import React from 'react';
import Slider from './Slider';

const ImageGrid = ({ images, showSlider, sliderIndex, setShowSlider, setSliderIndex }) => {
    return (
      <div>
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Preview ${index}`}
            style={{ width: '100px', height: '100px', margin: '5px' }}
            onClick={() => {
              setSliderIndex(index);
              setShowSlider(true);
            }}
          />
        ))}
        {showSlider && <Slider image={images[sliderIndex]} onClose={() => setShowSlider(false)} />}
      </div>
    );
  };

export default ImageGrid;
