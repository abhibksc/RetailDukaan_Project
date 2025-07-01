import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const SGroupMegaMenu = () => {
  const groupLists = useSelector((state) => state.homeSlice_reducer?.megaGroups ?? []);
  const AreaPin = useSelector((state) => state.auth.AreaPin);
  const scrollRef = useRef(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const scrollStep = 200; // px per scroll
    const interval = setInterval(() => {
      const { scrollLeft, scrollWidth, clientWidth } = container;

      if (scrollLeft + clientWidth >= scrollWidth - 5) {
        // If reached end, scroll back to start
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        container.scrollBy({ left: scrollStep, behavior: "smooth" });
      }
    }, 5000); // every 5 sec

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white pt-16 shadow-md w-full">
      <div
        ref={scrollRef}
        className="overflow-x-auto whitespace-nowrap px-4 scroll-smooth no-scrollbar"
      >
        <ul className="flex justify-between mx-4 gap-6">
          {groupLists.map((group, index) => (
            <li key={ index} className="inline-block flex-shrink-0 py-2">
              <Link
                to={`/Groups/${group.GroupName}/${group.GroupId}/${AreaPin}`}
                state={{
                  groupname: group.GroupName,
                  groupid: group.GroupId,
                }}
                className="flex flex-col items-center hover:text-blue-600"
              >
                <img
                  className="w-16 h-16 mx-auto rounded-lg"
                  src={group.GroupImage}
                  alt={group.GroupName}
                />
                <span className="mt-2 text-black font-inter">{group.GroupName}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SGroupMegaMenu;
