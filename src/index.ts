import express, { Router, Request, Response, NextFunction } from "express";
import jwtStrategy from "./strategies.js";
import { getUserDetail, login, logout, refreshToken, signUp } from "./controller.js";
import { AuthenticatedRequest } from "./types.js";

interface AuthLibOptions {
  getUser:  () => Promise<{ success: boolean }>;
  addToken:  () => Promise<{ success: boolean }>;
  getToken:  () => Promise<{ success: boolean }>;
  saveUser:  () => Promise<{ success: boolean }>;
  deleteExistingToken:  (id : string) => Promise<{ success: boolean }>;
}

class AuthLib {
  private initialized: boolean;
  private router: Router;

  constructor() {
    this.initialized = false;
    this.router = express.Router();
  }
  
  initialize({
    getUser,
    addToken,
    getToken,
    saveUser,
    deleteExistingToken
  }: AuthLibOptions) {
    if (this.initialized) {
      console.warn("AuthLib is already initialized.");
      return;
    }
    // Initialize any setup, configurations, or third-party libraries here.

    // Initialize authentication strategies
    jwtStrategy.initialize();

    // Initialize routes
    this.initRoutes({
        getUser,
        addToken,
        getToken,
        saveUser,
        deleteExistingToken
      });

    this.initialized = true;
  }

  initRoutes({
    getUser,
    addToken,
    getToken,
    saveUser,
    deleteExistingToken
  }: AuthLibOptions) {
    // Routes handlers
    this.router.get("/authLibCheck", this.authLibCheck.bind(this));
    this.router.post("/login", login({getUser, addToken}));
    this.router.post("/signup", signUp({
        getUser,
        saveUser
    }));
    this.router.post("/refresh-token", refreshToken({ getToken }));
    this.router.get("/getUser", getUserDetail({getUser}));
    this.router.get("/logout", logout({ deleteExistingToken }));
  }
  
  authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    // Perform authentication based on the strategy
    jwtStrategy.authenticate(req, res, next);
  }

  authLibCheck(req: Request, res: Response) {
    res.json("Connect to auth check");
  }

  getRoutes(): Router {
    return this.router;
  }
}

export default new AuthLib();
