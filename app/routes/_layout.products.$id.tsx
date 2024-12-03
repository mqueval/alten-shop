import { FC } from "react";
import { LoaderFunction } from "@remix-run/node";
import ProductsService from "~/services/ProductsService.server";
import { Link, useLoaderData } from "@remix-run/react";
import ProductType from "~/types/Product";
import ProductFormComponent from "~/components/Product/Form";

interface LoaderData {
  product: ProductType;
}
export const loader: LoaderFunction = async ({ params }) => {
  const id = params.id && parseInt(params.id, 10);
  if (!id || isNaN(id)) {
    throw new Response("L'identifiant du produit n'existe pas");
  }
  let product: ProductType;
  try {
    product = await ProductsService.getById(id);
  } catch (error) {
    throw new Response((error as Error).message);
  }

  return { product };
};

const ProductsIdPage: FC = function () {
  const { product } = useLoaderData<LoaderData>();
  return (
    <>
      <h1>Mise à jour du produit {product.id}</h1>
      <div className="flex pb-3">
        <Link className="button" to={"/products"}>
          Revenir à la liste
        </Link>
      </div>

      <ProductFormComponent data={product} />
    </>
  );
};

export default ProductsIdPage;
