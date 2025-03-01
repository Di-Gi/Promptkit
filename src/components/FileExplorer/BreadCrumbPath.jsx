// src/components/FileExplorer/BreadcrumbPath.jsx - Breadcrumb navigation for file paths

import React, { useMemo } from "react";
import { Button } from "../ui/button";
import { ChevronRight, Home } from "lucide-react";

export default function BreadcrumbPath({ path, separator, onNavigate }) {
  // Parse the path into segments
  const segments = useMemo(() => {
    if (!path) return [];
    
    // Special handling for Windows-style paths
    if (separator === '\\' && path.includes(':\\')) {
      // Handle Windows root drive (e.g., "C:\")
      const driveLetter = path.substring(0, 3); // e.g. "C:\"
      
      if (path === driveLetter) {
        return [{ name: driveLetter, path: driveLetter }];
      }
      
      const remainingPath = path.substring(3);
      const pathSegments = remainingPath.split(separator).filter(Boolean);
      
      return [
        { name: driveLetter, path: driveLetter },
        ...pathSegments.map((segment, index) => {
          const segmentPath = driveLetter + pathSegments
            .slice(0, index + 1)
            .join(separator) + separator;
          return { name: segment, path: segmentPath };
        })
      ];
    } 
    
    // Unix-style paths
    const isAbsolute = path.startsWith(separator);
    const rootSegment = isAbsolute ? { name: separator, path: separator } : null;
    
    const pathSegments = path.split(separator).filter(Boolean);
    
    const segments = pathSegments.map((segment, index) => {
      const segmentPath = isAbsolute
        ? separator + pathSegments.slice(0, index + 1).join(separator)
        : pathSegments.slice(0, index + 1).join(separator);
      
      return { name: segment, path: segmentPath };
    });
    
    return rootSegment ? [rootSegment, ...segments] : segments;
  }, [path, separator]);

  // Handle too many segments
  const displaySegments = useMemo(() => {
    if (segments.length <= 4) return segments;
    
    // If we have more than 4 segments, show first, ellipsis, and last two
    return [
      segments[0],
      { name: '...', path: null, isEllipsis: true },
      ...segments.slice(segments.length - 2)
    ];
  }, [segments]);

  if (!path) return null;

  return (
    <div className="px-4 py-2 border-b border-border flex items-center overflow-x-auto whitespace-nowrap scrollbar-hide">
      {displaySegments.map((segment, index) => (
        <React.Fragment key={segment.path || `ellipsis-${index}`}>
          {index > 0 && (
            <ChevronRight className="h-3 w-3 mx-1 text-muted-foreground" />
          )}
          
          {segment.isEllipsis ? (
            <span className="text-xs text-muted-foreground px-1">...</span>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs font-medium"
              onClick={() => onNavigate(segment.path)}
            >
              {segment.name === separator ? (
                <Home className="h-3 w-3" />
              ) : (
                segment.name
              )}
            </Button>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}