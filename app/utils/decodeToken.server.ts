import jwt from "jsonwebtoken";
import { JWT_SECRET } from "~/constants.server";
import TokenType from "~/types/Token";

function decodeToken(token: string): TokenType | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenType;
  } catch (error) {
    return null;
  }
}

export default decodeToken;
