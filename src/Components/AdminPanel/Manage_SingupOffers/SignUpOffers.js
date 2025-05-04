import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fa5, faPen, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import AddSignUpOffers from "./AddSignUpOffers";
import { useNavigate } from "react-router-dom";







const SignUpOffers = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [Staff, setStaff] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredGeoTagIntervals, setFilteredGeoTagIntervals] = useState([]);
  const [GeoTagIntervals, setGeoTagIntervals] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [currentStaffId, setCurrentStaffId] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [edit, setEdit] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // const fetchStaffs = async () => {
    //   const response = await getGeoTag();

    //   console.log(response);
      
    //   if (response.data.Message === "Success") {
    //     setGeoTagIntervals(response.data);
    //     setFilteredGeoTagIntervals(response.data);
    //   }
    // };
    // fetchStaffs();
  }, []);

  const handleSearchInput = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filteredList = GeoTagIntervals.filter(
      (p) =>
        p.StaffName.toLowerCase().includes(query) ||  p.SkillName.toLowerCase().includes(query)
    );
    setFilteredGeoTagIntervals(filteredList);
  };



  // handleUpdateStaff

  const handleUpdateStaff =  (p) => {


    setEdit(p);

    setIsModalOpen(true);
  };


  const handleAddStaffformClick = () => {
    // setIsModalOpen(true);

    navigate(`/admin/${localStorage.getItem('Merchanttoken')}/Add-singupOffers` , {state : edit});
  };

  const closeModal = () => {
    setEdit("");
    setIsModalOpen(false);
  };

  const handleSubmit = async() => {

    const response = await getDuttyAllotement();
      if (response.data.Message === "Success") {
        setGeoTagIntervals(response.data.AllottedDeputies);
        setFilteredGeoTagIntervals(response.data.AllottedDeputies);

        setEdit("");


        setIsModalOpen(false); // Close the modal after adding
        toast.success("Staff added or Update successfully!");
      }

   

  };

  const handleUpdate = (newStaff) => {
    console.log("Updated Staff:", newStaff);
    console.log("Editing Staff ID:", edit.id);
    console.log("Staff List:", GeoTagIntervals);

    setGeoTagIntervals((prev) =>
      prev.map((prevStaff) =>
        prevStaff.id === edit.id
          ? {
              ...prevStaff, // Keep existing properties
              ...newStaff, // Merge properties from newStaff
            }
          : prevStaff
      )
    );

    setFilteredGeoTagIntervals((prev) =>
      prev.map((prevStaff) =>
        prevStaff.id === edit.id
          ? {
              ...prevStaff,
              ...newStaff,
            }
          : prevStaff
      )
    );

    setEdit(null);
    closeModal(); // Close the modal after updating
  };


  const handleFilterChange = (e) => {
    const selectedStatus = e.target.value;

    if (!selectedStatus) {
      setFilteredGeoTagIntervals(GeoTagIntervals);
      return;
    }

    const filteredList = GeoTagIntervals.filter(
      (item) => item.Status === selectedStatus
    );
    setFilteredGeoTagIntervals(filteredList);
  };

  return (
    <div className="container mx-auto p-8 bg-white rounded-lg shadow-lg shadow-gray-300">
      <h1 className="text-xl font-inter font-bold mb-6 border-b-4 border-blue-600 pb-2 text-gray-800">
        Manage SignUp Offers
      </h1>

      <div className="mb-6 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchInput}
          className="w-1/2 border border-gray-300 p-3 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
        />

        <div className="flex items-center gap-4">
          <button
            onClick={handleAddStaffformClick}
            className="bg-blue-600 text-white px-6 py-2 rounded-md flex items-center gap-2 transition-transform duration-200 hover:bg-blue-700 hover:scale-105 shadow-md shadow-blue-500 hover:shadow-lg"
          >
            <FontAwesomeIcon icon={faPlus} />
           Add Offer
          </button>
        </div>
      </div>

      {/* Responsive table wrapper */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white table-auto border border-gray-300 rounded-lg shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              {[
                "S.No",
                "Event Name",
                "Interval"
              ].map((heading) => (
                <th
                  key={heading}
                  className="py-3 px-4 text-center font-semibold text-gray-700"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {console.log(filteredGeoTagIntervals)
            }
            {filteredGeoTagIntervals.length > 0 ? (
              filteredGeoTagIntervals.map((p,index) => (
                <tr
                  key={index}
                  className="border-b transition-colors duration-200 hover:bg-gray-50"
                >
                  <td className="py-3 px-4 text-center">{index+1}</td>
                  <td className="py-3 px-4 text-center">{p.EventName}</td>
                  <td className="py-3 px-4 text-center">{p.IntervalInMinutes}</td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="py-3 text-center text-gray-600">
                  No Staffs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Staff Modal */}
      {isModalOpen && (
        <AddSignUpOffers
          closeModal={closeModal}
          onSubmit={handleSubmit}
          alloteDuty={edit}
          onUpdate={handleUpdate}
        />
      )}

    </div>
  );
};

export default SignUpOffers;
