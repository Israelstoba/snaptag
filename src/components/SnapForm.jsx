import { useRef, useState, useEffect } from 'react';
import './_snapform.scss';

const SnapForm = ({ onSave, onClose, existingTags = [] }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const inputRef = useRef(null); // 👈 ref for tag input
  const [captured, setCaptured] = useState(null);
  const [tag, setTag] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => console.error('Camera error:', err));
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const takeShot = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    setCaptured(canvas.toDataURL('image/png'));
    stopCamera();

    // 👇 wait for render, then auto-focus input
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleSave = () => {
    if (!captured || !tag.trim()) {
      setError('Please capture an image and provide a tag.');
      return;
    }

    const duplicate = existingTags.some(
      (t) => t.toLowerCase() === tag.trim().toLowerCase()
    );
    if (duplicate) {
      setError(
        `❌ The tag "${tag}" already exists. Please choose another one.`
      );
      return;
    }

    onSave({ url: captured, tag: tag.trim() });

    setCaptured(null);
    setTag('');
    setError('');
    onClose();
  };

  const handleRetake = () => {
    setCaptured(null);
    setTag('');
    setError('');
    startCamera();
  };

  return (
    <div className="snapform">
      {!captured ? (
        <div className="camera-container">
          <video ref={videoRef} autoPlay playsInline />
          <button onClick={takeShot} className="capture-btn">
            Capture
          </button>
        </div>
      ) : (
        <div className="tag-popup">
          <div className="image-wrapper">
            <img src={captured} alt="preview" />
            <div className="tag-input-container">
              <input
                ref={inputRef} // 👈 attach ref here
                type="text"
                placeholder=" "
                value={tag}
                onChange={(e) => {
                  setTag(e.target.value);
                  setError('');
                }}
                required
              />
              <label>Enter Attendee ID...</label>
            </div>
          </div>

          {error && <p className="error">{error}</p>}

          <div className="actions">
            <button className="btn save" onClick={handleSave}>
              Save
            </button>
            <button className="btn cancel" onClick={handleRetake}>
              Retake
            </button>
          </div>
        </div>
      )}
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
      <button
        className="close-btn"
        onClick={() => {
          stopCamera();
          onClose();
        }}
      >
        ✖
      </button>
    </div>
  );
};

export default SnapForm;
