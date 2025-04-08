# SynthMem

SynthMem is a web application designed for musicians to save and manage synthesizer settings and configurations. It provides an intuitive interface for creating custom control layouts, storing presets, and organizing your synthesizer patches.

## Prerequisites

Before you begin, ensure you have met the following requirements:
- You have installed Node.js and npm
- You have a basic understanding of React
- You have Docker installed (for local development with PostgreSQL)

## Installation

To install the project, clone the repository and install the necessary dependencies:

```bash
git clone https://github.com/yourusername/synthmem.git
cd synthmem
npm install
```

## Usage

To use the project, first install the npm packages and then run the main script:

```bash
npm install
npm start
```

`npm start` will run the project using the start script defined in `package.json`.

## Features

- Create custom control layouts for synthesizers and other equipment
- Save and load preset configurations
- Organize presets with tags and categories
- Add images and audio samples to your presets
- Works offline as a Progressive Web App (PWA)

## Development server

Run `npm run dev` for a dev server. Navigate to `http://localhost:5173/`. The app will automatically reload if you change any of the source files.

## Docker Development

Run `docker-compose up` to start the development environment with PostgreSQL database.

## Build

Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory.

## PWA Build

Run `npm run build:pwa` to build the project as a Progressive Web App with offline capabilities.

## Running unit tests

Run `npm test` to execute the unit tests via [Vitest](https://vitest.dev/).

## Running end-to-end tests

Run `npm run test:e2e` to execute the end-to-end tests via [Cypress](https://www.cypress.io/).

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Deployment

The application is designed to be deployed as a static site on DigitalOcean web server. See the deployment documentation for detailed instructions.

## Further help

To get more help on Vite, check out the [Vite documentation](https://vitejs.dev/guide/).
For React, refer to the [React documentation](https://reactjs.org/docs/getting-started.html).
