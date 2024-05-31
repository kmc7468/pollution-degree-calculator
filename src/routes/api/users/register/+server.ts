import { error } from "@sveltejs/kit";

import { phoneNumberRegex } from "$lib/patterns.js";
import { registerUser } from "$lib/server/database";

/** @type {import("./$types").RequestHandler} */
export const POST = async ({ request }) => {
  const { phoneNumber, password, name } = await request.json();
  if (typeof phoneNumber !== "string" ||
      typeof password !== "string" ||
      typeof name !== "string") {

    error(400, "Invalid request");
  } else if (!phoneNumberRegex.test(phoneNumber)) {
    error(400, "Invalid phone number");
  } else if (password.length < 8) {
    error(400, "Dangerous password");
  } else if (name.length < 2) {
    error(400, "Too short name");
  }

  if (!registerUser(phoneNumber, password, name)) {
    error(400, "User already exists");
  }

  return new Response(undefined, {
    status: 200,
  });
};
