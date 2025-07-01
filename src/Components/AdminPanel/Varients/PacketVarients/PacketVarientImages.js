import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { EditPacketImage, UploadImage_to_packetVariant } from "../../../CrudOperations/Update&Edit";
import { useNavigate } from "react-router-dom";
import { DeletePacketImage } from "../../../CrudOperations/DeleteOperation";
import LoadingModal from "../../../LoadingModal";

const PacketVarientImages = ({ existingData = [], onclose, submission,Database_vaiantID }) => {
  const [imageFiles, setImageFiles] = useState([]);
  const [loading, setLoading] = useState(false);

console.log(Database_vaiantID);


  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    if (existingData.length > 0) {
      console.log(existingData);



      setImageFiles(existingData);
    }
    setLoading(false);
  }, [existingData]);

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
      const url = URL.createObjectURL(file);
      img.src = url;

      img.onload = () => {
        if (img.width === 1000 && img.height === 1000) {
          resolve(url);
        } else {
          URL.revokeObjectURL(url);
          reject(`${file.name} must be exactly 1000 x 1000 pixels.`);
        }
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(`${file.name} is not a valid image.`);
      };
    });
  };

  const handleImageChange = async(files) => {
    setLoading(true);

    if (!files || files.length === 0) return;


    files.forEach((file) => {
      validateImage(file)
        .then((url) => {
          console.log(imageFiles);
          console.log(url);
          console.log(file.name);

          


             if(Database_vaiantID.id){

                        console.log(file);
                        console.log(Database_vaiantID.id);


             const fun = async()=>{
                  setLoading(true);
             try{


                const response = await UploadImage_to_packetVariant( file, Database_vaiantID.id);

             if(response?.data?.message === "Image uploaded successfully!"){
              console.log(response);

              toast.success(response?.data?.message)


          //            setImageFiles((prev) => [
          //   ...prev,
          //   { url, name: file.name, file: file ?? null },
          // ]);


                            navigate(`/admin/${localStorage.getItem('Merchanttoken')}/packetVarient`)
              

             }
             else{

                            toast.error(response?.data?.message  || response?.data?.error)

             }


             }
             catch(error){

                 toast.error(error?.response?.data?.message  || error?.response?.data?.error)



             }
             finally{

                  setLoading(false);
             }
               


             }

             fun();



    }
    else{

          setImageFiles((prev) => [
            ...prev,
            { url, name: file.name, file: file ?? null },
          ]);


    }



        })
        .catch((err) => {
          toast.warn(err);
        });
    });
    setLoading(false);
  };

  const EditImage = async ({ type, id, files }) => {
    setLoading(true);

    console.log(files);
    

    if (!files || files.length === 0){
          setLoading(false);
return
    } ;




    files.forEach((file) => {
      validateImage(file)
        .then((url) => {
          console.log(imageFiles);
          console.log(url);
          console.log(file.name);



          
    console.log("type:", type);
    console.log("id:", id);
    console.log("file:", file);
    console.log("type match:", type === "EditOn_database");
    console.log("file instanceof File:", file instanceof File);

    if (type === "EditOn_database" && file instanceof File) {

          setLoading(true);
const fun = async()=>{

        try {
        const response = await EditPacketImage(file, id);
        console.log(response);

        if (response?.data?.message === "Image updated successfully!") {
          toast.success(response?.data?.message);
          navigate(
            `/admin/${localStorage.getItem("Merchanttoken")}/packetVarient`
          );
        }
      } catch (error) {
        console.log("Image update failed:", error);
        toast.success(
          error?.response?.data?.message || error?.response?.data?.error
        );
      }
      finally{

            setLoading(false);

      }



}
fun();
    } 
    
    
    else {
      console.log("ye chala");

      // Remove previous blob URL if any
      const toRemove = imageFiles[id];
      // toast.error(" toRemove worked line 102")
      console.log(toRemove);

      if (toRemove?.url?.startsWith("blob:")) {
        URL.revokeObjectURL(toRemove.url);
        setImageFiles((prev) => prev.filter((_, i) => i !== id));
      }

      // Add new preview file
      if (file instanceof File) {
        const url = URL.createObjectURL(file);
        setImageFiles((prev) => [...prev, { url, name: file.name, file }]);
      } else {
        toast.error("file not exist");
      }
    }




          





        })
        .catch((err) => {
          toast.warn(err);
        });
    });


    setLoading(false);
  };

  const removeImage = async ({ type, id }) => {
    setLoading(true);

    if (type === "EditOn_database") {
      try {
        const response = await DeletePacketImage(id);
        console.log(response);

        if (response?.data?.message === "Image deleted successfully!") {
          toast.success(response?.data?.message);
          navigate(
            `/admin/${localStorage.getItem("Merchanttoken")}/packetVarient`
          );
        }
      } catch (error) {
        toast.error(
          error?.response?.data?.message || error?.response?.data?.error
        );
        console.log("Image update failed:", error);
      }
    } else {
      const toRemove = imageFiles[id];
      if (toRemove?.url?.startsWith("blob:")) {
        URL.revokeObjectURL(toRemove.url);
      }
      setImageFiles((prev) => prev.filter((_, i) => i !== id));
    }

    setLoading(false);
  };

  if (loading) return <LoadingModal />;

  return (
    <div className="mb-2">
      <div
        className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50"
        onClick={onclose}
      >
        {console.log("fsdf")}
        <div
          className="bg-white p-6 rounded-lg w-2/4 max-h-screen overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-bold">Image Upload</h2>
              <h3 className="text-sm font-medium text-red-600 mt-1">
                * Image must be 1000×1000 pixels and &lt; 2MB
              </h3>
            </div>

            <div className="flex gap-4">
              <button
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                onClick={() => submission(imageFiles)}
              >
                Submit
              </button>

              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={onclose}
              >
                Close
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label
              className="block mb-2 text-gray-700 font-medium"
              htmlFor="imageUpload"
            >
              {/* Upload Images: */}
            </label>
            <input
              type="file"
              id="imageUpload"
              multiple
              onChange={(e) => handleImageChange(Array.from(e.target.files))}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          {console.log(imageFiles)}

          {imageFiles.length > 0 && (
            <div className="overflow-x-auto max-h-60 overflow-y-auto">
              <table className="table-auto border-collapse w-full text-left">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border px-4 py-2">Preview</th>
                    <th className="border px-4 py-2">Edit</th>
                    <th className="border px-4 py-2">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {imageFiles.map((image, index) => (
                    <tr key={index}>
                      <td className="border px-4 py-2">
                        <img
                          src={image.url}
                          alt={`Uploaded ${index}`}
                          className="w-20 h-20 object-cover rounded"
                        />
                      </td>

                      {image.db_id ? (
                        <td className="border px-4 py-2">
                          <input
                            type="file"
                            className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                            onChange={(e) =>
                              EditImage({
                                type: "EditOn_database",
                                id: image.db_id,
                                files: Array.from(e.target.files),
                              })
                            }
                          />
                        </td>
                      ) : (
                        <td className="border px-4 py-2">
                          <input
                            type="file"
                            className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                            onChange={(e) =>
                              EditImage({
                                type: "EditOn_Local",
                                id: index,
                                files: Array.from(e.target.files),
                              })
                            }
                          />
                        </td>
                      )}
                      {image.db_id ? (
                        <td className="border px-4 py-2">
                          <button
                            className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                            onClick={() =>
                              removeImage({
                                type: "EditOn_database",
                                id: image.db_id,
                              })
                            }
                          >
                            Remove
                          </button>
                        </td>
                      ) : (
                        <td className="border px-4 py-2">
                          <button
                            className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                            onClick={() =>
                              removeImage({
                                type: "EditOn_Local",
                                id: index,
                              })
                            }
                          >
                            Remove
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PacketVarientImages;
