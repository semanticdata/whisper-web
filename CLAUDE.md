# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Whisper Web is a React-based web application that performs ML-powered speech recognition directly in the browser using 🤗 Transformers.js. The app allows users to transcribe audio files or record audio directly, processing everything client-side without server communication.

## Development Commands

### Setup and Development
```bash
# Install dependencies (uses pnpm)
pnpm install

# Start development server
pnpm run dev

# Build for production
pnpm run build

# Preview production build
pnpm run preview
```

### Code Quality
```bash
# Run ESLint
pnpm run lint

# Fix ESLint issues automatically
pnpm run lint:fix

# Format code with Prettier
pnpm run format

# Type checking
pnpm run tsc
```

### Clean Build
```bash
# Remove node_modules and dist folders
pnpm run clean
```

## Architecture

### Core Components
- **App.tsx**: Main application component that orchestrates AudioManager and Transcript components
- **AudioManager**: Handles audio input (file upload, URL input, microphone recording)
- **Transcript**: Displays transcription results with timestamps
- **useTranscriber**: Core hook managing transcription state and Web Worker communication
- **useWorker**: Hook for Web Worker lifecycle management
- **worker.js**: Web Worker that runs Transformers.js for speech recognition

### Key Architecture Patterns

#### Web Worker Architecture
The app uses a Web Worker (`src/worker.js`) to run Transformers.js models off the main thread, preventing UI blocking during model loading and transcription. Communication flows:
- Main thread → Worker: Audio data + model configuration
- Worker → Main thread: Progress updates, partial results, final transcription

#### State Management
- **useTranscriber**: Central state management for transcription process
- **useWorker**: Manages Web Worker lifecycle and message handling
- No external state management library - uses React hooks and context

#### Model Loading Strategy
- Uses `PipelineFactory` pattern in worker for efficient model caching
- Supports multiple Whisper model variants (tiny, base, small, medium)
- Automatic model selection based on device capabilities (mobile/tablet detection)
- Special handling for medium models using `no_attentions` revision to avoid memory issues

### Audio Processing
- Converts stereo audio to mono using scaling factor
- Processes audio in chunks with sliding window approach
- Supports real-time transcription updates via callback functions

## Key Configuration

### Model Defaults (src/utils/Constants.ts)
- **DEFAULT_MODEL**: "Xenova/whisper-tiny"
- **DEFAULT_QUANTIZED**: Automatically enabled on mobile/tablet devices
- **DEFAULT_MULTILINGUAL**: false (English-only by default)
- **SAMPLING_RATE**: 16000 Hz

### Browser Compatibility
- Firefox users must enable `dom.workers.modules.enabled` in about:config
- Safari on M1/M2 Macs may have compatibility issues
- Chrome, Firefox, and Edge are fully supported

## Technology Stack
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **@xenova/transformers** for ML inference
- **ESLint + Prettier** for code quality
- **pnpm** for package management

## Special Notes
- All ML processing happens client-side - no server required
- Models are loaded from HuggingFace Hub on first use
- Uses Web Workers to prevent UI blocking during heavy ML operations
- Supports both file upload and real-time microphone recording