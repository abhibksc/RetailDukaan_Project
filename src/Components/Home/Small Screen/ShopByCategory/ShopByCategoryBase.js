import React, { useEffect, useState } from "react";
import { Show_users_SubCategory } from "../../../CrudOperations/GetOperation";
import { toast } from "react-toastify";
import useWindowSize from "../../../useWindowSize";
import { Link } from "react-router-dom";

const ShopByCategoryBase = () => {
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const { width } = useWindowSize(); // Get the screen width

  const [pathName, setPathName] = useState(null);


  // Fetch subcategories
  useEffect(() => {

    const pathnamee = location.pathname;

    if(pathnamee === "/Categoy"){

           (pathnamee);
        

      setPathName(pathnamee)
    }
    




    const fetchSubCategories = async () => {
      try {
        const response = await Show_users_SubCategory();
        setSubCategories(response.data);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load categories");
        toast.error(error.response?.data?.message || "Failed to load categories");
      } finally {
        setLoading(false);
      }
    };
    fetchSubCategories();
  }, []);



    // useEffect(() => {
  
    //   // Matches any "/admin", "/superadmin", "/merchant", "/manager", followed by any subpath (e.g. "/login")
    //   const pathnamee = location.pathname;

    //   if(pathnamee === "/Categoy"){

    //     setPathName(pathnamee)
    //   }
      
  
  
  
  
  
  

   
  
  
  
  
  
    // }, [location.pathname]);




  if (loading) return <p className="text-center w-screen h-screen text-gray-600"> </p>;
  if (error) return <p className="text-center text-red-500 w-screen h-screen">{error}</p>;

  // Limit to first 12 items unless "View All" is clicked
  let displayedCategories =   showAll ? subCategories : subCategories.slice(0, 12)  ;

  if(pathName)   displayedCategories = subCategories;

  return (
    <div className={`rounded-lg text-black bg-gradient-to-l from-white to-green-300  ${pathName ? "p-5" : "p-5" }`} >
      <div className="">
        <h1 className="text-xl font-semibold mb-4">Shop By Category</h1>

        <div className="grid grid-cols-4  gap-4">
          {displayedCategories.map((subCategory) => (
            <div
              key={subCategory.id}
              className="bg-white  rounded-lg shadow-md text-center hover:shadow-lg transition"
              
            >
            <Link  to={`/grocery/${subCategory.name}`}
                  state={{
                    // Category_id: category.id,
                    // Category_name: category.name,

                    id: subCategory.id,
                    type: "SubCategory",
                    name: subCategory.name,
                  }}>


            <img
                src={subCategory.image_url || "https://via.placeholder.com/150"}
                alt={subCategory.name}
                className="w-full  object-contain mt-1 rounded-md mb-2"
              />
              <h3 className={`${width < 200 ? 'text-[6px]' : width < 400 ? 'text-[9px]' : width < 600 ? 'text-[12px]' : "text-[14px]"} font-semibold`}>
                {/* {subCategory.name} */}
              </h3>
            
            
            
            
            </Link>
            </div>
          ))}
        </div>

        {/* Show "View All" Button if more than 12 categories */}
        {subCategories.length > 12 && (
          <div className="mt-4 text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md transition"
            >
              {showAll ? "Show Less" : "View All Categories"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopByCategoryBase;
