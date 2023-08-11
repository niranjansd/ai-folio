import React, { useState, useRef } from 'react';

const UploadComponent = (props) => {
    const fileInput = useRef(null);
    const [images, setImages] = useState([]);
    const handleDragOver = (e) => {
    e.preventDefault();
    };  
    const handleDragEnter = (e) => {
    e.preventDefault();
    };
    const handleDrop = (e) => {
    e.preventDefault();
    handleFileUpload({ target: { files: e.dataTransfer.files } });
    };

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
    <div
        style={{
        border: '2px dashed #aaa',
        padding: '10px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        }}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDrop={handleDrop}
    >
        <input type="file" multiple onChange={handleFileUpload} style={{ display: 'none' }} ref={fileInput} />
        <button onClick={() => fileInput.current.click()}>Select Images</button>
        <p>or drag and drop them here</p>
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
