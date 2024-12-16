# IRB Narrative Form Builder

A React application for building and managing IRB narrative forms with a modular, recursive form structure.

## Project Structure

```
src/
├── components/           # React components
│   ├── common/          # Shared/utility components
│   ├── form/           # Form-specific components
│   └── layout/         # Layout components
├── constants/           # Application constants
├── context/            # React context providers
├── data/               # Data and schema definitions
│   └── modules/        # Form module definitions
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## Key Features

- Modular form structure with recursive field rendering
- Dynamic form validation
- Preview functionality
- Navigation between form sections
- Conditional field visibility
- Comprehensive type safety

## Module Structure

Each form module follows a consistent structure:
- `index.ts` - Module configuration and exports
- Component-specific files for specialized functionality
- Shared options and constants

## Development

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Best Practices

- Use constants for shared values
- Extract reusable logic into utility functions
- Keep components focused and single-responsibility
- Maintain consistent validation patterns
- Use TypeScript for type safety 