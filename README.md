# SynthMem

SynthMem is a web application designed for musicians to save and manage synthesizer settings and configurations. It provides an intuitive interface for creating custom control layouts, storing presets, and organizing your synthesizer patches.

## Prerequisites

Before you begin, ensure you have met the following requirements:
- You have git installed.
- You have docker installed.
- You can launch this app with `docker-compose up -d` or equivalent and you know what that means.

## Installation

To install the project, clone the repository and install the necessary dependencies:

```bash
git clone https://github.com/yourusername/synthmem.git
cd synthmem
docker-compose up -d
```

## Getting Started

Once the Docker service is running, you can access the application in your web browser at `http://localhost:1337`.

## Features

- Create custom control layouts for synthesizers and other equipment
- Save and load preset configurations
- Organize presets with tags and categories
- Add images and audio samples to your presets
- Works offline as a Progressive Web App (PWA)

## Development

### Docker Development

We use Docker for both development and production environments. The development environment includes testing and linting capabilities.

```bash
# Start the development environment
docker-compose up dev

# Start the production environment
docker-compose up app
```

### Self-Testing System

We use a custom self-testing system that runs automatically when the container starts. The system uses the following terminology:

- **Bought**: A set of tests (test suite)
- **Boast**: A passed test
- **Roast**: A failed test
- **Route**: A failed Bought (test suite)
- **Conquest**: A passed Bought (test suite)
- **Victory**: All Boughts passed

The testing system runs automatically as part of the container startup and reports the results in the logs.

```bash
# Run all tests manually
docker-compose run --rm dev node scripts/run-tests.js

# Check the health of the system
docker-compose run --rm dev node scripts/health-check.js
```

### Git Integration

The testing system is integrated with git hooks to ensure code quality:

- **pre-commit**: Runs all Boughts and requires Victory before committing
- **pre-push**: Runs comprehensive Boughts and requires Victory before pushing

To set up the git hooks:

```bash
./frontend/scripts/setup-git-hooks.sh
```

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines on how to contribute to this project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Deployment

The application is designed to be deployed as a static set of files site on web server.

## Further help
See your local psychiatrist.
