import { useDispatch, useSelector } from "react-redux";






const useTruncateSentance = () => {

  const truncateText = (text, maxWords) => {
    
    const words = text?.split(" ");
    return words?.length > maxWords
      ? words?.slice(0, maxWords)?.join(" ") + "..."
      : text;
  };


  return { truncateText };
};

export default useTruncateSentance;
