"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Bot, Brain, Sparkles, Star, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation, useQuery } from "convex/react";
import { useUser } from "@clerk/clerk-react";
import { api } from "../../../convex/_generated/api";
import React from "react";

interface ApiKey {
  id: string;
  provider: string;
  key: string;
  isDefault: boolean;
  isEnabled: boolean;
}

const AI_PROVIDERS = [
  { id: "openai", name: "OpenAI", icon: Sparkles },
  { id: "gemini", name: "Google Gemini", icon: Brain },
  { id: "llama", name: "Llama", icon: Star },
  { id: "anthropic", name: "Anthropic Claude", icon: Bot },
];

export default function ApiKeyManager() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [newApiKey, setNewApiKey] = useState("");

  const instance = useUser();
  const user_email =
    instance.user && instance.user.emailAddresses && instance.user.emailAddresses[0].emailAddress;

  const data = useQuery(api.apikey_manager.getApiKeysByEmail, { email: user_email });

  useEffect(() => {
    if (data) {
      setApiKeys(data);
    }
  }, [data]);

  const uploadKey = useMutation(api.apikey_manager.addOrUpdateApiKey);
  const deleteApiKeyMutation = useMutation(api.apikey_manager.deleteApiKey);
  const toggleEnabledMutation = useMutation(api.apikey_manager.toggleApiKeyEnabled);

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
  };

  const toggleEnabled = async (id: string) => {
    try {
      const keyToUpdate = apiKeys.find((key) => key.key === id);
      if (!keyToUpdate) return;

      await toggleEnabledMutation({
        email: user_email,
        keyId: keyToUpdate.key,
      });
      setApiKeys((prevKeys) =>
        prevKeys.map((key) =>
          key.id === keyToUpdate.id ? { ...key, isEnabled: !key.isEnabled } : key
        )
      );
    } catch (error) {
      console.error("Error toggling API key:", error);
    }
  };

  const deleteKey = async (id: string) => {
    try {
      const keyToDelete = apiKeys.find((key) => key.id === id);
      if (!keyToDelete) return;

      await deleteApiKeyMutation({
        email: user_email,
        provider: keyToDelete.provider,
      });

      setApiKeys((prevKeys) => prevKeys.filter((key) => key.id !== id));
    } catch (error) {
      console.error("Error deleting API key:", error);
    }
  };

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
                  const Icon = provider.icon;
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
                  );
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
                <div className="flex items-center gap-2">
                  <Label htmlFor={`enabled-${key.id}`} className="text-sm">
                    {`${key.isEnabled ? "Enabled" : "Disabled"}`}
                  </Label>
                  <Switch id={`enabled-${key.key}`} checked={key.isEnabled} onCheckedChange={() => toggleEnabled(key.key)} />
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
  );
}
