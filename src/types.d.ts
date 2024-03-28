import { JwtPayload } from "jsonwebtoken";

// Define an interface extending the default Headers interface
interface CustomHeaders extends Headers {
  authorization: string;
}

// Define an interface for the Request object with the added user property
export interface AuthenticatedRequest extends Request {
  user: JwtPayload; // Define the user property as optional
  headers: CustomHeaders; // Use the custom headers interface
}

