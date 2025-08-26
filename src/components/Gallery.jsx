import GalleryItem from './GalleryItem';

const Gallery = ({ images }) => {
  return (
    <div className="gallery">
      {images.length === 0 ? (
        <p className="empty">No snaps yet. Tap + to add one!</p>
      ) : (
        images.map((img, index) => (
          <GalleryItem key={index} attendee={{ image: img.url, id: img.tag }} />
        ))
      )}
    </div>
  );
};

export default Gallery;
