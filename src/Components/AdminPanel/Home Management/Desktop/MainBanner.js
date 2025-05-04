import React, { useEffect, useState } from "react";
import { GetAllOffers, GetDesktopMainBanners } from "../../../CrudOperations/GetOperation";
import { toast } from "react-toastify";
import { uploadMainBanner } from "../../../CrudOperations/PostOperation";
import LoadingModal from "../../../LoadingModal";
import { DeleteBanner } from "../../../CrudOperations/DeleteOperation";

const MainBanner = () => {
  const [selectedOfferIds, setSelectedOfferIds] = useState([]);
  const [bannerImage, setBannerImage] = useState(null);
  const [uploadedBanners, setUploadedBanners] = useState([]);
  const [offerIds, setOfferIds] = useState([]);
  const [fileInputKey, setFileInputKey] = useState(Date.now());
  const [status, setStatus] = useState("Active");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const offersResponse = await GetAllOffers();
        const bannersResponse = await GetDesktopMainBanners();
        if (offersResponse?.data?.message === "All Offer retrieved successfully!") {
          setOfferIds(
            offersResponse?.data?.data.filter(
              (offer) =>
                offer.Status === "Active" &&
                new Date(offer.endDate) > new Date()
            )
          );
          
        } else {
          toast.error("Failed to retrieve offers.");
        }

        if (bannersResponse?.data?.message === "Desktop main banners retrieved successfully.") {
          setUploadedBanners(bannersResponse.data.MainBanner);
        }
        setLoading(true);
      } catch (error) {
        setLoading(true);
        toast.error("Error fetching data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const img = new Image();
      img.onload = () => {
        if (img.width === 1920 && img.height === 500) {
          setBannerImage(file);
        } else {
          toast.warn("Image dimensions must be 1920x500.");
          setFileInputKey(Date.now());
        }
      };
      img.src = URL.createObjectURL(file);
    }
  };

  const handleUpload = async () => {
    setLoading(true);
    if (!selectedOfferIds.length || !bannerImage) {
      toast.warn("Please select an offer and upload an image.");
      return;
    }

    try {
      const newBanner = {
        device: "Desktop",
        offerIds: selectedOfferIds,
        image: bannerImage,
        status,
      };

      const response = await uploadMainBanner(newBanner);
      console.log(response);
      
      if (response.message === "Banner uploaded successfully!") {
        console.log(response);
        const offersResponse = await GetAllOffers();
        const bannersResponse = await GetDesktopMainBanners();
        if (offersResponse?.data?.message === "All Offer retrieved successfully!") {
          setOfferIds(offersResponse.data.data);
        } else {
          toast.error("Failed to retrieve offers.");
        }

        if (bannersResponse?.data?.message === "Desktop main banners retrieved successfully.") {
          setUploadedBanners(bannersResponse.data.MainBanner);
        }

        setLoading(false);
      }
    } catch (error) {
      toast.error("Error uploading banner.");
      setLoading(false);

    }
    setLoading(false);

  };

  const handleDelete = async (bannerId) => {
    setLoading(true);
    try {
      const response = await DeleteBanner(bannerId);
      if (response.data.message === "MainBanner deleted successfully") {
        const offersResponse = await GetAllOffers();
        const bannersResponse = await GetDesktopMainBanners();
        if (offersResponse?.data?.message === "All Offer retrieved successfully!") {
          setOfferIds(offersResponse.data.data);
        } else {
          toast.error("Failed to retrieve offers.");
        }

        if (bannersResponse?.data?.message === "Desktop main banners retrieved successfully.") {
          setUploadedBanners(bannersResponse.data.MainBanner);
        }

        setLoading(false);
        toast.success("Banner deleted successfully!");
      }
    } catch (error) {
      setLoading(false);
      toast.error("Error deleting banner.");
    }
  };

  if (loading) return <LoadingModal />;

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow">
      <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">Manage Main Banners</h1>

      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-lg font-medium text-gray-700 mb-4">Add New Banner</h2>
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
          <input
            key={fileInputKey}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="p-2 border rounded bg-gray-50"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="p-2 border rounded bg-gray-50"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <button
            onClick={handleUpload}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Upload Banner
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-medium text-gray-700 mb-4">Uploaded Banners</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {uploadedBanners.length > 0 ? (
            uploadedBanners.map((banner , index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow relative">
                <img
                  src={banner.image}
                  alt="Banner"
                  className="w-full h-40 object-cover rounded-lg mb-2"
                />
                <button
                  onClick={() => handleDelete(banner.bannerId)}
                  className="absolute top-2 right-2 bg-red-500 text-white text-xs py-1 px-2 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No banners uploaded yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainBanner;
