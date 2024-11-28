'use client'

import * as React from 'react'
import { ChevronRight, Clock, Globe, LayoutGrid, History, Star, ChevronDown } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { api } from '../../../convex/_generated/api'
import { useQuery } from 'convex/react'

export default function WebHistoryExplorer() {
  const [expandedSections, setExpandedSections] = React.useState<Record<string, boolean>>({})

  const data = useQuery(api.web_history.fetchCategoriesAndBroaderCategories) ;
  /*   Api data structure
  {
  broaderCategories: [
    {
      _creationTime: 1732651350981.2422,
      _id: "k17b81w9abwz8peq1y59cafqk575a947",
      categories: [1],
      id: "bc1",
      name: "Tech Industry",
    },
    {
      _creationTime: 1732653210669.3806,
      _id: "k177eyhcc5y6s9v1hqndcgc3gx75b3yn",
      categories: [1, 2],
      id: "b1",
      name: "Professional Development",
    },
    {
      _creationTime: 1732653210669.3809,
      _id: "k17fspv8jtmqq3c8xe6gmw413175a8gw",
      categories: [3],
      id: "b2",
      name: "Personal Wellbeing",
    },
    {
      _creationTime: 1732653657725.3347,
      _id: "k177z3ss2wmewcykv0kvx8amsx75b10k",
      categories: [1, 4],
      id: "b1",
      name: "Frontend Development",
    },
    {
      _creationTime: 1732653657725.335,
      _id: "k17fnr324fhm790p4eeyjzhdts75bwqa",
      categories: [5],
      id: "b2",
      name: "Backend Development",
    },
    {
      _creationTime: 1732653657725.3352,
      _id: "k1773xp09m783xygs9b8rhynjx75bcj9",
      categories: [2, 3],
      id: "b3",
      name: "Machine Learning and Data Science",
    },
  ],
  mostVisitedCategories: [
    {
      _creationTime: 1732653657725.3342,
      _id: "k5771yffmgp97knb472a8j890x75b81g",
      id: 4,
      lastVisited: "2024-01-17T11:00:00Z",
      name: "JavaScript",
      subCategories: [
        {
          id: 13,
          lastVisited: "2024-01-17T11:00:00Z",
          name: "ES6+",
          type: "mostVisited",
          websiteCount: 15,
        },
        {
          id: 14,
          lastVisited: "2024-01-17T10:30:00Z",
          name: "Node.js",
          type: "mostVisited",
          websiteCount: 12,
        },
      ],
      type: "mostVisited",
      websiteCount: 40,
    },
    {
      _creationTime: 1732653657725.3345,
      _id: "k57657rh180tmntdzzjpz3502x75b2wd",
      id: 5,
      lastVisited: "2024-01-17T10:45:00Z",
      name: "Python",
      subCategories: [
        {
          id: 15,
          lastVisited: "2024-01-17T10:45:00Z",
          name: "Django",
          type: "mostVisited",
          websiteCount: 10,
        },
        {
          id: 16,
          lastVisited: "2024-01-17T09:30:00Z",
          name: "Flask",
          type: "mostVisited",
          websiteCount: 8,
        },
      ],
      type: "mostVisited",
      websiteCount: 35,
    },
  ],
  recentCategories: [
    {
      _creationTime: 1732653657725.3335,
      _id: "k5724x9zhkkcm05t6ndq8b57t975bzsn",
      id: 1,
      lastVisited: "2024-01-17T10:30:00Z",
      name: "Web Development",
      subCategories: [
        {
          id: 6,
          lastVisited: "2024-01-17T10:30:00Z",
          name: "React",
          type: "recent",
          websiteCount: 10,
        },
        {
          id: 7,
          lastVisited: "2024-01-17T09:45:00Z",
          name: "Next.js",
          type: "recent",
          websiteCount: 8,
        },
        {
          id: 8,
          lastVisited: "2024-01-17T08:15:00Z",
          name: "HTML/CSS",
          type: "recent",
          websiteCount: 12,
        },
      ],
      type: "recent",
      websiteCount: 30,
    },
    {
      _creationTime: 1732653657725.3337,
      _id: "k5786rqxczd0dfh94j09dd1y9175a3nf",
      id: 2,
      lastVisited: "2024-01-17T09:15:00Z",
      name: "Machine Learning",
      subCategories: [
        {
          id: 9,
          lastVisited: "2024-01-17T09:15:00Z",
          name: "TensorFlow",
          type: "recent",
          websiteCount: 7,
        },
        {
          id: 10,
          lastVisited: "2024-01-16T22:30:00Z",
          name: "PyTorch",
          type: "recent",
          websiteCount: 5,
        },
      ],
      type: "recent",
      websiteCount: 20,
    },
    {
      _creationTime: 1732653657725.334,
      _id: "k577kw2vzds7gvddqpy67sms6975bpq7",
      id: 3,
      lastVisited: "2024-01-17T08:45:00Z",
      name: "Data Science",
      subCategories: [
        {
          id: 11,
          lastVisited: "2024-01-17T08:45:00Z",
          name: "Pandas",
          type: "recent",
          websiteCount: 8,
        },
        {
          id: 12,
          lastVisited: "2024-01-16T21:00:00Z",
          name: "Matplotlib",
          type: "recent",
          websiteCount: 6,
        },
      ],
      type: "recent",
      websiteCount: 25,
    },
  ],
} */
 
  if (!data) {
    return <div>Loading...</div>
  }

  const { broaderCategories, mostVisitedCategories, recentCategories } = data

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const formatLastVisited = (timestamp: string) => {
    const date = new Date(timestamp)
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
      Math.ceil((date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
      'day'
    )
  }

  const SidebarSection = ({ title, categories }: { title: string, categories: any[] }) => (
    <Collapsible>
      <div className="flex items-center justify-between py-2 ">
        <h3 className="text-sm font-semibold">{title}</h3>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <ChevronDown className="h-4 w-4" />
            <span className="sr-only">Toggle {title}</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="space-y-1">
        {categories.map((category) => (
          <Collapsible key={category.id}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <ChevronRight className="h-4 w-4 mr-2" />
                <span className="truncate flex-grow text-left">{category.name}</span>
                <span className="text-muted-foreground ml-2">{category.websiteCount || 'N/A'}</span>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="ml-4 space-y-1 border-l border-muted pl-2 mt-1">
              {category.children?.map((child) => (
                <Button
                  key={child.id}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                >
                  <span className="truncate flex-grow text-left">{child.name}</span>
                  <span className="text-muted-foreground ml-2">{child.websiteCount || 'N/A'}</span>
                </Button>
              ))}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </CollapsibleContent>
    </Collapsible>
  )

  return (
    <div className="grid lg:grid-cols-5">
      <div className="hidden lg:block">
        <div className="space-y-4 py-4">
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold">Web History</h2>
            <div className="space-y-1">
              <Button variant="primary" className="w-full justify-start">
                <LayoutGrid className="mr-2 h-4 w-4" />
                All Categories
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <History className="mr-2 h-4 w-4" />
                Recent
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Star className="mr-2 h-4 w-4" />
                Most Visited
              </Button>
            </div>
          </div>
          <Separator />
          <div className="px-3">
            <SidebarSection title="Recent" categories={recentCategories || []} />
            <SidebarSection title="Most Visited" categories={mostVisitedCategories || []} />
          </div>
        </div>
      </div>
      <div className="col-span-4 lg:border-l">
        <div className="h-full px-4 py-6 lg:px-8">
          <ScrollArea className="h-full">
            <div className="space-y-6">
              {recentCategories && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold tracking-tight">
                      Recent
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recentCategories.map((category) => (
                      <Card key={category.id} className="hover:bg-accent transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">
                            {category.name}
                          </CardTitle>
                          <Globe className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{category.websiteCount || 'N/A'}</div>
                          <div className="text-xs text-muted-foreground flex items-center mt-1">
                            <Clock className="mr-1 h-3 w-3" />
                            {category.lastVisited ? formatLastVisited(category.lastVisited) : 'N/A'}
                          </div>
                          <div className="mt-2">
                            {category.subCategories?.map((child) => (
                              <div key={child.id} className="text-sm">
                                {child.name} ({child.websiteCount || 'N/A'})
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
              
              {recentCategories && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold tracking-tight">
                      Most Viewed
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {mostVisitedCategories.map((category) => (
                      <Card key={category.id} className="hover:bg-accent transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">
                            {category.name}
                          </CardTitle>
                          <Globe className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{category.websiteCount || 'N/A'}</div>
                          <div className="text-xs text-muted-foreground flex items-center mt-1">
                            <Clock className="mr-1 h-3 w-3" />
                            {category.lastVisited ? formatLastVisited(category.lastVisited) : 'N/A'}
                          </div>
                          <div className="mt-2">
                            {category.subCategories?.map((child) => (
                              <div key={child.id} className="text-sm">
                                {child.name} ({child.websiteCount || 'N/A'})
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {broaderCategories && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold tracking-tight">
                    Broader Categories
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {broaderCategories.map((category) => (
                      <Card key={category.id} className="hover:bg-accent transition-colors">
                        <CardHeader>
                          <CardTitle>{category.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="list-disc list-inside">
                            {category.categories.map((subCategory, index) => (
                              <li key={index} className="text-sm">{subCategory}</li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
