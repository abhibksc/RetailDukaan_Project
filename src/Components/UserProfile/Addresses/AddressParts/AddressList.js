import React from "react";
import AddressCard from "./AddressCard";

const AddressList = ({
  addresses = [],
  onEdit,
  onDelete,
  activeDropdown,
  toggleDropdown,
}) => {
  if (!addresses.length) {
    return <div className="text-gray-500 mt-4">No addresses saved.</div>;
  }

  return (
    <div className="flex flex-col gap-4 mt-4">
      {addresses.map((address) => (
        <AddressCard
          key={address.id}
          address={address}
          onEdit={onEdit}
          onDelete={onDelete}
          activeDropdown={activeDropdown}
          toggleDropdown={toggleDropdown}
        />
      ))}
    </div>
  );
};

export default AddressList;
