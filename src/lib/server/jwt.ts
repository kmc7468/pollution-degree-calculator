import jwt from "jsonwebtoken";

import { env } from "$env/dynamic/private";

if (!env.JWT_SECRET_KEY) {
  throw new Error("JWT_SECRET_KEY is not defined");
}

export const generateDetectorToken = () => {
  return jwt.sign({}, env.JWT_SECRET_KEY, {
    audience: "detector",
    expiresIn: "3h",
  });
}
