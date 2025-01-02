"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import { Bot, Brain, Sparkles, Star, Trash2 } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import React from "react"
import { useMutation, useQuery } from "convex/react"
import { useUser } from "@clerk/clerk-react"
import { api } from "../../../convex/_generated/api"

interface ApiKey {
  id: string
  provider: string
  key: string
  isDefault: boolean
  isEnabled: boolean
}

const AI_PROVIDERS = [
  { id: "openai", name: "OpenAI", icon: Sparkles },
  { id: "gemini", name: "Google Gemini", icon: Brain },
  { id: "llama", name: "Llama", icon: Star },
  { id: "anthropic", name: "Anthropic Claude", icon: Bot },
]

export default function ApiKeyManager() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null)
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [newApiKey, setNewApiKey] = useState("")


  const instance = useUser()
  const user_email = instance.user && instance.user.emailAddresses && instance.user.emailAddresses[0].emailAddress

  const data = useQuery(api.apikey_manager.getApiKeysByEmail, { email: user_email })
 
   React.useEffect(() => {
    if (data) {
      setApiKeys(data)
    }
  }, [data])

  const uploadKey = useMutation(api.apikey_manager.addOrUpdateApiKey)

  const handleAddKey = async () => {
    console.log("keys ", apiKeys)
    if (!selectedProvider || !newApiKey) return;

    const newKey: ApiKey = {
      id: crypto.randomUUID(),
      provider: selectedProvider,
      key: newApiKey,
      isDefault: apiKeys.length === 0,
      isEnabled: true,
    };
    console.log("new key ", newKey)
     try {
      await uploadKey({
        email: user_email,  
        provider: selectedProvider,  
        apiKey: newApiKey,  
        isDefault: newKey.isDefault,  
        isEnabled: newKey.isEnabled, 
      });

       setApiKeys((prevKeys) => [...prevKeys, newKey]);
      setIsOpen(false); 
      setSelectedProvider(null); 
      setNewApiKey(""); 
    } catch (error) {
      console.error("Error uploading API key:", error);
     }
  }

  const toggleDefault = (id: string) => {
    setApiKeys(
      apiKeys.map((key) => ({
        ...key,
        isDefault: key.id === id,
        isEnabled: key.id === id ? true : key.isEnabled, // Ensure the new default key is enabled
      }))
    )
  }

  const toggleEnabled = (id: string) => {
    setApiKeys(
      apiKeys.map((key) => ({
        ...key,
        isEnabled: key.id === id ? !key.isEnabled : key.isEnabled,
        isDefault: key.id === id && key.isDefault ? false : key.isDefault, // Remove default status if disabling
      }))
    )
  }

  const deleteKey = (id: string) => {
    setApiKeys(apiKeys.filter((key) => key.id !== id))
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">API Key Management</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>Add New API Key</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{selectedProvider ? "Enter API Key" : "Select AI Provider"}</DialogTitle>
            </DialogHeader>
            {!selectedProvider ? (
              <div className="grid grid-cols-2 gap-4 p-4 text-white">
                {AI_PROVIDERS.map((provider) => {
                  const Icon = provider.icon
                  return (
                    <Card
                      key={provider.id}
                      className={cn(
                        "cursor-pointer hover:border-primary transition-colors",
                        "flex flex-col items-center justify-center p-4 gap-2"
                      )}
                      onClick={() => setSelectedProvider(provider.id)}
                    >
                      <Icon className="h-8 w-8" />
                      <span className="font-medium">{provider.name}</span>
                    </Card>
                  )
                })}
              </div>
            ) : (
              <div className="p-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="apiKey">API Key for {AI_PROVIDERS.find((p) => p.id === selectedProvider)?.name}</Label>
                  <Input
                    id="apiKey"
                    type="password"
                    value={newApiKey}
                    onChange={(e) => setNewApiKey(e.target.value)}
                    placeholder="Enter your API key"
                    className="text-white border-2 border-gray-500"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" className="text-white border-2 border-white" onClick={() => setSelectedProvider(null)}>
                    Back
                  </Button>
                  <Button onClick={handleAddKey} disabled={!newApiKey}>
                    Save Key
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        <Card className="p-4">
          <CardContent className="p-0">
            <Label htmlFor="default-key" className="mb-2 block">
              Default API Key
            </Label>
            <Select
              onValueChange={(value) => toggleDefault(value)}
              value={apiKeys.find((key) => key.isDefault)?.id || ""}
            >
              <SelectTrigger id="default-key" className="w-full">
                <SelectValue placeholder="Select a default API key" />
              </SelectTrigger>
              <SelectContent>
                {apiKeys.filter((key) => key.isEnabled).map((key) => (
                  <SelectItem key={key.id} value={key.id}>
                    {AI_PROVIDERS.find((p) => p.id === key.provider)?.name} - {key.key.substring(0, 6)}...
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {apiKeys.map((key) => (
          <Card key={key.id} className="p-4">
            <CardContent className="flex items-center justify-between p-0">
              <div className="flex items-center gap-4">
                {AI_PROVIDERS.find((p) => p.id === key.provider)?.icon && (
                  <div className="p-2 bg-secondary rounded-lg">
                    {React.createElement(AI_PROVIDERS.find((p) => p.id === key.provider)!.icon, {
                      className: "h-5 w-5",
                    })}
                  </div>
                )}
                <div>
                  <h3 className="font-medium">{AI_PROVIDERS.find((p) => p.id === key.provider)?.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {key.key.substring(0, 6)}...{key.key.substring(key.key.length - 4)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {key.isDefault && (
                  <span className="text-sm text-primary font-medium">Default</span>
                )}
                <div className="flex items-center gap-2">
                  <Label htmlFor={`enabled-${key.id}`} className="text-sm">
                    Enabled
                  </Label>
                  <Switch id={`enabled-${key.id}`} checked={key.isEnabled} onCheckedChange={() => toggleEnabled(key.id)} />
                </div>
                <Button variant="ghost" size="icon" onClick={() => deleteKey(key.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
