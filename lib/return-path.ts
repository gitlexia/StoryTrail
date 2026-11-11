export function returnPath(value?: string | null) {
  if (value === "/membership" || value === "/stories" || /^\/stories\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value ?? "")) return value!;
  return "/";
}
