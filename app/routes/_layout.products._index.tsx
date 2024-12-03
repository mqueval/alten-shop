import { Link, useLoaderData } from "@remix-run/react";
import { LoaderFunction } from "@remix-run/node";
import ProductsService from "~/services/ProductsService.server";
import ProductType from "~/types/Product";
import ProductItemComponent from "~/components/Product/Item";

interface LoaderData {
  products?: ProductType[];
}

export const loader: LoaderFunction = async () => {
  const products = await ProductsService.get();

  return { products };
};

const ProductsPage = function () {
  const { products } = useLoaderData<LoaderData>();

  return (
    <>
      <h1>Liste des produits</h1>
      <div className={"flex pb-3 justify-between"}>
        <Link to="/products/create" className="button">
          Créer produit
        </Link>
      </div>

      <div className="products--list">
        {products &&
          products.length > 0 &&
          products.map((product) => (
            <ProductItemComponent key={product.id} item={product} />
          ))}
      </div>
    </>
  );
};

export default ProductsPage;
