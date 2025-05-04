export const ImageDropdown = ({ images, onSelectImage }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [hoveredImage, setHoveredImage] = useState(null);
  
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full p-3 border rounded bg-gray-50 flex items-center justify-between"
        >
          <span className="text-gray-500">Select Image</span>
          <span className="ml-2 text-gray-500">▼</span>
        </button>
        {isOpen && (
          <ul className="absolute w-full mt-2 bg-white border rounded shadow-lg max-h-60 overflow-auto z-10">
            {images.map((img) => (
              <li
                key={img.id}
                className="relative flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  onSelectImage(img);
                  setIsOpen(false);
                }}
                onMouseEnter={() => setHoveredImage(img.image)}
                onMouseLeave={() => setHoveredImage(null)}
              >
                <img src={img.image_path} alt="Thumbnail" className="w-10 h-10 rounded mr-2" />
                <span>{img.FeaturedBanner_id}</span>
                {hoveredImage === img.image && (
                  <div className="absolute left-14 top-[-10px] z-20 p-1 bg-white border rounded shadow-lg">
                    <img src={img.image_path} alt="Hovered" className="w-32 h-32 rounded" />
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };


  