import { verifyUserToken } from "$lib/server/jwt";

/** @type {import("./$types").PageServerLoad} */
export const load = async ({ cookies }) => {
  const jwt = cookies.get("auth");
  return {
    isLogin: !!(jwt && verifyUserToken(jwt)),
  };
};
