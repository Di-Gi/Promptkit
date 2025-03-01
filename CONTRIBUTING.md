# Contributing to PromptKit

Thank you for your interest in contributing to PromptKit! This document provides guidelines and instructions for contributing to this project.

## Code of Conduct

Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md) to foster an inclusive community.

## How Can I Contribute?

### Reporting Bugs

Before creating a bug report:
- Check the [issue tracker](https://github.com/Di-Gi/promptkit/issues) to see if the problem has already been reported
- If not, create a new issue with a clear title and description
- Include steps to reproduce, expected behavior, and screenshots if applicable
- Describe your environment (OS, browser, etc.)

### Suggesting Features

Feature suggestions are tracked as GitHub issues:
- Check existing suggestions to avoid duplicates
- Provide a clear description of the feature and its benefits
- Consider how it fits with existing functionality

### Pull Requests

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and linting
5. Commit your changes with clear messages
6. Push to your branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## Development Setup

### Prerequisites
- Node.js 16.x or higher
- npm or yarn

### Installation
```bash
# Clone your fork
git clone https://github.com/Di-Gi/promptkit.git
cd promptkit

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Project Structure

- `/src` - React application code
  - `/components` - UI components
  - `/contexts` - React context providers
  - `/hooks` - Custom React hooks
  - `/lib` - Utility functions and constants
- `/main.js` - Electron main process and Express server

### Style Guide

- We use ESLint for JavaScript/React linting
- Follow the existing code style
- Document public functions and components
- Write meaningful commit messages

## Release Process

1. Update version in package.json
2. Update CHANGELOG.md
3. Create a new tag and release on GitHub
4. CI will build and publish releases

Thank you for contributing!
