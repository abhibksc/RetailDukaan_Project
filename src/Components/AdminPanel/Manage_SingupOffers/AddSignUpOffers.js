import React, { useEffect, useReducer, useState } from "react";
import { toast } from "react-toastify";
import {
  fetchWarehousesPincode,
  Get_Singup_Edited_Data,
  GetAllCreatedItems,
  GetAllOffers,
  getAllpacketVariants_CreatingFor_SignupOffer,
  GetItemVariants_for_creating_SingUpOffer,
  LooseVariants_for_CreateSingupAllOffers,
} from "../../CrudOperations/GetOperation";
import { CreateSignUpOffer } from "../../CrudOperations/PostOperation";
import { UpdateSignUpOffer } from "../../CrudOperations/Update&Edit";
import * as Tone from "tone";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ItemList from "./ItemLIst";

// Reducer & initial state
const initialState = {
  offer_name: "",
  Created_for_warehouse: "",
  offer_mrp: "",
  offer_discount: "",
  offer_cashback: "",
  offer_description: "",
  offer_status: 1,
  offer_image_path: null,
  offerImagePriview: "",
  offerItemBucket: [],
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "RESET_FORM":
      return initialState;
    case "SET_IMAGE":
      return {
        ...state,
        offer_image_path: action.file,
        offerImagePriview: action.preview,
      };
    case "ADD_ITEM":
      return {
        ...state,
        offerItemBucket: [...state.offerItemBucket, action.item],
      };
    case "REMOVE_ITEM":
      return {
        ...state,
        offerItemBucket: state.offerItemBucket.filter((item) => {
          return !(
            item.varianType === action.varianType &&
            (item.looseVariantId === action.looseVariantId ||
              item.PacketVariantId === action.PacketVariantId)
          );
        }),
      };
    case "SET_ALL":
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

const AddSignUpOffers = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const Merchant_userId = useSelector((state) => state.auth.Merchant_userId);

  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    offer_name,
    Created_for_warehouse,
    offer_mrp,
    offer_discount,
    offer_cashback,
    offer_description,
    offer_status,
    offer_image_path,
    offerImagePriview,
    offerItemBucket,
  } = state;

  const [WareHouseList, setWareHouseList] = useState([]);

  const [LooseVariantList, setLooseVarientList] = useState([]);
  const [PacketVariantList, setPacketVarientList] = useState([]);
  const [looseVariantId, setLooseVariantId] = useState("");
  const [PacketVariantId, setPacketVariantId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [warehouseRes] = await Promise.all([fetchWarehousesPincode()]);
        if (warehouseRes?.data?.length > 0) {
          setWareHouseList(warehouseRes.data);
        }
      } catch (error) {
        toast.error(
          error?.response?.data?.message || error?.response?.data?.error
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const EditData = location.state?.Edit_id;
    if (EditData) {
      const fun = async () => {
        const res = await Get_Singup_Edited_Data(EditData);
        const ActualData = res?.data?.[0];

        if (res?.message.includes("retrieved successfully")) {
          dispatch({
            type: "SET_ALL",
            payload: {
              offer_name: ActualData?.title || "",
              offer_mrp: ActualData?.offer_mrp || "",
              offer_discount: ActualData?.offer_discount || "",
              offer_cashback: ActualData?.offer_cashback || "",
              offer_description: ActualData?.offer_description || "",
              offer_status: ActualData?.offer_status || 1,
              offerImagePriview: ActualData?.offer_image_path || "",
              offerItemBucket: ActualData?.items || [],
            },
          });
        } else {
          toast.error(res?.data?.message);
        }
      };
      fun();
    }
  }, [location.state]);

  useEffect(() => {
    console.log(Created_for_warehouse);

    if (Created_for_warehouse) {
      // setPacketVarientList()
      // setLooseVarientList()

      const fun = async () => {
        try {
          const response = await GetItemVariants_for_creating_SingUpOffer(
            Created_for_warehouse
          );

          console.log(response);

          if (
            response?.data?.message ===
            "All Loose and packet variant  for Creating Signup Offer retrieved successfully!"
          ) {
            setPacketVarientList(response?.data?.Packet);
            setLooseVarientList(response?.data?.Loose);
          }
        } catch (err) {
          console.log(err);
        }
      };

      fun();
    }
  }, [Created_for_warehouse]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      if (img.width === 1000 && img.height === 1000) {
        dispatch({
          type: "SET_IMAGE",
          file: file,
          preview: img.src,
        });
      } else {
        alert("Image must be exactly 1000 x 1000 pixels.");
        e.target.value = null;
      }
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (
      !offer_name ||
      !Created_for_warehouse ||
      !offer_mrp ||
      !offer_discount ||
      !offer_cashback ||
      !offer_description ||
      !offer_status ||
      offerItemBucket.length === 0
    ) {
      toast.error("Please fill all fields and add at least one item.");
      setLoading(false);
      return;
    }

    const payload = {
      userId: Merchant_userId,
      Created_for_warehouse: Created_for_warehouse,
      title: offer_name,
      offer_mrp,
      offer_discount,
      offer_cashback,
      offer_description,
      offer_status,
      offer_image_path,
      items: offerItemBucket,
    };

    const response = location.state?.Edit_id
      ? await UpdateSignUpOffer(
          Merchant_userId,
          location.state.Edit_id,
          ...Object.values(payload).slice(1)
        )
      : await CreateSignUpOffer(...Object.values(payload));

    const success = response?.data?.message.includes("successfully");

    if (success) {
      toast.success(response.data.message);
      const synth = new Tone.Synth().toDestination();
      await Tone.start();
      synth.triggerAttackRelease("C4", "8n");

      dispatch({ type: "RESET_FORM" });
      navigate(`/admin/${localStorage.getItem("Merchanttoken")}/singupOffers`);
    }

    setLoading(false);
  };

  const handleAddItem = () => {
    if (!looseVariantId && !PacketVariantId) {
      return toast.error("Please Select Item");
    }

    if (looseVariantId) {
      const exists = offerItemBucket.some(
        (item) => item.looseVariantId === looseVariantId
      );
      if (exists) return alert("Loose variant already exists.");

      const variant = LooseVariantList.find((ele) => ele.id == looseVariantId);
      dispatch({
        type: "ADD_ITEM",
        item: {
          looseVariantId,
          variant_name: variant?.variantName,
          varianType: variant?.varient_type,
        },
      });
    }

    if (PacketVariantId) {
      const exists = offerItemBucket.some(
        (item) => item.PacketVariantId === PacketVariantId
      );
      if (exists) return alert("Packet variant already exists.");

      const variant = PacketVariantList.find(
        (ele) => ele.id == PacketVariantId
      );
      dispatch({
        type: "ADD_ITEM",
        item: {
          PacketVariantId,
          variant_name: variant?.variantName,
          varianType: variant?.varient_type,
        },
      });
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow-md">
      {loading && (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        </div>
      )}

      <h1 className="text-2xl font-bold mb-4 border-b-2 py-2">
        {location.state?.Edit_id ? "Update" : "Create"} Signup Offers
      </h1>

      <div className="grid grid-cols-4 gap-5 border-b-2 p-2 pb-5">
        <div>
          <label className="block font-medium text-sm mb-1">
            Warehouse Name *
          </label>
          <select
            value={state.Created_for_warehouse}
            onChange={(e) =>
              dispatch({
                type: "SET_FIELD",
                field: "Created_for_warehouse",
                value: e.target.value,
              })
            }
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="">Select Warehouse</option>
            {WareHouseList.map((ware) => (
              <option key={ware.warehouse_id} value={ware.warehouse_id}>
                {ware.warehouse_name}
              </option>
            ))}
          </select>
        </div>

        {[
          ["Offer Name", "offer_name", "text"],

          ["Offer MRP", "offer_mrp", "number"],
          ["Offer Discount (%)", "offer_discount", "number"],
          ["Offer Cashback", "offer_cashback", "number"],
          ["Offer Description", "offer_description", "text"],
        ].map(([label, field, type]) => (
          <div key={field}>
            <label className="block font-medium">{label} *</label>
            <input
              type={type}
              value={state[field]}
              onChange={(e) =>
                dispatch({
                  type: "SET_FIELD",
                  field,
                  value: e.target.value,
                })
              }
              className="w-full p-2 border rounded"
            />
          </div>
        ))}

        <div>
          <label className="block font-medium">Offer Status</label>
          <select
            value={offer_status}
            onChange={(e) =>
              dispatch({
                type: "SET_FIELD",
                field: "offer_status",
                value: e.target.value,
              })
            }
            className="w-full p-2 border rounded"
          >
            <option value="">Select Status</option>
            <option value={1}>Active</option>
            <option value={0}>Inactive</option>
          </select>
        </div>

        <div>
          <label className="block font-medium">
            Offer Image * <span className="text-sm">(1000 x 1000)</span>
          </label>
          <input
            type="file"
            onChange={handleImageChange}
            accept="image/*"
            className="w-full p-1 border rounded"
          />
        </div>
      </div>

      <div className="mt-4">
        <h2 className="text-xl font-bold mb-2">Add Item to Offer</h2>
        <div className="flex gap-4 mb-4">
          {[
            [
              "Loose Varient",
              looseVariantId,
              setLooseVariantId,
              LooseVariantList,
            ],
            [
              "Packet Varient",
              PacketVariantId,
              setPacketVariantId,
              PacketVariantList,
            ],
          ].map(([label, value, setter, list]) => (
            <div key={label}>
              <label className="block font-medium text-sm mb-1">{label}</label>
              <select
                value={value}
                onChange={(e) => setter(e.target.value)}
                className="border p-2 rounded text-sm"
              >
                <option value="">Select Item</option>

                {list.map((item, index) => (
                  <option key={index} value={item.id}>
                    {item.itemName} {item.variantName} ({item.sku_id}) (
                    {item.BrandName})
                  </option>
                ))}
              </select>
            </div>
          ))}
          <button
            onClick={handleAddItem}
            className="bg-green-600 text-white px-3 py-1 rounded mt-6"
          >
            Add Item
          </button>
        </div>

        <ItemList offerItemBucket={offerItemBucket} dispatch={dispatch} />
      </div>

      <button
        onClick={handleSubmit}
        className="mt-6 bg-blue-600 text-white py-2 px-4 rounded"
      >
        Submit
      </button>
    </div>
  );
};

export default AddSignUpOffers;
