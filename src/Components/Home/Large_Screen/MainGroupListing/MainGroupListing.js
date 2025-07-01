import { useEffect, useRef, useState } from "react";
import { getDesktopHomeManagementGroupInCustomerUI } from "../../../CrudOperations/GetOperation";
import useTruncateSentance from "../../../UseFullHooks/useTruncateSentance";
import LoadingModal from "../../../LoadingModal";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const MainGroupListing = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const { truncateText } = useTruncateSentance();
  const scrollRefs = useRef([]);
  const [isHovered, setIsHovered] = useState([]);
  const [currentIndexes, setCurrentIndexes] = useState([]);
  const navigate = useNavigate();

    const AreaPin = useSelector((state) => state.auth.AreaPin);

  const groupLists = useSelector(
    (state) => state.homeSlice_reducer.megaGroupCategoryListing
  );
  console.log(groupLists);
  


  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     categories.forEach((_, idx) => {
  //       if (!isHovered[idx]) {
  //         const container = scrollRefs.current[idx];
  //         if (container) {
  //           const scrollAmount = container.clientWidth;
  //           const atEnd =
  //             container.scrollLeft + scrollAmount >=
  //             container.scrollWidth - container.clientWidth / 2;

  //           container.scrollTo({
  //             left: atEnd ? 0 : container.scrollLeft + scrollAmount,
  //             behavior: "smooth",
  //           });

  //           setCurrentIndexes((prev) => {
  //             const copy = [...prev];
  //             copy[idx] = atEnd ? 0 : copy[idx] + 1;
  //             return copy;
  //           });
  //         }
  //       }
  //     });
  //   }, 8000);

  //   return () => clearInterval(interval);
  // }, [categories, isHovered]);

  const handleClick = (item, category) => {
    navigate(
      `/product/${category.GroupName}/${category.GroupId}/${item.cat_name}/${item.cat_id}/${AreaPin}`,
      {
        state: {
          type: "Category",
          title: item.cat_name,
          id: item.cat_id,
        },
      }
    );
  };

  const getDotsCount = (length) => Math.ceil(length / 5); // lg: 5 items per view

  if (loading) return <LoadingModal />;

  return (
<div className="bg-white py-6 px-4 sm:px-6 lg:px-8 rounded-xl border shadow-sm">
  {groupLists?.length > 0 &&
  groupLists?.some((category) => category.Categories?.length > 0) ? (
    groupLists
      ?.filter((category) => category.Categories?.length > 0)
      .map((category, index) => {
        return (
          <div key={index} className="mb-10">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {category.GroupName}
            </h2>

            <div className="relative">
              <div
                ref={(el) => (scrollRefs.current[index] = el)}
                className="flex overflow-x-auto space-x-4 scrollbar-hide scroll-smooth px-2"
              >
                {category.Categories.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    onClick={() => handleClick(item, category)}
                    className="cursor-pointer flex-shrink-0 min-w-[80%] sm:min-w-[40%] md:min-w-[25%] lg:min-w-[20%] xl:min-w-[16.66%] transition-transform hover:scale-[1.03]"
                  >
                    <div className="bg-white border rounded-xl shadow hover:shadow-md transition p-4 h-52 flex flex-col justify-center items-center space-y-2">
                      <img
                        src={item.cat_image}
                        alt={item.cat_name}
                        className="w-20 h-20 object-contain"
                      />
                      <h4 className="text-sm text-center font-medium text-gray-700 line-clamp-2">
                        {truncateText(item.cat_name, 40)}
                      </h4>
                    </div>
                  </div>
                ))}
              </div>

              {/* Dots */}
              {getDotsCount(category.Categories.length) > 1 && (
                <div className="flex justify-center mt-3 space-x-1">
                  {Array.from({
                    length: getDotsCount(category.Categories.length),
                  }).map((_, dotIndex) => (
                    <button
                      key={dotIndex}
                      type="button"
                      onClick={() => {
                        const container = scrollRefs.current[index];
                        if (container) {
                          container.scrollTo({
                            left: dotIndex * container.clientWidth,
                            behavior: "smooth",
                          });
                          setCurrentIndexes((prev) => {
                            const copy = [...prev];
                            copy[index] = dotIndex;
                            return copy;
                          });
                        }
                      }}
                      className={`w-3 h-3 rounded-full ${
                        currentIndexes[index] === dotIndex
                          ? "bg-gray-800"
                          : "bg-gray-300"
                      }`}
                      aria-label={`Go to slide ${dotIndex + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })
  ) : (
    <p className="text-center text-gray-500 py-10">
      No categories available.
    </p>
  )}
</div>

  );
};

export default MainGroupListing;
