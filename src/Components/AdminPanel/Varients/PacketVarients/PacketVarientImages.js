import React, { useEffect, useState } from "react";

const PacketVarientImages = ({ existingData,onclose ,submission}) => {
  const [imageFiles, setImageFiles] = useState([]);

  useEffect(()=>{

if(existingData.length > 0){
    setImageFiles(existingData)
}




  },[existingData])


  const handleImageUpload = (event) => {
    const uploadedFiles = event.target.files;

    setImageFiles((prevImages) => [...prevImages, ...uploadedFiles]);
  };

  const removeImage = (index) => {

    console.log(imageFiles);
    console.log(index);

    
    setImageFiles((prevImages) => prevImages.filter((_, i) => i !== index));

  };

  return (
    <div className="mb-2">
      <div
        className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50"
        onClick={onclose} // Close modal on clicking outside
      >
        <div
          className="bg-white p-6 rounded-lg w-2/4 max-h-screen overflow-y-auto"
          onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Image</h2>
          <div className="flex gap-4">

          <button
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              onClick={()=>submission(imageFiles)}
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
              Upload Images:
            </label>
            <input
              type="file"
              id="imageUpload"
              multiple
              onChange={handleImageUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          {imageFiles.length > 0 && (
            <div className="overflow-x-auto max-h-60 overflow-y-auto">
              <table className="table-auto border-collapse w-full text-left">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border px-4 py-2">Preview</th>
                    <th className="border px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {imageFiles.map((image, index) => (
                    <tr key={index}>
                      <td className="border px-4 py-2">
                        <img
                          src={ URL.createObjectURL(image)}
                          alt={`Uploaded ${index}`}
                          className="w-20 h-20 object-cover rounded"
                        />
                      </td>
                      <td className="border px-4 py-2">
                        <button
                          className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                          onClick={() => removeImage(index)}
                        >
                          Remove
                        </button>
                      </td>
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
