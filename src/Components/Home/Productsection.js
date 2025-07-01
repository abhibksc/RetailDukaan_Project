import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProductSection = () => {
  const navigate = useNavigate();

    const bannerData = useSelector(
    (state) => state.homeSlice_reducer.featuredBanner
  );
     (bannerData);

    // Function to handle image click
    const handleFeaturedBannerClick = async(ImageId) => {
      navigate(`/product/items`, { state: { ImageId: ImageId} });
    };

  return (
    <div className="">
      {bannerData.map((banner) => (
        <div key={banner.bannerId} className="grid w-full mx-auto gap-5 shadow-md rounded-md mb-5">
          <span className="text-center font-inter md:text-2xl rounded-md shadow-md font-bold p-2 mx-auto bg-gray-50">
           {banner.zone_name}
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mx-auto">
            {banner.images.map((img, imgIndex) => (
              <div key={imgIndex} className="flex justify-center" onClick={()=>handleFeaturedBannerClick(img.ImageId)}>
                <img
                  src={img.Imageurl}
                  alt={`Offer ${img.ImageId}`}
                  className="object-contain hover:shadow-lg hover:shadow-gray-400 cursor-pointer"
                  // style={{
                  //   width: img.width ? `${img.width}px` : 'auto',
                  //   height: img.height ? `${img.height}px` : 'auto',
                  //   maxWidth: '100%',
                  //   maxHeight: '100%',
                  // }}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductSection;
