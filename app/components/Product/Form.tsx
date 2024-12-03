import { CATEGORIES } from "~/constants";
import { useFetcher, useNavigate } from "@remix-run/react";
import { FC, useEffect, useState } from "react";
import ProductType from "~/types/Product";

const ProductFormComponent: FC<{
  data?: ProductType;
}> = function ({ data }) {
  const navigate = useNavigate();
  const fetcher = useFetcher<{ success: boolean; data?: ProductType }>();
  const [message, setMessage] = useState<string>();

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.success) {
      let timeout: NodeJS.Timeout;

      if (data?.id) {
        // c'est une mise à jour
        setMessage("La mise à jour a été réalisée avec succès");
        timeout = setTimeout(() => setMessage(""), 3000);
      } else {
        // c'est une création
        if (fetcher.data.data) {
          navigate(`/products/${fetcher.data.data.id}`);
        }
      }

      return () => {
        if (timeout) {
          clearTimeout(timeout);
        }
      };
    }
  }, [fetcher.state, fetcher.data]);

  return (
    <fetcher.Form
      className="form"
      method={data?.id ? "PATCH" : "POST"}
      action={data?.id ? `/api/products/${data.id}` : "/api/products"}
    >
      <div className="field">
        <label htmlFor="name">Nom</label>
        <input
          type="text"
          id="name"
          name="name"
          required={true}
          defaultValue={data?.name}
        />
      </div>
      <div className="field">
        <label htmlFor="price">Prix</label>
        <input
          type="number"
          id="price"
          name="price"
          required={true}
          defaultValue={data?.price}
        />
      </div>
      <div className="field">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          defaultValue={data?.description}
        />
      </div>
      <div className="field">
        <label htmlFor="category">Catégorie</label>
        <select id="category" name="category" defaultValue={data?.category}>
          <option></option>
          {CATEGORIES.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor="quantity">Quantité</label>
        <input
          type="number"
          id="quantity"
          name="quantity"
          defaultValue={data?.quantity}
        />
      </div>

      <div className="footer">
        {message && <span>{message}</span>}
        <input
          className={"button self-center"}
          type="submit"
          value={data?.id ? "Modifier le produit" : "Créer le produit"}
          disabled={fetcher.state === "submitting"}
        />
      </div>
    </fetcher.Form>
  );
};

export default ProductFormComponent;
