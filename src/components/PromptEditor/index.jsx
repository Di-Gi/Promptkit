// src/components/PromptEditor/index.jsx - Prompt editor

import React, { useState } from "react";
import { usePrompt } from "@/contexts/PromptContext";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useToast } from "@/hooks/useToast";
import {
  BoldIcon,
  ItalicIcon,
  ListIcon,
  Code2Icon,
  Sparkles,
  RotateCcw,
  Save,
  FileText
} from "lucide-react";


export default function PromptEditor() {
  const { mainPrompt, setMainPrompt, savedPrompts, savePrompt } = usePrompt();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);


  const formatText = (format) => {
    const textarea = document.getElementById('prompt-editor');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = mainPrompt.substring(start, end);
    let formattedText = '';
    
    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'list':
        formattedText = selectedText.split('\n').map(line => `- ${line}`).join('\n');
        break;
      case 'code':
        formattedText = `\`\`\`\n${selectedText}\n\`\`\``;
        break;
      default:
        formattedText = selectedText;
    }
    
    const newPrompt = mainPrompt.substring(0, start) + formattedText + mainPrompt.substring(end);
    setMainPrompt(newPrompt);
    
    // Re-focus and set selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start, start + formattedText.length);
    }, 0);
  };
  
  const handleSavePrompt = () => {
    if (mainPrompt.trim()) {
      setSaving(true);
      
      // Save the prompt
      savePrompt(mainPrompt);
      
      // Show toast notification
      toast({
        title: "Prompt saved",
        description: "Your prompt has been saved successfully.",
      });
      
      // Show saving animation briefly
      setTimeout(() => {
        setSaving(false);
      }, 600);
    }
  };
  
  const insertTemplate = (template) => {
    setMainPrompt(template);
  };
  
  return (
    <Card className="border border-border bg-card">
      <CardHeader className="py-3 px-4 border-b border-border">
        <CardTitle className="text-base flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Prompt Editor</span>
          </div>
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 px-2"
              onClick={() => formatText('bold')}
            >
              <BoldIcon className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 px-2"
              onClick={() => formatText('italic')}
            >
              <ItalicIcon className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 px-2"
              onClick={() => formatText('list')}
            >
              <ListIcon className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 px-2"
              onClick={() => formatText('code')}
            >
              <Code2Icon className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 px-2"
              onClick={() => setMainPrompt('')}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 px-2 relative"
              onClick={handleSavePrompt}
              disabled={!mainPrompt.trim() || saving}
            >
              {saving ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-4 w-4 border-2 border-t-transparent border-primary rounded-full animate-spin"></div>
                </div>
              ) : (
                <Save className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-4">
        <Tabs defaultValue="editor">
          <TabsList className="mb-4">
            <TabsTrigger value="editor">Edit</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="editor">
            <textarea
              id="prompt-editor"
              className="w-full h-48 p-4 rounded-md bg-background border border-input 
                       text-foreground focus:outline-none focus:ring-2 focus:ring-ring
                       resize-none font-mono text-sm"
              value={mainPrompt}
              onChange={(e) => setMainPrompt(e.target.value)}
              placeholder="Type your prompt here..."
            />
          </TabsContent>
          
          <TabsContent value="templates">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  title: "Analyze Code",
                  text: "Analyze the following code and explain what it does, any potential bugs, and how it could be improved:",
                  icon: <Code2Icon className="h-4 w-4" />
                },
                {
                  title: "Explain Concept",
                  text: "Explain the following concept in simple terms, as if you were teaching it to someone with no background knowledge:",
                  icon: <Sparkles className="h-4 w-4" />
                },
                {
                  title: "Summarize Content",
                  text: "Summarize the key points from the following content in bullet points:",
                  icon: <ListIcon className="h-4 w-4" />
                },
                {
                  title: "Compare Files",
                  text: "Compare these files and explain the main differences between them:",
                  icon: <FileText className="h-4 w-4" />
                }
              ].map((template) => (
                <Card 
                  key={template.title}
                  className="border border-border cursor-pointer hover:bg-accent transition-colors"
                  onClick={() => insertTemplate(template.text)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2 mb-2">
                      {template.icon}
                      <h3 className="text-sm font-medium">{template.title}</h3>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{template.text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="history">
            <div className="space-y-2">
              {savedPrompts.length > 0 ? (
                savedPrompts.map((prompt, index) => (
                  <div 
                    key={index}
                    className="p-3 border border-border rounded-md cursor-pointer hover:bg-accent transition-colors"
                    onClick={() => setMainPrompt(prompt)}
                  >
                    <p className="text-sm line-clamp-2">{prompt}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date().toLocaleDateString()}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted-foreground p-4">
                  <p>No saved prompts yet</p>
                  <p className="text-xs mt-1">Save prompts to see them here</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}