import React, { useState } from 'react';

const UploadComponent = (props) => {
  const [images, setImages] = useState([]);

  const handleFileUpload = (e) => {
    const files = e.target.files;
    const imageFiles = Array.from(files).filter((file) => file.type.startsWith('image/'));
    const imagePromises = imageFiles.map((imageFile) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve(event.target.result);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(imageFile);
      });
    });

    Promise.all(imagePromises).then((imagesArray) => {
      setImages(imagesArray);
    });
  };

  return (
    <div>
      <input type="file" multiple onChange={handleFileUpload} />
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Preview ${index}`}
            style={{ width: '100px', height: '100px', margin: '5px' }}
          />
        ))}
      </div>
    </div>
  );
};

export default UploadComponent;
