
<div className="mb-2">
<label className="block text-gray-700">Price</label>
<input
  disabled={!verifyskuId}
  type="price"
  value={price}
  onChange={(e) => setPrice(e.target.value)}
  className="border border-gray-300 p-1 w-full rounded-md"
  required
/>
</div>

<div className="mb-2">
<label className="block text-gray-700">Discount Percentage</label>
<input
  disabled={!verifyskuId}
  type="discount_percentage"
  value={discount_percentage}
  onChange={(e) => setDiscount_percentage(e.target.value)}
  className="border border-gray-300 p-1 w-full rounded-md"
  required
/>
</div>

<div className="mb-2">
<label className="block text-gray-700">Discount</label>
<input
  disabled
  type="discount_price"
  value={discount_price}
  onChange={(e) => setDiscount_price(e.target.value)}
  className="border border-gray-300 p-1 w-full rounded-md"
  required
/>
</div>

<div className="mb-2">
<label className="block text-gray-700">Selling Price</label>
<input
  disabled
  type="selling_price"
  value={selling_price}
  onChange={(e) => setSelling_price(e.target.value)}
  className="border border-gray-300 p-1 w-full rounded-md"
  required
/>
</div>



useEffect(() => {
    if (price && discount_percentage) {
      const discountAmount = (price * discount_percentage) / 100;
      const finalDiscountPrice = parseFloat(price) - discountAmount;
      setDiscount_price(discountAmount.toFixed(2)); // Discount amount
      setSelling_price(finalDiscountPrice.toFixed(2)); // Price after discount
    } else {
      setDiscount_price("");
      setSelling_price(price); // If no discount, selling price is the same as original price
    }
  }, [price, discount_percentage]);