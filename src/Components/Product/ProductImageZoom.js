import React, { useState, useRef } from "react";

const ProductImageZoom = ({ images = [] }) => {
  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [showZoom, setShowZoom] = useState(false);
  const previewRef = useRef(null);

  const handleMouseMove = (e) => {
    const rect = previewRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  return (
    <div className="flex gap-4">
      {/* Thumbnail List */}
      <div className="flex flex-col gap-2">
        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            className={`w-16 h-16 object-cover border-2 rounded cursor-pointer ${
              selectedImage === img ? "border-blue-500" : "border-gray-300"
            }`}
            onClick={() => setSelectedImage(img)}
          />
        ))}
      </div>

      {/* Main Image + Zoom */}
      <div className="relative">
        <div
          ref={previewRef}
          className="w-96 h-96 border relative overflow-hidden"
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setShowZoom(true)}
          onMouseLeave={() => setShowZoom(false)}
        >
          <img
            src={selectedImage}
            className="w-full h-full object-cover"
            alt="Selected"
          />
        </div>

        {/* Zoomed View */}
        {showZoom && (
          <div className="absolute top-0 left-[430px] w-96 h-96 overflow-hidden border bg-white hidden md:block">
            <img
              src={selectedImage}
              alt="Zoomed"
              className="absolute w-[150%] h-[150%]"
              style={{
                left: `calc(-${zoomPosition.x}% + 192px)`,
                top: `calc(-${zoomPosition.y}% + 192px)`,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductImageZoom;
