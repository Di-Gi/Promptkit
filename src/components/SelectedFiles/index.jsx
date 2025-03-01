// src/components/SelectedFiles/index.jsx - Selected files list component

import React from "react";
import { useFileSelection } from "../../contexts/FileSelectionContext";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Scroll, X, Eye, Trash2, FileText, Check } from "lucide-react";
import { formatFileSize } from "../../lib/utils";
import { ScrollArea } from "../ui/scroll-area";
import { useToast } from "../../hooks/useToast";

export default function SelectedFiles() {
  const { selectedFiles, removeSelectedFile, clearSelectedFiles, setActiveFile, activeFile } = useFileSelection();
  const { toast } = useToast();

  if (!selectedFiles.length) {
    return null;
  }

  const handleRemoveFile = (file) => {
    removeSelectedFile(file.path);
    toast({
      title: "File removed",
      description: file.name,
    });
  };

  const handleClearAllFiles = () => {
    if (selectedFiles.length > 0) {
      clearSelectedFiles();
      toast({
        title: "Selection cleared",
        description: "All files have been removed from selection",
      });
    }
  };

  const handlePreviewFile = (file) => {
    setActiveFile(file);
  };

  return (
    <Card className="border border-border bg-card overflow-hidden flex flex-col">
      <CardHeader className="py-3 px-4 border-b border-border">
        <CardTitle className="text-base flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scroll className="h-4 w-4" />
            <span>Selected Files ({selectedFiles.length})</span>
          </div>
          
          {selectedFiles.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs text-muted-foreground"
              onClick={handleClearAllFiles}
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              Clear All
            </Button>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea className="max-h-[200px]">
          <div className="p-2 space-y-1">
            {selectedFiles.map((file) => (
              <div
                key={file.path}
                className={`
                  flex items-center justify-between p-2 rounded text-sm
                  ${activeFile?.path === file.path ? 'bg-accent text-accent-foreground' : 'hover:bg-background'}
                  group transition-colors
                `}
              >
                <div 
                  className="flex items-center gap-2 flex-1 cursor-pointer"
                  onClick={() => handlePreviewFile(file)}
                >
                  <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="truncate">{file.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)} • {file.extension || 'No extension'}
                    </div>
                  </div>
                  
                  {activeFile?.path === file.path && (
                    <Check className="h-3.5 w-3.5 text-primary" />
                  )}
                </div>
                
                <div className="flex items-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handlePreviewFile(file)}
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                    onClick={() => handleRemoveFile(file)}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}