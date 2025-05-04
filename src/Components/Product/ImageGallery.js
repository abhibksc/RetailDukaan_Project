import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { GetVariantDetails } from "../CrudOperations/GetOperation";

const Container = styled.div`
  display: flex;
  gap: 20px;
`;

const ThumbnailList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100px; /* FIXED WIDTH ADDED */
  align-items: center;
`;


const Thumbnail = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border: 2px solid #ddd;
  cursor: pointer;
  transition: border-color 0.2s;

  &:hover {
    border-color: #00adb7;
  }
`;

const ImageWrapper = styled.div`
  display: flex;
  gap: 20px;
`;

const PreviewContainer = styled.div`
  position: relative;
  width: 300px;
  height: 300px;
  overflow: hidden;
  border: 2px solid #ddd;
  cursor: crosshair;
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const MagnifiedContainer = styled.div`
  width: 400px;
  height: 400px;
  overflow: hidden;
  display: ${({ show }) => (show ? "block" : "none")};
  position: relative;
`;

const MagnifiedImage = styled.img`
  width: 600px; /* High-resolution zoom */
  height: 600px;
  position: absolute;
  left: ${({ x }) => `calc(-${x}% + 200px)`};
  top: ${({ y }) => `calc(-${y}% + 200px)`};
`;

const ImageGallery = ({images , setImages,selectedImage ,setSelectedImage}) => {
  const location = useLocation();
  const [product, setProduct] = useState(location.state?.product || null);
  const [zoom, setZoom] = useState({ x: 50, y: 50, show: false });
  const previewRef = useRef(null);


  useEffect(() => {
    if (product?.images?.length) {
      setImages(product.images);
      setSelectedImage(product.images[0]);
    }
  }, [product]);

  const handleHover = (imagePath) => {
    setSelectedImage(imagePath);
  };

  const handleMouseMove = (e) => {
    const rect = previewRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setZoom({ x, y, show: true });
  };

  const handleMouseLeave = () => {
    setZoom({ x: 50, y: 50, show: false });
  };

  return (
    <Container>
      {/* Left side thumbnail list */}
      <ThumbnailList>
        {images.map((img, index) => {
          const imagePath = `https://retaildukan.wipenex.com/public/${img.image_path}`;
          return (
            <Thumbnail
              key={index}
              src={imagePath}
              onMouseEnter={() => handleHover(imagePath)}
            />
          );
        })}
      </ThumbnailList>

      {/* Main Image & Magnified Image */}
      <ImageWrapper>
        <PreviewContainer
          ref={previewRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {selectedImage && <PreviewImage src={selectedImage} />}
        </PreviewContainer>

        {/* Magnified Image (appears on the right, tracks cursor) */}
        <MagnifiedContainer show={zoom.show}>
          {selectedImage && (
            <MagnifiedImage
              src={selectedImage}
              x={zoom.x}
              y={zoom.y}
            />
          )}

          <div>
            fsdf
          </div>
        </MagnifiedContainer>
      </ImageWrapper>
    </Container>
  );
};

export default ImageGallery;
