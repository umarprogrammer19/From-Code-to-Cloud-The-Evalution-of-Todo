# Todo Dashboard Frontend

A modern, responsive todo dashboard application built with Next.js, TypeScript, and Tailwind CSS. This application provides a clean and intuitive interface for managing your tasks efficiently.

## Features

- **Authentication**: Secure user authentication with better-auth
- **Task Management**: Create, read, update, and delete todos
- **Filtering & Search**: Filter tasks by status and search by title/description
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Optimistic Updates**: Smooth user experience with instant UI updates
- **Error Handling**: Comprehensive error handling and user feedback
- **Accessibility**: Built with accessibility in mind using ARIA labels
- **SEO Optimized**: Proper meta tags and structured data

## Tech Stack

- **Framework**: Next.js 16.0.10
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: better-auth
- **State Management**: React Query (TanStack Query)
- **Icons**: Emoji icons (no external dependencies)
- **Testing**: Jest, React Testing Library

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create environment variables file:
   ```bash
   cp .env.example .env.local
   ```

4. Update the environment variables in `.env.local`:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000
   NEXT_PUBLIC_JWT_SECRET=your-jwt-secret-key
   ```

### Running the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

### Building for Production

```bash
npm run build
# or
yarn build
```

### Running in Production

```bash
npm run start
# or
yarn start
```

## Project Structure

```
frontend/
├── public/                 # Static assets
├── pages/                  # Next.js pages
│   ├── index.tsx          # Home page (redirects to login/dashboard)
│   ├── login.tsx          # Login page
│   ├── dashboard.tsx      # Main dashboard page
│   └── _app.tsx           # Custom App component
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── auth/          # Authentication-related components
│   │   ├── dashboard/     # Dashboard-specific components
│   │   ├── todos/         # Todo-related components
│   │   └── ui/            # Generic UI components (Button, Input, etc.)
│   ├── hooks/             # Custom React hooks
│   ├── services/          # API services and utilities
│   ├── styles/            # Global styles
│   └── types/             # TypeScript type definitions
├── .env.local             # Environment variables (not committed)
├── next.config.ts         # Next.js configuration
├── package.json
└── tsconfig.json
```

## API Integration

The frontend communicates with the backend API at the URL specified in `NEXT_PUBLIC_API_URL`. All API requests automatically include JWT tokens for authentication.

### Available Endpoints

- `GET /api/todos` - Get all todos for the current user
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/:id` - Update a todo
- `DELETE /api/todos/:id` - Delete a todo
- `PUT /api/todos/:id/toggle` - Toggle todo completion status
- `GET /api/todos/stats` - Get todo statistics

## Environment Variables

- `NEXT_PUBLIC_API_URL` - Base URL of the backend API
- `NEXT_PUBLIC_JWT_SECRET` - Secret key for JWT token verification

## Testing

Run the unit tests:
```bash
npm test
# or
yarn test
```

Run tests in watch mode:
```bash
npm test -- --watch
# or
yarn test -- --watch
```

## Performance Optimizations

- Bundle splitting and code splitting
- Image optimization
- Tree shaking
- Minification
- Gzip compression

To analyze the bundle size:
```bash
ANALYZE=true npm run build
# or
ANALYZE=true yarn build
```

## Deployment

The application is optimized for static export. To export as static files:
```bash
npm run export
# or
yarn export
```

The exported files will be in the `out/` directory.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions, please file an issue in the repository.
