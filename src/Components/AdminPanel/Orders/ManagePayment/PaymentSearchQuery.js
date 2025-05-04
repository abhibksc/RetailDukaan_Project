const PaymentSearchQuery = ({ orders }) => {
  console.log(orders);
  
  
    const filteredOrders = orders.filter(
      (ele) => ele.unique_order_id.toLowerCase() === searchQuery.toLowerCase()
    );
  
    return filteredOrders.map((item) => (
      <tr key={item.id} className="bg-blue-200">
        {Array.from({ length: 17 }).map((_, index) => (
          <td key={index} className="py-3 px-5 border-b border-gray-200">
            {item.unique_order_id}
          </td>
        ))}
      </tr>
    ));
  };
  
  export default PaymentSearchQuery;
  