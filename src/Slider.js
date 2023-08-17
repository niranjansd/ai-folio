

const Slider = ({ image, onClose }) => (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      onClick={onClose}
    >
      <img
        src={image}
        alt="Slider Preview"
        style={{ maxWidth: '80%', maxHeight: '80%' }}
        onClick={(e) => e.stopPropagation()} // Prevent click event from reaching the background
      />
    </div>
  );
  
  export default Slider;
  


  