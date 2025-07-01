import React, { useEffect, useState } from "react";
import Sidebar from "../Header&SideBar/Sidebar";
import { UpdatePan } from "../CrudOperations/Update&Edit";
import { useDispatch, useSelector } from "react-redux";
import { updatePan } from "../ReduxStore/Slices/auth";
const SavedUPI = () => {
  const [hide, setHide] = useState(false);
  const [panName, setPanName] = useState("");
  const [panNumber, setPanNumber] = useState("");

  const token = useSelector((state) => state.auth.token);
  const pan = useSelector((state) => state.auth.pan);
  const dispatch = useDispatch();
  console.log(pan);

  useEffect(() => {
    // Fetch PAN card details from backend when component mounts
    const fetchPANCardDetails = async () => {
      try {
        // Replace with your API endpoint to fetch PAN card details
        const response = await fetch(
          "http://localhost:8000/api/updatepancard",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );





        // if (response.ok) {
        //   const data = await response.json();
        //   console.log(data);
        //   dispatch(
        //     updatePan({ panName: data.panName, panNumber: data.panNumber })
        //   );
        //   setPanName(data.panName);
        //   setPanNumber(data.panNumber);
        // } else {
        //   console.error("Failed to fetch PAN card details");
        // }




      } catch (error) {
        console.log("Error fetching PAN card details:", error);
      }
    };

    fetchPANCardDetails();
  }, [token]);

  const handleToggle = () => setHide(!hide);

  const handleForm = async (e) => {
    e.preventDefault();
    console.log("chala");
    console.log(panName);
    console.log(panNumber);

    if (panName && panNumber) {
      const response = await UpdatePan({ panName, panNumber, token });
      console.log(response);

      if (response) {
        dispatch(updatePan({ panName: panName, panNumber: panNumber }));
      }
    }
  };

  return (
    <div className="flex mt-14 xl:mt-0 gap-4 justify-center">
      {/* <Sidebar /> */}

      <div className="bg-white flex flex-col gap-4 border p-4 w-[1100px]">
        <h1 className="font-bold text-2xl font-roboto">Saved UPI</h1>

    

      </div>
    </div>
  );
};

export default SavedUPI;
