// src/components/layout/Header.jsx
import React, { useState, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useSettings } from "../../contexts/SettingsContext";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { 
  Sun, 
  Moon, 
  HelpCircle, 
  Settings,
  Code,
  FileText,
  X,
  Minus,
  Maximize,
  Square
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "../ui/dialog";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const { settings, updateSetting, resetSettings } = useSettings();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  
  // Detect if running in Electron
  const isElectronApp = Boolean(window.electron?.windowControls);
  
  // Only check maximized state when in Electron
  useEffect(() => {
    if (!isElectronApp) return;
    
    const checkMaximized = async () => {
      try {
        const maximized = await window.electron.windowControls.isMaximized();
        setIsMaximized(maximized);
      } catch (err) {
        console.error("Error checking window state:", err);
      }
    };
    
    checkMaximized();
    
    const handleResize = () => {
      checkMaximized();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isElectronApp]);
  
  // Window control handlers - only used in Electron
  const handleMinimize = () => {
    if (isElectronApp) {
      window.electron.windowControls.minimize();
    }
  };
  
  const handleMaximize = () => {
    if (isElectronApp) {
      window.electron.windowControls.maximize();
    }
  };
  
  const handleClose = () => {
    if (isElectronApp) {
      window.electron.windowControls.close();
    }
  };
  
  return (
    <header className={isElectronApp ? 'app-region-drag border-b border-border' : 'border-b border-border'}>
      <div className="container mx-auto max-w-7xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Code className="h-6 w-6 text-primary" />
          <h1 className="font-semibold text-xl">PromptKit</h1>
        </div>
        
        <TooltipProvider>
          <div className="flex items-center gap-2">
            {/* Regular UI controls */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className={isElectronApp ? "window-control-btn" : ""}
                >
                  {theme === "dark" ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Toggle theme</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setHelpOpen(true)}
                  className={isElectronApp ? "window-control-btn" : ""}
                >
                  <HelpCircle className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Help & Documentation</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setSettingsOpen(true)}
                  className={isElectronApp ? "window-control-btn" : ""}
                >
                  <Settings className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Settings</p>
              </TooltipContent>
            </Tooltip>
            
            {/* Window controls - only shown in Electron */}
            {isElectronApp && (
              <div className="ml-4 pl-4 border-l border-border flex items-center">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={handleMinimize}
                      className="window-control-btn"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Minimize</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={handleMaximize}
                      className="window-control-btn"
                    >
                      {isMaximized ? <Square className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isMaximized ? "Restore" : "Maximize"}</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={handleClose}
                      className="window-control-btn hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Close</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            )}
          </div>
        </TooltipProvider>
      </div>

      
      {/* Settings Dialog */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Configure your PromptKit preferences.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-5">
          {/* Theme Setting */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="theme-setting">Theme</Label>
              <p className="text-xs text-muted-foreground">
                Choose light or dark mode
              </p>
            </div>
            <select 
              id="theme-setting"
              className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
              value={settings.theme}
              onChange={(e) => updateSetting('theme', e.target.value)}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
          </div>
          
          {/* Auto-save Setting */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-save">Auto-save prompts</Label>
              <p className="text-xs text-muted-foreground">
                Automatically save prompts when modified
              </p>
            </div>
            <Switch 
              id="auto-save" 
              checked={settings.autoSavePrompts}
              onCheckedChange={(checked) => updateSetting('autoSavePrompts', checked)}
            />
          </div>
          
          {/* Path Format Setting */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="path-format">File path format</Label>
              <p className="text-xs text-muted-foreground">
                How file paths appear in generated prompts
              </p>
            </div>
            <select 
              id="path-format"
              className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
              value={settings.pathDisplayFormat}
              onChange={(e) => updateSetting('pathDisplayFormat', e.target.value)}
            >
              <option value="full">Full paths</option>
              <option value="relative">Relative paths</option>
              <option value="filename">Filenames only</option>
            </select>
          </div>
          
          {/* Include Metadata Setting */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="include-metadata">Include file metadata</Label>
              <p className="text-xs text-muted-foreground">
                Include size, dates and other info in prompts
              </p>
            </div>
            <Switch 
              id="include-metadata" 
              checked={settings.includeMetadata}
              onCheckedChange={(checked) => updateSetting('includeMetadata', checked)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={resetSettings}>
            Reset to Defaults
          </Button>
          <DialogClose asChild>
            <Button>Save Changes</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
      
      {/* Help Dialog */}
      <Dialog open={helpOpen} onOpenChange={setHelpOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Help & Documentation</DialogTitle>
            <DialogDescription>
              Learn how to use PromptKit effectively.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto">
            <h3 className="text-lg font-medium">Getting Started</h3>
            <p className="text-sm text-muted-foreground">
              PromptKit helps you create and manage prompts with file content references for AI assistants.
            </p>
            
            <h4 className="text-md font-medium mt-4">Basic Workflow</h4>
            <ol className="list-decimal pl-5 text-sm space-y-2">
              <li>Write your prompt in the editor</li>
              <li>Browse and select files you want to reference</li>
              <li>Generate the final prompt which combines your text with file contents</li>
              <li>Copy or save the final prompt for use with AI assistants</li>
            </ol>
            
            <h4 className="text-md font-medium mt-4">Tips</h4>
            <ul className="list-disc pl-5 text-sm space-y-2">
              <li>Use the formatting tools for better prompt structure</li>
              <li>Try the templates for common use cases</li>
              <li>Preview files before adding them to ensure they contain the content you need</li>
              <li>Save useful prompts for reuse later</li>
            </ul>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
}