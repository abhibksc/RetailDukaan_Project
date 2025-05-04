import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { GetOfferZone } from "../../../CrudOperations/GetOperation";
import { CreteOfferZone } from "../../../CrudOperations/PostOperation";
import { DeleteFeaturedBanner } from "../../../CrudOperations/DeleteOperation";

const FeaturedBannerZone = () => {
  const [loading, setLoading] = useState(false);
  const [zoneName, setZoneName] = useState("");
  const [Status, setStatus] = useState("");
  const [Device, setDevice] = useState("");
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadedZones, setUploadedZones] = useState([]);

  // Fetch initial data (zones)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const bannersResponse = await GetOfferZone();
        if (bannersResponse?.data?.message === "Zone retrieved successfully.") {
          setUploadedZones(bannersResponse.data.offerZone);
        }
      } catch (error) {
        toast.error("Error fetching data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!zoneName || !Device || uploadedImages.length === 0 || !Status) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      const formData = { zoneName, Device, uploadedImages, Status };
      const response = await CreteOfferZone({ formDataa: formData });
      if (response?.data?.message === "Zone Created successfully!") {
        toast.success("Zone created successfully!");
        const updatedZones = await GetOfferZone();
        if (updatedZones?.data?.message === "Zone retrieved successfully.") {
          setUploadedZones(updatedZones.data.offerZone);
          setZoneName("");
          setDevice("");
          setUploadedImages([]);
          
          setStatus("");
        }
      } else {
        toast.error("Failed to create zone.");
      }
    } catch (error) {
      toast.error("Error submitting data.");
    } finally {
      setLoading(false);
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setUploadedImages(files);
  };

  const handleDelete = async (bannerId) => {
    setLoading(true);
    try {
      const response = await DeleteFeaturedBanner(bannerId);
      if (response?.data?.message === "FeaturedBanner deleted successfully") {
        toast.success("Featured banner deleted successfully!");
        const bannersResponse = await GetOfferZone();
        if (bannersResponse?.data?.message === "Zone retrieved successfully.") {
          setUploadedZones(bannersResponse.data.offerZone);
        }
      }
    } catch (error) {
      toast.error("Error deleting banner.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow-md">
      {loading && (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        </div>
      )}

      {/* Form Section */}
      <h1 className="text-2xl font-bold mb-2">Create Zone</h1>
      <form className="grid grid-cols-4 gap-5 border-b-2 p-2 pb-5" onSubmit={handleSubmit}>
        <div className="mb-2">
          <label className="block text-gray-700">Zone Name</label>
          <input
            value={zoneName}
            onChange={(e) => setZoneName(e.target.value)}
            type="text"
            placeholder="Enter zone name"
            className="border border-gray-300 p-1 w-full rounded-md"
          />
        </div>
        <div className="mb-2">
          <label className="block text-gray-700">Upload Images</label>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="w-full p-3 border rounded bg-gray-50 text-gray-800"
          />
        </div>
        <div className="mb-2">
          <label className="block text-gray-700">Status</label>
          <select
            value={Status}
            onChange={(e) => setStatus(e.target.value)}
            className="border border-gray-300 p-2 w-full rounded-md"
          >
            <option value="">Select</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        <div className="mb-2">
          <label className="block text-gray-700">Device</label>
          <select
            value={Device}
            onChange={(e) => setDevice(e.target.value)}
            className="border border-gray-300 p-2 w-full rounded-md"
          >
            <option value="">Select Device</option>
            <option value="Desktop">Desktop</option>
            <option value="Mobile">Mobile</option>
          </select>
        </div>
        <div>
          <button type="submit" className="bg-blue-600 text-white py-2 px-4 mt-6 rounded">
            Submit
          </button>
        </div>
      </form>

      {/* Table Section */}
      <h2 className="text-xl font-bold mt-4">Uploaded Zones</h2>
      <table className="table-auto w-full mt-4 border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">Zone Name</th>
            <th className="border border-gray-300 px-4 py-2">Images</th>
            <th className="border border-gray-300 px-4 py-2">Device</th>
            <th className="border border-gray-300 px-4 py-2">Status</th>
            <th className="border border-gray-300 px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {uploadedZones.map((zone) => (
            <tr key={zone.bannerId} className="text-center">
              <td className="border border-gray-300 px-4 py-2">{zone.zone_name}</td>
              <td className="border border-gray-300 px-4 py-2">{zone.zone_name}</td>
              <td className="border border-gray-300 px-4 py-2">{zone.device}</td>
              <td className="border border-gray-300 px-4 py-2">{zone.status}</td>
              <td className="px-4 py-2 text-sm">
                <button
                  onClick={() => handleDelete(zone.bannerId)}
                  className="bg-red-500 text-white text-xs py-1 px-2 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FeaturedBannerZone;
