// server.js
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const os = require("os");

const serverPort = process.env.PORT || 3001;

// Create Express app and configure routes
function createServer() {
  const expressApp = express();

  // 1. Middleware setup
  expressApp.use(cors());
  expressApp.use(express.json());
  expressApp.use(express.urlencoded({ extended: true }));

  // 2. Create an API router
  const apiRouter = express.Router();

  apiRouter.get("/health", (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  apiRouter.get("/homedir", (req, res) => {
    try {
      const homeDir = os.homedir();
      console.log('Sending home directory:', homeDir);

      res.json({
        homedir: homeDir,
        separator: path.sep,
        platform: process.platform
      });
    } catch (err) {
      console.error("Error getting home directory:", err);
      res.status(500).json({ 
        error: 'Failed to get home directory',
        details: err.message 
      });
    }
  });

  apiRouter.get("/file", (req, res) => {
    try {
      const filePath = req.query.path;
      if (!filePath) {
        return res.status(400).json({ error: "No file path provided" });
      }

      const absolutePath = path.resolve(filePath);

      if (!fs.existsSync(absolutePath)) {
        return res.status(404).json({ error: "File not found" });
      }

      const stats = fs.statSync(absolutePath);

      if (!stats.isFile()) {
        return res.status(400).json({ error: "Not a file" });
      }

      // Check file size - limit to 1MB for safety
      const maxSize = 1024 * 1024; // 1MB
      if (stats.size > maxSize) {
        return res.json({
          path: absolutePath,
          size: stats.size,
          tooLarge: true,
          error: "File too large to preview"
        });
      }

      // Read file content
      let content;
      try {
        content = fs.readFileSync(absolutePath, 'utf8');
      } catch (readError) {
        // Handle binary files or encoding issues
        content = "[Binary file content - cannot display]";
      }

      // Serialize the date to prevent React rendering errors
      const modifiedDate = stats.mtime ? stats.mtime.toISOString() : null;

      res.json({
        path: absolutePath,
        size: stats.size,
        content: content,
        modified: modifiedDate
      });
    } catch (err) {
      console.error("Error reading file:", err);
      res.status(500).json({ 
        error: err.message,
        path: req.query.path 
      });
    }
  });

  apiRouter.get("/list", (req, res) => {
    try {
      let dirPath = req.query.dir;
      console.log('Requested directory:', dirPath);

      if (!dirPath) {
        dirPath = os.homedir();
        console.log('Using default home directory:', dirPath);
      }

      const absolutePath = path.resolve(dirPath);
      console.log('Resolved absolute path:', absolutePath);

      // Add debug logging
      console.log('Checking if path exists:', absolutePath);
      console.log('Directory exists:', fs.existsSync(absolutePath));

      if (!fs.existsSync(absolutePath)) {
        throw new Error(`Directory not found: ${absolutePath}`);
      }

      const pathStats = fs.statSync(absolutePath);
      if (!pathStats.isDirectory()) {
        throw new Error(`Not a directory: ${absolutePath}`);
      }

      const items = fs.readdirSync(absolutePath, { withFileTypes: true });
      const directories = [];
      const files = [];

      items.forEach((item) => {
        try {
          const itemPath = path.join(absolutePath, item.name);
          const stats = fs.statSync(itemPath);
    
          if (item.isDirectory()) {
            directories.push({
              name: item.name,
              type: 'directory',
              // Serialize dates to ISO strings to prevent React rendering errors
              modified: stats.mtime ? stats.mtime.toISOString() : null,
              created: stats.birthtime ? stats.birthtime.toISOString() : null,
              size: stats.size,
              isAccessible: true
            });
          } else {
            files.push({
              name: item.name,
              type: 'file',
              extension: path.extname(item.name),
              // Serialize dates to ISO strings to prevent React rendering errors
              modified: stats.mtime ? stats.mtime.toISOString() : null,
              created: stats.birthtime ? stats.birthtime.toISOString() : null,
              size: stats.size
            });
          }
        } catch (itemErr) {
          console.warn(`Skipping inaccessible item ${item.name}:`, itemErr);
          if (item.isDirectory()) {
            directories.push({
              name: item.name,
              type: 'directory',
              isAccessible: false,
              // Add default values for required fields to prevent errors
              modified: null,
              created: null,
              size: 0
            });
          }
        }
      });

      directories.sort((a, b) => a.name.localeCompare(b.name));
      files.sort((a, b) => a.name.localeCompare(b.name));

      const parentDir = path.dirname(absolutePath);
      const isAtDriveRoot = process.platform === 'win32' && 
                           absolutePath.match(/^[A-Z]:\\$/i) !== null;

      let drives = [];
      if (process.platform === 'win32') {
        try {
          const drivesOutput = require('child_process').execSync('wmic logicaldisk get name').toString();
          drives = drivesOutput
            .split('\n')
            .slice(1)
            .map(drive => drive.trim())
            .filter(drive => drive.length === 2);
        } catch (err) {
          console.warn('Failed to get drives list:', err);
        }
      }

      const response = {
        path: absolutePath,
        separator: path.sep,
        parent: isAtDriveRoot ? null : parentDir,
        isRoot: isAtDriveRoot,
        drives: process.platform === 'win32' ? drives : null,
        directories,
        files,
      };

      res.json(response);
    } catch (err) {
      console.error("Error reading directory:", err);
      res.status(500).json({ 
        error: err.message,
        path: req.query.dir 
      });
    }
  });

  // Mount the API router
  expressApp.use('/api', apiRouter);

  // Only serve static files if not in development mode
  if (process.env.NODE_ENV !== 'development') {
    // Determine the correct path for serving static files
    const distPath = path.join(__dirname, 'dist');
    console.log('Dist path:', distPath);
    console.log('Dist path exists:', fs.existsSync(distPath));

    // 3. Static file serving - After API routes
    expressApp.use(express.static(distPath));

    // 4. SPA catch-all route - Must be last
    expressApp.get("*", (req, res) => {
      console.log('Catch-all route hit, serving:', path.join(distPath, "index.html"));
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  return expressApp;
}

// Start the server
if (require.main === module) {
  const server = createServer();
  server.listen(serverPort, () => {
    console.log(`Express server running on http://localhost:${serverPort}`);
  });
}

module.exports = { createServer };