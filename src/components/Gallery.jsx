const Gallery = ({ images }) => {
  return (
    <div className="gallery">
      {images.length === 0 ? (
        <p className="empty">No snaps yet. Tap + to add one!</p>
      ) : (
        images.map((img, index) => (
          <div className="gallery-item" key={index}>
            <img src={img.url} alt={img.tag} />
            <p>{img.tag}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default Gallery;
