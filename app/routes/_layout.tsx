import { Outlet, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import CartType from "~/types/Cart";
import { LoaderFunction } from "@remix-run/node";

interface LoaderData {
  cart: CartType;
}

export const loader: LoaderFunction = async ({
  request,
}): Promise<LoaderData> => {
  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}`;
  const response = await fetch(`${baseUrl}/api/cart`, {
    headers: request.headers,
  });
  const { data } = await response.json();

  return { cart: data };
};

const LayoutPage = function () {
  const { cart: defaultCart } = useLoaderData<LoaderData>();
  const [cart, setCart] = useState<CartType>(defaultCart);

  async function refreshCart() {
    const newCart = await fetchCart({
      url: "/api/cart",
      refresh: false,
    });

    if (newCart) {
      setCart(newCart);
    }
  }

  async function fetchCart({
    url,
    formData,
    refresh = true,
  }: {
    url: string;
    formData?: FormData;
    refresh?: boolean;
  }): Promise<CartType | null> {
    let headers = undefined;
    const token = localStorage.getItem("authToken");
    if (token) {
      headers = {
        Authorization: `Bearer ${token}`,
      };
    }
    const response = await fetch(url, {
      headers,
      body: formData,
      method: formData ? "POST" : "GET",
    });

    const result = await response.json();
    if (result.success) {
      if (refresh) {
        refreshCart();
      }

      return result.data;
    }

    return null;
  }

  async function addToCart(productId: number, quantity: number) {
    const formData = new FormData();
    formData.append("productId", productId.toString());
    formData.append("quantity", quantity.toString());
    return fetchCart({
      formData,
      url: "/api/cart/add",
    });
  }

  const removeFromCart = (productId: number) => {
    const formData = new FormData();
    formData.append("productId", productId.toString());

    return fetchCart({
      formData,
      url: "/api/cart/remove",
    });
  };

  return (
    <div className="layout">
      <header className="header">
        <span>ALTEN SHOP</span>
      </header>
      <div className="main-container">
        <nav className="sidebar">
          <ul>
            <li>
              <a href="/">Accueil</a>
            </li>
            <li>
              <a href="/products">Produits</a>
            </li>
            <li>
              <a href="/cart">
                Panier{" "}
                {cart.items && cart.items.length > 0 && (
                  <span>({cart.items.length})</span>
                )}
              </a>
            </li>
            <li>
              <a href="/contact">Contact</a>
            </li>
          </ul>
        </nav>
        <main className="content">
          <Outlet context={{ addToCart, cart, removeFromCart }} />
        </main>
      </div>
    </div>
  );
};

export default LayoutPage;
