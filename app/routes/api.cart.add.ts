import { ActionFunction } from "@remix-run/node";
import CartService from "~/services/CartsService.server";
import { commitSession, getSession } from "~/sessions.server";
import { getUserFromToken } from "~/utils/getUserFromToken.server";

export const action: ActionFunction = async ({ request }) => {
  switch (request.method) {
    case "POST": {
      const formData = await request.formData();

      const session = await getSession(request.headers.get("Cookie"));
      const userId = await getUserFromToken(request); // Vérifie le token pour récupérer userId

      const productId = Number(formData.get("productId"));
      const quantity =
        formData.get("quantity") !== null &&
        typeof formData.get("quantity") === "string" &&
        formData.get("quantity") !== ""
          ? parseFloat(formData.get("quantity") as string)
          : 1;

      if (!productId || isNaN(quantity)) {
        return Response.json(
          { success: false, message: "Invalid product ID or quantity" },
          { status: 400 },
        );
      }

      try {
        let cart;

        if (userId) {
          // Utilisateur connecté
          cart = await CartService.addToCartForUser(
            userId,
            productId,
            quantity,
          );
        } else {
          // Utilisateur non connecté
          cart = await CartService.addToCartForGuest(
            session,
            productId,
            quantity,
          );
        }

        const headers = userId
          ? undefined
          : { "Set-Cookie": await commitSession(session) };

        return Response.json({ success: true, data: cart }, { headers });
      } catch (error) {
        return Response.json(
          { success: false, message: "Internal server error" },
          { status: 500 },
        );
      }
    }
  }
};
