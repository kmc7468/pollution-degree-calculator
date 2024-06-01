import { error, text } from "@sveltejs/kit";

import { query } from "$lib/server/gpt";
import { verifyDetectorToken } from "$lib/server/jwt";

/** @type {import("./$types").RequestHandler} */
export const POST = async ({ request, cookies }) => {
  const jwt = cookies.get("auth");
  if (!jwt) {
    error(401, "Unauthorized");
  } else if (!verifyDetectorToken(jwt)) {
    error(403, "Forbidden");
  }

  const result = await query(await request.text());
  if (result) {
    console.log(result);
    return text(result);
  } else {
    error(500, "Internal Server Error");
  }
};
