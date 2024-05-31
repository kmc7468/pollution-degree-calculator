import { error } from "@sveltejs/kit";

import { registerUser } from "$lib/server/pointDatabase";

/** @type {import("./$types").RequestHandler} */
export const POST = async ({ request }) => {
  const { phoneNumber, name } = await request.json();
  if (!phoneNumber || !name) {
    error(400, "Invalid request");
  }
  if (!registerUser(phoneNumber, name)) {
    error(400, "User already exists");
  }

  return new Response(undefined, {
    status: 200,
  });
};
