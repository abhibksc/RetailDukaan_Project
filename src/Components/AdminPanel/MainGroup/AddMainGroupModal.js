import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Atom } from "react-loading-indicators";
import { StoreMainGroup } from "../../CrudOperations/PostOperation";
import { fetchParticular_grouid_data, GetwareHouses } from "../../CrudOperations/GetOperation";
import { UpdateMainGroup } from "../../CrudOperations/Update&Edit";

const AddMainGroupPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [desktopImage, setDesktopImage] = useState(null);
  const [viewImage, setViewImage] = useState(null);
  const [warehouseList, setWarehouseList] = useState([]);
  const [selectedWarehouses, setSelectedWarehouses] = useState([]);
  const [loading, setLoading] = useState(false);

  const [status, setStatus] = useState(1);



useEffect(() => {
  if (id) {
    const fetchGroup = async () => {
      try {
        const res = await fetchParticular_grouid_data(id);
        const group = res?.data?.data;
        const warehouse_ids = res?.data?.warehouse_ids;

        setName(group.name);
        setStatus(group.status);
        setSelectedWarehouses(warehouse_ids);

        // Preload image preview if you want to show existing image
        setViewImage(group.image_url);
        setDesktopImage(null); // Set to null unless user uploads new
      } catch (err) {
        toast.error("Failed to fetch group data");
      }
    };

    fetchGroup();
  }
}, [id]);




  useEffect(() => {
    GetwareHouses()
      .then((res) => setWarehouseList(res.data || []))
      .catch(() => toast.error("Failed to fetch warehouses"));
  }, []);

const handleImageChange = async (file) => {
  if (!file) return;

  try {
    await validateImage(file); // Validate type, size, and dimensions
    setDesktopImage(file);
    setViewImage(URL.createObjectURL(file));
  } catch (error) {
    toast.error(error);
    setDesktopImage(null);
    setViewImage(null);
  }
};


const handleSubmit = async (e) => {
  e.preventDefault();

  if (!name || (!desktopImage && !id) || selectedWarehouses.length === 0) {
    toast.error("Please fill all required fields.");
    return;
  }

  setLoading(true);

  try {
    let res;

    if (id) {
      // Update logic
      res = await UpdateMainGroup(id, name, desktopImage, status, selectedWarehouses);
    } else {
      // Create logic
      res = await StoreMainGroup(name, desktopImage, status, selectedWarehouses);
    }

    if (res?.data?.message?.includes("success")) {
      toast.success(res.data.message);
      navigate(-1);
    } else {
      toast.error(res?.data?.message || "Failed to save group");
    }
  } catch (err) {
    toast.error(err?.response?.data?.message || err?.response?.data?.error);
  } finally {
    setLoading(false);
  }
};


  const validateImage = (file) => {
    return new Promise((resolve, reject) => {
      if (!file) return reject("No file selected");

      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/gif",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        return reject("Only jpeg, png, jpg, gif, webp images are allowed");
      }

        if (file.size > 2 * 1024 * 1024) {
              return reject(`${file.name} is larger than 2MB.`);
      }

      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        if (img.width === 1000 && img.height === 1000) {
          resolve();
        } else {
          reject("Image must be exactly 1000 x 1000 pixels");
        }
      };

      img.onerror = () => reject("Invalid image file");
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <Atom color="#333" size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-center mb-6">
          {id ? "Update Group" : "Create Group"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Group Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter group name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Desktop Image
            </label>
<input
  type="file"
  accept="image/*"
  onChange={(e) => handleImageChange(e.target.files[0])}
  className="w-full text-sm"
  required={!id}
/>

           {viewImage && (
  <img
    src={viewImage}
    alt="Preview"
    className="h-24 w-24 mt-3 rounded border object-cover"
  />
)}

          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Warehouses
            </label>
            <select
              multiple
              value={selectedWarehouses}
              onChange={(e) =>
                setSelectedWarehouses(
                  Array.from(e.target.selectedOptions, (opt) => opt.value)
                )
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 h-32 focus:ring-2 focus:ring-blue-500 bg-white"
              required
            >
              {warehouseList.map((wh) => (
                <option key={wh.id} value={wh.id}>
                  {wh.warehouse_name}
                </option>
              ))}
            </select>
          </div>


          <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Status
  </label>
  <select
    value={status}
    onChange={(e) => setStatus(e.target.value)}
    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
    required
  >
    <option value="">Select status</option>
    <option value={1}>Active</option>
    <option value={0}>Inactive</option>
  </select>
</div>


          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
            >
              {id ? "Update Group" : "Create Group"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMainGroupPage;
