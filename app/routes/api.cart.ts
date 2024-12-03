import { LoaderFunction } from "@remix-run/node";
import CartService from "~/services/CartsService.server";
import { getUserFromToken } from "~/utils/getUserFromToken.server";
import { getSession } from "~/sessions.server";
import CartType from "~/types/Cart";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const userId = await getUserFromToken(request);

  if (userId) {
    const cart = (await CartService.getCartForUser(userId)) as CartType;

    return Response.json({ success: true, data: cart });
  }

  const cart = session.get("cart") || { items: [] };

  return Response.json({ success: true, data: cart as CartType });
};
