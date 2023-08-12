import React, { useState, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';

const UploadComponent = (props) => {
    const fileInput = useRef(null);
    const [images, setImages] = useState([]);
    const [categories, setCategories] = useState({});
    const [isCategorized, setIsCategorized] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
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
    //  run inference function - runs the model on the images
    const runInference = async () => {
        setIsLoading(true);
        const model = await mobilenet.load();
        const categorizedImages = {};
      
        for (const image of images) {
          const imageElement = document.createElement('img');
          imageElement.src = image;
      
          const imageTensor = tf.browser.fromPixels(imageElement);
          const resized = tf.image.resizeBilinear(imageTensor, [224, 224]);
          const normalized = resized.div(tf.scalar(255));
      
          const predictions = await model.classify(normalized);
      
          // Assuming that the prediction class is in predictions[0].className
          const predictionClass = predictions[0].className;
      
          if (!categorizedImages[predictionClass]) {
            categorizedImages[predictionClass] = [];
          }
      
          categorizedImages[predictionClass].push(image);
        }
      
        setCategories(categorizedImages);
        setIsCategorized(true); // Categorization is complete
        setIsLoading(false);
      };
      <button onClick={runInference}>Categorize Images</button>
      
      return (
        <div>
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
          </div>
      
          {images.length > 0 && (
            <button
                onClick={runInference}
                style={{
                background: '#4CAF50',
                border: 'none',
                color: 'white',
                padding: '15px 32px',
                textAlign: 'center',
                textDecoration: 'none',
                display: 'inline-block',
                fontSize: '16px',
                margin: '4px 2px',
                cursor: 'pointer',
                borderRadius: '4px',
                }}
            >
                Categorize Images
            </button>
            )}
      
          {isLoading && <div>Loading, please wait...</div>};
          {isCategorized ? (
            Object.keys(categories).map((category) => (
              <div key={category}>
                <h2>{category}</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                  {categories[category].map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Preview ${index}`}
                      style={{ width: '100px', height: '100px', margin: '5px' }}
                    />
                  ))}
                </div>
              </div>
            ))
          ) : (
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
          )}
        </div>
      );
};

export default UploadComponent;
