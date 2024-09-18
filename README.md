
# ExpressJS IoC (Inversion of Control) Container

## Overview

This project demonstrates how to build an **Inversion of Control (IoC)** container in **ExpressJS**, similar to the IoC mechanism in **NestJS** but in a lighter form. It showcases how to organize your application in a modular way, register and resolve dependencies, and inject those dependencies into classes. This project is a great learning tool for understanding how IoC can improve the maintainability and scalability of ExpressJS applications.

## Features

- **IoC Container:** The core of the project is the `Container` class, responsible for resolving and managing dependencies.
- **Modular Architecture:** Similar to NestJS, you can define modules with controllers, services, and providers.
- **Decorator-based Dependency Injection:** Using TypeScript decorators and `reflect-metadata`, you can mark classes for injection and define how parameters are passed into constructors.
- **Lightweight:** Designed to be minimal and easy to extend, making it suitable for learning purposes or for adding IoC to smaller Express applications without the overhead of a full NestJS framework.

## Key Concepts

- **Modules:** Like in NestJS, modules serve as the primary structure for organizing your application. A module can contain controllers and providers (services or repositories).
- **Controllers:** Responsible for handling HTTP requests and returning responses. Controllers can use injected services to handle business logic.
- **Providers:** Services, repositories, or other classes that perform application logic. Providers are automatically injected into controllers or other providers as needed.
- **Decorators:** Used to define the metadata for IoC. They tell the container how to register and resolve dependencies.

## Quick Start

### 1. Clone the repository

```bash
git clone <repository-url>
cd express-ioc-container
```

### 2. Install dependencies

```bash
npm install
```

### 3. Define your modules and controllers

Define a module and controller with the help of the built-in decorators.

**Module Example:**

```typescript
import { Module } from './ioc/decorators/module';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';

@Module({
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}
```

**Controller Example:**

```typescript
import { Controller, Get, Req, Resp } from './ioc/decorators/controller';
import { AppService } from '../services/app.service';
import { Request, Response } from 'express';

@Controller('app')
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get('/')
    async getRoot(@Req() req: Request, @Resp() res: Response) {
        const result = await this.appService.getWelcomeMessage();
        return res.json(result);
    }
}
```

### 4. Launch the application

The entry point of your application is the `Application` class, where everything is initialized.

```typescript
import { Application } from './application';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = new Application(AppModule);
    await app.launch(3000, () => {
        console.log('Server running on port 3000');
    });
}

bootstrap();
```

Run the server:

```bash
npm run start
```

### 5. Define Providers (Services or Repositories)

You can inject services or repositories into your controllers or other providers.

**Service Example:**

```typescript
import { Injectable } from './ioc/decorators/injectable';

@Injectable()
export class AppService {
    getWelcomeMessage(): string {
        return 'Welcome to Express IoC!';
    }
}
```

## Project Structure

The project follows a clean and modular structure:

```
src/
│
├── ioc/
│   ├── container.ts          // Core IoC container
│   ├── decorators/           // Decorators for controllers, modules, and providers
│   ├── providers/            // Provider definitions
│   └── utils/                // Utility classes (e.g., for date formatting)
│
├── controllers/
│   └── app.controller.ts     // Example controller
│
├── services/
│   └── app.service.ts        // Example service (provider)
│
└── application.ts            // Entry point of the application
```

## How It Works

The IoC container is responsible for **registering** and **resolving dependencies**. It uses metadata (provided by TypeScript decorators) to understand how modules, controllers, and providers are related. Here's how it works step-by-step:

1. **Module Registration:**
    - Modules are registered in the container by scanning the provided metadata (e.g., controllers, providers).

2. **Dependency Injection:**
    - The container automatically resolves and injects the required services into controllers or other services by checking constructor parameters and injecting the appropriate instances.

3. **Request Handling:**
    - HTTP requests are routed to controllers based on metadata (e.g., `@Get`, `@Post`), and any services injected into the controllers are used to handle business logic.

4. **Decorators:**
    - `@Controller(prefix)`: Marks a class as a controller with an optional URL prefix.
    - `@Get(path)`, `@Post(path)`, etc.: Defines an HTTP route.
    - `@Inject`: Injects a dependency into a constructor.
    - `@Module`: Marks a class as a module and registers its controllers and providers.

## Example Usage

Here's an example flow:

- The `AppModule` contains the `AppController` and `AppService`.
- When a `GET` request is made to `/app`, the `AppController` will handle it.
- The controller uses `AppService` to fetch a welcome message, which is then returned in the response.

### Modular Design

You can easily extend the project by creating new modules and providers. Just follow the same structure, and the container will handle the rest.

## Comparison with NestJS

This project is similar to **NestJS**, but in a lightweight form:

| Feature        | ExpressJS IoC | NestJS  |
| -------------- | ------------- | ------- |
| IoC Container  | ✅             | ✅      |
| Decorators     | ✅             | ✅      |
| Modules        | ✅             | ✅      |
| HTTP Methods   | ✅             | ✅      |
| Middleware     | ❌             | ✅      |
| Exception Filters | ❌          | ✅      |
| Pipes/Guards   | ❌             | ✅      |

This IoC container is a great way to understand how NestJS works behind the scenes by breaking it down to its core essentials. You can extend this project with more advanced features like middleware, guards, or exception filters if needed.

## Future Improvements

- Add **middleware** support to handle requests before they reach the controllers.
- Implement **exception filters** to handle errors more gracefully.
- Introduce **Pipes** for transforming request data.
- Add **guards** for handling authorization logic.

## License

This project is open source and available under the MIT License.
