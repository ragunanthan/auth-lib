import express from "express";
import jwtStrategy from "./strategies.js";
import { getUserDetail, login, logout, refreshToken, signUp } from "./controller.js";

class AuthLib {
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
  }) {
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
  }) {
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
  

  authenticate(req, res, next) {
    // Perform authentication based on the strategy
    jwtStrategy.authenticate(req, res, next);
  }

  authLibCheck(req, res) {
    res.json("Connect to auth check");
  }

  getRoutes() {
    return this.router;
  }
}

export default new AuthLib();
