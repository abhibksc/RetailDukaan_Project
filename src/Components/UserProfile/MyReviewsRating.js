import React from "react";
import Sidebar from "../Header&SideBar/Sidebar";
const MyReviewsRating = () => {
  return (
    <div className="flex gap-4 mt-14 xl:mt-0 justify-center">
      <Sidebar />

      <div className="bg-white flex flex-col gap-4 border p-4 w-[1100px]">
        <h1 className="font-bold text-2xl font-roboto">MyReviewsRating</h1>
        <div>no ratings</div>

        {/* <div className="flex flex-col gap-4 border p-2">
          <ul>
            <li>
              <div>
                <div className="flex flex-row justify-between">
                  <span>Grab upto 25% off</span>
                  <span>
                    Valid till 31st aug
                  </span>
                </div>

                <div className="flex flex-row justify-between">
                  <span>Get extra 25% off on 10 item(s) (price inclusive of
                    cashback/coupon)</span>
                  <span>View T&C</span>
                </div>
              </div>

            </li>
          </ul>
        </div> */}
      </div>
    </div>
  );
};

export default MyReviewsRating;
