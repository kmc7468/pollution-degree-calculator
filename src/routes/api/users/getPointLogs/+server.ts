import { error, json } from "@sveltejs/kit";

import { getPointLogs } from "$lib/server/database";
import { verifyDetectorToken, verifyUserToken } from "$lib/server/jwt";

/** @type {import("./$types").RequestHandler} */
export const GET = async ({ url, cookies }) => {
  const jwt = cookies.get("auth");
  if (!jwt) {
    error(401, "Unauthorized");
  }

  const jwtPhoneNumber = verifyUserToken(jwt);
  const phoneNumber = url.searchParams.get("phoneNumber") ?? jwtPhoneNumber;
  if (!phoneNumber) { // JWT가 Detector Token이지만 Query Parameter가 없는 경우
    error(400, "Invalid request");
  } else if (jwtPhoneNumber && phoneNumber !== jwtPhoneNumber) { // JWT가 User Token이지만 다른 사용자의 정보를 요청한 경우
    error(403, "Forbidden");
  } else if (!jwtPhoneNumber && !verifyDetectorToken(jwt)) { // 유효하지 않은 JWT인 경우
    error(403, "Forbidden");
  }

  const pointLogs = getPointLogs(phoneNumber);
  if (pointLogs) {
    return json(pointLogs);
  } else {
    error(400, "User not found");
  }
};
