# AI Google Form Filler

An intelligent web application that automates Google Form submissions using AI-powered contextual answer generation. Built with React, TypeScript, TailwindCSS, and OpenAI's GPT-5 model.

![AI Form Filler](https://img.shields.io/badge/AI-Powered-7c3aed) ![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue) ![Status](https://img.shields.io/badge/Status-MVP-success)

## ✨ Features

- 🤖 **AI-Powered Answers**: Uses OpenAI GPT-5 to generate contextual, human-like responses
- 📝 **Multi-Type Support**: Handles text, MCQ, checkboxes, scales, dates, and more
- 🔢 **Bulk Generation**: Create 1-100 form responses automatically
- 📊 **Real-Time Progress**: Beautiful progress tracking with live updates
- 🎨 **Modern UI**: Clean, professional design with dark mode support
- 🌐 **Chrome Extension**: Convenient popup interface (included)
- ✅ **Comprehensive Results**: Detailed success/failure statistics and submission logs

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- OpenAI API Key ([Get one here](https://platform.openai.com/))

### Installation

1. **Clone or download this project**

2. **Set up environment variables**
   ```bash
   
   # For local development, create a .env file:
   echo "OPENAI_API_KEY=your_key_here" > .env
   ```

3. **Install dependencies** (if not already installed)
   ```bash
   npm install
   ```

4. **Start the application**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:5000
   ```

## 📖 How to Use

### Web Application

1. **Paste a Google Form URL**
   - Copy the link from any publicly accessible Google Form
   - Paste it into the form URL input field

2. **Configure Settings**
   - Set the number of responses (1-100)
   - Optionally add consistent user data (name, email)

3. **Generate & Submit**
   - Click "Generate & Fill Responses"
   - Watch real-time progress as AI creates and submits answers
   - View detailed results with success/failure stats

### Chrome Extension

1. **Load the extension** (see [chrome-extension/README.md](chrome-extension/README.md))
2. **Navigate to a Google Form** or have the URL ready
3. **Click the extension icon**
4. **Configure and submit** - same as web app but in a compact popup!

## 🏗️ Architecture

### Tech Stack

**Frontend**
- React with TypeScript
- TailwindCSS + Shadcn UI
- TanStack Query for data fetching
- Wouter for routing
- React Hook Form + Zod validation

**Backend**
- Express.js
- OpenAI API (GPT-5)
- Cheerio for HTML parsing
- Axios for HTTP requests

**Chrome Extension**
- Manifest v3
- Vanilla JavaScript
- Shared API integration

### Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── pages/         # Route pages
│   │   └── lib/           # Utilities
│
├── server/                # Express backend
│   ├── services/          # Business logic
│   │   ├── openaiService.ts
│   │   ├── formAnalyzer.ts
│   │   ├── answerGenerator.ts
│   │   └── formSubmitter.ts
│   ├── utils/             # Helpers
│   └── routes.ts          # API endpoints
│
├── shared/                # Shared types
│   └── schema.ts          # Zod schemas
│
└── chrome-extension/      # Browser extension
    ├── manifest.json
    ├── popup/
    └── README.md
```

## 🔌 API Endpoints

### POST `/api/parse-form`

Parse a Google Form and extract questions.

**Request:**
```json
{
  "formUrl": "https://docs.google.com/forms/d/e/..."
}
```

**Response:**
```json
{
  "formId": "abc123",
  "title": "Sample Survey",
  "questions": [...]
}
```

### POST `/api/fill-form`

Generate and submit form responses.

**Request:**
```json
{
  "formUrl": "https://docs.google.com/forms/d/e/...",
  "numResponses": 5,
  "userData": {
    "name": "John Doe",
    "email": "john@example.com"
  },
  "useAI": true
}
```

**Response:**
```json
{
  "totalRequested": 5,
  "successCount": 5,
  "failedCount": 0,
  "duration": 12500,
  "submissions": [...]
}
```

## 🎨 Design

The application features a modern, professional design:

- **Color Scheme**: Purple primary (#7c3aed) with neutral grays
- **Layout**: Two-column responsive layout
- **Typography**: Inter for UI, JetBrains Mono for code
- **Dark Mode**: Full support with automatic theme persistence
- **Animations**: Smooth transitions and progress indicators

## 🤖 AI Answer Generation

The application uses OpenAI's **GPT-5** model (released August 2025) to generate contextual answers:

- **Text Questions**: Natural, relevant responses based on question context
- **Paragraph Questions**: Longer, detailed content (2-4 sentences)
- **Email Fields**: Uses provided email or generates realistic format
- **Other Types**: Intelligent fallbacks (random selection, dates, etc.)

## ⚙️ Configuration

### Environment Variables

- `OPENAI_API_KEY` - Your OpenAI API key (**required**)
- `SESSION_SECRET` - Session secret (auto-generated)
- `PORT` - Server port (default: 5000)

### Question Type Support

- ✅ Short Text (AI-generated)
- ✅ Paragraph (AI-generated)
- ✅ Multiple Choice (random selection)
- ✅ Checkboxes (random selection)
- ✅ Dropdown (random selection)
- ✅ Linear Scale (random in range)
- ✅ Date (current or random date)
- ✅ Time (current or random time)
- ✅ Email (from user data or generated)

## 🔒 Privacy & Ethics

**Important Notes:**

- This tool is for **testing, demonstrations, and educational purposes**
- Ensure you have permission before submitting to any form
- Some forms may have CAPTCHA or rate limiting protection
- The tool respects form structures but cannot bypass security measures
- AI-generated responses are contextual but generic

## 🐛 Troubleshooting

### Common Issues

**"Failed to parse form"**
- Ensure the form is publicly accessible (doesn't require login)
- Check the URL is a valid Google Form link
- Some forms may have complex structures that aren't supported

**"OpenAI API error"**
- Verify your `OPENAI_API_KEY` is valid
- Check you have API credits available
- Ensure you have access to GPT-5 model

**"Submission failed"**
- Google may be rate limiting requests
- The form might be closed or have restrictions
- Try reducing the number of responses

### Debug Mode

Check the browser console (F12) for detailed error messages and logs.

## 📝 Development

### Run Development Server

```bash
npm run dev
```

This starts both the frontend (Vite) and backend (Express) on port 5000.

### Build for Production

```bash
npm run build
```

### Code Quality

- TypeScript for type safety
- Zod for runtime validation
- ESLint for code linting
- Modular architecture for maintainability

## 🚧 Future Enhancements

- [ ] CSV export of submission data
- [ ] Response preview before submission
- [ ] Smart answer templates and patterns
- [ ] Form history and favorites
- [ ] Support for conditional form logic
- [ ] Batch processing from file uploads
- [ ] Advanced AI customization options

## 📄 License

This project is provided as-is for educational and testing purposes.

## 🙏 Acknowledgments

- Powered by [OpenAI](https://openai.com)
- UI components from [Shadcn](https://ui.shadcn.com)

---

**Made with ❤️**
