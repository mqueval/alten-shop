import ContactFormComponent from "~/components/Contact/Form";
import { ActionFunction } from "@remix-run/node";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const email = formData.get("email");
  if (!email || typeof email !== "string") {
    throw new Response("L'adresse email est obligatoire");
  }

  const message = formData.get("message");
  if (!message || typeof message !== "string") {
    throw new Response("Le message est obligatoire");
  }

  return {
    data: {
      email,
      message,
    },
    success: true,
  };
};

const ContactPage = function () {
  return (
    <>
      <h1>Contact</h1>
      <ContactFormComponent />
    </>
  );
};

export default ContactPage;
