import { error, fail, redirect } from "@sveltejs/kit";

import { phoneNumberRegex } from "$lib/patterns";
import { loginUser } from "$lib/server/database";
import { generateUserToken, verifyUserToken } from "$lib/server/jwt";

/** @type {import("./$types").PageServerLoad} */
export const load = async ({ cookies }) => {
  const jwt = cookies.get("auth");
  if (jwt && verifyUserToken(jwt)) {
    redirect(302, "/my");
  }
};

/** @type {import("./$types").Actions} */
export const actions = {
  default: async ({ request, cookies }) => {
    const form = await request.formData();
    const phoneNumber = form.get("phoneNumber")?.toString();
    const password = form.get("password")?.toString();
    if (!phoneNumber) {
      error(400, "Phone number is required");
    } else if (!phoneNumberRegex.test(phoneNumber)) {
      error(400, "Invalid phone number");
    } else if (!password) {
      error(400, "Password is required");
    } else if (password.length < 4) {
      error(400, "Password is too short");
    }

    if (loginUser(phoneNumber, password)) {
      cookies.set("auth", generateUserToken(phoneNumber), {
        path: "/",
      });
      redirect(302, "/my");
    } else {
      return fail(401, {
        phoneNumber,
        message: "휴대폰 번호 또는 비밀번호가 올바르지 않아요."
      });
    }
  }
};
