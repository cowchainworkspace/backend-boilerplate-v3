# NestJS + PostgreSQL + Drizzle Boilerplate

## Table of Contents

- [Overview](#overview)
- [Project Structure](#project-structure)
  - [Core Architecture](#core-architecture)
  - [Directory Structure](#directory-structure)
  - [Module Organization](#module-organization)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Setup](#environment-setup)
- [Running the Application](#running-the-application)
  - [Development Mode](#development-mode)
  - [Production Mode](#production-mode)
- [Database Management](#database-management)
  - [Migrations](#migrations)
  - [Database Seeds](#database-seeds)
- [Logging System](#logging-system)
  - [Logger Configuration](#logger-configuration)
  - [Using the Logger](#using-the-logger)
  - [Log Levels](#log-levels)
  - [Sensitive Data Handling](#sensitive-data-handling)
- [Error Handling](#error-handling)
- [Testing](#testing)
- [Environment Variables](#environment-variables)
- [Code Style and Linting](#code-style-and-linting)

## Overview

This is a backend boilerplate built with:

- **NestJS**: A progressive Node.js framework for building efficient and scalable server-side applications.
- **PostgreSQL**: A powerful, open-source object-relational database system.
- **Drizzle ORM**: A TypeScript ORM for SQL databases with a focus on type safety.
- **Winston**: A versatile logging library with multiple transport options.

This boilerplate implements an **Onion Architecture** (also known as Hexagonal Architecture or Ports and Adapters) to maintain loose coupling between application layers and modules, allowing for better code scalability and easier maintenance.

## Project Structure

### Core Architecture

The project follows the Onion Architecture pattern, which consists of concentric layers:

1. **Domain Layer** (Core) - Contains business entities, value objects, and business logic
2. **Application Layer** - Contains use cases, service interfaces, and application services
3. **Infrastructure Layer** - Contains implementations of interfaces defined in the inner layers
4. **UI/Presentation Layer** - Contains controllers and API endpoints

This architecture allows for:
- Clear separation of concerns
- Easier testing with dependency inversion
- Flexibility to change implementations without affecting business logic

### Directory Structure

```
backend-boilerplate-v3/
├── drizzle/                  # Database migration files
│   └── migrations/           # SQL migration files
├── src/
│   ├── apps/                 # Applications (API, etc.)
│   │   └── api/              # API application
│   │       ├── main.ts       # Application entry point
│   │       ├── seed-runner.ts  # Seed runner entry point
│   │       ├── migration-runner.ts # Migration runner entry point
│   │       └── modules/      # API modules
│   │           ├── cars/     # Example domain module
│   │           ├── configuration/ # Configuration module
│   │           ├── core/     # Core module
│   │           ├── seed-runner/ # Seed runner module
│   │           ├── database-setup/ # Database setup module
│   │           └── health/   # Health check module
│   ├── libs/                 # Library code
│   │   └── configuration/    # Configuration library
│   └── shared/               # Shared code across applications
│       ├── domain/           # Domain layer (entities, value objects)
│       ├── application/      # Application layer (use cases, services)
│       ├── infrastructure/   # Infrastructure layer
│       │   ├── database/     # Database-related code
│       │   │   ├── drizzle/  # Drizzle ORM configuration
│       │   │   ├── schemas/  # Database schemas
│       │   │   └── seeds/    # Database seed definitions
│       │   └── logger/       # Logging infrastructure
│       └── utility/          # Utility functions and helpers
├── test/                     # Test files
├── .env.example              # Example environment variables
├── package.json              # Dependencies and scripts
└── README.md                 # This file
```

### Module Organization

Each domain module is organized with the following structure:

```
modules/cars/
├── application/              # Application layer
│   ├── commands/             # Command handlers (write operations)
│   ├── queries/              # Query handlers (read operations)
│   ├── dtos/                 # Data Transfer Objects
│   └── cars.module.ts        # Module definition
├── domain/                   # Domain layer
│   ├── entities/             # Domain entities
│   ├── events/               # Domain events
│   └── value-objects/        # Value objects
├── infrastructure/           # Infrastructure layer
│   ├── persistence/          # Database-related code
│   │   ├── repositories/     # Repository implementations
│   │   └── seeds/            # Database seeds for this module
│   └── services/             # External service implementations
└── presentation/             # Presentation layer
    ├── controllers/          # REST controllers
    ├── dtos/                 # API DTOs
    └── middlewares/          # Controller middlewares
```

## Getting Started

### Prerequisites

- Node.js (>= 16.x)
- Yarn package manager
- PostgreSQL database

### Installation

1. Clone the repository:
```bash
git clone https://your-repository-url.git
cd backend-boilerplate-v3
```

2. Install dependencies:
```bash
yarn install
```

3. Copy the environment example file and update with your configuration:
```bash
cp .env.example .env
```

4. Configure your database connection in the `.env` file:
```ini
POSTGRES_URL=postgresql://username:password@localhost:5432/your_database
```

### Environment Setup

Configure your `.env` file with the appropriate values:

```ini
PORT=5001                  # Application port
ENVIRONMENT=DEVELOPMENT    # DEVELOPMENT, PRODUCTION, or STAGING
POSTGRES_URL=postgresql://username:password@localhost:5432/your_database
```

## Running the Application

### Development Mode

To start the API server in development mode with hot-reload:

```bash
yarn run start:api:dev
```

### Production Mode

1. Build the application:
```bash
yarn run build
```

2. Start the API server in production mode:
```bash
yarn run start:api:prod
```

## Database Management

### Migrations

This project uses Drizzle ORM for database operations and migrations.

#### Generate Migrations

After changing your database schema definitions in the code, generate migration files:

```bash
yarn db:generate
```

This will:
1. Analyze your schema definitions in the code
2. Compare with the current database state
3. Create SQL migration files in the `drizzle/migrations` directory

#### Run Migrations

To apply pending migration files to your database:

```bash
yarn db:migrate
```

This script will:
1. Connect to your database using the connection string from your `.env` file
2. Run all pending migrations in the order they were created
3. Update the migrations table in your database

### Database Seeds

This boilerplate includes a robust seeding system to populate your database with initial data.

#### Seed Structure

Seeds are organized following the modular structure of the application. Each module that requires seeding will have a `seeds` folder within its infrastructure layer.

Each seed class must implement the `ISeed` interface:

```typescript
export interface ISeed {
  // Order in which the seed should run (lower numbers run first)
  readonly order: number;
  
  // Unique identifier for the seed
  readonly name: string;
  
  // Method to determine if the seed should run in the current environment
  shouldRunInEnvironment(environment: AppEnvironment): boolean;
  
  // Method to execute the seeding
  run(options: ISeedOptions): Promise<void>;
}
```

#### Creating a Seed

To create a new seed:

1. Create a class that extends `BaseSeed` or implements `ISeed`:

```typescript
@Injectable()
export class UsersSeed extends BaseSeed {
  constructor(
    @Inject(DRIZZLE_DATASOURCE_PROVIDER_TOKEN)
    private readonly db: NodePgDatabase<TDatabaseSchema>,
  ) {
    // Pass the name and order to the BaseSeed constructor
    super('Users', 100);
  }
  
  // Customize which environments this seed should run in
  public shouldRunInEnvironment(environment: AppEnvironment): boolean {
    // Run in all environments
    return true;
    
    // Or customize:
    // return environment === AppEnvironment.DEVELOPMENT;
  }
  
  async run(options: ISeedOptions): Promise<void> {
    // Implementation of the seed
    const existingUsers = await this.db.select({ count: count() }).from(users);
    
    if (existingUsers[0].count > 0 && !options.force) {
      // Skip if users already exist and not forced
      return;
    }
    
    // Insert seed data
    await this.db.insert(users).values([
      {
        id: 'user-1',
        email: 'admin@example.com',
        name: 'Admin User',
        role: 'admin',
      },
      // More users...
    ]);
  }
}
```

2. Register your seed in the appropriate module:

```typescript
@Module({
  providers: [
    UsersSeed,
    // Other seeds...
  ],
  exports: [
    UsersSeed,
    // Other seeds...
  ],
})
export class UsersSeedsModule {}
```

3. Import the module in the `DatabaseSeedsModule`:

```typescript
@Module({
  imports: [
    UsersSeedsModule,
    // Other seed modules...
  ],
})
export class DatabaseSeedsModule {}
```

#### Running Seeds

To run all seeds:

```bash
yarn db:seed
```

To run seeds for a specific environment:

```bash
ENVIRONMENT=DEVELOPMENT yarn db:seed
```

To force running all seeds, even if they would normally be skipped:

```bash
yarn db:seed --force
```

## Logging System

This boilerplate includes a custom logging system based on Winston that provides structured logs, multiple transport options, and context-aware logging.

### Logger Configuration

The logger is configured in `src/shared/infrastructure/logger/logger.provider.ts` and uses Winston under the hood. The configuration includes:

- Console transport with colored output (in development)
- File transport with structured JSON output (in production)
- Daily rotation of log files to manage disk space
- Different log levels based on the environment

### Using the Logger

The logger can be injected and used in any service or controller:

```typescript
import { Injectable } from '@nestjs/common';
import { Logger } from '@shared/infrastructure/logger/logger.service';

@Injectable()
export class UserService {
  constructor(private readonly logger: Logger) {
    // Set the context for all logs from this service
    this.logger.setContext('UserService');
  }

  async findUser(id: string) {
    this.logger.debug(`Finding user with id ${id}`);
    
    // If you need to include additional metadata:
    this.logger.info(`User ${id} accessed the system`, {
      userId: id,
      action: 'access',
      timestamp: new Date().toISOString(),
    });
    
    // For errors:
    try {
      // Some code that might fail
    } catch (error) {
      this.logger.error(`Failed to find user ${id}`, error.stack, {
        userId: id,
        errorCode: error.code,
      });
    }
  }
}
```

### Log Levels

The logger supports the following log levels (in order of severity):

- `critical` - Critical errors that require immediate attention
- `error` - Errors that need attention but aren't critical
- `warn` - Warnings that don't cause errors but are noteworthy
- `info` - General informational messages (default level)
- `debug` - Detailed debug information (only displayed in development)
- `verbose` - Even more detailed information (rarely needed)

### Sensitive Data Handling

The logger automatically redacts sensitive information in logs to prevent leaking credentials or personal data. Fields that contain the following words are automatically redacted:

- password
- token
- authorization
- apiKey
- secret
- credentials

Example:

```typescript
logger.info('User logged in', { 
  userId: 'user-123', 
  password: 'secret123', // Will be redacted
  authToken: 'eyJhbGciOi...' // Will be redacted
});

// Output: { userId: 'user-123', password: '[REDACTED]', authToken: '[REDACTED]' }
```

## Error Handling

The boilerplate includes a global exception filter that:

1. Catches all unhandled exceptions
2. Logs the error with appropriate metadata
3. Returns a standardized error response to the client

### Custom Error Handling

For custom error handling, you can:

1. Create domain-specific exceptions that extend from `Error`
2. Use the `HttpException` class from NestJS for HTTP-related errors
3. Implement custom exception filters for specific routes or controllers

## Testing

The boilerplate includes configuration for both unit and integration testing using Jest.

### Unit Tests

Run unit tests with:

```bash
yarn test
```

### End-to-End Tests

Run end-to-end tests with:

```bash
yarn test:e2e
```

## Environment Variables

The following environment variables are used:

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | The port the application will listen on | 5001 |
| ENVIRONMENT | The current environment (DEVELOPMENT, STAGING, PRODUCTION) | DEVELOPMENT |
| POSTGRES_URL | PostgreSQL connection string | postgresql://postgres:postgres@localhost:5432/cars |
| APP_NAME | Name of the application | Cars Example |

## Code Style and Linting

This project uses:

- ESLint for linting
- Prettier for code formatting
- Import sorting to organize imports

### Running Linting

```bash
yarn lint
```

### Running Formatting

```bash
yarn format
```

### Import Sorting Convention

Imports are automatically sorted in the following order:

1. Node.js built-in modules
2. External dependencies
3. Internal application imports

Within each group, imports are sorted alphabetically.

Example:

```typescript
// Node.js built-in modules
import { join } from 'path';

// External dependencies
import { Controller, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

// Internal application imports
import { UserEntity } from '@domain/entities/user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
```

This sorting is enforced by Prettier and can be manually triggered with `yarn format`.
