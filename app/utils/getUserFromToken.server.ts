import decodeToken from "~/utils/decodeToken.server";

export async function getUserFromToken(
  request: Request,
): Promise<number | null> {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null; // Pas de token
  }

  const token = authHeader.split(" ")[1];
  const decoded = decodeToken(token);
  return decoded?.id || null;
}
