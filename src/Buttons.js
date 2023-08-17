import React from 'react';

const CategorizeButton = ({ runInference, hasImages }) => (
  hasImages && (
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
  )
);

export default CategorizeButton;
