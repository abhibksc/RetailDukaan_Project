import { useEffect } from "react";
import ReactDOM from "react-dom";
import { RxCross1 } from "react-icons/rx";

const ViewBasketModal = ({ toggle }) => {
  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, []);
  return ReactDOM.createPortal(
    <>
      <div className="fixed z-40 inset-0 bg-opacity-40 bg-black flex justify-center items-center">
        <div className="bg-white rounded-md shadow-sm border p-3  flex flex-col gap-5">




          <div
            className="text-blue-600 flex gap-10 font-bold font-roboto cursor-pointer justify-between"
           
          >
            <span className="self-start">Grocery Basket</span>
            <span> <RxCross1  onClick={toggle} />
          </span>
          </div>

          <ul>
            <li>
                <div className="flex gap-5">
                    <div >
                        <img className="w-10" src="https://rukminim2.flixcart.com/image/100/100/xif0q/washing-powder/n/r/y/-original-imaguv89rus8rdcq.jpeg?q=90" alt="" />
                    </div>

                    <div className="flex flex-col gap-2">

                        <div className="flex gap-1">
                            <span>surf excel Easy Wash Detergent Powder</span>
                            <span>5 kg</span>
                        </div>

                        <div className="flex gap-2 font-inter">
                            <span className="font-bold text-[14px]">$140.0</span>
                            <span className="line-through text-[12px]">$5000</span>
                            <span className="text-green-500 font-semibold text-[13px]">$732 saved</span>
                        </div>



                    </div>

                </div>
            </li>
          </ul>

         






        </div>
      </div>
    </>,
    document.getElementById("modal-root") // Ensure you have a div with id="modal-root" in your index.html or root component
  );
};

export default ViewBasketModal;
