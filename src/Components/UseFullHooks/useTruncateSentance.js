import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";






const useTruncateSentance = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
   const reduxcartItems = useSelector((state) => state.cartReducer.cartItems);
  const filteredProducts = useSelector((state) => state.filteredProducts); // Update with the correct state path
  const Customer_userId = useSelector((state) => state.auth.Customer_userId);

  const truncateText = (text, maxWords) => {
    console.log(text);
    console.log(maxWords);
    
    const words = text.split(" ");
    return words.length > maxWords
      ? words.slice(0, maxWords).join(" ") + "..."
      : text;
  };


  return { truncateText };
};

export default useTruncateSentance;
