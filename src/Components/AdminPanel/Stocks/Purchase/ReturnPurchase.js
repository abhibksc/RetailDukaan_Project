import React, { useEffect, useState } from "react";
import {
  getAllBrand,
  GetAllCreatedItems,
  getAllGST,
  getAllPurchase,
  getAllSupplier,
  getAllUnit,
  GetAllVarients,
} from "../../../CrudOperations/GetOperation";

import { toast } from "react-toastify";
import { checkHSNExists, StorePurchase } from "../../../CrudOperations/PostOperation";
import { useLocation, useNavigate } from "react-router-dom";
import { UpdatePurchaseData } from "../../../CrudOperations/Update&Edit";
import { deletePurchaseItem } from "../../../CrudOperations/DeleteOperation";

const ReturnPurchase = () => {
  const location = useLocation();
  let data = location.state;

  const navigate = useNavigate();

  const [ItemList, setItemList] = useState([]);
  const [item_id, setItem_id] = useState("");
  const [itemAleradyExists, setItemAleradyExists] = useState(false);
  const [VerifyHSN, setVarifyHSN] = useState(false);
  const [verifyskuId, setVarifySku] = useState(false);
  // setItemAleradyExists
  const [isVerifying, setIsVerifying] = useState(false); // New state to track verification status
  const [invoiceDetails, setinvoiceDetails] = useState({
    supplier: "",
    invoiceNo: "",
    date: "",
    ModeofPayment: "",
    MotorVehicleNo: "",
    e_WayBillNo: "",
    cgstSgst: false, // Added
    igst: false, // Added
  });

  const [items, setItems] = useState({
    item_id: "",
    selectedItem: "",
    variant_id: "",
    sellingPrice: "",
    varient_type: "",
    ItemName: "",
    variantName: "",
    quantity_perPacket: "",
    batchNo: "",
    HSN: "",
    quantity: 0,
    unitName: "",
    unit_Id: "",
    cost_per_unit: "",
    gstRate: "",
    gstRate_Id: "",
    gst_Value: "",
    mrp: 0,
    totalCost: 0,
    discountPercent: 0,
    discount: 0,
    lineAmount: 0,
    mfgDate: "",
    gstAmount: 0,
    expiryDate: "",
  });

  const [summaryTotals, setsummaryTotals] = useState({
    totalTaxableAmount: 0,
    cgst: 0,
    sgst: 0,
    igst: 0,
    discount: 0,
    totalAmount: 0,
    roundOff: 0,
    roundOff_Value: 0,
    payment: 0,
  });

  const [formData, setFormData] = useState({
    invoiceDetails: invoiceDetails,
    items: [],
    summaryTotals: summaryTotals,
  });

  const [supplierList, setsupplierList] = useState([]);
  const [unitList, setUnitList] = useState([]);
  const [gstList, setGSTList] = useState([]);
  const [loading, setLoading] = useState(false);
  const Navigate = useNavigate();

  // loading

  const [Edit, setEdit] = useState(false);

  const [BrandList, setBrandList] = useState([]);

  useEffect(() => {
    console.log(invoiceDetails);
    console.log(items);
    console.log(summaryTotals);
  }, [invoiceDetails, items, summaryTotals]);

  useEffect(() => {
    const fun = async () => {
      setLoading(true);
      const [
        itemResponse,
        suppliersResponse,
        unitResponse,
        gstResponse,
        brandResponse,
      ] = await Promise.all([
        GetAllVarients(),
        getAllSupplier(),
        getAllUnit(),
        getAllGST(),
        getAllBrand(),
      ]);

      console.log(itemResponse);

      if (itemResponse.data.message === "All variants successfully retrieved") {
        setItemList(itemResponse.data.items);
      }

      if (
        suppliersResponse.data &&
        suppliersResponse.data.message == "All Supplier retrieved successfully!"
      ) {
        console.log(suppliersResponse);
        setsupplierList(suppliersResponse.data.data);
      }

      if (
        unitResponse.data &&
        unitResponse.data.message == "All unit retrieved successfully!"
      ) {
        console.log(unitResponse);
        setUnitList(unitResponse.data.data);
      }

      if (
        gstResponse.data &&
        gstResponse.data.message == "All gst retrieved successfully!"
      ) {
        console.log(gstResponse);
        setGSTList(gstResponse.data.data);
      }

      if (
        brandResponse.data &&
        brandResponse.data.message == "All brands retrieved successfully!"
      ) {
        console.log(brandResponse);
        setBrandList(brandResponse.data.data);
      }

      setLoading(false);
    };

    fun();
  }, []);

  useEffect(() => {
    if (data) {
      console.log(data);

      setEdit(true);

      setinvoiceDetails({
        supplier: data.Supplier_id,
        invoiceNo: data.invoiceNo,
        date: data.date,
        ModeofPayment: data.ModeofPayment,
        MotorVehicleNo: data.MotorVehicleNo,
        e_WayBillNo: data.e_WayBillNo,
        cgstSgst: Number(data.igst_amount) === 0 ? true : false,
        igst: Number(data.igst_amount) !== 0 ? true : false,
      });

      setFormData({
        invoiceDetails: {
          supplier: data.Supplier_id,
          invoiceNo: data.invoiceNo,
          date: data.date,
          ModeofPayment: data.ModeofPayment,
          MotorVehicleNo: data.MotorVehicleNo,
          e_WayBillNo: data.e_WayBillNo,
          cgstSgst: Number(data.igst_amount) === 0 ? true : false,
          igst: Number(data.igst_amount) !== 0 ? true : false,
        },

        items: data.items,

        summaryTotals: {
          totalTaxableAmount: data.totalTaxableAmount,
          cgst: data.cgst_amount,
          sgst: data.sgst_amount,
          igst: data.igst_amount,
          discount: data.totalDiscount,
          totalAmount: data.totalAmount,
          roundOff: data.roundOff,
          roundOff_Value: data.roundOff_Value,
          payment: data.payment,
        },
      });

      setsummaryTotals({
        totalTaxableAmount: data.totalTaxableAmount,
        cgst: data.cgst_amount,
        sgst: data.sgst_amount,
        igst: data.igst_amount,
        discount: data.totalDiscount,
        totalAmount: data.totalAmount,
        roundOff: data.roundOff,
        roundOff_Value: data.roundOff_Value,
        payment: data.payment,
      });
    } else {
      console.log("Data Nahi Aaya");
    }
  }, []);

  // Handle input changes
  const handleInvoiceDetailsChange = (e) => {
    const { name, type, checked, value } = e.target;

    setinvoiceDetails((prevDetails) => {
      if (type === "checkbox") {
        return {
          ...prevDetails,
          cgstSgst: name === "cgstSgst" ? checked : false,
          igst: name === "igst" ? checked : false,
        };
      } else {
        return {
          ...prevDetails,
          [name]: value,
        };
      }
    });
  };


  // handleItemChange

  const handleItemChange = (e) => {
    console.log(e);


    let { name, value } = e.target;
    console.log(name);

    console.log(value);
    console.log(formData);

    if( name == 'selectedItem'){

      console.log(formData);


      let requestedValue;
    
      try {
          // Try parsing the value as JSON
          requestedValue = JSON.parse(value);

      } catch (error) {
          console.error("Invalid JSON:", value);
          return toast.error("Invalid input format. Please check your data.");
      }
      
      console.log(formData);
      
      // Check for duplicates
      const isDuplicate = formData.items.some((ele) => {
          return ele.varient_type == requestedValue.varient_type && ele.variant_id == requestedValue.variant_id;
      });
      
      if (isDuplicate) {
        setItemAleradyExists(true);
          return toast.warn("Selected Varient Already Added");
      }



    

      value = JSON.parse(value);
      console.log(value);
      

    if (value.varient_type) {
        setItems((prevItems) => {
          const updatedItems = {
            ...prevItems,
            ItemName: "",
            item_id: value.item_id,
            varient_type: value.varient_type,
            variant_id: value.variant_id,
            variantName: value.variantName,
          };
          return updatedItems;
        });
      }

    }
    
 
    


    if (name === "gstRate_Id") {
      // Find the GST row from the list based on the selected value
      const selectedGst = gstList.find((ele) => ele.id == value);

      if (selectedGst) {
        setItems((prevItems) => ({
          ...prevItems,
          gstRate_Id: selectedGst.id,
          gst_Value: selectedGst.value,
        }));
      }
    } else if (name === "unit_Id") {
      console.log("Unit field change detected:", value);

      // Find the unit row from the list based on the selected value
      const selectedUnit = unitList.find((ele) => ele.id == value);

      if (selectedUnit) {
        setItems((prevItems) => ({
          ...prevItems,
          unitName: selectedUnit.unit,
          unit_Id: selectedUnit.id,
        }));
      }
    } else {
      // Parse value if it's numeric
      const parsedValue = [
        "cost_per_unit",
        "quantity",
        "discountPercent",
        "totalCost",
        "lineAmount",
      ].includes(name)
        ? Number(value) || 0
        : value;

      setItems((prevItems) => {
        const updatedItems = {
          ...prevItems,
          [name]: parsedValue,
        };

        // Recalculate total cost if quantity or cost_per_unit changes
        if (name === "cost_per_unit" || name === "quantity") {
          updatedItems.totalCost =
            (updatedItems.quantity || 0) * (updatedItems.cost_per_unit || 0);
        }

        // Always recalculate discount and final amount
        updatedItems.discount = (
          (updatedItems.totalCost * (updatedItems.discountPercent || 0)) /
          100
        ).toFixed(2);

        updatedItems.amount = (
          updatedItems.totalCost - Number(updatedItems.discount)
        ).toFixed(2);

        updatedItems.lineAmount = (
          updatedItems.totalCost - Number(updatedItems.discount)
        ).toFixed(2);

        // lineAmount

        return updatedItems;
      });



    }
  };

  // Function to add medicine to the list
  const addItems = () => {
    console.log(items);

    if(itemAleradyExists){
      return toast.warn("Selected Varient Already Added");
    }


    if (
      (items.item_id || items.variant_id) &&
      items.quantity &&
      items.unit_Id &&
      items.cost_per_unit &&
      items.totalCost &&
      items.lineAmount
    ) {
      setLoading(true);
      // Calculate discount amount and taxable amount
      const discountAmount = (items.totalCost * items.discountPercent) / 100;
      const taxableAmt = items.totalCost - discountAmount;
      const gstAmount = (taxableAmt * items.gst_Value) / 100;

      let cgst = 0,
        sgst = 0,
        igst = 0;

      // Determine tax type (CGST + SGST or IGST)
      if (invoiceDetails.cgstSgst) {
        cgst = gstAmount / 2;
        sgst = gstAmount / 2;
      } else if (invoiceDetails.igst) {
        igst = gstAmount;
      }

      let totalAmount = 0;

      if (invoiceDetails.cgstSgst) {
        totalAmount = taxableAmt + cgst + sgst;
      } else if (invoiceDetails.igst) {
        totalAmount = taxableAmt + igst;
      }

      console.log(typeof totalAmount);

      console.log(totalAmount);

      const roundOff_Value = totalAmount - Math.floor(totalAmount); // Difference for rounding

      console.log(typeof roundOff_Value);
      console.log(roundOff_Value);

      // Update summary totals
      setsummaryTotals((prevTotals) => ({
        totalTaxableAmount:
          Number(prevTotals.totalTaxableAmount) + Number(taxableAmt),
        cgst: Number(prevTotals.cgst) + Number(cgst),
        sgst: Number(prevTotals.sgst) + Number(sgst),
        igst: Number(prevTotals.igst) + Number(igst),
        discount: Number(prevTotals.discount) + Number(discountAmount),
        totalAmount: Number(prevTotals.totalAmount) + Number(totalAmount),
        roundOff: Number(prevTotals.roundOff) + Math.round(totalAmount),
        roundOff_Value:
          Number(prevTotals.totalAmount) +
          Number(totalAmount) -
          (Number(prevTotals.roundOff) + Math.round(totalAmount)),
        payment: Number(prevTotals.payment) + Math.round(totalAmount),
      }));

      // Update the form data with new item and updated summary totals

      const newItem = {
        ...items,
        selectedItem: "",
        lineAmount: taxableAmt,

        gstAmount: gstAmount,
      };
      console.log(newItem);
      
      setFormData((prevData) => ({
        ...prevData,
        items: [...prevData.items, newItem],
        summaryTotals: {
          totalTaxableAmount: (
            Number(prevData.summaryTotals.totalTaxableAmount) + taxableAmt
          ).toFixed(2),
          cgst: (Number(prevData.summaryTotals.cgst) + cgst).toFixed(2),
          sgst: (Number(prevData.summaryTotals.sgst) + sgst).toFixed(2),
          igst: (Number(prevData.summaryTotals.igst) + igst).toFixed(2),
          discount: (
            Number(prevData.summaryTotals.discount) + discountAmount
          ).toFixed(2),
          totalAmount: (
            Number(prevData.summaryTotals.totalAmount) + totalAmount
          ).toFixed(2),
          roundOff: (
            Number(prevData.summaryTotals.roundOff) + roundOff_Value
          ).toFixed(2),
          roundOff_Value: roundOff_Value.toFixed(2),
          payment: (
            Number(prevData.summaryTotals.payment) + Math.round(totalAmount)
          ).toFixed(2),
        },
      }));

      setItemAleradyExists(false)

      setItems({
        item_id: "",
        selectedItem: "",
        variant_id: "",
        sellingPrice: "",
        varient_type: "",
        ItemName: "",
        variantName: "",
        quantity_perPacket: "",
        batchNo: "",
        HSN: "",
        quantity: 0,
        unitName: "",
        unit_Id: "",
        cost_per_unit: "",
        gstRate: "",
        gstRate_Id: "",
        gst_Value: "",
        mrp: 0,
        totalCost: 0,
        discountPercent: 0,
        discount: 0,
        lineAmount: 0,
        mfgDate: "",
        gstAmount: 0,
        expiryDate: "",
      });

      setVarifyHSN(false);

      toast.success("Item Added");

      setLoading(false);
    } else {
      toast.warn("Please Fill Necessary Details!!");
    }
  };

  // Function to delete a medicine from the list
  const deleteItem = async (index) => {
    console.log(index);

    if (Edit) {
      setLoading(true);
      console.log("Edit", index);
      console.log(formData.items);

      const response = await deletePurchaseItem({ id: index });

      console.log(response);

      if (response.data.message == "Purchase item deleted successfully!") {
        const purchaseResponse = await getAllPurchase();
        if (
          purchaseResponse.data.message ===
          "All purchases retrieved successfully!"
        ) {
          console.log(response);
          console.log(purchaseResponse);

          const allData = purchaseResponse.data.data.find(
            (ele) => ele.id == response.data.data
          );

          console.log(allData);

          setEdit(true);

          setinvoiceDetails({
            supplier: allData.Supplier_id,
            invoiceNo: allData.invoiceNo,
            date: allData.date,
            ModeofPayment: allData.ModeofPayment,
            MotorVehicleNo: allData.MotorVehicleNo,
            e_WayBillNo: allData.e_WayBillNo,
            cgstSgst: Number(allData.igst_amount) === 0 ? true : false,
            igst: Number(allData.igst_amount) !== 0 ? true : false,
          });

          setFormData({
            invoiceDetails: {
              supplier: allData.Supplier_id,
              invoiceNo: allData.invoiceNo,
              date: allData.date,
              ModeofPayment: allData.ModeofPayment,
              MotorVehicleNo: allData.MotorVehicleNo,
              e_WayBillNo: allData.e_WayBillNo,
              cgstSgst: Number(allData.igst_amount) === 0 ? true : false,
              igst: Number(allData.igst_amount) !== 0 ? true : false,
            },

            items: allData.items,

            summaryTotals: {
              totalTaxableAmount: allData.totalTaxableAmount,
              cgst: allData.cgst_amount,
              sgst: allData.sgst_amount,
              igst: allData.igst_amount,
              discount: allData.totalDiscount,
              totalAmount: allData.totalAmount,
              roundOff: allData.roundOff,
              roundOff_Value: allData.roundOff_Value,
              payment: allData.payment,
            },
          });

          setsummaryTotals({
            totalTaxableAmount: allData.totalTaxableAmount,
            cgst: allData.cgst_amount,
            sgst: allData.sgst_amount,
            igst: allData.igst_amount,
            discount: allData.totalDiscount,
            totalAmount: allData.totalAmount,
            roundOff: allData.roundOff,
            roundOff_Value: allData.roundOff_Value,
            payment: allData.payment,
          });
        }

        setLoading(false);
        toast.success("Item Deleted");
      }
    } else if (!Edit) {
      // Ensure the index is valid
      if (index < 0 || index >= formData.items.length) {
        toast.error("Invalid item index");
        return;
      }

      // Retrieve the item to be deleted
      const itemToDelete = formData.items[index];

      // Calculate values for the item to be deleted
      const discountAmount =
        (itemToDelete.totalCost * itemToDelete.discountPercent) / 100;
      const taxableAmt = itemToDelete.totalCost - discountAmount;
      const gstAmount = (taxableAmt * itemToDelete.gst_Value) / 100;

      let cgst = 0,
        sgst = 0,
        igst = 0;
      if (invoiceDetails.cgstSgst) {
        cgst = gstAmount / 2;
        sgst = gstAmount / 2;
      } else if (invoiceDetails.igst) {
        igst = gstAmount;
      }

      const itemTotalAmount = taxableAmt + cgst + sgst;

      // Update the formData and summary totals
      setFormData((prevData) => ({
        ...prevData,
        items: prevData.items.filter((_, itemIndex) => itemIndex !== index),
      }));

      setsummaryTotals((prevTotals) => ({
        totalTaxableAmount: (
          Number(prevTotals.totalTaxableAmount) - taxableAmt
        ).toFixed(2),
        cgst: (Number(prevTotals.cgst) - cgst).toFixed(2),
        sgst: (Number(prevTotals.sgst) - sgst).toFixed(2),
        igst: (Number(prevTotals.igst) - igst).toFixed(2),
        discount: (Number(prevTotals.discount) - discountAmount).toFixed(2),
        totalAmount: (Number(prevTotals.totalAmount) - itemTotalAmount).toFixed(
          2
        ),
        roundOff: (
          Number(prevTotals.roundOff) - Math.round(itemTotalAmount)
        ).toFixed(2),
        roundOff_Value: (
          Number(prevTotals.roundOff_Value) -
          (itemTotalAmount - Math.round(itemTotalAmount))
        ).toFixed(2),
        payment: (
          Number(prevTotals.payment) - Math.round(itemTotalAmount)
        ).toFixed(2),
      }));

      if (formData.items.length === 1) {
        setsummaryTotals((prevTotals) => ({
          totalTaxableAmount: 0,
          cgst: 0,
          sgst: 0,
          igst: 0,
          discount: 0,
          totalAmount: 0,
          roundOff: 0,
          roundOff_Value: 0,
          payment: 0,
        }));
      }

      toast.success("Item Deleted");
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    // Logic to handle the submission of the bill
    // For example, you might send the data to an API or log it

    if (Edit) {
      // Directly create the form object
      const filterFormItem = formData.items.filter((ele) => !ele.id);
      console.log(filterFormItem);

      const form = {
        invoiceDetails, // Spread invoice details
        summaryTotals, // Spread summary totals
        items: filterFormItem, // Only include items without an id
        purchase_id: data.id, // Add purchase id
      };

      console.log(form);

      if (form.items.length > 0) {
        const response = await StorePurchase({ form });
        console.log(response);

        if (response.data.message == "Purchase Updated successfully!") {
          const Merchanttoken = localStorage.getItem("Merchanttoken");

          Navigate(`/admin/${Merchanttoken}/purchaseList`);

          toast.success("Purchase updated successfully!");
        }
      } else {
        toast.warn("Empty Item");
      }
    } else if (!Edit) {
      console.log(invoiceDetails);
      console.log(items);
      console.log(summaryTotals);

      const form = {
        invoiceDetails: invoiceDetails,
        items: formData.items,
        summaryTotals: summaryTotals,
      };

      console.log(form);

      if (form.items.length > 0) {
        const response = await StorePurchase({ form });
        console.log(response);

        if (response && response.data.message == "Purchase saved successfully!") {
          toast.success("Bill submitted successfully!");

          setinvoiceDetails({
            supplier: "",
            invoiceNo: "",
            date: "",
            ModeofPayment: "",
            MotorVehicleNo: "",
            e_WayBillNo: "",
            cgstSgst: false, // Added
            igst: false, // Added
          });

          setItems({
            item_id: "",
            sellingPrice: "",
            varient_type: "",
            ItemName: "",
            quantity_perPacket: "",
            quantityPerPacketUnit: "",
            brand_id: "",
            batchNo: "",
            HSN: "",
            quantity: 0,
            unitName: "",
            unit_Id: "",
            cost_per_unit: "",
            gstRate: "",
            gstRate_Id: "",
            gst_Value: "",
            mrp: 0,
            totalCost: 0,
            discountPercent: 0,
            discount: 0,
            lineAmount: 0,
            mfgDate: "",
            gstAmount: 0,
            expiryDate: "",
          });

          setsummaryTotals({
            totalTaxableAmount: 0,
            cgst: 0,
            sgst: 0,
            igst: 0,
            discount: 0,
            totalAmount: 0,
            roundOff: 0,
            roundOff_Value: 0,
            payment: 0,
          });

          setFormData({
            invoiceDetails: invoiceDetails,
            items: [],
            summaryTotals: summaryTotals,
          });


          const merchanttoken = localStorage.getItem('Merchanttoken');
          navigate(`/admin/${merchanttoken}/stocks`);
          
        }
        else if(response  && response.data.message){
          toast.error(response.data.message);
        }
        else{
          toast.error("Something Went Wrong!!")
        }
      } else {
        toast.warn(response.data.message);
      }
    }

    setTimeout(() => {


      setLoading(false);
      
    }, 3000);

   
  };

  // useEffect(() => {
  //   if (items.item_id) {
  //     const findItem = ItemList.find((ele) => ele.id == items.item_id);
  //     console.log(findItem);
  //     setItems({
  //       ...items,
  //       ItemName: findItem.variantName,
  //       varient_type: findItem.varient_type,
  //     });
  //   }
  // }, [items.item_id]);


    const handleVerifyHSN = async () => {
      setIsVerifying(true); // Set verifying state to true
      try {

        if(formData.items.find((ele)=>ele.HSN == items.HSN)){
          setVarifyHSN(false);
          toast.error("hsn already exists.");
          return;
        }







        const response = await checkHSNExists({hsn : items.HSN});
        if (response && response.data.message === "hsn does not exist") {
          setVarifyHSN(true);
          toast.success("hsn is available.");
        } else {
          setVarifyHSN(false);
          toast.error("hsn already exists.");
        }
      } catch (error) {
        console.error("Error verifying hsn:", error);
        toast.error("Error verifying hsn. Please try again.");
      } finally {
        setIsVerifying(false); // Reset verifying state
      }
    };

  return (
    <div className="p-6 bg-white rounded shadow-md">
      
      {loading && (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        </div>
      )}

      <h2 className="text-xl font-semibold mb-4 border-b-2">Purchase : Return</h2>

      
      {/* Form for entering item details */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6 border-b p-5">
        {/* Supplier Input */}
        <div>
          <label className="block font-medium">Supplier *</label>
          <select
            name="supplier"
            value={invoiceDetails.supplier}
            onChange={handleInvoiceDetailsChange}
            className="w-full p-2 border rounded"
          >
            <option value="">--Select Supplier--</option>
            {supplierList.map((supplier, index) => (
              <option key={index} value={supplier.id}>
                {supplier.Supplier_Name}
              </option>
            ))}
          </select>
        </div>

        {/* Invoice Number Input */}
        <div>
          <label className="block font-medium">Invoice No *</label>
          <input
            type="text"
            name="invoiceNo"
            value={invoiceDetails.invoiceNo}
            onChange={handleInvoiceDetailsChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Motor Vehicle Number Input */}
        <div>
          <label className="block font-medium">Motor Vehicle No. *</label>
          <input
            type="text"
            name="MotorVehicleNo"
            value={invoiceDetails.MotorVehicleNo}
            onChange={handleInvoiceDetailsChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Mode of Payment Input */}
        <div>
          <label className="block font-medium">Mode of Payment *</label>
          <input
            type="text"
            name="ModeofPayment"
            value={invoiceDetails.ModeofPayment}
            onChange={handleInvoiceDetailsChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Date Input */}
        <div>
          <label className="block font-medium">Date *</label>
          <input
            type="date"
            name="date"
            value={invoiceDetails.date}
            onChange={handleInvoiceDetailsChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* e-Way Bill Number Input */}
        <div>
          <label className="block font-medium">e_WayBillNo *</label>
          <input
            type="text"
            name="e_WayBillNo"
            value={invoiceDetails.e_WayBillNo}
            onChange={handleInvoiceDetailsChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* GST Type Checkboxes */}
        <div>
          <label className="block font-medium">GST Type</label>
          <div className="flex items-center space-x-4 mb-2">
            <label className="flex items-center">
              <input
                disabled={Edit}
                type="checkbox"
                name="cgstSgst"
                checked={invoiceDetails.cgstSgst}
                onChange={handleInvoiceDetailsChange}
                className="mr-2"
              />
              CGST/SGST
            </label>
            <label className="flex items-center">
              <input
                disabled={Edit}
                type="checkbox"
                name="igst"
                checked={invoiceDetails.igst}
                onChange={handleInvoiceDetailsChange}
                className="mr-2"
              />
              IGST
            </label>
          </div>
        </div>
      </div>


      {/* item List */}
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
            {console.log(formData.items)}
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

                  {`${
                    item.variantName ? item.variantName + " (variant)" : ""
                  }` ||
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
                    "No name available"}
                </td>
                <td className="py-3 px-4 text-center">{item.HSN}</td>
                <td className="py-3 px-4 text-center">{item.quantity} {item.unitName || item.Unit_Name}</td>

                <td className="py-3 px-4 text-center">
                  {item.totalCost ? item.totalCost : item.Totalcost}
                </td>
                <td className="py-3 px-4 text-center">{item.discount}</td>
                <td className="py-3 px-4 text-center">
                  {item.lineAmount ? item.lineAmount : item.Line_Total}
                </td>
                <td className="py-3 px-4 text-center">
                  {isNaN(parseFloat(item.gstAmount))
                    ? "Invalid"
                    : parseFloat(item.gstAmount).toFixed(2)}
                </td>
                <td className="py-3 px-4 text-center">
                  {item.Line_Total
                    ? Number(item.Line_Total) + Number(item.gstAmount)
                    : Number(item.lineAmount) + Number(item.gstAmount)}
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

      {/* summaryTotals */}
      <div className="mt-6 p-5">
        <h4 className="text-lg font-semibold mb-4">Summary Totals</h4>
        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="block font-medium">Taxable Amount:</label>
            <input
              type="text"
              value={`₹${summaryTotals.totalTaxableAmount}`}
              disabled
              className="w-full border rounded py-1 px-2 bg-gray-100"
            />
          </div>
          <div>
            <label className="block font-medium">CGST:</label>
            <input
              type="text"
              value={`₹${summaryTotals.cgst}`}
              disabled
              className="w-full border rounded py-1 px-2 bg-gray-100"
            />
          </div>
          <div>
            <label className="block font-medium">SGST:</label>
            <input
              type="text"
              value={`₹${summaryTotals.sgst}`}
              disabled
              className="w-full border rounded py-1 px-2 bg-gray-100"
            />
          </div>

          <div>
            <label className="block font-medium">IGST:</label>
            <input
              type="text"
              value={`₹${summaryTotals.igst}`}
              disabled
              className="w-full border rounded py-1 px-2 bg-gray-100"
            />
          </div>

          <div>
            <label className="block font-medium">Discount:</label>
            <input
              type="text"
              value={`₹${summaryTotals.discount}`}
              disabled
              className="w-full border rounded py-1 px-2 bg-gray-100"
            />
          </div>
          <div>
            <label className="block font-medium">Total Amount:</label>
            <input
              type="text"
              value={`₹${summaryTotals.totalAmount}`}
              disabled
              className="w-full border rounded py-1 px-2 bg-gray-100"
            />
          </div>

          <div>
            <label className="block font-medium">Round Off:</label>
            <input
              type="text"
              value={`₹${summaryTotals.roundOff}`}
              disabled
              className="w-full border rounded py-1 px-2 bg-gray-100"
            />
          </div>

          <div>
            <label className="block font-medium">Round Off Value:</label>
            <input
              type="text"
              value={`₹${summaryTotals.roundOff_Value}`}
              disabled
              className="w-full border rounded py-1 px-2 bg-gray-100"
            />
          </div>

          <div>
            <label className="block font-medium">Payment:</label>
            <input
              type="text"
              value={`₹${summaryTotals.payment}`}
              disabled
              className="w-full border rounded py-1 px-2 bg-gray-100"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="mt-6 bg-blue-600 text-white py-2 px-4 rounded"
      >
        Submit Bill
      </button>
    </div>
  );
};

export default ReturnPurchase;
