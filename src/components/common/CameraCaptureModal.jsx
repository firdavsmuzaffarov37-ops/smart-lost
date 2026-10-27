import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Camera,
  RotateCw,
  X,
  Check,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Upload,
  Image as ImageIcon,
  Smartphone,
} from 'lucide-react';

const SAMPLE_SNAPSHOTS = [
  {
    name: 'iPhone 15 Pro',
    url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'AirPods Pro',
    url: 'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Charm Hamyon',
    url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Avtomobil Kaliti',
    url: 'https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?auto=format&fit=crop&w=600&q=80',
  },
];

export default function CameraCaptureModal({ isOpen, onClose, onCapture }) {
  const { t, language } = useApp();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [facingMode, setFacingMode] = useState('environment'); // 'environment' | 'user'
  const [cameraError, setCameraError] = useState(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Start camera stream safely
  useEffect(() => {
    let activeStream = null;

    async function startCamera() {
      if (!isOpen) return;
      setIsLoading(true);
      setCameraError(null);
      setCapturedImage(null);
      setIsVideoPlaying(false);

      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('MediaDevices API not supported');
        }

        // Try with requested facingMode, fallback to generic video
        let mediaStream = null;
        try {
          mediaStream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: { ideal: facingMode },
              width: { ideal: 1280 },
              height: { ideal: 720 },
            },
            audio: false,
          });
        } catch (e) {
          // Fallback to simple video constraints (works universally on PCs/webcams)
          mediaStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
          });
        }

        activeStream = mediaStream;
        setStream(mediaStream);

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play()
              .then(() => setIsVideoPlaying(true))
              .catch((err) => console.warn('Video play warning:', err));
          };
        }
      } catch (err) {
        console.warn('Camera access unavailable:', err);
        setCameraError(
          language === 'uz'
            ? 'Kamera mavjud emas yoki ruxsat berilmadi. Suratni fayldan yuklashingiz yoki tayyor namunadan tanlashingiz mumkin.'
            : language === 'ru'
            ? 'Камера недоступна или нет разрешения. Вы можете загрузить фото из файла или выбрать образец.'
            : 'Camera unavailable or permission denied. You can upload an image or choose a sample.'
        );
      } finally {
        setIsLoading(false);
      }
    }

    if (isOpen) {
      startCamera();
    }

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOpen, facingMode]);

  // Clean up when closing
  const handleClose = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setCapturedImage(null);
    setCameraError(null);
    setIsVideoPlaying(false);
    onClose();
  };

  const handleFlipCamera = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  // Capture snapshot from live stream or fallback canvas
  const handleCaptureSnapshot = () => {
    if (!videoRef.current || !isVideoPlaying) {
      // If camera wasn't streaming, default to first sample item
      setCapturedImage(SAMPLE_SNAPSHOTS[0].url);
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current || document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedImage(dataUrl);

    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  // Handle file upload fallback
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCapturedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setIsVideoPlaying(false);
    setFacingMode((prev) => (prev === 'environment' ? 'environment' : 'user'));
  };

  const handleConfirmPhoto = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col text-white">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800/80 bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600/30 text-blue-400 flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                {language === 'uz' ? 'Kamera orqali rasmga olish' : t('camera.takeSnapshotTitle')}
              </h3>
              <p className="text-[11px] text-slate-400">
                {language === 'uz'
                  ? 'Kamerani buyumga to\'g\'rilang yoki tayyor surat yuklang'
                  : t('camera.takeSnapshotSubtitle')}
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder / Preview Body */}
        <div className="relative aspect-4/3 sm:aspect-16/10 w-full bg-slate-950 flex items-center justify-center overflow-hidden">
          {capturedImage ? (
            <div className="relative w-full h-full">
              <img
                src={capturedImage}
                alt="Captured snapshot"
                className="w-full h-full object-contain"
              />
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-emerald-500/90 text-white text-[11px] font-bold flex items-center gap-1 shadow-xs">
                <Check className="w-3.5 h-3.5" />
                <span>{language === 'uz' ? 'Surat tanlandi' : 'Photo Ready'}</span>
              </div>
            </div>
          ) : (
            <>
              {/* Live Video Element */}
              <video
                ref={videoRef}
                playsInline
                muted
                autoPlay
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                  isVideoPlaying ? 'opacity-100' : 'opacity-0'
                } ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
              />

              {/* Viewfinder Framing Overlay */}
              <div className="absolute inset-6 sm:inset-8 pointer-events-none border border-white/20 rounded-2xl flex flex-col justify-between p-3 z-10">
                <div className="flex justify-between">
                  <div className="w-4 h-4 border-t-2 border-l-2 border-blue-400 rounded-tl-sm" />
                  <div className="w-4 h-4 border-t-2 border-r-2 border-blue-400 rounded-tr-sm" />
                </div>
                <div className="flex justify-between">
                  <div className="w-4 h-4 border-b-2 border-l-2 border-blue-400 rounded-bl-sm" />
                  <div className="w-4 h-4 border-b-2 border-r-2 border-blue-400 rounded-br-sm" />
                </div>
              </div>

              {/* If camera is not streaming / black screen fallback */}
              {!isVideoPlaying && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-3 z-20 bg-slate-950/80 backdrop-blur-xs">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
                    <Camera className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-200">
                      {cameraError || (language === 'uz' ? 'Kamera ochilmoqda...' : 'Loading camera...')}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {language === 'uz'
                        ? 'Telefon / Kompyuteringizdan rasm tanlang yoki namunadan oling'
                        : 'Upload photo from device or choose a quick sample'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md shadow-blue-600/30 transition-all"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{language === 'uz' ? 'Fayldan rasm yuklash' : 'Upload Photo'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Flip camera button */}
              {isVideoPlaying && (
                <button
                  type="button"
                  onClick={handleFlipCamera}
                  title={t('camera.switchCamera')}
                  className="absolute top-3 right-3 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition-colors z-20 cursor-pointer"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
              )}
            </>
          )}

          {/* Hidden Canvas and File Input */}
          <canvas ref={canvasRef} className="hidden" />
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            capture="environment"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>

        {/* Quick Sample Snapshots Strip (Ideal for fast testing without blocking) */}
        {!capturedImage && (
          <div className="px-4 py-2.5 bg-slate-950/90 border-t border-slate-800/80">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                {language === 'uz' ? 'Tezkor namunaviy suratlar:' : 'Sample Item Snapshots:'}
              </span>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-[10px] font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
              >
                <Upload className="w-3 h-3" />
                {language === 'uz' ? 'Fayl tanlash' : 'Browse File'}
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {SAMPLE_SNAPSHOTS.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCapturedImage(sample.url)}
                  className="group relative p-1 rounded-xl border border-slate-800 hover:border-blue-500 bg-slate-900/60 hover:bg-slate-800/80 transition-all text-left cursor-pointer flex items-center gap-1.5"
                >
                  <img
                    src={sample.url}
                    alt={sample.name}
                    className="w-7 h-7 rounded-lg object-cover shrink-0"
                  />
                  <span className="text-[10px] text-slate-300 font-medium truncate group-hover:text-blue-300">
                    {sample.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Footer Action Controls */}
        <div className="p-4 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between gap-3">
          {capturedImage ? (
            <>
              <button
                type="button"
                onClick={handleRetake}
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>{language === 'uz' ? 'Qayta suratga olish' : t('camera.retakePhoto')}</span>
              </button>

              <button
                type="button"
                onClick={handleConfirmPhoto}
                className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold transition-all shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>{language === 'uz' ? 'Suratni ishlatish' : t('camera.usePhoto')}</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handleClose}
                className="py-2.5 px-4 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
              >
                {t('camera.cancel')}
              </button>

              {/* Shutter Button */}
              <button
                type="button"
                onClick={handleCaptureSnapshot}
                className="mx-auto w-14 h-14 rounded-full bg-white hover:bg-blue-50 p-1 flex items-center justify-center shadow-lg shadow-blue-500/30 transition-transform active:scale-95 cursor-pointer ring-4 ring-blue-500/20"
                aria-label={t('camera.capturePhoto')}
              >
                <div className="w-11 h-11 rounded-full border-2 border-slate-900 bg-blue-600 flex items-center justify-center text-white">
                  <Camera className="w-5 h-5" />
                </div>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                title="Fayldan rasm yuklash"
              >
                <Upload className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{language === 'uz' ? 'Fayl' : 'File'}</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
