import { FC, MouseEventHandler } from "react";
import { CartItemType } from "~/types/Cart";
import {
  MinusCircleIcon,
  PlusCircleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useOutletContext } from "@remix-run/react";
import DefaultContextType from "~/contexts/DefaultContext";

const CartItemComponent: FC<{
  item: CartItemType;
}> = function ({ item }) {
  const { addToCart, removeFromCart } = useOutletContext<DefaultContextType>();

  const handleAddOnClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();

    addToCart(item.productId, 1);
  };

  const handleRemoveOnClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();

    addToCart(item.productId, -1);
  };

  const handleDeleteOnClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();
    removeFromCart(item.productId);
  };

  return (
    <div className="cart--item">
      <div className="body">
        {item.product.name} - {item.quantity}
      </div>
      <div className="actions">
        <button onClick={handleAddOnClick} className="button py-[2px]">
          <PlusCircleIcon className={"h-[20px]"} />
        </button>
        <button onClick={handleRemoveOnClick} className="button py-[2px]">
          <MinusCircleIcon className={"h-[20px]"} />
        </button>
        <button onClick={handleDeleteOnClick} className="button py-[2px]">
          <TrashIcon className={"h-[20px]"} />
        </button>
      </div>
    </div>
  );
};

export default CartItemComponent;
