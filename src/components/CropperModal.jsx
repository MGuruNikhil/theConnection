import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';

/**
 * Utility to get the cropped image as a Blob
 */
function getCroppedImg(imageSrc, crop, zoom, aspect = 1) {
  return new Promise((resolve, reject) => {
    const image = new window.Image();
    image.crossOrigin = 'anonymous';
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const size = Math.min(image.width, image.height);
      canvas.width = crop.width;
      canvas.height = crop.height;
      ctx.drawImage(
        image,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        crop.width,
        crop.height
      );
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Canvas is empty'));
          return;
        }
        resolve(blob);
      }, 'image/jpeg');
    };
    image.onerror = (err) => reject(err);
  });
}

/**
 * CropperModal
 * Props:
 * - image: string (URL or base64)
 * - onCancel: function
 * - onCropComplete: function(blob)
 */
const CropperModal = ({ image, onCancel, onCropComplete }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropChange = useCallback((c) => setCrop(c), []);
  const onZoomChange = useCallback((z) => setZoom(z), []);
  const onCropCompleteCb = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleDone = async () => {
    if (!croppedAreaPixels) return;
    const blob = await getCroppedImg(image, croppedAreaPixels, zoom);
    onCropComplete(blob);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-white rounded-lg shadow-lg p-4 relative w-[90vw] max-w-md">
        <div className="relative w-full h-64 bg-gray-100">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onCropComplete={onCropCompleteCb}
          />
        </div>
        <div className="flex justify-between mt-4">
          <button className="px-4 py-2 bg-gray-200 rounded" onClick={onCancel}>Cancel</button>
          <button className="px-4 py-2 bg-primary text-white rounded" onClick={handleDone}>Crop</button>
        </div>
      </div>
    </div>
  );
};

export default CropperModal;
