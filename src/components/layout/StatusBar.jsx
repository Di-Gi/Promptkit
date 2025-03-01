// src/components/layout/StatusBar.jsx - Application status bar

import React from "react";
import { useFileSelection } from "../../contexts/FileSelectionContext";
import { Database, FileText } from "lucide-react";
import packageJson from "../../../package.json";

export default function StatusBar() {
  const { selectedFiles } = useFileSelection();
  const appVersion = packageJson.version;
  
  return (
    <footer className="border-t border-border py-2 px-4 text-xs text-muted-foreground">
      <div className="container mx-auto max-w-7xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <FileText className="h-3 w-3" />
            <span>
              {selectedFiles.length} file{selectedFiles.length !== 1 ? "s" : ""} selected
            </span>
          </div>
          {selectedFiles.length > 0 && (
            <div>
              <span>
                {(selectedFiles.reduce((total, file) => total + (file.size || 0), 0) / 1024).toFixed(1)} KB total
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Database className="h-3 w-3" />
            <span>PromptKit v{appVersion}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
