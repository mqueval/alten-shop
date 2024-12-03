import { FC, MouseEventHandler } from "react";
import ProductType from "~/types/Product";
import { Link, useOutletContext } from "@remix-run/react";
import DefaultContextType from "~/contexts/DefaultContext";

const ProductItemComponent: FC<{ item: ProductType }> = function ({ item }) {
  const { addToCart, removeFromCart } = useOutletContext<DefaultContextType>();
  const handleAddToCartOnClick: MouseEventHandler<HTMLButtonElement> = (
    event,
  ) => {
    event.preventDefault();

    addToCart(item.id, 1);
  };

  const handleDeleteOnClick: MouseEventHandler<HTMLButtonElement> = async (
    event,
  ) => {
    event.preventDefault();

    const response = await fetch(`/api/products/${item.id}`, {
      method: "DELETE",
    });

    const { success } = await response.json();

    if (success) {
      removeFromCart(item.id);
      window.location.reload();
    }
  };

  return (
    <div className="products--item">
      <div className="body">
        <h2 className={"name"}>{item.name}</h2>
        {item.description && <p>{item.description}</p>}
        <dl className={"grid grid-cols-2"}>
          <dt>Prix</dt>
          <dd>{item.price} €</dd>
          <dt>Stock</dt>
          <dd>
            {item.inventoryStatus}{" "}
            {item.inventoryStatus !== "OUTOFSTOCK" ? item.quantity : ""}
          </dd>
        </dl>
      </div>
      <div className="actions">
        {(item.inventoryStatus !== "OUTOFSTOCK" || item.quantity > 0) && (
          <button onClick={handleAddToCartOnClick} className="button">
            Ajouter au panier
          </button>
        )}

        <Link to={`/products/${item.id}`} className="button">
          Modifier
        </Link>
        <button onClick={handleDeleteOnClick} className="button">
          Supprimer
        </button>
      </div>
    </div>
  );
};

export default ProductItemComponent;
