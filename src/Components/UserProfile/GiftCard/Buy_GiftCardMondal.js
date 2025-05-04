import React, { useEffect, useState } from "react";
import { RxCross1 } from "react-icons/rx";
import Lottie from "react-lottie";
import animationData from "../../../assets/animations/congratulations.json"; // Update the path
import { buyCard } from "../../CrudOperations/PostOperation";
// import Gift_cart from "./Gift_cart";
import { useNavigate } from "react-router-dom";
import CheckOut from "../../CheckOut/CheckOut";
// import CheckOut from "../../CheckOut/CheckOut";


const Buy_GiftCardMondal = ({ toggle2 }) => {
  const [showAnimation, setShowAnimation] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);
  const [hide, setHide] = useState(0);

  const navigate = useNavigate();

  const [giftCard, setGiftCard] = useState({
    receiver_emailId: "",
    receiver_Name: "",
    receiver_CardValue: "",
    receiver_NumberOfCard: "",
    receiver_Gifter_Name: null,
    receiver_message: null,
  });

  useEffect(() => {
    document.body.classList.add("modal-open");

    const timer = setTimeout(() => {
      setShowAnimation(false);
    }, 2000);

    return () => {
      document.body.classList.remove("modal-open");

      clearTimeout(timer);
    };
  }, []);

  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGiftCard((prevDetails) => ({ ...prevDetails, [name]: value }));

    // Calculate the total price when card value or number of cards changes
    if (name === "receiver_CardValue" || name === "receiver_NumberOfCard") {
      const cardValue = parseInt(
        name === "receiver_CardValue" ? value : giftCard.receiver_CardValue || 0
      );
      const numberOfCards = parseInt(
        name === "receiver_NumberOfCard"
          ? value
          : giftCard.receiver_NumberOfCard || 0
      );
      setTotalPrice(
        (isNaN(cardValue) ? 0 : cardValue) *
          (isNaN(numberOfCards) ? 0 : numberOfCards)
      );
    }
  };

  const handleForm = async (e) => {
    e.preventDefault();

    if (
      giftCard.receiver_emailId &&
      giftCard.receiver_Name &&
      giftCard.receiver_CardValue &&
      giftCard.receiver_NumberOfCard
    ) {
      console.log(giftCard.receiver_emailId);
      console.log(giftCard.receiver_Name);
      console.log(giftCard.receiver_CardValue);
      console.log(giftCard.receiver_NumberOfCard);
      console.log();

      // const response = await buyCard({
      //   receiver_mail: giftCard.receiver_emailId,
      //   receiver_name: giftCard.receiver_Name,
      //   cardValue: giftCard.receiver_CardValue,
      //   numberOfCard: giftCard.receiver_NumberOfCard,
      //   receiver_Gifter_Name: giftCard.receiver_Gifter_Name,
      //   receiver_message: giftCard.receiver_message,
      // });
      // console.log(response);

      // if(response){

      //   setHide(true);

      // }

      setHide(true);
      navigate("/CheckOut/", { state: giftCard });
     

    }
    console.log(giftCard);
  };

  return (
    <div className="fixed inset-0 bg-opacity-40 bg-black flex justify-center items-center z-20">
      {showAnimation && (
        <div className="fixed inset-0 bg-opacity-40 border  flex justify-center items-center z-20">
          <Lottie options={defaultOptions} height={300} width={300} />
        </div>
      )}

      {/* Buy gift card */}
      <div className="bg-white text-black border  w-80 flex flex-col gap-5 relative">
        <h1 className="font-bold text-2xl font-serif bg-pink-200 p-2 text-center">
          Buy a Gift Card
        </h1>
        <RxCross1
          className="absolute top-2 right-2 cursor-pointer"
          onClick={toggle2}
        />

        <form
          className="flex flex-col rounded-md  gap-3 p-3 "
          onSubmit={handleForm}
        >
          <input
            onChange={handleChange}
            value={giftCard.receiver_emailId}
            type="text"
            name="receiver_emailId"
            className="rounded-sm p-3 bg-white border-b focus:outline-none"
            placeholder="Receiver's Email Id"
          />
          <input
            onChange={handleChange}
            value={giftCard.receiver_Name}
            type="text"
            name="receiver_Name"
            className="rounded-sm p-3 bg-white border-b focus:outline-none"
            placeholder="Receiver's Name"
          />
          <div className="flex gap-4">
            <select
              className="rounded-sm p-3 bg-white text-gray-400 border-b focus:outline-none"
              name="receiver_CardValue"
              onChange={handleChange}
              value={giftCard.receiver_CardValue}
            >
              <option value="" disabled>
                Card Value
              </option>
              <option value="100">100₹</option>
              <option value="101">101₹</option>
              <option value="400">400₹</option>
              <option value="1000">1000₹</option>
              <option value="4000">4000₹</option>
              <option value="8000">8000₹</option>
              <option value="15000">15000₹</option>
              <option value="18000">18000₹</option>
            </select>
            <input
              onChange={handleChange}
              value={giftCard.receiver_NumberOfCard}
              type="number"
              name="receiver_NumberOfCard"
              className="rounded-sm p-3 w-full bg-white border-b focus:outline-none "
              placeholder="No. Of Cards"
            />
          </div>
          <input
            onChange={handleChange}
            value={giftCard.receiver_Gifter_Name}
            type="text"
            name="receiver_Gifter_Name"
            className="rounded-sm p-3 bg-white border-b focus:outline-none"
            placeholder="Gifter's Name (Optional)"
          />
          <input
            onChange={handleChange}
            value={giftCard.receiver_message}
            type="text"
            name="receiver_message"
            className="rounded-sm p-3 bg-white border-b focus:outline-none"
            placeholder="Write a message (Optional, 100 characters)"
          />
          <button onClick={()=>navigate("/checkout")} className="border p-2 w-52 mx-auto shadow-md hover:shadow-pink-300">
            Buy Gift Card For {totalPrice}₹
          </button>
        </form>
      </div>
    </div>
  );
};

export default Buy_GiftCardMondal;
