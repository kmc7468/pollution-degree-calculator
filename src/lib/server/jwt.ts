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

export const verifyDetectorToken = (token: string) => {
  try {
    jwt.verify(token, env.JWT_SECRET_KEY, {
      audience: "detector",
    });
    return true;
  } catch {
    return false;
  }
}

interface UserTokenPayload {
  phoneNumber: string;
}

export const generateUserToken = (phoneNumber: string) => {
  const payload: UserTokenPayload = {
    phoneNumber,
  };
  return jwt.sign(payload, env.JWT_SECRET_KEY, {
    audience: "user",
    expiresIn: "1d",
  });
};

export const verifyUserToken = (token: string) => {
  try {
    const payload = jwt.verify(token, env.JWT_SECRET_KEY, {
      audience: "user",
    }) as UserTokenPayload;
    return payload.phoneNumber;
  } catch {
    return null;
  }
};
