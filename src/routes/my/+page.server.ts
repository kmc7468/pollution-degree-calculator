import { redirect } from "@sveltejs/kit";

import { getPointLogs } from "$lib/server/database";
import { verifyUserToken } from "$lib/server/jwt";

/** @type {import("./$types").PageServerLoad} */
export const load = async ({ cookies }) => {
  const jwt = cookies.get("auth");
  const phoneNumber = jwt && verifyUserToken(jwt);
  if (!phoneNumber) {
    redirect(302, "/login");
  }

  return {
    pointLogs: getPointLogs(phoneNumber.replaceAll("-", "")),
  };
};
