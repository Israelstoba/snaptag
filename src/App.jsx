import { useState } from 'react';
import Gallery from './components/Gallery';
import SnapForm from './components/SnapForm';
import './styles/main.scss';

function App() {
  const [images, setImages] = useState([]);
  const [showSnapForm, setShowSnapForm] = useState(false);

  const handleSave = (imageData) => {
    setImages((prev) => [...prev, imageData]);
    setShowSnapForm(false);
  };
  return (
    <div className="app">
      <h1 className="title">📸 SnapTag</h1>

      <Gallery images={images} />

      {showSnapForm && (
        <SnapForm
          onSave={handleSave}
          onClose={() => setShowSnapForm(false)}
          existingTags={images.map((img) => img.tag)} // pass all current tags
        />
      )}

      {/* Floating button (only visible when SnapForm is hidden) */}
      {!showSnapForm && (
        <button className="fab" onClick={() => setShowSnapForm(true)}>
          +
        </button>
      )}
    </div>
  );
}

export default App;
