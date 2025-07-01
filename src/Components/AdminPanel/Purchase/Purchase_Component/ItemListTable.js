const ItemListTable = ({ formData, deleteItem, Edit }) => {
  return (
    <div className="overflow-x-auto mt-5 text-left p-5">
      <h4 className="text-lg font-semibold mb-2">Item List</h4>
      <table className="min-w-full bg-white table-auto border border-gray-300 rounded-lg shadow-sm">
        <thead className="bg-gray-100">
          <tr className="border-b">
            <th className="py-3 px-4 text-center font-semibold text-gray-700">
              Name
            </th>
            <th className="py-3 px-4 text-center font-semibold text-gray-700">
              HSN
            </th>
            <th className="py-3 px-4 text-center font-semibold text-gray-700">
              Qty
            </th>
            <th className="py-3 px-4 text-center font-semibold text-gray-700">
              Mrp
            </th>

            <th className="py-3 px-4 text-center font-semibold text-gray-700">
              Default Selling Price
            </th>

            <th className="py-3 px-4 text-center font-semibold text-gray-700">
              Cost Price
            </th>
            <th className="py-3 px-4 text-center font-semibold text-gray-700">
              Discount
            </th>
            <th className="py-3 px-4 text-center font-semibold text-gray-700">
              Taxable Amt.
            </th>
            <th className="py-3 px-4 text-center font-semibold text-gray-700">
              GST Amount
            </th>
            <th className="py-3 px-4 text-center font-semibold text-gray-700">
              Total
            </th>
            <th className="py-3 px-4 text-center font-semibold text-gray-700">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {formData.items.map((item, index) => (
            <tr
              key={index}
              className="border-b transition-colors duration-200 hover:bg-gray-50"
            >
              <td className="py-3 px-4 text-center">
                {/* {!item.ItemName
                    ? item.PacketVariantName
                      ? item.PacketVariantName
                      : item.LooseVariantName
                    : item.ItemName} */}
                {/* 
                      {items?.sku_id && items?.ItemName && items?.variantName
                  ? `(${items.sku_id}) ${items.ItemName} ${items.variantName}`
                  : "Select Variant"}

                {`${(item.variantName && item.ItemName )? (item.ItemName item.variantName ) : ""}` ||
                  item.ItemName ||
                  `${
                    item.LooseVariantName
                      ? item.LooseVariantName + " (variant)"
                      : ""
                  }` ||
                  `${
                    item.PacketVariantName
                      ? item.PacketVariantName + " (variant)"
                      : ""
                  }` ||
                  "No name available"} */}
                {item.ItemName} {item.variantName} {item.varient_type}
                {console.log(item)}
              </td>
              <td className="py-3 px-4 text-center">{item.HSN}</td>
              {console.log(item)}

              <td className="py-3 px-4 text-center">
                {item.quantity} {item.unitName || item.Unit_Name}
              </td>

              <td className="py-3 px-4 text-center">
                {"₹" +
                  Number(
                    item.mrp?.toString().replace(/[^\d.]/g, "") || 0
                  ).toLocaleString("en-IN")}
              </td>
              <td className="py-3 px-4 text-center">
                {"₹" +
                  Number(
                    item.sellingPrice?.toString().replace(/[^\d.]/g, "") || 0
                  ).toLocaleString("en-IN")}
              </td>

              <td className="py-3 px-4 text-center">
                {item.totalCost
                  ? "₹" +
                    Number(
                      item.totalCost?.toString().replace(/[^\d.]/g, "") || 0
                    ).toLocaleString("en-IN")
                  : "₹" +
                    Number(
                      item.Totalcost?.toString().replace(/[^\d.]/g, "") || 0
                    ).toLocaleString("en-IN")}
              </td>
              <td className="py-3 px-4 text-center">
                {"₹" +
                  Number(
                    item.discount?.toString().replace(/[^\d.]/g, "") || 0
                  ).toLocaleString("en-IN")}
              </td>
              <td className="py-3 px-4 text-center">
                {item.lineAmount
                  ? "₹" +
                    Number(
                      item.lineAmount?.toString().replace(/[^\d.]/g, "") || 0
                    ).toLocaleString("en-IN")
                  : "₹" +
                    Number(
                      item.Line_Total?.toString().replace(/[^\d.]/g, "") || 0
                    ).toLocaleString("en-IN")}
              </td>
              <td className="py-3 px-4 text-center">
                {isNaN(parseFloat(item.gstAmount))
                  ? "Invalid"
                  : "₹" +
                    Number(
                      item.gstAmount?.toString().replace(/[^\d.]/g, "") || 0
                    ).toLocaleString("en-IN")}
              </td>
              <td className="py-3 px-4 text-center">
                ₹
                {(
                  Number(
                    (item.Line_Total || item.lineAmount || 0)
                      .toString()
                      .replace(/[^\d.]/g, "")
                  ) +
                  Number(
                    (item.gstAmount || 0).toString().replace(/[^\d.]/g, "")
                  )
                ).toLocaleString("en-IN")}
              </td>

              <td className="py-3 px-4 text-center">
                <button
                  onClick={() =>
                    Edit ? deleteItem(item.id) : deleteItem(index)
                  }
                  className="bg-red-500 text-white py-1 px-2 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ItemListTable;
