import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useTruncateSentance from "../../../UseFullHooks/useTruncateSentance";
import LoadingModal from "../../../LoadingModal";

const SMainGroupListing = () => {
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

  useEffect(() => {
    const interval = setInterval(() => {
      groupLists.forEach((_, idx) => {
        if (!isHovered[idx]) {
          const container = scrollRefs.current[idx];
          if (container) {
            const scrollAmount = container.clientWidth;
            const atEnd =
              container.scrollLeft + scrollAmount >=
              container.scrollWidth - container.clientWidth / 2;

            container.scrollTo({
              left: atEnd ? 0 : container.scrollLeft + scrollAmount,
              behavior: "smooth",
            });

            setCurrentIndexes((prev) => {
              const copy = [...prev];
              copy[idx] = atEnd ? 0 : (copy[idx] || 0) + 1;
              return copy;
            });
          }
        }
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [groupLists, isHovered]);

  useEffect(() => {
    if (groupLists?.length) {
      setIsHovered(new Array(groupLists.length).fill(false));
      setCurrentIndexes(new Array(groupLists.length).fill(0));
    }
  }, [groupLists]);

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

  const getDotsCount = (length) => Math.ceil(length / 1.25);

  if (loading) return <LoadingModal />;

  return (
    <div className="bg-white py-4 px-3 rounded-lg">
      {groupLists?.length > 0 &&
      groupLists?.some((category) => category.Categories?.length > 0) ? (
        groupLists
          ?.filter((category) => category.Categories?.length > 0)
          .map((category, index) => (
            <div key={index} className="mb-10">
              <h2 className="text-lg font-semibold text-gray-800 mb-2 pl-1">
                {category.GroupName}
              </h2>

              <div className="relative">
                <div
                  ref={(el) => (scrollRefs.current[index] = el)}
                  className="flex overflow-x-auto space-x-4 scroll-smooth snap-x snap-mandatory scrollbar-hide px-1"
                  onMouseEnter={() => {
                    const copy = [...isHovered];
                    copy[index] = true;
                    setIsHovered(copy);
                  }}
                  onMouseLeave={() => {
                    const copy = [...isHovered];
                    copy[index] = false;
                    setIsHovered(copy);
                  }}
                >
                  {category.Categories.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      onClick={() => handleClick(item, category)}
                      className="cursor-pointer snap-start flex-shrink-0 w-[85%] rounded-xl bg-white border border-gray-200 shadow-md transition duration-300 hover:scale-[1.02]"
                    >
                      <div className="flex flex-col w-full">
                        <div className="w-full h-40 bg-gray-50 overflow-hidden rounded-t-xl">
                          <picture>
                            <source
                              media="(min-width: 1024px)"
                              srcSet={item.cat_image.replace(
                                "/image/",
                                "/images/lg/"
                              )}
                            />
                            <source
                              media="(min-width: 640px)"
                              srcSet={item.cat_image.replace(
                                "/image/",
                                "/images/md/"
                              )}
                            />
                            <img
                              src={item.cat_image.replace(
                                "/image/",
                                "/images/sm/"
                              )}
                              alt={item.cat_name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </picture>
                        </div>
                        <div className="p-2 bg-gray-100 rounded-b-xl text-center">
                          <p className="text-sm font-medium text-gray-800 line-clamp-2">
                            {truncateText(item.cat_name, 45)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {getDotsCount(category.Categories.length) > 1 && (
                  <div className="flex justify-center mt-3 space-x-2">
                    {Array.from({
                      length: getDotsCount(category.Categories.length),
                    }).map((_, dotIndex) => (
                      <button
                        key={dotIndex}
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
                        className={`w-2.5 h-2.5 rounded-full ${
                          currentIndexes[index] === dotIndex
                            ? "bg-blue-600 scale-110"
                            : "bg-gray-300"
                        } transition-all duration-300`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
      ) : (
        <p className="text-center text-gray-500 py-10 text-sm">
          No categories available.
        </p>
      )}
    </div>
  );
};

export default SMainGroupListing;
