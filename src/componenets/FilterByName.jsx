const FilterbyName = ({ filterParams, handleFilter }) => {
  return (
    <div>
      <input
        type="text"
        name="product"
        value={filterParams?.product || ""}
        onChange={handleFilter}
        placeholder="найти товара по названию"
        id="productName"
      />
    </div>
  );
};

export default FilterbyName;
