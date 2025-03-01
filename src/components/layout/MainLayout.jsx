// src/components/layout/MainLayout.jsx

import React from "react";
import PromptEditor from "../PromptEditor";
import FileExplorer from "../FileExplorer";
import SelectedFiles from "../SelectedFiles";
import FinalPrompt from "../FinalPrompt";
import FilePreview from "../FilePreview";
import ErrorBoundary from "../ErrorBoundary";

export default function MainLayout() {
  return (
    <main className="flex-1 p-4 lg:p-6 grid grid-cols-1 md:grid-cols-6 gap-4 lg:gap-6 container mx-auto max-w-7xl">
      <div className="md:col-span-4 space-y-4 lg:space-y-6">
        <ErrorBoundary>
          <PromptEditor />
        </ErrorBoundary>
        <ErrorBoundary>
          <FinalPrompt />
        </ErrorBoundary>
      </div>
      <div className="md:col-span-2 space-y-4 lg:space-y-6">
        <ErrorBoundary>
          <FileExplorer />
        </ErrorBoundary>
        <ErrorBoundary>
          <SelectedFiles />
        </ErrorBoundary>
        <ErrorBoundary>
          <FilePreview />
        </ErrorBoundary>
      </div>
    </main>
  );
}