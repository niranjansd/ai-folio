import React from 'react';
import ImageGrid from './ImageGrid';

const Categories = ({ categories }) => (
// const Categories = ({ categories, showSlider, sliderIndex, setShowSlider, setSliderIndex }) => {
        <>
    {Object.keys(categories).map((category) => (
      <div key={category}>
        <h2>{category}</h2>
        <ImageGrid images={categories[category]} />
      </div>
    ))}
  </>
);

export default Categories;
