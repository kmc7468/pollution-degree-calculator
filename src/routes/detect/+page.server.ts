import { redirect } from "@sveltejs/kit";

import { verifyDetectorToken } from "$lib/server/jwt.js";

/** @type {import("./$types").PageServerLoad} */
export const load = async ({ cookies }) => {
  const jwt = cookies.get("auth");
  if (!jwt || !verifyDetectorToken(jwt)) {
	redirect(302, "/detect/login");
  }
};
