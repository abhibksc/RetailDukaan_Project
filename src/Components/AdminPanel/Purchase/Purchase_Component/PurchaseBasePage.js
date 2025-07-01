import { useLocation, useNavigate } from "react-router-dom";
import InvoiceDetailsForm from "./InvoiceDetailsForm";
import ItemListTable from "./ItemListTable";
import PurchaseItemForm from "./PurchaseItemForm";
import SubmitButton from "./SubmitButton";
import SummaryTotals from "./SummaryTotals";
import { useEffect, useState } from "react";
import {
  getAllGST,
  getAllSupplier,
  getAllUnit,
  GetAllVarients,
} from "../../../CrudOperations/GetOperation";
import { toast } from "react-toastify";
import { StorePurchase } from "../../../CrudOperations/PostOperation";

const PurchaseBasePage = () => {
  const location = useLocation();
  let data = location.state;

  const navigate = useNavigate();

  const [ItemList, setItemList] = useState([]);
  const [itemAleradyExists, setItemAleradyExists] = useState(false);
  const [VerifyHSN, setVarifyHSN] = useState(false);
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
    sku_id : "",
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

  useEffect(()=>{

    console.log(items);
    



  },[items.item_id])

  useEffect(() => {
    console.log(invoiceDetails);
    console.log(items);
    console.log(summaryTotals);
  }, [invoiceDetails, items, summaryTotals]);

  useEffect(() => {
    const fun = async () => {
      setLoading(true);
      const [itemResponse, suppliersResponse, unitResponse, gstResponse] =
        await Promise.all([
          GetAllVarients(),
          getAllSupplier(),
          getAllUnit(),
          getAllGST(),
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

    if (name == "selectedItem") {
      console.log(name);

      let requestedValue;

      try {
        // Try parsing the value as JSON
        requestedValue = JSON.parse(value);
      } catch (error) {
        console.log("Invalid JSON:", error, value);
        return toast.error("Invalid input format. Please check your data.");
      }

      console.log(formData);

      // Check for duplicates
      const isDuplicate = formData.items.some((ele) => {
        return (
          ele.varient_type == requestedValue.varient_type &&
          ele.variant_id == requestedValue.variant_id
        );
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
            ItemName: value.ItemName,
                     sku_id: value.sku_id,
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

    // check the GST type selected or not


      // Check if all required fields in invoiceDetails are filled

        const {
    supplier,
    invoiceNo,
    date,
    ModeofPayment,
    MotorVehicleNo,
    cgstSgst,
    igst,
  } = invoiceDetails;



  if (
    !supplier ||
    !invoiceNo ||
    !date ||
    !ModeofPayment ||
    !MotorVehicleNo ||
    (!cgstSgst && !igst)
  ) {
    toast.error("Please fill in all invoice details and select either CGST/SGST or IGST.");
    return;
  }





    if (itemAleradyExists) {
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

      setItemAleradyExists(false);

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

  const FormcleanUp = () => {
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
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // setLoading(true);

    console.log(Edit);

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
      const form = {
        invoiceDetails: invoiceDetails,
        items: formData.items,
        summaryTotals: summaryTotals,
      };

      try {
        if (form.items.length > 0) {
          const response = await StorePurchase({ form });
          console.log(response);

          if (
            response &&
            response.data.message == "Purchase saved successfully!"
          ) {
            toast.success("Bill submitted successfully!");

            FormcleanUp();

            const merchanttoken = localStorage.getItem("Merchanttoken");
            navigate(`/admin/${merchanttoken}/stocks`);
          } else {
            toast.error(
              response?.data?.message ||
                response?.data?.error ||
                "something went wrong, please try again!! or contact Developer!!"
            );
          }
        } else {
          toast.warn("Please Purchase Items..");
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            error.response?.data?.error ||
            "something went wrong, please try again!! or contact Developer!!"
        );
      }
    }

    // setTimeout(() => {
    //   setLoading(false);
    // }, 3000);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );

  const Invoice_props = {
    invoiceDetails,
    handleInvoiceDetailsChange,
    Edit,
  };

  const PurchaseItemForm_props = {
    items,
    handleItemChange,
    addItems,
  };

  const ItemListTable_props = {
    formData,
    deleteItem,
    Edit,
  };

  const SummaryTotals_props = {
    summaryTotals,
  };

  return (
    <div className="p-6 bg-white rounded shadow-md">
      <h2 className="text-xl font-semibold mb-4 border-b-2">New Purchase</h2>

      <InvoiceDetailsForm {...Invoice_props} />
      <PurchaseItemForm {...PurchaseItemForm_props} />
      <ItemListTable {...ItemListTable_props} />
      <SummaryTotals {...SummaryTotals_props} />
      <SubmitButton onSubmit={handleSubmit} />
    </div>
  );
};

export default PurchaseBasePage;
