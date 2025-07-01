import React from "react";
import { BsThreeDotsVertical } from "react-icons/bs";

const AddressCard = ({
  address,
  onEdit,
  onDelete,
  activeDropdown,
  toggleDropdown,
}) => {
  return (
    <div
      className="border bg-blue-100 p-3 rounded relative"
      onMouseLeave={() => toggleDropdown(null)}
    >
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-2">
          <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 w-fit rounded">
            {address.address_type}
          </span>

          <div className="font-semibold text-sm">
            <span>{address.name}</span> &nbsp; | &nbsp;{" "}
            <span>{address.phone}</span>
          </div>

          <div className="text-sm text-gray-700">
            <p>{address.full_addresss}</p>
            <p className="font-semibold">{address.pin_code}</p>
          </div>
        </div>

        <div className="relative">
          <BsThreeDotsVertical
            className="cursor-pointer text-xl"
            onMouseEnter={() => toggleDropdown(address.id)}
          />
          {activeDropdown === address.id && (
            <div className="absolute right-0 mt-2 w-28 bg-white border rounded shadow-lg z-10">
              <button
                onClick={() => onEdit(address)}
                className="text-blue-500 block px-4 py-2 hover:bg-blue-100 w-full text-left"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(address.id)}
                className="text-red-500 block px-4 py-2 hover:bg-blue-100 w-full text-left"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddressCard;
