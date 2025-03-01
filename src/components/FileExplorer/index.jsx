// src/components/FileExplorer/index.jsx - File explorer

import React, { useState, useEffect } from "react";
import { useFileSelection } from "../../contexts/FileSelectionContext";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Skeleton } from "../ui/skeleton";
import { useToast } from "../../hooks/useToast";
import { formatFileSize, formatDate } from "../../lib/utils";
import BreadcrumbPath from "./BreadCrumbPath";
import {
  Folder,
  File,
  ArrowLeft,
  Home,
  RefreshCw,
  Search,
  Star,
  Clock,
  ChevronRight,
  FileText,
  FileCog,
  HardDrive
} from "lucide-react";


export default function FileExplorer() {
  const { addSelectedFile } = useFileSelection();
  const { toast } = useToast();
  const [currentPath, setCurrentPath] = useState("");
  const [pathSeparator, setPathSeparator] = useState("/");
  const [directories, setDirectories] = useState([]);
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState([]);
  
  useEffect(() => {
    fetchHomeDirectory();
  }, []);
  
  useEffect(() => {
    if (currentPath) {
      fetchDirectoryContents(currentPath);
    }
  }, [currentPath]);
  
  const fetchHomeDirectory = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/homedir");
      if (!response.ok) throw new Error("Failed to fetch home directory");
      
      const data = await response.json();
      setCurrentPath(data.homedir);
      setPathSeparator(data.separator);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch home directory",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchDirectoryContents = async (dirPath) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/list?dir=${encodeURIComponent(dirPath)}`);
      if (!response.ok) throw new Error("Failed to fetch directory contents");
      
      const data = await response.json();
      setDirectories(data.directories || []);
      setFiles(data.files || []);
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to read directory: ${error.message}`,
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const navigateUp = () => {
    if (!currentPath) return;
    
    const parts = currentPath.split(pathSeparator);
    if (parts.length > 1) {
      // Remove the last part and join
      parts.pop();
      const parentPath = parts.join(pathSeparator);
      setCurrentPath(parentPath || pathSeparator);
    }
  };
  
  const navigateToDirectory = (dirName) => {
    setCurrentPath(`${currentPath}${pathSeparator}${dirName}`);
  };
  
  const handleSelectFile = (file) => {
    const fullPath = `${currentPath}${pathSeparator}${file.name}`;
    addSelectedFile({
      path: fullPath,
      name: file.name,
      size: file.size,
      extension: file.extension,
      modified: file.modified
    });
    
    toast({
      title: "File selected",
      description: file.name,
    });
  };
  
  const refreshDirectory = () => {
    fetchDirectoryContents(currentPath);
  };
  
  const filteredDirectories = directories.filter(dir => 
    dir.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredFiles = files.filter(file => 
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <Card className="border border-border bg-card overflow-hidden h-[400px] flex flex-col">
      <CardHeader className="py-3 px-4 border-b border-border">
        <CardTitle className="text-base flex items-center gap-2">
          <HardDrive className="h-4 w-4" />
          File Explorer
        </CardTitle>
      </CardHeader>
      
      <div className="px-4 py-2 flex items-center gap-2 border-b border-border">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={navigateUp}
          disabled={isLoading || !currentPath}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={fetchHomeDirectory}
          disabled={isLoading}
        >
          <Home className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={refreshDirectory}
          disabled={isLoading}
          className={isLoading ? "animate-spin" : ""}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
        
        <Input 
          className="h-8 text-sm"
          placeholder="Search files..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>
      
      <BreadcrumbPath 
        path={currentPath} 
        separator={pathSeparator} 
        onNavigate={setCurrentPath}
      />
      
      <CardContent className="p-0 overflow-y-auto flex-1">
        {isLoading ? (
          <div className="p-4 space-y-2">
            {Array(5).fill().map((_, i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </div>
        ) : (
          <div className="p-2">
            {filteredDirectories.length === 0 && filteredFiles.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-muted-foreground">
                <FileCog className="h-12 w-12 mb-2 opacity-20" />
                <p className="text-sm">No matching files or folders</p>
              </div>
            ) : (
              <div className="space-y-1">
                {filteredDirectories.map((dir) => (
                  <div
                    key={dir.name}
                    onClick={() => navigateToDirectory(dir.name)}
                    className={`
                      flex items-center gap-2 p-2 rounded text-sm
                      hover:bg-accent hover:text-accent-foreground
                      cursor-pointer transition-colors
                      ${dir.isAccessible === false ? 'opacity-50' : ''}
                    `}
                  >
                    <Folder className="h-4 w-4 text-blue-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="truncate font-medium">{dir.name}</div>
                    </div>
                  </div>
                ))}
                
                {filteredFiles.map((file) => (
                  <div
                    key={file.name}
                    onClick={() => handleSelectFile(file)}
                    className={`
                      flex items-center gap-2 p-2 rounded text-sm
                      hover:bg-accent hover:text-accent-foreground
                      cursor-pointer transition-colors
                    `}
                  >
                    <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="truncate">{file.name}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2">
                        <span>{formatFileSize(file.size)}</span>
                        <span>•</span>
                        <span>{file.extension || 'No extension'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
