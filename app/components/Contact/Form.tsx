import { FC, useEffect, useState } from "react";
import { useFetcher } from "@remix-run/react";
import ProductType from "~/types/Product";

const ContactFormComponent: FC = function () {
  const fetcher = useFetcher<{ success: boolean; data?: ProductType }>();
  const [message, setMessage] = useState<string>();

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.success) {
      setMessage("Demande de contact envoyée avec succès");
      const timeout = setTimeout(() => setMessage(""), 3000);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [fetcher.state, fetcher.data]);

  return (
    <fetcher.Form className="form" method={"POST"}>
      <div className="field">
        <label htmlFor="email">Adresse email</label>
        <input type="email" id="email" name="email" required={true} />
      </div>
      <div className="field">
        <label htmlFor="message">Message</label>
        <textarea id="message" name="message" required={true} maxLength={300} />
      </div>
      <div className="footer">
        {message && <span>{message}</span>}
        <input
          className={"button self-center"}
          type="submit"
          value={"Envoyer le demande"}
          disabled={fetcher.state === "submitting"}
        />
      </div>
    </fetcher.Form>
  );
};

export default ContactFormComponent;
