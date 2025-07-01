import { motion } from "framer-motion";

const highlight = "text-green-700 font-semibold underline decoration-wavy decoration-green-400";

const pincodeData = [
  { pincode: "827001", district: "Bokaro", state: "Jharkhand" },
  { pincode: "827002", district: "Bokaro", state: "Jharkhand" },
  { pincode: "827003", district: "Bokaro", state: "Jharkhand" },
  { pincode: "827004", district: "Bokaro", state: "Jharkhand" },
  { pincode: "827005", district: "Bokaro", state: "Jharkhand" },
  { pincode: "827006", district: "Bokaro", state: "Jharkhand" },
  { pincode: "827007", district: "Bokaro", state: "Jharkhand" },
  { pincode: "827008", district: "Bokaro", state: "Jharkhand" },
  { pincode: "827009", district: "Bokaro", state: "Jharkhand" },
  { pincode: "827010", district: "Bokaro", state: "Jharkhand" },
  { pincode: "826001", district: "Dhanbad", state: "Jharkhand" },
  { pincode: "826002", district: "Dhanbad", state: "Jharkhand" },
  { pincode: "826003", district: "Dhanbad", state: "Jharkhand" },
  { pincode: "826004", district: "Dhanbad", state: "Jharkhand" },
  { pincode: "826005", district: "Dhanbad", state: "Jharkhand" },
  { pincode: "826006", district: "Dhanbad", state: "Jharkhand" },
  { pincode: "826007", district: "Dhanbad", state: "Jharkhand" },
  { pincode: "826008", district: "Dhanbad", state: "Jharkhand" },
  { pincode: "826009", district: "Dhanbad", state: "Jharkhand" },
  { pincode: "826010", district: "Dhanbad", state: "Jharkhand" },
  { pincode: "828109", district: "Dhanbad", state: "Jharkhand" },
];

const Starting_Page_Base = () => {
  return (
    <motion.div
      className=" mx-28 my-10 p-4 mt-20 bg-white shadow-md rounded-lg "
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <h1 className="text-sm font-bold mb-3 text-green-800">
        RetailDukaan: Your One-Stop Online Grocery Store
      </h1>

      <p className="mb-2 text-xs">
        Hate standing in queues at the grocery store? Unable to find all grocery products under the same roof? The supermarket is too far? Technology can help make life simpler for you.
      </p>

      <p className="mb-2 text-xs">
        RetailDukaan brings convenience to your doorstep. <span className={highlight}>Currently, we deliver only to Bokaro & Dhanbad, Jharkhand</span>. Below are the serviceable pincodes:
      </p>

      {/* 📦 Delivery Coverage Table */}
      <div className="overflow-x-auto mb-4">
        <table className="w-full text-xs border border-gray-200 text-left shadow-sm">
          <thead className="bg-green-100 text-green-800 uppercase tracking-wider">
            <tr>
              <th className="p-2 border">Pincode</th>
              <th className="p-2 border">District</th>
              <th className="p-2 border">State</th>
            </tr>
          </thead>
          <tbody>
            {pincodeData.map(({ pincode, district, state }) => (
              <tr key={pincode} className="hover:bg-green-50">
                <td className="p-2 border">{pincode}</td>
                <td className="p-2 border">{district}</td>
                <td className="p-2 border">{state}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mb-2 text-xs">
        We plan to expand soon. Enjoy daily deals from ₹1, exclusive bank offers, and next-day delivery. Shopping for groceries online has never been easier!
      </p>

      <p className="mb-2 text-xs font-semibold">
        Shop for Quality & Savings
      </p>

      <p className="mb-2 text-xs">
        From lentils, flours, snacks, and spices to detergents, sanitary and personal care — we’ve got you covered.
      </p>

      <p className="mb-2 text-xs">
        Buy Now Pay Later, BOGO deals, free vouchers & contests are just a few perks. You may never visit a supermarket again!
      </p>

      <p className="mb-2 text-xs">
        We partner with top brands to bring only quality products. Ready to shop with RetailDukaan?
      </p>

      <p className="mb-1 text-xs font-semibold">
        Your Daily Needs Made Easy
      </p>

      <p className="text-xs">
        Find staples like lentils, pulses, atta, sugar, snacks, coffee, noodles, pickles, sauces and more — all in one place.
      </p>
    </motion.div>
  );
};

export default Starting_Page_Base;
