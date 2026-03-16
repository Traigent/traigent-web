# Traigent Web

A React-based frontend for Traigent - the AI Agent Optimization Platform.

## Website Team Notes

- Resources-section handoff and content brief: [WEBSITE_RESOURCES_HANDOFF.md](./WEBSITE_RESOURCES_HANDOFF.md)

## Setup

### Prerequisites

- Node.js (v14+)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/traigent-web.git
   cd traigent-web
   ```

2. Install JavaScript dependencies:
   ```bash
   npm install
   ```

## Development

To start the development server:

```bash
npm run dev
```

This will start the development server at [http://localhost:5173](http://localhost:5173)

## Building for Production

To build the project for production:

```bash
npm run build
```

This will create a `dist` directory with the compiled assets.

## Deploying to GitHub Pages

To deploy the application to GitHub Pages:

1. Make sure you have the correct base path set in `vite.config.js`:
   ```js
   base: '/traigent-web/',  // Replace with your repository name
   ```

2. Run the deploy command:
   ```bash
   npm run deploy
   ```

## Project Structure

- `src/` - Contains the React application source code
- `public/` - Static assets that will be copied to the build directory
- `dist/` - Build output directory (created when you run `npm run build`)

## Technologies Used

- React
- Vite
- Tailwind CSS
- Framer Motion
- React Router 
