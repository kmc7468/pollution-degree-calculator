import { error, json } from "@sveltejs/kit";

import { addPointLog } from "$lib/server/pointDatabase";

/** @type {import("./$types").RequestHandler} */
export const POST = async ({ request }) => {
  const { phoneNumber, point, trash } = await request.json();
  if (!phoneNumber || !point || !trash) {
    error(400, "Invalid request");
  }
  if (!addPointLog(phoneNumber, point, trash)) {
	error(400, "User not found");
  }

  return new Response(undefined, {
	status: 200,
  });
};
