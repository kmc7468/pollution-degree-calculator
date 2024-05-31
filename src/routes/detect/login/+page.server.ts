import { error, redirect } from "@sveltejs/kit";

import { env } from "$env/dynamic/private";
import { generateDetectorToken } from "$lib/server/jwt";

if (!env.DETECTOR_AUTH_TOKEN) {
  throw new Error("DETECTOR_AUTH_TOKEN is not defined");
}

/** @type {import("./$types").Actions} */
export const actions = {
  default: async ({ request, cookies }) => {
    const form = await request.formData();
    const token = form.get("token")?.toString();
    if (!token) {
      error(400, "Token is required");
    } else if (token !== env.DETECTOR_AUTH_TOKEN) {
      error(403, "Invalid token");
    }

    const jwt = generateDetectorToken();
    cookies.set("auth", jwt, {
      path: "/",
    });

    redirect(302, "/detect");
  }
};
