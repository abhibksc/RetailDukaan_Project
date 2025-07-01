const ItemList = ({ offerItemBucket, dispatch }) => {
  return (
    <div className="overflow-x-auto mt-5 text-left p-5">
      <h4 className="text-lg font-semibold mb-2">Item List</h4>
      <table className="min-w-full bg-white border">
        <thead className="bg-gray-100">
          <tr className="border-b">
            <th className="py-3 px-4 text-center">Name</th>
            <th className="py-3 px-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {offerItemBucket.map((ele, index) => (
            <tr key={index} className="border-b">
              <td className="py-2 px-4 text-center">{ele.variant_name}</td>
              <td className="py-2 px-4 text-center">
                <button
                  className="text-red-500"
                  onClick={() =>
                    dispatch({
                      type: "REMOVE_ITEM",
                      varianType: ele.varianType,
                      looseVariantId: ele.looseVariantId,
                      PacketVariantId: ele.PacketVariantId,
                    })
                  }
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

export default ItemList;
