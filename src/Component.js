import React, { useState, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import Upload from './Upload';
import Buttons from './Buttons';
import Animations from './Animations';
import ImageGrid from './ImageGrid';
import Categories from './Categories';
import Slider from './Slider';


const Component = (props) => {
    const fileInput = useRef(null);
    const [images, setImages] = useState([]);
    const [showSlider, setShowSlider] = useState(false);
    const [sliderIndex, setSliderIndex] = useState(0);
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

    return (
        <div>
            <Upload
                handleDragOver={handleDragOver}
                handleDragEnter={handleDragEnter}
                handleDrop={handleDrop}
                handleFileUpload={handleFileUpload}
                fileInput={fileInput}
            />
            <Buttons runInference={runInference} hasImages={images.length > 0} />
            {isLoading && <Animations />}
            {isCategorized ? <Categories categories={categories} /> :
                <ImageGrid  images={images}
                            showSlider={showSlider}
                            sliderIndex={sliderIndex}
                            setShowSlider={setShowSlider}
                            setSliderIndex={setSliderIndex} />}
            </div>
    );
};

export default Component;
