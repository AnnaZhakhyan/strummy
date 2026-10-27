# Strummy - the acoustic guitar beginner guide


# Strummy 

Strummy is a cozy, beginner-friendly guitar learning website designed to help users discover songs they love and learn how to play them on acoustic guitar. With a warm, relaxing visual style, Strummy makes practising guitar feel approachable and enjoyable.

##  Features

- **Song discovery** — Search and explore songs to find something new to play.
- **Song previews** — Listen to available song previews before deciding what to learn.
- **Chord search** — Search for songs with available chord charts through the Strummy chord backend.
- **Chord learning** — Retrieve chord information for supported songs.
- **Interactive learning experience** — Explore songs in a comfortable, beginner-friendly interface.
- **Cozy visual design** — A warm colour palette, illustrated room, guitar visuals, and interactive lighting details.
- **Responsive interface** — Designed to provide a comfortable experience across different screen sizes.

##  Technologies Used

### Frontend
- **HTML5** — Page structure and content.
- **CSS3** — Styling, responsive layouts, animations, and visual effects.
- **JavaScript (ES Modules)** — Application logic, API requests, and interactive features.
- **React** — Component-based user interface development.
- **Vite** — Frontend development server and build tooling.

### APIs and Backend Integration
- **iTunes Search API** — Song search and available audio preview information.
- **Strummy Chord Backend API** — Searches for songs with chord charts and retrieves chord information.
- **Fetch API** — Communicates with external APIs using HTTP requests.
- **Vite Development Server Proxy** — Routes API requests during local development.

### Development Tools and Deployment
- **npm** — Dependency and package management.
- **Git** — Version control.
- **GitHub** — Source code hosting.
- **GitHub Pages** — Hosting for the deployed frontend.

## Design Direction

Strummy uses a cozy, acoustic-inspired aesthetic intended to recreate the feeling of practising guitar in a comfortable room.

The design focuses on:
- Warm, earthy colours.
- Cream, brown, muted green, and sunset-inspired accents.
- Editorial typography.
- Illustrated guitar and room elements.
- Subtle animations and interactive details.

##  Getting Started

### Prerequisites

- Node.js
- npm
- Git

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/AnnaZhakhyan/strummy.git
   ```

2. Navigate to the project directory:

   ```bash
   cd strummy
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the local development server:

   ```bash
   npm run dev
   ```

5. Open the local URL printed in your terminal, usually:

   ```text
   http://localhost:5173
   ```

##  Project Structure

The project uses a React and Vite setup. The exact file structure may vary as development continues.

```text
strummy/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   │   └── songChordsApi.js
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

##  API Integration

### Song Search and Previews

Strummy uses the iTunes Search API to retrieve song information and available audio previews.

During local development, Vite proxies requests through `/itunes-api`.

### Chord Search

The Strummy chord backend provides endpoints for searching for chord charts and retrieving song chord data.

The frontend integrates with the backend through `songChordsApi.js`. During local development, requests are routed through `/chords-api` using the Vite proxy configuration.

Chord availability depends on the backend's supported catalogue and API availability.

##  Deployment

The frontend is deployed using GitHub Pages.

**Live website:**  
https://annazhakhyan.github.io/strummy/

The Vite configuration uses `/strummy/` as the deployment base path.

> Note: GitHub Pages hosts the frontend as a static website. API functionality depends on the availability and configuration of the external services used by the application.

---
