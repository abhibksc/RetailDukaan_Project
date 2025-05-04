import React, { useEffect, useState } from "react";
import Sidebar from "../Header&SideBar/Sidebar";
import { UpdatePan } from "../CrudOperations/Update&Edit";
import { useDispatch, useSelector } from "react-redux";
import { updatePan } from "../ReduxStore/Slices/auth";
const PANCardInfo = () => {
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
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          dispatch(
            updatePan({ panName: data.panName, panNumber: data.panNumber })
          );
          setPanName(data.panName);
          setPanNumber(data.panNumber);
        } else {
          console.error("Failed to fetch PAN card details");
        }
      } catch (error) {
        console.error("Error fetching PAN card details:", error);
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
      <Sidebar />

      <div className="bg-white flex flex-col gap-4 border p-4 w-[1100px]">
        <h1 className="font-bold text-2xl font-roboto">PAN Card Information</h1>

       {!pan && <div>
          {!hide && (
            <h1
              className="font-roboto text-blue-600 font-bold cursor-pointer"
              onClick={handleToggle}
            >
              ➕ ADD PAN CARD DETAILS
            </h1>
          )}

          {hide && (
            <form
              className="bg-blue-100 border p-3 flex flex-col gap-5"
              onSubmit={handleForm}
            >
              <h1
                className="text-blue-600 font-bold font-roboto cursor-pointer"
                onClick={handleToggle}
              >
                ➕ ADD PAN CARD DETAILS
              </h1>

              <div className="flex flex-row gap-4">
                <input
                  onChange={(e) => setPanNumber(e.target.value)}
                  className="border bg-white p-2"
                  type="text"
                  placeholder="PAN Card Number"
                />
              </div>

              <div className="flex flex-row gap-4">
                <input
                  onChange={(e) => setPanName(e.target.value)}
                  className="border bg-white p-2"
                  type="text"
                  placeholder="Name as on PAN Card"
                />
              </div>

              <div className="flex gap-4">
                <button className="border p-3 w-40 bg-blue-500 rounded-md text-white">
                  Save
                </button>
                <button className="border p-3 w-40 rounded-md">Cancel</button>
              </div>
            </form>
          )}
        </div>}

        {pan && <div className="border w-64  p-2 bg-blue-200 shadow-slate-900 shadow-md rounded-md">

          <h1 className="text-lg font-semibold mb-4">Your Pan Card</h1>

          <h1 className="">{pan.panName}</h1>
          <h1>{pan.panNumber}</h1>


          


          
          
          </div>}






      </div>
    </div>
  );
};

export default PANCardInfo;
