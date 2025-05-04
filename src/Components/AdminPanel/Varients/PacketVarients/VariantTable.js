import { useState, useEffect } from "react";
import { BiAlignRight, BiExpandAlt } from "react-icons/bi";
import { toast } from "react-toastify";
import { DeletePacketVarient } from "../../../CrudOperations/DeleteOperation";
import ViewImages from "./ViewVariant/ViewImages";
import ViewSpecification from "./ViewVariant/ViewSpecification";
import { useNavigate } from "react-router-dom";
//

const VariantTable = ({Variants , updationData , BrandList , onDelete}) => {

    const navigate = useNavigate();



  const [PacketVarients, setPacketVarient] = useState([]);



  // Packet_Specification_View

  const [viewSpecificationModal, setviewSpecificationModal] = useState(false);
  const [viewImageModal, setViewImageModal] = useState(false);

  const [Packet_Specification_View, setPacket_Specification_View] = useState(
    []
  );

  const [ImageView, setImageView] = useState([]);








  const deleteVariant = (index) => {
    setPacketVarient((prev) => prev.filter((_, i) => i !== index));
    toast.success("Variant deleted successfully");
  };






  const handleDeletevarient = async (id) => {
    const previousLooseVarientList = [...PacketVarients];
    const updatedList = PacketVarients.filter((p) => p.id !== id);
    setPacketVarient(updatedList);

    try {
      const response = await DeletePacketVarient(id);

      if (response.data.message) {
        const Merchanttoken = localStorage.getItem("Merchanttoken");

        navigate(`/admin/${Merchanttoken}/packetVarient`);

        toast.error(`Status: ${response.data.message}`);
      }
    } catch (error) {
      toast.error("Error deleting Brand.");
    }
  };


    // editVarient

    const editVarient = (index) => {
        onDelete(index)
      };

  return (
    <div>
      {/* Display Table */}
      <table className="min-w-full bg-white">
        <thead>
          <tr className="w-full bg-gray-100 border-b">
            <th className="p-2 text-left">Varient</th>
            <th className="p-2 text-left">brand</th>
            <th className="p-2 text-left">SKU</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left">Image</th>
            <th className="p-2 text-left">Specification</th>
            <th className="p-2 text-left">Limit/Order</th>
            {!updationData && <th className="p-2 text-left">Edit</th>}
            {updationData && <th className="p-2 text-left">Delete</th>}
          </tr>
        </thead>
        <tbody>
          {Variants.map((variant, index) => (
            <tr key={index} className="border-b">
              <td className="p-2">{variant.variantName}</td>

              <td className="p-2">
                {variant.brand_name
                  ? variant.brand_name
                  : BrandList.find((ele) => ele.id == variant.brand_id)
                      .brand_name}
              </td>

              <td className="p-2">{variant.sku_id}</td>

              <td className="p-2">{variant.Status}</td>

              <td className="p-2 cursor-pointer">
                <BiAlignRight
                  onClick={() => {
                    setImageView(
                      variant.ImageBucket
                        ? variant.ImageBucket
                        : variant.PacketImages
                    );
                    setViewImageModal(true);
                  }}
                />
              </td>

              <td className="p-2 cursor-pointer">
                <BiAlignRight
                  onClick={() => {
                    setPacket_Specification_View(
                      variant.SpecificationBucket
                        ? variant.SpecificationBucket
                        : variant.PacketSpecification
                    );
                    setviewSpecificationModal(true);
                  }}
                />
              </td>

              <td className="p-2">{variant.limit_per_order}</td>

              {!updationData && (
                <td className="p-2 cursor-pointer">
                  <button
                    onClick={() => editVarient(index)}
                    className="bg-gray-500 hover:bg-gray-600 text-white p-1 rounded"
                  >
                    Edit
                  </button>
                </td>
              )}

              {updationData && (
                <td className="p-2 cursor-pointer">
                  <button
                    onClick={() => handleDeletevarient(variant.id)}
                    className="bg-red-500 hover:bg-red-600 text-white p-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

     

      {viewSpecificationModal && (
        <ViewSpecification
          onclose={() => {
            setviewSpecificationModal(!viewSpecificationModal);
          }}
          Specifications={Packet_Specification_View}
        />
      )}

      {viewImageModal && (
        <ViewImages
          onclose={() => {
            setViewImageModal(!viewImageModal);
          }}
          ImageView={ImageView}
        />
      )}
    </div>
  );
};

export default VariantTable;
