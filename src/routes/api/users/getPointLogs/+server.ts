import { error, json } from "@sveltejs/kit";

import { getPointLogs } from "$lib/server/pointDatabase";

/** @type {import("./$types").RequestHandler} */
export const GET = async ({ url }) => {
  const phoneNumber = url.searchParams.get("phoneNumber");
  if (!phoneNumber) {
    error(400, "Invalid request");
  }

  const pointLogs = getPointLogs(phoneNumber);
  if (!pointLogs) {
    error(400, "User not found");
  }

  return json(pointLogs);
};
