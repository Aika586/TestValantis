import useSWR from "swr";
import { getProductsData } from "../api/getProductsData";

const PriceFilter = ({ filterParams, handleFilter }) => {
  const { data: productPrices } = useSWR(
    ["get_fields", { field: "price", offset: 0, limit: 100 }],
    ([url, params]) => getProductsData(url, params)
  );

  const minPrice = productPrices && Math.min(...productPrices);
  const maxPrice = productPrices && Math.max(...productPrices);

  return (
    <div>
      <div className="wrapper-filterPrice">
        <p className="price">
          {" "}
          Цены от {minPrice} - {maxPrice}
        </p>
        <input
          name="price"
          value={filterParams.price || ""}
          onChange={handleFilter}
          placeholder="фильтрация по ценам"
        />
      </div>
    </div>
  );
};

export default PriceFilter;
