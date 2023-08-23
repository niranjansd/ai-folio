
import React from 'react';
import Segment from './Segment';

// You can also add a hover effect
const handleButtonHover = (e) => {
    e.target.style.backgroundColor = '#0056b3'; // Darken the blue color on hover
    };

const handleZoom = () => {
    // Implement zoom logic here
  };
  
const handleSegment = () => {
    // Implement segmentation logic here
    console.log('Segmenting image...');
    Segment();
    };

const handleGrab = () => {
    // Implement grab logic here
    };

const Sidebar = () => (
    <div style={{
      position: 'absolute',
      right: 0,
      top: 0,
      width: '75px',
      height: '100%',
      backgroundColor: '#f5f5f5', // A neutral background color
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '10px', // Adds padding around the buttons
      boxShadow: '-2px 0 5px rgba(0,0,0,0.1)', // Adds a subtle shadow
    }}>
      <button style={buttonStyle}
              onClick={handleZoom} onMouseEnter={handleButtonHover}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#007bff'}>Zoom</button>
      <button style={buttonStyle}
              onClick={handleSegment} onMouseEnter={handleButtonHover}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#007bff'}>Segm</button>
      <button style={buttonStyle}
              onClick={handleGrab} onMouseEnter={handleButtonHover}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#007bff'}>Grab</button>
    </div>
  );

const buttonStyle = {
    backgroundColor: '#007bff', // A blue color for the buttons
    color: 'white', // White text
    border: 'none',
    padding: '10px 20px',
    margin: '10px 0',
    borderRadius: '5px', // Rounded corners
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '500', // Semi-bold text
    transition: 'background-color 0.3s', // Transition for hover effect
  };
 
export default Sidebar;