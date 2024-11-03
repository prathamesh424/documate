'use client'

import React, { useState, useRef, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronRight, Lock, Unlock, Search, Heart, GripVertical, Settings, Layers, History, Database,Notebook, Pencil, ExternalLink, Trash2, ChevronDown,Home } from 'lucide-react'
import { UserButton, useUser } from '@clerk/clerk-react'
import Memory from './storage/page'
import SettingsPage from '@/components/settings/settings_page'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { se } from 'date-fns/locale'
import CreatePage from '@/components/home/create-page'
const inputData = [
  { id: "text1", type: "text", content: "React is a popular JavaScript library for building user interfaces. It allows developers to create reusable UI components that can be composed to build complex applications.", description: "Introduction to React", url: "https://reactjs.org" },
  { id: "text2", type: "text", content: "Key Concepts", description: "React key concepts heading", url: "https://reactjs.org/docs/getting-started.html" },
  { id: "text3", type: "text", content: "Here are some key concepts in React:", description: "Introduction to key concepts", url: "https://reactjs.org/docs/getting-started.html" },
  { id: "table1", type: "table", content: [["Concept", "Description"], ["Components", "Reusable pieces of UI"], ["Props", "Data passed to components"], ["State", "Internal component data"], ["JSX", "Syntax extension for JavaScript"]], description: "React key concepts table", url: "https://reactjs.org/docs/getting-started.html" },
  { id: "text4", type: "text", content: "Getting Started", description: "Getting started with React heading", url: "https://reactjs.org/docs/getting-started.html" },
  { id: "text5", type: "text", content: "To get started with React, you'll need to set up your development environment. Here's a simple example of a React component:", description: "Introduction to React components", url: "https://reactjs.org/docs/components-and-props.html" },
  { id: "code1", type: "code", content: `function Welcome(props) {\n  return <h1>Hello, {props.name}</h1>;\n}`, description: "Simple React component example", url: "https://reactjs.org/docs/components-and-props.html" },
  { id: "image1", type: "image", content: "/placeholder.svg?height=300&width=500", description: "React component diagram", url: "https://reactjs.org/docs/components-and-props.html" },
  { id: "text6", type: "text", content: "This is just the beginning of what you can do with React. As you progress, you'll learn about more advanced concepts and techniques for building powerful web applications.", description: "Conclusion", url: "https://reactjs.org/docs/thinking-in-react.html" },
]

export default function Dashboard() {
  const [selectedArticle, setSelectedArticle] = useState([])
  const [selectedDataCards, setSelectedDataCards] = useState<string[]>([])
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const sheetTriggerRef = useRef<HTMLButtonElement>(null)
  const [expandedSections, setExpandedSections] = useState<number[]>([])
  const instance = useUser()
  const user_email = instance.user && instance.user.emailAddresses && instance.user.emailAddresses[0].emailAddress
  const pagesData = useQuery(api.pages.getPages, {author: user_email||""  });
  const sidebarData = pagesData ? pagesData.map((item)=>{ return {id:item._id , title: item.title , date : item.date , locked : item.islocked|| false}}) : []
  const cardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  const onDragEnd = (result) => {
    if (!result.destination) return

    const items = Array.from(selectedArticle.content)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setSelectedArticle({
      ...selectedArticle,
      content: items
    })
  }
  // useEffect(() => {
  //   if (sidebarData) {
  //     console.log(sidebarData)
  //     setSelectedArticle(sidebarData&&sidebarData[0])
  //   }
  // }, [sidebarData])
  const renderContent = (item) => {
    switch (item.type) {
      case 'paragraph':
        return <p className="mb-4">{item.text}</p>
      case 'heading':
        const Heading = `h${item.level}` as keyof JSX.IntrinsicElements
        return <Heading className="mb-4 mt-6 font-bold">{item.text}</Heading>
      case 'table':
        return (
          <div className="mb-6 overflow-x-auto">
            <table className="w-full border-collapse border">
              <tbody>
                {item.data.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className="border p-2">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      case 'code':
        return (
          <pre className="mb-4 overflow-x-auto rounded bg-gray-300 p-4">
            <code>{item.code}</code>
          </pre>
        )
      case 'image':
        return (
          <figure className="mb-6">
            <img src={item.src} alt={item.alt} className="w-full rounded-lg" />
            {item.caption && <figcaption className="mt-2 text-center text-sm text-muted-foreground">{item.caption}</figcaption>}
          </figure>
        )
      default:
        return null
    }
  }

  const handleDataCardSelect = (id: string) => {
    setSelectedDataCards(prev => 
      prev.includes(id) ? prev.filter(cardId => cardId !== id) : [...prev, id]
    )
  }

  const handleDataCardDelete = () => {
    // In a real application, you would delete the selected cards here
    setSelectedDataCards([])
  }

  const handleViewOriginData = (originDataId: string) => {
    setSelectedDataCards(prev => 
      prev.includes(originDataId) ? prev : [...prev, originDataId]
    )
    setIsSheetOpen(true)
    sheetTriggerRef.current?.click()
  }

  useEffect(() => {
    if (isSheetOpen && selectedDataCards.length > 0) {
      const lastSelectedCard = selectedDataCards[selectedDataCards.length - 1]
      const cardElement = cardRefs.current[lastSelectedCard]
      if (cardElement) {
        cardElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }
    }
  }, [isSheetOpen, selectedDataCards])

  const toggleSection = (sectionId: number) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    )
  }

  const renderSidebarItem = (item) => (
    <div key={item.id} className="mb-1">
      {item.children ? (
        <Collapsible open={expandedSections.includes(item.id)} onOpenChange={() => toggleSection(item.id)}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-start p-2">
              <ChevronRight className={`h-4 w-4 shrink-0 transition-transform duration-200 ${expandedSections.includes(item.id) ? 'rotate-90' : ''}`} />
              <span className="ml-2">{item.title}</span>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pl-4">
            {item.children.map(child => renderSidebarItem(child))}
          </CollapsibleContent>
        </Collapsible>
      ) : (
        <Button
          variant="ghost"
          className={`w-full justify-start p-2 py-6 ${selectedArticle.id === item.id ? 'bg-gray-200' : ''}`}
          onClick={() => setSelectedArticle(item)}
        >
        <div className="relative flex flex-col py-2 w-full items-start justify-between">
          <div className="flex w-full items-between space-x-2">
            <span className="truncate">{item.title}</span>
          </div>
          <span className="text-xs text-muted-foreground">{item.date}</span>
          {item.locked ? <Lock className="absolute top-2 right-1 h-4 w-4" /> : <Unlock className="absolute top-2 right-1 h-4 w-4" />}
        </div>

        </Button>
      )}
    </div>
  )
// State to keep track of the currently selected page
const [currentPage, setCurrentPage] = useState('home');

const handlePageChange = (pageName) => {
  setCurrentPage(pageName);
  // Add any additional logic you want to perform on page change here
};
  return (
    <TooltipProvider>
      <div className="flex h-screen  bg-white p-0 m-0 w-[100vw]">
        <div className="flex w-16 flex-col items-center justify-between border-r  py-4 overflow-hidden fixed h-screen">
          <div className="flex flex-col items-center space-y-4">
          <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={`h-10 w-10 ${currentPage === 'home' ? 'bg-gray-200' : ''}`}
            onClick={() => handlePageChange('home')}
          >
            <Home className="h-5 w-5" />
            <span className="sr-only">Home</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>Home</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={`h-10 w-10 ${currentPage === 'pages' ? 'bg-gray-200' : ''}`}
            onClick={() => handlePageChange('pages')}
          >
            <Notebook className="h-5 w-5" />
            <span className="sr-only">Pages</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>Pages</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={`h-10 w-10 ${currentPage === 'memory' ? 'bg-gray-200' : ''}`}
            onClick={() => handlePageChange('memory')}
          >
            <Database className="h-5 w-5" />
            <span className="sr-only">Memory</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>Memory</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={`h-10 w-10 ${currentPage === 'settings' ? 'bg-gray-200' : ''}`}
            onClick={() => handlePageChange('settings')}
          >
            <Settings className="h-5 w-5" />
            <span className="sr-only">Settings</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>Settings</p>
        </TooltipContent>
      </Tooltip>
    </div>
          <div className='py-5'>
          <UserButton />
          </div>

        </div>

        <div className='ml-20'>
          {
            currentPage === 'home' && (
              <CreatePage/>
            )
          }
          {
            currentPage === 'pages' && (
              <ResizablePanelGroup direction="horizontal" className='fixed'>
          <ResizablePanel defaultSize={20} minSize={15}>
            <div className="flex h-full flex-col">
              <div className="border-b p-4">
                <Input type="search" placeholder="Search articles..." className="w-full" />
              </div>
              <ScrollArea className="flex-1">
                {sidebarData&&sidebarData.map(renderSidebarItem)}
                
              </ScrollArea>
            </div>
          </ResizablePanel>
          <ResizablePanel>
            <div className="flex h-full flex-col ">
              <header className="flex items-center justify-around border-b p-4">
                <div>

                  <h1 className="text-2xl font-bold">{selectedArticle.title}</h1>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <span>{selectedArticle.author}</span>
                    <span>•</span>
                    <span>{selectedArticle.date}</span>
                  </div>
                </div>
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                  <SheetTrigger asChild>
                    <Button variant="primary" size="icon" ref={sheetTriggerRef}>
                      <Database className="h-4 w-4" />
                      <span className="sr-only">Input Data</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent className='bg-white'>
                    <SheetHeader>
                      <SheetTitle className='text-black'>Input Data</SheetTitle>
                    </SheetHeader>
                    <ScrollArea className="h-[calc(100vh-8rem)] pr-4 bg-white text-black">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {inputData.map((data) => (
                          <Card key={data.id} className={`mb-4 bg-white text-black ${selectedDataCards.includes(data.id)?"border shadow-xl":"border-2xl "} `}>
                            <CardHeader className="bg-white text-black flex flex-row items-start justify-between space-y-0 pb-2">
                              <CardTitle className="bg-white text-black text-sm font-medium">
                                {data.type.charAt(0).toUpperCase() + data.type.slice(1)}
                              </CardTitle>
                              <Checkbox
                              className='border-2xl'
                                checked={selectedDataCards.includes(data.id)}
                                onCheckedChange={() => handleDataCardSelect(data.id)}
                              />
                            </CardHeader>
                            <CardContent>
                              <p className="bg-white text-black text-sm">
                                {data.type === 'image' ? (
                                  <img
                                    src={data.content}
                                    alt={data.description}
                                    className="max-h-40 w-full object-cover"
                                  />
                                ) : data.type === 'table' ? (
                                  <div className="max-h-40 overflow-auto">
                                    <table className="w-full text-xs">
                                      <tbody>
                                        {data.content.map((row, index) => (
                                          <tr key={index}>
                                            {row.map((cell, cellIndex) => (
                                              <td key={cellIndex} className="border p-1">
                                                {cell}
                                              </td>
                                            ))}
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                ) : (
                                  data.content
                                )}
                              </p>
                            </CardContent>
                            <CardFooter className="flex justify-between">
                              <CardDescription>{data.description}</CardDescription>
                              <Button variant="ghost" size="icon" asChild>
                                <a href={data.url} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-4 w-4" />
                                </a>
                              </Button>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    </ScrollArea>


                    {selectedDataCards.length > 0 && (
                      <div className="mt-4 flex justify-end">
                        <Button variant="destructive" onClick={handleDataCardDelete}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Selected
                        </Button>
                      </div>
                    )}
                  </SheetContent>
                </Sheet>
              </header>
              <main className="flex-1 overflow-auto p-6">
                <article className="mx-auto max-w-3xl">
                  <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="article-content">
                      {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                          {/* {JSON.stringify(selectedArticle)} */}
                         
                          {pagesData?.find((item) => item._id === selectedArticle?.id)?.content.map((item, index) => (
                            <Draggable key={item.id} draggableId={item.id} index={index}>
                              {(provided, snapshot) => (
                                <ContextMenu>
                                  <ContextMenuTrigger>
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      className={`group relative mb-4 ${snapshot.isDragging ? 'bg-muted/50' : ''}`}
                                    >
                                      <div
                                        {...provided.dragHandleProps}
                                        className="absolute left-0 top-0 h-full w-6 cursor-move opacity-0 transition-opacity group-hover:opacity-100"
                                      >
                                        <div className="flex h-full items-center justify-center">
                                          <GripVertical className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                      </div>
                                      <div className="pl-8">
                                        {renderContent(item)}
                                      </div>
                                    </div>
                                  </ContextMenuTrigger>
                                  <ContextMenuContent>
                                    <ContextMenuItem onSelect={() => handleViewOriginData(item.originDataId)}>
                                      View Origin Data
                                    </ContextMenuItem>
                                  </ContextMenuContent>
                                </ContextMenu>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                </article>
              </main>
              <footer className="border-t p-4 text-center text-sm text-muted-foreground">
                Built with <Heart className="inline-block h-4 w-4 text-red-500" />
              </footer>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
            )
          }
          {
            currentPage === 'memory' && (
              <Memory/>
            )
          }
          {
            currentPage === 'settings' && (
              <SettingsPage/>
            )
          }
        
        </div>

      </div>
    </TooltipProvider>
  )
}