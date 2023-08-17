import React from 'react';

const Upload = ({ handleDragOver, handleDragEnter, handleDrop, handleFileUpload, fileInput }) => (
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
);

export default Upload;
