import { Link, useLocation } from "react-router-dom";

const NewFooterBar = () => {
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow z-50 flex justify-around items-center h-16">
      <Link
        to="/"
        className={`flex flex-col items-center text-sm ${
          location.pathname === "/" ? "text-blue-600" : "text-gray-600"
        }`}
      >
        <i className="fas fa-home text-xl"></i>
        <span className="text-xs">Home</span>
      </Link>

      <Link
        to="/search"
        className={`flex flex-col items-center text-sm ${
          location.pathname.includes("/search")
            ? "text-blue-600"
            : "text-gray-600"
        }`}
      >
        <i className="fas fa-search text-xl"></i>
        <span className="text-xs">Search</span>
      </Link>

      <Link
        to="/viewCart"
        className={`flex flex-col items-center text-sm ${
          location.pathname.includes("/viewCart")
            ? "text-blue-600"
            : "text-gray-600"
        }`}
      >
        <i className="fas fa-shopping-cart text-xl"></i>
        <span className="text-xs">Cart</span>
      </Link>

      <Link
        to="/Profile"
        className={`flex flex-col items-center text-sm ${
          location.pathname.includes("/Profile")
            ? "text-blue-600"
            : "text-gray-600"
        }`}
      >
        <i className="fas fa-user text-xl"></i>
        <span className="text-xs">Profile</span>
      </Link>
    </div>
  );
};

export default NewFooterBar;
