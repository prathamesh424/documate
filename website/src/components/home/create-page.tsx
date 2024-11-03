'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Settings, StarsIcon } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Label } from '@radix-ui/react-context-menu'
import { Calendar } from '../ui/calendar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@radix-ui/react-select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'

export default function CreatePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [ tone, setTone ] = useState<string>('casual')
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  })
  const [emotion, setEmotion] = useState<string>()
  const handleGenerate = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 2000)) // Simulating API call
    setIsLoading(false)
    router.push('/apitest')
  }
  const buttonConfigs = [
    {
      key: 'generate',
      onClick: handleGenerate,
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
        onClick: handleGenerate,
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
        onClick: handleGenerate,
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
  return (
    <div className="w-[90vw] bg-white flex h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-[584px] mb-8">
        <h1 className="text-[60px] font-normal mb-8 text-center">
          <span className="text-black">Provide a page title</span>
          {/* <span className="text-red-500">o</span>
          <span className="text-yellow-500">o</span>
          <span className="text-blue-500">g</span>
          <span className="text-green-500">l</span>
          <span className="text-red-500">e</span> */}
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
          {/* <Settings className="absolute right-4 top-3.5 h-5 w-5 text-gray-400 cursor-pointer" /> */}
          <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" className="absolute right-4 top-2 p-0 px-2 hover:bg-white  text-gray-400 cursor-pointer">
            <Settings className="h-5 w-5 text-gray-400 cursor-pointer" />
            <span className="sr-only">Open settings</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 bg-white text-black">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Settings</h4>
              <p className="text-sm text-muted-foreground">
                Adjust your date range and emotion settings.
              </p>
            </div>
            <div className="grid gap-2">
              <div className="grid gap-1">
                <Label htmlFor="date-range">Date Range</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="date-range"
                        variant={"outline"}
                        className={`w-full justify-start text-left bg-white font-normal ${!dateRange.from && "text-muted-foreground"}`}
                      >
                        {dateRange.from ? (
                          dateRange.from.toLocaleDateString()
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dateRange.from}
                        className='bg-white text-black'
                        onSelect={(date) => setDateRange((prev) => ({ ...prev, from: date }))}
                      />
                    </PopoverContent>
                  </Popover>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={`w-full justify-start bg-white text-black text-left font-normal ${!dateRange.to && "text-muted-foreground"}`}
                      >
                        {dateRange.to ? (
                          dateRange.to.toLocaleDateString()
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-white text-black" align="start">
                      <Calendar
                        mode="single"
                        className='bg-white text-black'

                        selected={dateRange.to}
                        onSelect={(date) => setDateRange((prev) => ({ ...prev, to: date }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="grid gap-1">
              <Tabs className='w-full ' value={tone} onValueChange={setTone}>
                    <TabsList className="flex w-full bg-gray justify-start space-x-2">
                    <TabsTrigger value="casual">Casual</TabsTrigger>
                    <TabsTrigger value="neutral">Neutral</TabsTrigger>
                    <TabsTrigger value="formal">Formal</TabsTrigger>
                    </TabsList>
                    <TabsContent value="casual" />
                    <TabsContent value="neutral" />
                    <TabsContent value="formal" />
                </Tabs>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
        </div>
      </div>

      <div className="flex space-x-4 grid grid-cols-3 gap-4">
        {buttonConfigs.map((button) => (
            <Button
            key={button.key}
            onClick={button.onClick}
            disabled={button.disabled}
            className="bg-[#f8f9fa] text-gray-800 hover:border-gray-300 hover:shadow-md transition-all px-4 py-2 text-sm font-normal"
            >
            {button.text}
            </Button>
        ))}
        </div>
        <div className='absolute bottom-5 flex items-center'>

      <p className='text-gray-400 text-sm '> Data tracked from the highlighted content will be used to generate the page, Checkout </p>
      <Button variant='ghost' className='m-0 px-2 hover:bg-white hover:text-black'>Memory</Button>
      <p className='text-gray-400 text-sm '>to view the Data stored</p>
        </div>
        
    </div>
  )
}