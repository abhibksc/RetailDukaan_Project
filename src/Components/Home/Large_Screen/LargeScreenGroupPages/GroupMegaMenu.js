import  {  useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const GroupMegaMenu = () => {
  const groupLists = useSelector((state) => state.homeSlice_reducer?.megaGroups ?? []);
  const AreaPin = useSelector((state) => state.auth.AreaPin);


  // Track window resizing
  // useEffect(() => {
  //   const handleResize = () => setWindowWidth(window.innerWidth);
  //   window.addEventListener("resize", handleResize);
  //   return () => window.removeEventListener("resize", handleResize);
  // }, []);




  return (
    <div className="bg-white pt-16  shadow-md flex-grow w-full  ">
      <ul className="lg:flex  justify-around mx-20">
        {groupLists?.map((group) => (
          <li
            key={group.GroupId}
            className="   z-10 group py-2"
          >
            <Link
              className="lg:inline-block text-white hover:text-gray-300 flex items-center"
              to={`/Groups/${group.GroupName}/${group.GroupId}/${AreaPin}`}
              state={{
                groupname: group.GroupName,
                groupid: group.GroupId,
              }}
            >
              <div className="text-center">
                <img
                  className="w-16 h-16 mx-auto hidden md:block"
                  src={group.GroupImage}
                  alt={group.GroupName}
                />
                <span className="flex flex-row gap-2 text-black hover:text-blue-600">
                  <span className="font-inter">{group.GroupName}</span>
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GroupMegaMenu;
