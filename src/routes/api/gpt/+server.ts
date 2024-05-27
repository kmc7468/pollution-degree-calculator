import { query } from "$lib/server/gpt.js";

/** @type {import("./$types").RequestHandler} */
export const POST = async ({ request }) => {
  return new Response(await query(await request.text()));
};
