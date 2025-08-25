// src/components/GalleryItem.jsx
const GalleryItem = ({ attendee }) => {
  return (
    <div className="gallery-item">
      <img src={attendee.image} alt={attendee.id} />
      <p>{attendee.id}</p>
    </div>
  );
};

export default GalleryItem;
