'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusIcon, X } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState('')
  const [userId, setUserId] = useState('')
  const [ignoredUrls, setIgnoredUrls] = useState<string[]>([])
  const [newIgnoredUrl, setNewIgnoredUrl] = useState('')
  const [topics, setTopics] = useState<string[]>([])
  const [newTopic, setNewTopic] = useState('')
  const [language, setLanguage] = useState('en')
  const [tone, setTone] = useState('casual')

  const addIgnoredUrl = () => {
    if (newIgnoredUrl && !ignoredUrls.includes(newIgnoredUrl)) {
      setIgnoredUrls([...ignoredUrls, newIgnoredUrl])
      setNewIgnoredUrl('')
    }
  }

  const removeIgnoredUrl = (url: string) => {
    setIgnoredUrls(ignoredUrls.filter(u => u !== url))
  }

  const addTopic = () => {
    if (newTopic && !topics.includes(newTopic)) {
      setTopics([...topics, newTopic])
      setNewTopic('')
    }
  }

  const removeTopic = (topic: string) => {
    setTopics(topics.filter(t => t !== topic))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the settings to your backend
    console.log({ apiKey, userId, ignoredUrls, topics, language, tone })
  }

  return (
    <form onSubmit={handleSubmit} className="w-[80vw] bg-white mx-auto p-4 space-y-8">
      <Card className='bg-white text-black'>
        <CardHeader>
          <CardTitle>API and User Settings</CardTitle>
          <CardDescription>Manage your API key and user ID</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">Aria API Key</Label>
            <Input
              className='bg-white'

              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your API key"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="userId">User ID</Label>
            <Input
              className='bg-white'

              id="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter your user ID"
            />
          </div>
        </CardContent>
      </Card>

      <Card className='bg-white text-black'>
        <CardHeader>
          <CardTitle>Content Preferences</CardTitle>
          <CardDescription>Customize your content tracking settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ignoredUrls">URLs to Ignore</Label>
            <div className="flex space-x-2">
              <Input
              className='bg-white'

                id="ignoredUrls"
                value={newIgnoredUrl}
                onChange={(e) => setNewIgnoredUrl(e.target.value)}
                placeholder="Enter URL to ignore"
              />
              <Button variant='ghost' className='border' onClick={addIgnoredUrl}><PlusIcon></PlusIcon></Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {ignoredUrls.map(url => (
                <span key={url} className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-sm flex items-center">
                  {url}
                  <button type="button" onClick={() => removeIgnoredUrl(url)} className="ml-2 text-secondary-foreground/50 hover:text-secondary-foreground">
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="topics">Topics to Consider</Label>
            <div className="flex space-x-2">
              <Input
              className='bg-white'
                id="topics"
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
                placeholder="Enter topic to consider"
              />
              <Button variant='ghost' className='border' onClick={addTopic}><PlusIcon/></Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {topics.map(topic => (
                <span key={topic} className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-sm flex items-center">
                  {topic}
                  <button type="button" onClick={() => removeTopic(topic)} className="ml-2 text-primary-foreground/50 hover:text-primary-foreground">
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className='bg-white text-black'>
        <CardHeader>
          <CardTitle>Output Preferences</CardTitle>
          <CardDescription>Set your language and tone preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 ">
          <div className="space-y-2" >
            <Label htmlFor="language">Language Preference</Label>
            <Select value={language} onValueChange={setLanguage} className="bg-white" >
              <SelectTrigger id="language" className="bg-white" >
                <SelectValue className="bg-white"  placeholder="Select language" />
              </SelectTrigger>
              <SelectContent className="bg-white text-black" >
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
                <SelectItem value="de">German</SelectItem>
                <SelectItem value="it">Italian</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 ">
      <Label>Tone of Generated Documents</Label>
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

        </CardContent>
      </Card>

      <Button type="submit" className="w-full bg-black border text-white  hover:bg-green-700 ">Save Settings</Button>
    </form>
  )
}