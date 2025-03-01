// src/components/FinalPrompt/index.jsx - Final prompt generation with file contents

import React, { useState } from "react";
import { usePrompt } from "../../contexts/PromptContext";
import { useFileSelection } from "../../contexts/FileSelectionContext";
import { useSettings } from "../../contexts/SettingsContext";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { maximumFileSize } from "../../lib/constants";
import { formatFileSize, formatDate, formatFilePath } from "../../lib/utils";
import { useToast } from "../../hooks/useToast";
import {
  Terminal,
  Copy,
  Check,
  Download,
  FileDown,
  Loader2,
  Settings,
} from "lucide-react";

export default function FinalPrompt() {
  const { mainPrompt } = usePrompt();
  const { selectedFiles } = useFileSelection();
  const { settings } = useSettings(); 
  const { toast } = useToast();
  const [finalPrompt, setFinalPrompt] = useState("");
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateFinalPrompt = async () => {
    if (!mainPrompt) return;
    
    setIsGenerating(true);
    
    try {
      // Fetch content for each selected file
      const filesWithContent = await Promise.all(
        selectedFiles.map(async (file) => {
          try {
            const response = await fetch(`/api/file?path=${encodeURIComponent(file.path)}`);
            
            if (!response.ok) {
              return {
                ...file,
                content: `[Error: Failed to fetch file content]`,
                error: true
              };
            }
            
            const data = await response.json();
            
            if (data.size > maximumFileSize) {
              return {
                ...file,
                content: `[File too large: ${formatFileSize(data.size)}]`,
                error: true
              };
            }
            
            return {
              ...file,
              content: data.content,
              error: false
            };
          } catch (error) {
            return {
              ...file,
              content: `[Error: ${error.message || "Unknown error"}]`,
              error: true
            };
          }
        })
      );
      
      // Format each path according to user settings
      const formattedFiles = filesWithContent.map(file => {
        return {
          ...file,
          formattedPath: formatFilePath(file.path, settings.pathDisplayFormat)
        };
      });
      
      // Build the file index section
      let fileIndexSection = "";
      if (selectedFiles.length) {
        fileIndexSection = "\n\n# Selected Files\n\n";
        fileIndexSection += "The following files are referenced in this prompt:\n\n";
        fileIndexSection += formattedFiles.map((f, idx) => {
          let line = `- ${f.formattedPath}`;
          
          // Add metadata if enabled in settings
          if (settings.includeMetadata) {
            line += ` (${formatFileSize(f.size)}`;
            if (f.extension) {
              line += `, ${f.extension}`;
            }
            line += ')';
          }
          return line;
        }).join('\n');
      }
      
      // Build the file contents section
      let contentsSection = "";
      if (selectedFiles.length) {
        contentsSection = "\n\n# File Contents\n";
        contentsSection += formattedFiles.map(file => {
          return `
====================
FILE: ${file.formattedPath}
====================
${file.error ? file.content : file.content}
`;
        }).join('\n');
      }
      
      // Combine all sections
      setFinalPrompt(`${mainPrompt}${fileIndexSection}${contentsSection}`);
      
      toast({
        title: "Prompt generated",
        description: `Generated with ${selectedFiles.length} file${selectedFiles.length !== 1 ? 's' : ''}`,
      });
    } catch (error) {
      console.error("Error generating prompt:", error);
      toast({
        title: "Error",
        description: "Failed to generate prompt with file contents",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    if (!finalPrompt) return;

    try {
      await navigator.clipboard.writeText(finalPrompt);
      setCopied(true);
      
      toast({
        title: "Success",
        description: "Prompt copied to clipboard",
      });
      
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const downloadPrompt = () => {
    if (!finalPrompt) return;

    const blob = new Blob([finalPrompt], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "prompt.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Success",
      description: "Prompt downloaded as text file",
    });
  };

  return (
    <Card className="border border-border bg-card">
      <CardHeader className="py-3 px-4 border-b border-border">
        <CardTitle className="text-base flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4" />
            <span>Final Prompt</span>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              onClick={generateFinalPrompt}
              size="sm"
              className="h-8"
              disabled={!mainPrompt || isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Terminal className="h-4 w-4 mr-2" />
                  Generate
                </>
              )}
            </Button>
    
            <Button 
              onClick={copyToClipboard}
              variant="outline"
              size="sm"
              className="h-8"
              disabled={!finalPrompt || isGenerating}
            >
              {copied ? (
                <Check className="h-4 w-4 mr-2" />
              ) : (
                <Copy className="h-4 w-4 mr-2" />
              )}
              Copy
            </Button>
    
            <Button 
              onClick={downloadPrompt}
              variant="outline"
              size="sm"
              className="h-8"
              disabled={!finalPrompt || isGenerating}
            >
              <FileDown className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="rounded-md bg-background border border-input p-4 min-h-[200px] overflow-auto">
          {finalPrompt ? (
            <div className="whitespace-pre-wrap font-mono text-sm">{finalPrompt}</div>
          ) : (
            <div className="text-muted-foreground text-center flex flex-col items-center justify-center h-full">
              <Terminal className="h-12 w-12 mb-2 opacity-20" />
              <p>Click "Generate" to create your final prompt</p>
              <p className="text-xs mt-2">Combines your prompt with selected file contents</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}