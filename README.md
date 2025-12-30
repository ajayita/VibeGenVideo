# VibeGen Architect 🎬

**VibeGen Architect** is a specialized prompt engineering tool designed for the new wave of text-to-video AI models (Sora, Runway Gen-3, Pika, etc.). 

It helps creators "architect" production-ready prompts by fusing a core **Topic** (subject/action) with a curated **Vibestack** (cinematography/lighting/mood), utilizing Google's Gemini models to synthesize the final output.

![VibeGen Interface](https://via.placeholder.com/800x450?text=VibeGen+Architect+Interface)

## ✨ Features

- **Cinematic Vibestacks**: Pre-configured stylistic presets ranging from *Cyberpunk Noir* to *Wes Anderson-style Symmetrical Pastel*.
- **Preset Management**: 
  - **Create** your own custom vibes.
  - **Export** your library to JSON.
  - **Import** shared vibestacks from other users.
- **AI-Powered Synthesis**: Uses Google's **Gemini 2.0 Flash** (via the new GenAI SDK) to intelligently merge subject matter with technical camera and lighting constraints.
- **History & Restore**: Automatically saves your generations locally. One-click restore to bring back previous settings.
- **Privacy First**: All history and custom presets are stored in your browser's `localStorage`.
- **Dark Mode**: Fully responsive UI with toggleable dark/light themes.

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- A Google Cloud Project with the **Gemini API** enabled.
- An API Key from [Google AI Studio](https://aistudio.google.com/).

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/vibegen-architect.git
   cd vibegen-architect
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   Create a `.env` file in the root directory and add your API key:
   ```env
   API_KEY=your_google_gemini_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm start
   ```

## 🛠 Usage Guide

### 1. Define the Topic
Describe **what** is happening. Focus on the subject, the action, and the physics of the scene.
> *Example: A giant astronaut walking through a field of crystalline flowers on Mars.*

### 2. Select or Build a Vibestack
Describe **how** it looks. This includes camera gear, lighting, color grading, and film stock.
- Click a **Preset** (e.g., "Analog 16mm") to auto-fill.
- Mix and match presets, or type your own technical specifications.
- **Save** your custom stack as a new preset for future use.

### 3. Set Duration
Choose the target length (5s, 8s, 10s, 15s) to help the AI pace the description (e.g., slow-motion for shorter clips, complex movements for longer ones).

### 4. Generate
Click **Generate Prompt**. The AI will produce a single, dense, production-grade paragraph ready to be pasted into your video generation tool of choice.

## 📦 Preset Management (JSON)

You can share your cinematic presets with the community.
- **Export**: Downloads a `vibegen_presets.json` file.
- **Import**: Upload a valid JSON file to merge new presets into your library.

**JSON Structure:**
```json
[
  {
    "id": "unique-id",
    "name": "Preset Name",
    "description": "Short UI description",
    "value": "Full technical prompt content..."
  }
]
```

## 🏗 Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Icons**: Lucide React
- **AI**: Google GenAI SDK (`@google/genai`)
- **Storage**: LocalStorage (Client-side persistence)

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

*Powered by Google Gemini*
