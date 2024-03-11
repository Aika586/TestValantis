import useSWR from "swr";
import { getProductsData } from "../api/getProductsData";

const FilterBrand = ({ filterParams, handleFilter }) => {
  const { data: brandsArray } = useSWR(
    ["get_fields", { field: "brand", offset: 0, limit: 100 }],
    ([url, params]) => getProductsData(url, params)
  );

  const brandsName = brandsArray?.filter((brand) => brand !== null);

  return (
    <>
      <select value={filterParams?.brand} onChange={handleFilter} name="brand">
        <option value="">All Brands</option>
        {brandsName &&
          brandsName?.map((brand, index) => (
            <option key={index} value={brand}>
              {brand}
            </option>
          ))}
      </select>
    </>
  );
};

export default FilterBrand;
