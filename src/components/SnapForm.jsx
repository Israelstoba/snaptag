import { useRef, useState, useEffect } from 'react';
import './_snapform.scss';

const SnapForm = ({ onSave, onClose, existingTags = [] }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const inputRef = useRef(null);
  const [captured, setCaptured] = useState(null);
  const [tag, setTag] = useState('');
  const [error, setError] = useState('');
  const [stream, setStream] = useState(null);
  const [facingMode, setFacingMode] = useState('environment'); // rear cam default

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [facingMode]);

  const startCamera = async () => {
    try {
      stopCamera();
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
      });
      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
    } catch (err) {
      console.error('Camera error:', err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
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

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  return (
    <div className="snapform">
      {!captured ? (
        <div className="camera-container">
          <div className="video-wrapper">
            <video ref={videoRef} autoPlay playsInline />
            <button onClick={toggleCamera} className="switch-btn">
              🔄
            </button>
          </div>
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
                ref={inputRef}
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
