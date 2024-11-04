import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRightIcon, Search, SendHorizontalIcon, Settings, StarsIcon } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Label } from '@radix-ui/react-context-menu'
import { Calendar } from '../ui/calendar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@radix-ui/react-select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { useEffect, useState } from 'react';
import OpenAI from "openai"; 
import { useUser } from '@clerk/clerk-react'
import { api } from '../../../convex/_generated/api'
import { useMutation, useQuery } from 'convex/react'
import { Skeleton } from '../ui/skeleton'
import { Progress } from '../ui/progress'
import WordRotate from "@/components/ui/word-rotate";
import MarkdownIt from 'markdown-it';
import { v4 as uuidv4 } from 'uuid';
type ContentBlockInput = {
    id: string;
    originDataId: string;
    type: string;
    text: string;
    language?: string;
    code?: string;
    data?: string[][];
    src?: string;
    alt?: string;
    caption?: string;
    level?: number;
  };
type MarkdownEntry = {
  id: string;
  level?: number;
  originDataId: string;
  text: string;
  type: string;
};

const parseMarkdown = (markdownText: string): MarkdownEntry[] => {
    const md = new MarkdownIt();
    const tokens = md.parse(markdownText, {});
  
    const entries: MarkdownEntry[] = [];
    console.log("tokens are ",tokens)
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      
      if (token.type === 'heading_open') {
        const level = parseInt(token.tag.replace('h', ''), 10);
        const textToken = tokens[i + 1]; // Get the text token
        if (textToken && textToken.type === 'inline') {
          const textContent = textToken.content;
          // Remove all # characters and trim the resulting text
          const cleanedText = textContent.replace(/#/g, '').trim();
          // Count the number of # characters
          const level = (textContent.match(/#/g) || []).length;
          entries.push({
            id: uuidv4(),
            level,
            originDataId: '',
            text: cleanedText,
            type: `heading${level}`,
          });
          i=i+2
        }
      } else if (token.type === 'inline') {
        if (token.content.trim()) {
          entries.push({
            id: uuidv4(),
            originDataId: '',
            text: token.content,
            type: 'paragraph',
          });
        }
      } else if (token.type === 'bullet_list_open') {
        const listItems = [];
        // Loop through tokens until we find the closing tag for the bullet list
        for (let j = i + 1; j < tokens.length; j++) {
          if (tokens[j].type === 'list_item_open') {
            const listItemContent = tokens[j + 1];
            if (listItemContent && listItemContent.type === 'inline') {
              listItems.push(listItemContent.content);
            }
          } else if (tokens[j].type === 'bullet_list_close') {
            i = j; // Update the outer loop index to skip past the bullet list
            break; // Stop when we reach the end of the list
          }
        }
        // Add list items as paragraphs
        listItems.forEach((item) => {
          entries.push({
            id: uuidv4(),
            originDataId: '',
            text: item,
            type: 'paragraph',
          });
        });
      } else if (token.type === 'fence') {
        // Handle code blocks
        entries.push({
          id: uuidv4(),
          originDataId: '',
          text: token.content,
          type: 'code',
        });
      } else if (token.type === 'image') {
        // Handle images
        entries.push({
          id: uuidv4(),
          originDataId: '',
          text: token.attrs?.find(attr => attr[0] === 'src')?.[1] || '', // Get the image URL
          type: 'image',
        });
      }
    }
    
    return entries;
  };
import AnimatedCircularProgressBar from '../ui/animated-circular-progress-bar'
const openai = new OpenAI({ 
  baseURL: "https://api.rhymes.ai/v1", 
  dangerouslyAllowBrowser: true, 
  apiKey: `${process.env.NEXT_PUBLIC_ARIA_API_KEY}` 
});

const useApi = (initialCall = false, systemPrompt = "You are a helpful assistant.", userPrompt = "Write a haiku about recursion in programming.") => {
  const [loading, setLoading] = useState(initialCall);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const executeApiCall = async () => {
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await openai.chat.completions.create({
        model: "aria",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      });

      const data = await response;
      setResult(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialCall) {
      executeApiCall();
    }
  }, [initialCall, systemPrompt, userPrompt]);

  return { loading, result, error, executeApiCall };
};
interface CreatePageProps {
    setPage: (page: string) => void; // Define the type for the setPage prop
  }
  const CreatePage: React.FC<CreatePageProps> =({handlePageChange}) =>{
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [tone, setTone] = useState<string>('casual')
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  })
  const handlerArticleGenerationCompleted = () => {
    // Logic for creating an article goes here...

    // Example of calling setPage to navigate to a different page
    handlePageChange('pages'); // Change the current page to "articleCreated"
  };

  const addNewArticle = useMutation(api.pages.addArticle) 
  const [emotion, setEmotion] = useState<string>()
  function extractTitles(content) {
    // Split the content into lines
    const lines = content.split('\n');
    // Filter and clean lines that start with a number followed by a dot
    const titles = content.split('\n')
        .filter(line => /^\d+\.\s/.test(line)) // Check if the line starts with a number and a dot
        .map(line => line.split('. ')[1].replace(/"/g, '').trim()); // Remove number and dot, and strip quotes
    return titles;
}

  const instance = useUser();
  const user_email = instance.user && instance.user.emailAddresses && instance.user.emailAddresses[0].emailAddress;
  const data = useQuery(api.highlights.getHighlights, { id: user_email });
  
  const user_prompt = "The text information of the research is as follows :- " + (data ? data.map((item) => item.description).join('') : '');
  const system_prompt = `Based on the following text, generate a list of six concise and descriptive documentation titles that accurately reflect the key concepts and features mentioned. Each title should be specific enough to convey the content's focus while being engaging to potential readers , the word limit for each title is one to seven words.give only 6 outputs
 
      1. "Title 1",
      2. "Title 2",
      3. "Title 3",
      4. "Title 4",
      5. "Title 5",
      6. "Title 6"
    
  `;
   
  // Call the API when user_email or the user_prompt changes
  const { loading, result, error, executeApiCall } = useApi(true, system_prompt, user_prompt);
  const GeneratePage = async (searchQuery:any) => {
    setIsLoading(true)
    setValue(0)
    const system_prompt="Create a docuement form the below text with the content "+searchQuery +" give the docment in a markdown format make sure to add headings , paragraphs , code and tables where ever required make sure that the entire document is well structured and easy to read and straight to point"
    const user_prompt = data ? data.map((item) => item.description).join('') : '';
    try {
      const response = await openai.chat.completions.create({
        model: "aria",
        messages: [
          { role: "system", content: system_prompt },
          { role: "user", content: user_prompt },
        ],
      });

      const data = await response;
      console.log("data doc is ",data)
      const markdownData = parseMarkdown(data.choices[0].message.content);
      console.log("data doc is ",markdownData)
      await addNewArticle({
        title: searchQuery,
        author: user_email||"",
        date: new Date().toISOString(),
        content: markdownData,
        markdown: data.choices[0].message.content,
      })
        
      handlerArticleGenerationCompleted()
      setIsLoading(false)
    } catch (error) {
      console.error(error.message);
    } finally {
        setIsLoading(false);
        handlerArticleGenerationCompleted()
    //   setLoading(false);
    }
  }
  const [progress, setProgress] = useState(13)
  const [value, setValue] = useState(0);
 
  useEffect(() => {
    const handleIncrement = (prev: number) => {
      if (prev === 100) {
        return 0;
      }
      return prev + 10;
    };
    setValue(handleIncrement);
    const interval = setInterval(() => setValue(handleIncrement), 2000);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500)
    return () => clearTimeout(timer)
  }, [])
  useEffect(() => {
    if (user_email) {
      executeApiCall();
    }
  }, [user_email, user_prompt, system_prompt]);
  const suggestions =result&&result.choices&&result.choices[0] &&result.choices[0].message && result.choices[0].message.content.split('\n')
  .filter(line => /^\d+\.\s/.test(line)) // Check if the line starts with a number and a dot
  .map(line => line.split('. ')[1].replace(/"/g, '').trim())
  return (
   isLoading ? 
   <div className='h-screen w-[90vw] flex items-center justify-center space-x-8'>
     <AnimatedCircularProgressBar
      max={100}
      min={0}
      value={value}
      gaugePrimaryColor="rgb(79 70 229)"
      gaugeSecondaryColor="rgba(0, 0, 0, 0.1)"
    />
    <WordRotate
    duration={2000}
      className="text-4xl font-bold text-black dark:text-white"
      words={["Generating...", "Organising...", "Compiling...","almost done..."]}
    />
   </div>
   : 
   <div className="w-[90vw] bg-white flex h-screen flex-col items-center justify-center p-4">
   <div className="w-full max-w-[584px] mb-8">
     {/* {error && <div className="text-red-500">{error}</div>}
     {loading && <div>Loading...</div>}
     {result && (
       <div>
         <h2 className="font-bold">Generated Titles:</h2>
         <pre>{JSON.stringify(extractTitles(result.choices[0].message.content))}</pre>
       </div>
     )} */}
     <Button
     onClick={()=>router.push('/guide')}
         className="absolute top-10 right-10 w-[180px] h-12 bg-white pl-4 pr-4 rounded-full border border-gray-200 focus:outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-200 shadow-sm "
         >Download Extension 
         <ArrowRightIcon className="h-5 w-5 text-gray-400"/>
         </Button>
     <h1 className="text-[60px] font-normal mb-8 text-center">
       <span className="text-black">Provide a page title</span>
     </h1>
     <div className="relative">
       <Input
         type="text"
         placeholder="Enter the document title"
         value={searchQuery}
         onChange={(e) => setSearchQuery(e.target.value)}
         className="w-full h-12 bg-white pl-12 pr-4 rounded-full border border-gray-200 focus:outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-200 shadow-sm "
       />
       <StarsIcon className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
       <Button variant='ghost' className='absolute right-4 top-2 hover:bg-white'>
         <SendHorizontalIcon onClick={()=>{GeneratePage(searchQuery)}} className=" h-5 w-5 text-gray-400" />

       </Button>
      
     </div>
   </div>
     {/* Button configs and rendering */}

         {/* {suggestions&&suggestions.length} */}
     <div className="flex space-x-4 grid grid-cols-3 gap-4">
         {!result&&
             [1,2,3].map((button) => (
                 <Button
                     key={button}
                     disabled={true}
                     className="animate-pulse bg-gray-300 w-[200px] text-gray-800 hover:border-gray-300 hover:shadow-md transition-all px-4 py-2 text-sm font-normal"
                 >
                 </Button>
             ))
         }
     {result&&result.choices&&result.choices[0] &&result.choices[0].message && result.choices[0].message.content.split('\n')
     .filter(line => /^\d+\.\s/.test(line)) // Check if the line starts with a number and a dot
     .map(line => line.split('. ')[1].replace(/"/g, '').trim()).slice(0, 6).map((button) => (
         <Button
         key={button}
         // onClick={button.onClick}
         onClick={()=>{setSearchQuery(button)}}
         // disabled={button.disabled}
         className="bg-[#f8f9fa] text-gray-800 hover:border-gray-300 hover:shadow-md transition-all px-4 py-2 text-sm font-normal"
         >
         {<p className='truncate'>{button}</p>}
         </Button>
     ))}
     </div>
    
 </div>
  );
}
export default CreatePage;