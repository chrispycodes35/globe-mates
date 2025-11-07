# Development Environment Setup

## Quick Start Commands

### Start Development Server
```bash
pnpm dev
# or
pnpm start
# or
pnpm test:dev
```

### Development Server with Network Access
```bash
pnpm dev:host
```

### Build and Preview
```bash
pnpm build
pnpm preview
```

### Code Quality
```bash
pnpm lint
pnpm lint:fix
pnpm type-check
```

### Clean Build
```bash
pnpm clean
```

## Development Server Configuration

The development server is configured to run on:
- **Port**: 8080
- **Host**: All interfaces (::) when using `dev:host`
- **Local**: localhost when using `dev`

## Available Scripts

- `dev` - Start development server (localhost only)
- `dev:host` - Start development server (accessible from network)
- `build` - Build for production
- `build:dev` - Build in development mode
- `preview` - Preview production build
- `preview:host` - Preview production build (network accessible)
- `lint` - Run ESLint
- `lint:fix` - Run ESLint with auto-fix
- `type-check` - Run TypeScript type checking
- `clean` - Clean build artifacts
- `test:dev` - Alias for dev (for testing purposes)
- `start` - Alias for dev

## Local Testing Tips

1. Use `pnpm dev:host` if you need to test on mobile devices or other machines on your network
2. The server will automatically reload when you make changes
3. Check the terminal for any TypeScript or ESLint errors
4. Use `pnpm type-check` to verify TypeScript types without starting the server
