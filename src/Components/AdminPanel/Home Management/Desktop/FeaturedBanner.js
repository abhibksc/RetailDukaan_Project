// src/FeaturedBanner.js
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  uploadFeaturedBanner,
  uploadFeaturedBannerOfferIds,
  uploadMainBanner,
} from "../../../CrudOperations/PostOperation";
import {
  getActiveFeaturedZone,
  GetAllOffers,
  GetDesktopFeaturedBanners,
  GetDesktopFeaturedZoneImageResponse,
  GetDesktopMainBanners,
} from "../../../CrudOperations/GetOperation";
import {
  DeleteFeaturedBannerOffer,
} from "../../../CrudOperations/DeleteOperation";
import {
  ViewFeaturedImages,
  ViewFeaturedOffers,
} from "../HomeManagementModals";
import { FaUserPlus } from "react-icons/fa";
import { use } from "react";
import { useNavigate } from "react-router-dom";

const FeaturedBanner = () => {
  const [selectedallZones, setSelectedallZones] = useState("");
  const [selectedOfferIds, setSelectedOfferIds] = useState([]);
  const [selectedImageIds, setSelectedImageIds] = useState("");
  const [bannerImages, setBannerImages] = useState(null);
  const [uploadedBanners, setUploadedBanners] = useState([]);
  const [allZones, setAllZones] = useState([]);
    const [offerIds, setOfferIds] = useState([]);
  
  const [zoneImages, setZoneImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalImage, setModalImage] = useState("");
  const [modalOffer, setModalOffer] = useState(null);
  const [showOfferModal, setShowOfferModal] = useState(false);

  const [selectedImage, setSelectedImage] = useState(null); // Holds the selected image
  const [isOpen, setIsOpen] = useState(false); // Tracks dropdown state
  const [hoveredImage, setHoveredImage] = useState(null); // Tracks the currently hovered image



  const navigate = useNavigate();

  // Fetching offers and banners data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const ZoneResponse = await getActiveFeaturedZone();
        if (ZoneResponse?.data?.message === "Zone retrieved successfully.") {
          setAllZones(ZoneResponse.data.zone);
        } else {
          toast.error("Failed to retrieve offers.");
        }

        const bannersResponse = await GetDesktopFeaturedBanners();

        if (
          bannersResponse?.data?.message ===
          "Desktop featured banners retrieved successfully."
        ) {
          setUploadedBanners(bannersResponse.data.FeaturedBanner);
        }

        const FeaturedZoneImageResponse =
          await GetDesktopFeaturedZoneImageResponse();


          console.log(FeaturedZoneImageResponse);
          
        if (
          FeaturedZoneImageResponse?.data?.message ===
          "Zone Images retrieved successfully."
        ) {
          console.log(FeaturedZoneImageResponse);
          setZoneImages(FeaturedZoneImageResponse.data.Images);

          // I have these things in FeaturedZoneImageResponse :

          // FeaturedBanner_id;
          // created_at;
          // id;
          // image_path;



        }


     const offersResponse = await GetAllOffers();
        if (offersResponse?.data?.message === "All Offer retrieved successfully!") {
          setOfferIds(offersResponse.data.data);
        } else {
          toast.error("Failed to retrieve offers.");
        }



      } catch (error) {
        toast.error("Error fetching data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    console.log(file);

    setBannerImages(file);
  };

  const handleUpload =  async() => {




    if (!selectedallZones || !selectedImage || selectedOfferIds.length < 0) {
      toast.warn("Please select an offer and upload at least one image.");
      return;
    }
    setLoading(true);

    try {
      const newBanner = {
        featuredBannerId: selectedallZones,
        image: selectedImage,
        offerIds: selectedOfferIds,
      };

      console.log(newBanner);
      
      const response = await uploadFeaturedBannerOfferIds(newBanner);
      console.log(response);
      

      if (response?.message === "Offer IDs uploaded successfully!") {
        toast.success("Banner Updated successfully!");


        const bannersResponse = await GetDesktopFeaturedBanners();
        if (
          bannersResponse?.data?.message ===
          "Desktop featured banners retrieved successfully."
        ) {
          setUploadedBanners(bannersResponse.data.FeaturedBanner);
        }
      }
    } catch (error) {
      toast.error("Error uploading banner.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (imageId) => {
    console.log(imageId);

    setLoading(true);
    try {
      const response = await DeleteFeaturedBannerOffer(imageId);
      if (
        response?.data?.message === "getOfferData deleted successfully"
      ) {
        toast.success(" banner Offer deleted successfully!");
        const offersResponse = await getActiveFeaturedZone();
        const bannersResponse = await GetDesktopFeaturedBanners();

        if (offersResponse?.data?.message === "Zone retrieved successfully.") {
          setAllZones(offersResponse.data.zone);
        } else {
          toast.error("Failed to retrieve offers.");
        }

        if (
          bannersResponse?.data?.message ===
          "Desktop featured banners retrieved successfully."
        ) {
          setUploadedBanners(bannersResponse.data.FeaturedBanner);
        }
      }
    } catch (error) {
      toast.error("Error deleting banner.");
    } finally {
      setLoading(false);
    }
  };

  const openImageModal = (image) => {
    setModalImage(image);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleClickOfferDetails = (offer) => {
    setModalOffer(offer);
    setShowOfferModal(!showOfferModal);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-medium text-gray-800">
            Upload New Featured Banner
          </h2>
          <button
            onClick={() =>
              navigate(
                `/admin/${localStorage.getItem(
                  "Merchanttoken"
                )}/FeaturedOfferzone`
              )
            }
            className="bg-blue-600 text-white px-6 py-2 rounded-md flex items-center gap-2 transition-transform duration-200 hover:bg-blue-700 hover:scale-105 shadow-md"
          >
            Create Zone
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Select Zone
            </label>
            <select
              value={selectedallZones}
              onChange={(e) => setSelectedallZones(e.target.value)}
              className="w-full p-3 border rounded bg-gray-50"
            >
              <option value="" disabled>
                Select Zone
              </option>
              {allZones.map((offer) => (
                <option
                  key={offer.id}
                  value={offer.id}
                >
                  {offer.zone_name}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
      <label className="block text-gray-700 font-medium mb-2">Select Image</label>

      {/* Selected Image/Dropdown Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-3 border rounded bg-gray-50 flex items-center justify-between"
      >
        {selectedImage ? (
          <img
            src={selectedImage.image}
            alt="Selected"
            className="w-10 h-10 rounded"
          />
        ) : (
          <span className="text-gray-500">Select Zone</span>
        )}
        <span className="ml-2 text-gray-500">▼</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <ul className="absolute w-full mt-2 bg-white border rounded shadow-lg max-h-60 overflow-auto z-10">
          { zoneImages.filter((img) => img.bannerId == selectedallZones) 
          
          .map((img) => (
            <li
              key={img.FeaturedBannerId}
              className="relative flex items-center p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                // 
                setSelectedImage(img); // Set selected image
                setIsOpen(false); // Close dropdown
              }}
              onMouseEnter={() => setHoveredImage(img.image)} // Set hovered image
              onMouseLeave={() => setHoveredImage(null)} // Reset hovered image
            >
              {/* Small Thumbnail */}
              <img
                src={img.image}
                alt={`Offer ${img.FeaturedBannerId}`}
                className="w-10 h-10 rounded mr-2"
              />
              <span>{img.FeaturedBannerId}</span>

              {/* Enlarged Preview */}
              {hoveredImage === img.image && (
                <div className="absolute left-14 top-[-10px] z-20 p-1 bg-white border rounded shadow-lg">
                  <img
                    src={img.image}
                    alt={`Hovered Offer ${img.FeaturedBannerId}`}
                    className="w-32 h-32 rounded"
                  />
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>


    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            multiple
            value={selectedOfferIds}
            onChange={(e) =>
              setSelectedOfferIds(Array.from(e.target.selectedOptions, (option) => option.value))
            }
            className="p-2 border rounded bg-gray-50"
          >
            <option value="" disabled>
              Select Offer IDs
            </option>
            {offerIds.map((offer) => (
              <option key={offer.id} value={offer.id}>
                {offer.offerName}
              </option>
            ))}
          </select>
        </div>


          <div className="mt-6 flex justify-center">
            <button
              onClick={handleUpload}
              className="bg-gradient-to-r from-blue-500 to-teal-500 text-white py-3 px-6 rounded-lg hover:opacity-90"
            >
              Upload Banner
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 overflow-x-auto">
        <h2 className="text-xl font-medium text-gray-800 mb-4">
          Uploaded Banners
        </h2>
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                Zone
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                Banner Image
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                Device
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                Offers
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {uploadedBanners.length > 0 ? (
              uploadedBanners.map((banner) => (
                <tr key={banner.bannerId} className="border-b">
                  <td className="px-4 py-2 text-sm text-gray-800">
                    {banner.zone_name}
                  </td>
                  <td className="px-4 py-2">
                    <img
                      src={banner.image[0].ImageUrl}
                      alt="Banner"
                      className="w-24 h-16 object-cover rounded cursor-pointer"
                      onClick={() => openImageModal(banner.image)}
                    />
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-800">
                    {banner.device}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-800">
                    <FaUserPlus
                      className="w-6 h-6 cursor-pointer"
                      onClick={() => handleClickOfferDetails(banner.offers)}
                    />
                  </td>
                  <td className="px-4 py-2 text-sm">
                    <button
                      onClick={() => handleDelete(banner.bannerId)}
                      className="bg-red-500 text-white text-xs py-1 px-2 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="px-4 py-2 text-sm text-center text-gray-500"
                >
                  No banners uploaded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <ViewFeaturedImages closeModal={closeModal} modalImage={modalImage} />
      )}

      {showOfferModal && (
        <ViewFeaturedOffers
          closeModal={handleClickOfferDetails}
          modaloffers={modalOffer}
        />
      )}
    </div>
  );
};

export default FeaturedBanner;
