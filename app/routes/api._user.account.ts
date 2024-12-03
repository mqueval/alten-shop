import { ActionFunction } from "@remix-run/node";
import UsersService from "~/services/UsersService.server";

export const action: ActionFunction = async ({ request }) => {
  switch (request.method) {
    case "POST": {
      const formData = await request.formData();

      const username = formData.get("username");
      if (!username || typeof username !== "string") {
        throw new Response("Le username est obligatoire");
      }

      const firstname = formData.get("firstname");
      if (!firstname || typeof firstname !== "string") {
        throw new Response("Le firstname est obligatoire");
      }

      const email = formData.get("email");
      if (!email || typeof email !== "string") {
        throw new Response("L'adresse email est obligatoire");
      }
      const password = formData.get("password");
      if (!password || typeof password !== "string") {
        throw new Response("Le mot de passe email est obligatoire");
      }

      try {
        const user = await UsersService.create({
          username,
          firstname,
          email,
          password,
        });

        return Response.json({
          data: user,
          success: true,
        });
      } catch (error) {
        return Response.json({
          message: (error as Error).message,
          success: false,
        });
      }
    }

    default:
      return Response.json({
        message: "Cette méthode n'est pas gérée",
        success: false,
      });
  }
};
