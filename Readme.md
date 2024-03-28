# Authentication API Library

## Overview

This is a reusable library for implementing authentication functionality in Node.js applications. It provides endpoints for user registration, login, logout, and token management (e.g., generating and refreshing access tokens).

## Installation

```bash
npm i auth-lib-jwt
```

### Endpints

```js
"/authLibCheck";
"/login";
"/signup";
"/refresh-token";
"/getUser";
"/logout";
```

## Usage

```js
import express from "express";
import helmet from "helmet";
import authLib from "auth-lib-jwt";

// Initialize express app
const app = express();

// Initialize authentication library
authLib.initialize({
  // Implement your own logic for these functions
  getUser: () => ({ success: true }),
  addToken: ({}) => ({ success: true }),
  getToken: () => ({ success: true }),
  saveUser: () => ({ success: true }),
  deleteExistingToken: () => ({ success: true }),
});

// Allow BigInt to be serialized to JSON
BigInt.prototype.toJSON = function () {
  return this.toString();
};

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(helmet());

// Routes
app.use(
  "/api/Other-api-routers" // Other api routers
);
app.use("/auth", authLib.getRoutes());

// Define port
const port = process.env.PORT || 3000;

// Start server
app.listen(port, () =>
  console.log(`
🚀 Server ready at: ${port}`)
);
```
