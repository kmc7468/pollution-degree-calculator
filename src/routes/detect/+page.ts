/** @type {import("./$types").PageLoad} */
export const load = ({ url }) => {
  const debug = url.searchParams.get("debug")?.toLowerCase() === "true";
  return { debug };
};
