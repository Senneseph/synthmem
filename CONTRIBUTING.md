# Contributing to SynthMem

Thank you for considering contributing to SynthMem! This document outlines the process for contributing to the project and the coding standards we follow.

## Development Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run linters and tests locally
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## Code Style and Linting

We use a combination of linters to ensure code quality and consistency:

### JavaScript/React

- **ESLint**: We use ESLint to catch JavaScript errors and enforce coding standards
- **Prettier**: We use Prettier for consistent code formatting

To lint JavaScript/React files:
```bash
npm run lint
```

### CSS

- **Stylelint**: We use Stylelint to enforce CSS coding standards

To lint CSS files:
```bash
npm run lint:css
```

### YAML

- **yamllint**: We use yamllint to validate YAML files

To lint YAML files:
```bash
npm run lint:yaml
```

### Running All Linters

To run all linters at once:
```bash
npm run lint:all
```

## Git Hooks

We use Husky to set up Git hooks that automatically run linters and tests:

- **pre-commit**: Runs linters on staged files
- **pre-push**: Runs tests before pushing to remote

## Testing

We follow a test-first approach. Please write tests for any new features or bug fixes.

To run tests:
```bash
npm test
```

## Docker Development

We use Docker for development to ensure consistency across environments.

To start the development environment:
```bash
docker-compose up
```

To run linters and tests in Docker:
```bash
docker-compose run --rm frontend npm run lint:all
docker-compose run --rm frontend npm test
```

## Pull Request Process

1. Ensure your code passes all linters and tests
2. Update the README.md with details of changes if applicable
3. The PR will be merged once it receives approval from maintainers

## Code of Conduct

Please be respectful and considerate of others when contributing to this project. We aim to foster an inclusive and welcoming community.
