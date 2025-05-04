import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ImportCustomerDetails } from "./CrudOperations/GetOperation";
import { ImportUserDeatils } from "./ReduxStore/Slices/auth";






const useImportUserDetails = () => {
  const dispatch = useDispatch();

  const importDetails = async (
  ) => {


    const login = localStorage.getItem("token");

    if (login) {


  
      const response = await ImportCustomerDetails(login);
      console.log(response);

      if(response && response.data.id){

              dispatch(ImportUserDeatils({

                






                Customer_userId : response.data.id,
          
                Unique_UserID : response.data.Unique_userId,
          
                email : response.data.email,
                name : response.data.name,
                phone : response.data.phone,
                userlogin: true,
                registered : true,
                login: false,
                mobile_login_pageActive : false




              }))





      }


      

        
    } else {
      toast.warn("Please login");
    }
  };


  return { importDetails };
};

export default useImportUserDetails;
