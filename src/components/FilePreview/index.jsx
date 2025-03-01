// src/components/FilePreview/index.jsx - File content preview

import React, { useState, useEffect } from "react";
import { useFileSelection } from "../../contexts/FileSelectionContext";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { maximumFileSize } from "../../lib/constants";
import { formatFileSize } from "../../lib/utils";
import {
  FileText,
  Eye,
  EyeOff,
  XCircle,
  AlertCircle
} from "lucide-react";


export default function FilePreview() {
  const { selectedFiles, activeFile, setActiveFile } = useFileSelection();
  const [fileContent, setFileContent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (activeFile) {
      fetchFileContent(activeFile.path);
    } else {
      setFileContent(null);
      setError(null);
    }
  }, [activeFile]);
  
  const fetchFileContent = async (filePath) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/file?path=${encodeURIComponent(filePath)}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch file content");
      }
      
      const data = await response.json();
      
      if (data.size > maximumFileSize) {
        setError(`File too large (${formatFileSize(data.size)})`);
        setFileContent(null);
      } else {
        setFileContent(data.content);
      }
    } catch (error) {
      console.error("Error fetching file content:", error);
      setError(error.message || "Failed to load file content");
      setFileContent(null);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!selectedFiles.length) {
    return null;
  }
  
  return (
    <Card className="border border-border bg-card overflow-hidden h-[300px] flex flex-col">
      <CardHeader className="py-3 px-4 border-b border-border">
        <CardTitle className="text-base flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            <span>File Preview</span>
          </div>
          <div className="flex items-center gap-1">
            {activeFile && (
              <Button 
                variant="ghost" 
                size="sm"
                className="h-7 px-2" 
                onClick={() => setActiveFile(null)}
              >
                <XCircle className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0 flex-1 overflow-hidden">
        {!activeFile ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4">
            <EyeOff className="h-12 w-12 mb-2 opacity-20" />
            <p className="text-sm">Select a file to preview its content</p>
          </div>
        ) : isLoading ? (
          <div className="p-4 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-10/12" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full text-destructive p-4">
            <AlertCircle className="h-12 w-12 mb-2 opacity-20" />
            <p className="text-sm">{error}</p>
          </div>
        ) : (
          <div className="p-4 h-full overflow-auto">
            <pre className="text-xs font-mono whitespace-pre-wrap">{fileContent}</pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}