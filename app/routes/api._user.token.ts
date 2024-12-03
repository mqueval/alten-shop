import { ActionFunction } from "@remix-run/node";
import UsersService from "~/services/UsersService.server";

export const action: ActionFunction = async ({ request }) => {
  switch (request.method) {
    case "POST": {
      const formData = await request.formData();
      const email = formData.get("email");
      const password = formData.get("password");

      if (
        email === null ||
        typeof email !== "string" ||
        password === null ||
        typeof password !== "string"
      ) {
        return Response.json(
          { success: false, message: "Email and password are required" },
          { status: 400 },
        );
      }

      try {
        const token = await UsersService.login(email, password);

        return Response.json({ success: true, token }, { status: 200 });
      } catch (error) {
        return Response.json(
          { success: false, message: "Invalid credentials" },
          { status: 401 },
        );
      }
    }

    default:
      return Response.json({
        success: false,
        message: "Cette méthode n'est pas prise en charge",
      });
  }
};
