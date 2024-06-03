import { error, fail, redirect } from "@sveltejs/kit";

import { phoneNumberRegex } from "$lib/patterns";
import { registerUser } from "$lib/server/database";
import { generateUserToken, verifyUserToken } from "$lib/server/jwt";

/** @type {import("./$types").PageServerLoad} */
export const load = async ({ cookies }) => {
  const jwt = cookies.get("auth");
  if (jwt && verifyUserToken(jwt)) {
    redirect(302, "/mypage");
  }
};

/** @type {import("./$types").Actions} */
export const actions = {
  default: async ({ request, cookies }) => {
    const form = await request.formData();
    const name = form.get("name")?.toString();
    const phoneNumber = form.get("phoneNumber")?.toString();
    const password = form.get("password")?.toString();
    const passwordConfirm = form.get("passwordConfirm")?.toString();
    if (!name) {
      error(400, "Name is required");
    } else if (name.length < 2) {
      error(400, "Name is too short");
    } else if (!phoneNumber) {
      error(400, "Phone number is required");
    } else if (!phoneNumberRegex.test(phoneNumber)) {
      error(400, "Invalid phone number");
    } else if (!password) {
      error(400, "Password is required");
    } else if (password.length < 4) {
      error(400, "Password is too short");
    } else if (!passwordConfirm) {
      error(400, "Password confirm is required");
    } else if (password !== passwordConfirm) {
      return fail(400, {
        name,
        phoneNumber,
        message: "비밀번호가 일치하지 않아요.",
      });
    }

    if (registerUser(phoneNumber, password, name)) {
      cookies.set("auth", generateUserToken(phoneNumber), {
        path: "/",
      });
      redirect(302, "/mypage");
    } else {
      return fail(409, {
        name,
        phoneNumber,
        message: "이미 가입되어 있는 휴대폰 번호예요.",
      });
    }
  }
};
