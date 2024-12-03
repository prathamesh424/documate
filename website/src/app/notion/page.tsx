"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CalendarIcon, TagIcon, MenuIcon, PlusIcon, SearchIcon, SettingsIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface NotionItem {
  id: string
  title: string
  status: string
  created: string
  tags: string[]
}

export default function NotionInspiredPage() {
  const [data, setData] = useState<NotionItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const response = await fetch("/api/notion/employ")
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        const result = await response.json()
        setData(result)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="flex h-screen bg-gray-100 w-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 p-4 hidden md:block">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold text-gray-800">Workspace</h1>
          <Button variant="ghost" size="icon">
            <MenuIcon className="h-5 w-5" />
          </Button>
        </div>
        <nav>
          <Button variant="ghost" className="w-full justify-start mb-2">
            <PlusIcon className="mr-2 h-4 w-4" />
            New Page
          </Button>
          <Button variant="ghost" className="w-full justify-start mb-2">
            <SearchIcon className="mr-2 h-4 w-4" />
            Search
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <SettingsIcon className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <header className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Notion Data</h1>
            <Input placeholder="Search pages..." className="max-w-md" />
          </header>

          <ScrollArea className="h-[calc(100vh-12rem)]">
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="w-full">
                    <CardHeader>
                      <Skeleton className="h-6 w-2/3" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-4/5" />
                    </CardContent>
                    <CardFooter>
                      <Skeleton className="h-4 w-20" />
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {data.map((item) => (
                  <Card key={item.id} className=" bg-white hover:bg-gray-50 transition-colors">
                    <CardHeader>
                      <CardTitle className="text-xl font-medium text-gray-900">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center space-x-2 text-gray-500 mb-2">
                        <CalendarIcon className="w-4 h-4" />
                        <span className="text-sm">{new Date(item.created).toLocaleDateString()}</span>
                      </div>
                      <p className="text-gray-600">
                        A page in your Notion-inspired workspace.
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center">
                      <Badge variant="secondary" className="text-gray-600">
                        {item.status}
                      </Badge>
                      <div className="flex items-center space-x-2">
                        <TagIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-500">
                          {item.tags.length > 0 ? item.tags.join(", ") : "No tags"}
                        </span>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </main>
    </div>
  )
}

