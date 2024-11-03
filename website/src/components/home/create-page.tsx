import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Settings, StarsIcon } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Label } from '@radix-ui/react-context-menu'
import { Calendar } from '../ui/calendar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@radix-ui/react-select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { useEffect, useState } from 'react';
import OpenAI from "openai"; 
import { useUser } from '@clerk/clerk-react'
import { api } from '../../../convex/_generated/api'
import { useQuery } from 'convex/react'
import { Skeleton } from '../ui/skeleton'

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

export default function CreatePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [tone, setTone] = useState<string>('casual')
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  })
  const [emotion, setEmotion] = useState<string>()
  const buttonConfigs = [
    {
      key: 'generate',
      onClick: () => {
        // Handle "I'm Feeling Lucky" click
      },
      text: isLoading ? 'Generating...' : 'Generate Document',
      isLoading: isLoading,
      disabled: isLoading,
    },
    {
      key: 'lucky',
      onClick: () => {
        // Handle "I'm Feeling Lucky" click
      },
      text: "I'm Feeling Lucky",
      isLoading: false,
      disabled: false,
    },
    {
        key: 'generate1',
        onClick: () => {
            // Handle "I'm Feeling Lucky" click
          },
        text: isLoading ? 'Generating...' : 'Generate Document',
        isLoading: isLoading,
        disabled: isLoading,
      },
      {
        key: 'lucky1',
        onClick: () => {
          // Handle "I'm Feeling Lucky" click
        },
        text: "I'm Feeling Lucky",
        isLoading: false,
        disabled: false,
      },
      {
        key: 'generate2',
        onClick: () => {
            // Handle "I'm Feeling Lucky" click
          },
        text: isLoading ? 'Generating...' : 'Generate Document',
        isLoading: isLoading,
        disabled: isLoading,
      },
      {
        key: 'lucky2',
        onClick: () => {
          // Handle "I'm Feeling Lucky" click
        },
        text: "I'm Feeling Lucky",
        isLoading: false,
        disabled: false,
      },
  ];
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

  useEffect(() => {
    if (user_email) {
      executeApiCall();
    }
  }, [user_email, user_prompt, system_prompt]);

  return (
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
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="absolute right-4 top-2 p-0 px-2 hover:bg-white  text-gray-400 cursor-pointer">
                <Settings className="h-5 w-5 text-gray-400 cursor-pointer" />
                <span className="sr-only">Open settings</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-white text-black">
              {/* Your settings content goes here */}
            </PopoverContent>
          </Popover>
        </div>
      </div>
        {/* Button configs and rendering */}

        <div className="flex space-x-4 grid grid-cols-3 gap-4">
        {result&&result.choices&&result.choices[0] &&result.choices[0].message && result.choices[0].message.content.split('\n')
        .filter(line => /^\d+\.\s/.test(line)) // Check if the line starts with a number and a dot
        .map(line => line.split('. ')[1].replace(/"/g, '').trim()).slice(0, 6).map((button) => (
            <Button
            // key={button.key}
            // onClick={button.onClick}
            // disabled={button.disabled}
            className="bg-[#f8f9fa] text-gray-800 hover:border-gray-300 hover:shadow-md transition-all px-4 py-2 text-sm font-normal"
            >
            {button}
            </Button>
        ))}
        </div>
       
    </div>
  );
}
