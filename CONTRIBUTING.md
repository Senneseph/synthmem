# Contributing to SynthMem

Thank you for considering contributing to SynthMem! This document outlines the process for contributing to the project and the coding standards we follow.

## Development Process

1. Clone the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests using Docker to ensure Victory (`docker-compose run --rm dev node scripts/run-tests.js`)
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)

## Self-Testing System

We use a custom self-testing system with the following terminology:

- **Bought**: A set of tests (test suite)
- **Boast**: A passed test
- **Roast**: A failed test
- **Route**: A failed Bought (test suite)
- **Conquest**: A passed Bought (test suite)
- **Victory**: All Boughts passed

### Running Tests

To run all tests (Boughts):
```bash
docker-compose run --rm dev node scripts/run-tests.js
```

To check the health of the system:
```bash
docker-compose run --rm dev node scripts/health-check.js
```

## Code Style

We use Prettier for consistent code formatting. While linting tools are included in the project, they are not actively enforced to avoid stalling development.

## Testing

We use Docker-based testing that runs automatically as part of the build process. This project does not use git hooks to avoid stalling development.

To run tests manually:

```bash
docker-compose run --rm dev node scripts/run-tests.js
```

## Docker Development

We use Docker for both development and production environments:

```bash
# Start the development environment
docker-compose up dev

# Start the production environment
docker-compose up app
```

## Adding New Tests

When adding new features, please add appropriate tests to the relevant Bought or create a new Bought if necessary. To create a new Bought, add it to the `boughts` array in `scripts/run-tests.js`.

## Code of Conduct

Please be respectful and considerate of others when contributing to this project. We aim to foster an inclusive and welcoming community.
