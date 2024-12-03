import { Link, useOutletContext } from "@remix-run/react";
import CartItemComponent from "~/Cart/Item";
import DefaultContext from "~/contexts/DefaultContext";

const CartPage = function () {
  const { cart } = useOutletContext<DefaultContext>();

  return (
    <>
      <h1>Panier</h1>
      {cart && cart.items && cart.items.length === 0 && (
        <div className={"flex flex-col items-center space-y-3"}>
          <p>Le panier est vide</p>
          <Link to={"/products"} className={"button"}>
            Voir les produits
          </Link>
        </div>
      )}
      {cart && cart.items && cart.items.length > 0 && (
        <div className={"cart"}>
          {cart.items.map((item) => (
            <CartItemComponent item={item} key={item.productId} />
          ))}
        </div>
      )}
    </>
  );
};

export default CartPage;
