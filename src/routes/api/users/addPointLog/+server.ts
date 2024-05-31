import { error, text } from "@sveltejs/kit";

import { verifyDetectorToken } from "$lib/server/jwt.js";
import { addPointLog } from "$lib/server/pointDatabase";

/** @type {import("./$types").RequestHandler} */
export const POST = async ({ request, cookies }) => {
  const jwt = cookies.get("auth");
  if (!jwt) {
    error(401, "Unauthorized");
  } else if (!verifyDetectorToken(jwt)) {
    error(403, "Forbidden");
  }

  const { phoneNumber, point, trash } = await request.json();
  if (!phoneNumber || !point || !trash) {
    error(400, "Invalid request");
  }

  const totalPoint = addPointLog(phoneNumber, point, trash);
  if (totalPoint === null) {
    error(400, "User not found");
  }

  return text(totalPoint.toString());
};
