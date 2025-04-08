# Contributing to SynthMem

Thank you for considering contributing to SynthMem! This document outlines the process for contributing to the project and the coding standards we follow.

## Development Process

1. Clone the repository
2. Set up the git hooks (`./frontend/scripts/setup-git-hooks.sh`)
3. Create a feature branch (`git checkout -b feature/amazing-feature`)
4. Make your changes
5. Run tests locally to ensure Victory
6. Commit your changes (`git commit -m 'Add some amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)

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

## Code Style and Linting

Code style and linting are part of the Bootstrap Bought. We use a combination of linters to ensure code quality and consistency:

### JavaScript/React

- **ESLint**: We use ESLint to catch JavaScript errors and enforce coding standards
- **Prettier**: We use Prettier for consistent code formatting

### CSS

- **Stylelint**: We use Stylelint to enforce CSS coding standards

### YAML

- **yamllint**: We use yamllint to validate YAML files

## Git Hooks

We use Git hooks that automatically run our testing system:

- **pre-commit**: Runs all Boughts and requires Victory before committing
- **pre-push**: Runs comprehensive Boughts and requires Victory before pushing

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
