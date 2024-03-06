import useSWR from "swr";
import { getProductsData } from "../api/getProductsData";
import { useState } from "react";

const Products = () => {
  const PAGE_SIZE = 50;
  const [pageIndex, setpageIndex] = useState(0);
  const { data: productsId, isLoading: loadingIds } = useSWR(
    ["get_ids", { offset: pageIndex * PAGE_SIZE, limit: PAGE_SIZE }],
    ([url, params]) => getProductsData(url, params)
  );

const uniqueProductsId = productsId && [...new Set(productsId)];

  const {
    data: productsItem,
    isLoading: loadingItems,
    error,
  } = useSWR(
    ["get_items", { ids: uniqueProductsId }],
    ([url, params]) => getProductsData(url, params),
    {
      onErrorRetry: (error, key, revalidate, { retryCount }) => {
        if (error.status === 404) return;
        if (key === "/api/user") return;
        if (retryCount >= 5) return;
        // Retry after 5 seconds.
        setTimeout(() => revalidate({ retryCount }), 3000);
      },
    }
  );

  const handleNextPage = () => {
    setpageIndex((prevIndex) => prevIndex + 1);
  };
  const handlePrevPage = () => {
    setpageIndex((prevIndex) => prevIndex - 1);
  };

  if (loadingIds || loadingItems) return <h2>Loading...</h2>;
  if (error) return <h3>Error loading data</h3>;
  return (
    <>
      {productsItem?.map((product, index) => (
        <ul key={index}>
          <li><b>Id:</b>{product.id}</li>
          <li>{product.product}</li>
          <li><b>Цена:</b>{product.price}</li>
          <li> <b>Бренд:</b>{product.brand ? product.brand : "Информация о бренде отсутствует"}</li>
        </ul>
      ))}

      {productsItem && (
        <div className="button-container">
          <button onClick={handlePrevPage} disabled={pageIndex === 0}>
            Previous
          </button>
          <button onClick={handleNextPage} disabled={pageIndex === 2}>
            Next
          </button>
        </div>
      )}
    </>
  );
};

export default Products;
