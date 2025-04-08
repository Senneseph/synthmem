# SynthMem Frontend

This is the frontend for the SynthMem application, built with React, Vite, and Material-UI.

## Development

To start the development server:

```bash
# From the project root
docker-compose up
```

This will start the development server at http://localhost:5173.

## Testing

To run tests:

```bash
# From the project root
docker-compose -f docker-compose.test.yml up
```

## Building

To build the application:

```bash
# From the project root
docker-compose run --rm frontend npm run build
```

## PWA Build

To build the application as a Progressive Web App:

```bash
# From the project root
docker-compose run --rm frontend npm run build:pwa
```

The build artifacts will be in the `dist` directory.

## Project Structure

- `public/` - Static assets
- `src/` - Source code
  - `components/` - React components
  - `test/` - Test setup and utilities
  - `App.jsx` - Main application component
  - `main.jsx` - Application entry point
