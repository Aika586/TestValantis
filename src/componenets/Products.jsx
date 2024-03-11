import useSWR from "swr";
import { getProductsData } from "../api/getProductsData";
import { useEffect, useState } from "react";
import PriceFilter from "./PriceFilter";
import FilterBrand from "./FilterBrand";
import FilterbyName from "./FilterByName";

const Products = () => {
  const PAGE_SIZE = 50;
  const [pageIndex, setpageIndex] = useState(0);
  const [filterParams, setFilterParams] = useState({});
  const [filteredResult, setFilteredResult] = useState(null);

  const { data: productsId, isLoading: loadingIds } = useSWR(
    ["get_ids", { offset: pageIndex * PAGE_SIZE, limit: PAGE_SIZE }],
    ([url, params]) => getProductsData(url, params)
  );

  const { data: idOf100Products } = useSWR(
    ["get_ids", { offset: 0, limit: 100 }],
    ([url, params]) => getProductsData(url, params)
  );
  const uniqueidsOf100Products = idOf100Products
    ? [...new Set(idOf100Products)]
    : [];

  const uniqueProductsId = productsId ? [...new Set(productsId)] : [];

  const filteredId = uniqueidsOf100Products?.filter((id) =>
    filteredResult?.includes(id)
  );

  const {
    data: productsItem,
    isLoading: loadingItems,
    error,
  } = useSWR(
    ["get_items", { ids: filteredResult ? filteredId : uniqueProductsId }],
    ([url, params]) => getProductsData(url, params),
    {
      onErrorRetry: (error, revalidate, { retryCount }) => {
        if (error.status === 404) return;
        if (retryCount >= 5) return;
        // Retry after 3 seconds.
        setTimeout(() => revalidate({ retryCount }), 3000);
      },
    }
  );

  useEffect(() => {
    if (Object.keys(filterParams).length !== 0) {
      const fetchData = async () => {
        try {
          const data = await getProductsData("filter", filterParams);
          setFilteredResult(data);
        } catch (error) {
          console.error("Error fetching filtered data:", error);
        }
      };
      fetchData();
    }
  }, [filterParams]);
  const handleNextPage = () => {
    setpageIndex((prevIndex) => prevIndex + 1);
  };
  const handlePrevPage = () => {
    setpageIndex((prevIndex) => prevIndex - 1);
  };
  const handleFilter = (e) => {
    const { name, value } = e.target;
    setFilterParams({ [name]: name === "price" ? parseFloat(value) : value });
  };

  if (loadingIds || loadingItems) return <h2>Loading...</h2>;
  if (error) return <h3>Error loading data</h3>;

  return (
    <>
      <div className="filter-wrapper">
        <PriceFilter filterParams={filterParams} handleFilter={handleFilter} />
        <FilterBrand filterParams={filterParams} handleFilter={handleFilter} />
        <FilterbyName filterParams={filterParams} handleFilter={handleFilter} />
      </div>
      <div className="cards-container">
        {filteredResult?.length === 0 && productsItem?.length === 0 ? (
          <p>No products match the filter criteria.</p>
        ) : (
          productsItem?.map((product, index) => (
            <ul key={index} className="card-container">
              <li>
                <b>{product.product}</b>
              </li>
              <li>
                {" "}
                <b>Id:</b>
                {product.id}
              </li>
              <li>
                <b>Цена:</b>
                {product.price}
              </li>
              <li>
                {" "}
                <b>Бренд:</b>
                {product.brand
                  ? product.brand
                  : "Информация о бренде отсутствует"}
              </li>
            </ul>
          ))
        )}
      </div>

      {productsItem?.length > 48 && (
        <div className="button-container">
          <button onClick={handlePrevPage} disabled={pageIndex === 0}>
            Previous
          </button>
          <button onClick={handleNextPage} disabled={pageIndex === 1}>
            Next
          </button>
        </div>
      )}
    </>
  );
};

export default Products;
