'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Settings } from 'lucide-react'

export default function CreatePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

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
    <div className="w-[90vw] bg-white flex flex-col items-center justify-center p-4">
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
            className="w-full h-12 pl-12 pr-4 rounded-full border border-gray-200 focus:outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-200 shadow-sm"
          />
          <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
          <Settings className="absolute right-4 top-3.5 h-5 w-5 text-gray-400 cursor-pointer" />
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
    </div>
  )
}