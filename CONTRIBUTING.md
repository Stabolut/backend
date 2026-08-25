# Contributing to Stabolut Backend

Thank you for your interest in contributing to the Stabolut backend!

## Development Workflow

1. Fork the repository and create your branch from main:
   `ash
   git checkout -b feature/your-feature-name
   `
2. Install dependencies:
   `ash
   npm install
   `
3. Create your .env configuration from .env.example.
4. Ensure your changes follow consistent formatting and linting.
5. Submit a Pull Request with a clear summary of your changes.

## Code Guidelines

- Never commit sensitive keys, mnemonics, or production .env files.
- Ensure all API endpoints have corresponding validation and error handling.
- Keep gasless relayer handlers idempotent and secure.
