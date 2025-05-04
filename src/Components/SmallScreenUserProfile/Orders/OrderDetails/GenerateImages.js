// generateImages.js
import React, { useEffect, useRef } from 'react';
import { fabric } from 'fabric';

const GenerateImages = ({ images }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current);

    images.forEach((imgUrl, index) => {
      fabric.Image.fromURL(imgUrl, (img) => {
        img.set({ left: index * 100, top: 0 });
        canvas.add(img);
      });
    });

    return () => {
      canvas.dispose();
    };
  }, [images]);

  return <canvas ref={canvasRef} width={500} height={500} />;
};

export default GenerateImages;



