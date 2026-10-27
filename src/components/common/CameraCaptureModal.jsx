import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  Smartphone,
  Eye,
  Loader2,
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
  const nativeCameraInputRef = useRef(null);

  // Check if mobile or desktop to choose initial camera
  const isMobile = typeof window !== 'undefined' && (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    window.innerWidth < 768
  );

  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [facingMode, setFacingMode] = useState(isMobile ? 'environment' : 'user');
  const [cameraError, setCameraError] = useState(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Safe stream stop helper
  const stopCurrentStream = useCallback((streamToStop) => {
    if (streamToStop) {
      streamToStop.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch (e) {
          // ignore
        }
      });
    }
  }, []);

  // Start live camera stream
  const startCamera = useCallback(async () => {
    if (!isOpen) return;
    setIsLoading(true);
    setCameraError(null);
    setCapturedImage(null);
    setIsVideoPlaying(false);

    if (stream) {
      stopCurrentStream(stream);
      setStream(null);
    }

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('MediaDevices API not supported');
      }

      let mediaStream = null;

      // 1. Try with preferred facingMode
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: facingMode },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });
      } catch (err1) {
        console.warn('Ideal facingMode failed, falling back to basic video:', err1);
        // 2. Fallback to any available video (universal for PCs/laptops)
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
      }

      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        try {
          await videoRef.current.play();
          setIsVideoPlaying(true);
        } catch (playErr) {
          console.warn('Auto-play promise was interrupted:', playErr);
          setIsVideoPlaying(true);
        }
      }
    } catch (err) {
      console.warn('Camera access unavailable:', err);
      setCameraError(
        language === 'uz'
          ? 'Kamera ruxsati berilmadi yoki qurilmada veb-kamera topilmadi. Brauzerda kamera ruxsatini yoqing yoki quyidan telefon kamerasini oching.'
          : language === 'ru'
          ? 'Доступ к камере не предоставлен или камера не найдена. Включите разрешение или откройте камеру телефона.'
          : 'Camera permission denied or camera not found. Please enable camera access or open your device camera.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [isOpen, facingMode, language, stopCurrentStream]);

  // Trigger camera startup when modal opens or facingMode flips
  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      if (stream) {
        stopCurrentStream(stream);
        setStream(null);
      }
      setCapturedImage(null);
      setCameraError(null);
      setIsVideoPlaying(false);
    }

    return () => {
      if (stream) {
        stopCurrentStream(stream);
      }
    };
  }, [isOpen, facingMode]);

  // Clean up and close modal
  const handleClose = () => {
    if (stream) {
      stopCurrentStream(stream);
      setStream(null);
    }
    setCapturedImage(null);
    setCameraError(null);
    setIsVideoPlaying(false);
    onClose();
  };

  // Switch between front and back camera
  const handleFlipCamera = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  // Real capture snapshot from live video stream
  const handleCaptureSnapshot = () => {
    const video = videoRef.current;
    if (!video) {
      // If no video ref exists, fallback to first sample
      setCapturedImage(SAMPLE_SNAPSHOTS[0].url);
      return;
    }

    try {
      const canvas = canvasRef.current || document.createElement('canvas');
      const w = video.videoWidth || 1280;
      const h = video.videoHeight || 720;
      canvas.width = w;
      canvas.height = h;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        if (facingMode === 'user') {
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
        }
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
        setCapturedImage(dataUrl);

        if (stream) {
          stopCurrentStream(stream);
          setStream(null);
        }
        return;
      }
    } catch (err) {
      console.warn('Canvas snapshot error:', err);
    }

    // Fallback if canvas draw fails
    setCapturedImage(SAMPLE_SNAPSHOTS[0].url);
  };

  // File picker handler (gallery or native camera)
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCapturedImage(reader.result);
        if (stream) {
          stopCurrentStream(stream);
          setStream(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    startCamera();
  };

  const handleConfirmPhoto = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[92vh] bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col text-white">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 border-b border-slate-800/80 bg-slate-900">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-blue-600/30 text-blue-400 flex items-center justify-center shrink-0">
              <Camera className="w-4 h-4" />
            </div>
            <div className="truncate">
              <h3 className="text-xs sm:text-sm font-bold text-white tracking-tight truncate">
                {language === 'uz' ? 'Jonli kamera orqali suratga olish' : t('camera.takeSnapshotTitle')}
              </h3>
              <p className="text-[11px] text-slate-400 truncate">
                {language === 'uz'
                  ? 'Kamerani buyumga qarating va suratga olish tugmasini bosing'
                  : t('camera.takeSnapshotSubtitle')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {!capturedImage && (
              <button
                type="button"
                onClick={handleFlipCamera}
                title="Kamerani almashtirish (Old / Orqa)"
                className="p-1.5 sm:p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-[11px]"
              >
                <RotateCw className="w-4 h-4 text-blue-400" />
                <span className="hidden sm:inline font-medium">
                  {facingMode === 'user' ? 'Old kamera' : 'Orqa kamera'}
                </span>
              </button>
            )}

            <button
              onClick={handleClose}
              className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Yopish"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Viewfinder / Preview Body */}
        <div className="relative aspect-4/3 sm:aspect-16/10 w-full bg-black flex items-center justify-center overflow-hidden">
          {capturedImage ? (
            <div className="relative w-full h-full flex items-center justify-center bg-slate-950">
              <img
                src={capturedImage}
                alt="Captured snapshot"
                className="w-full h-full object-contain"
              />
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md">
                <Check className="w-3.5 h-3.5" />
                <span>{language === 'uz' ? 'Surat tayyor' : 'Photo Ready'}</span>
              </div>
            </div>
          ) : (
            <>
              {/* Real Live Video Feed - Always rendered visibly */}
              <video
                ref={videoRef}
                playsInline
                muted
                autoPlay
                onLoadedMetadata={() => {
                  videoRef.current?.play().catch(() => {});
                  setIsVideoPlaying(true);
                }}
                onPlay={() => setIsVideoPlaying(true)}
                onPlaying={() => setIsVideoPlaying(true)}
                className={`w-full h-full object-cover transition-opacity duration-200 ${
                  facingMode === 'user' ? 'scale-x-[-1]' : ''
                }`}
              />

              {/* Viewfinder Framing Overlay */}
              <div className="absolute inset-5 sm:inset-7 pointer-events-none border border-white/25 rounded-2xl flex flex-col justify-between p-3 z-10">
                <div className="flex justify-between">
                  <div className="w-5 h-5 border-t-2 border-l-2 border-blue-400 rounded-tl-sm" />
                  <div className="w-5 h-5 border-t-2 border-r-2 border-blue-400 rounded-tr-sm" />
                </div>
                <div className="flex justify-center">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-white/60 bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-full">
                    {facingMode === 'user' ? 'Webcam / Selfie' : 'Orqa kamera'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <div className="w-5 h-5 border-b-2 border-l-2 border-blue-400 rounded-bl-sm" />
                  <div className="w-5 h-5 border-b-2 border-r-2 border-blue-400 rounded-br-sm" />
                </div>
              </div>

              {/* Small Initializing Indicator (Doesn't block video) */}
              {isLoading && !cameraError && (
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-[11px] font-semibold text-blue-300 flex items-center gap-1.5 z-20 shadow-xs border border-blue-500/30">
                  <Loader2 className="w-3 h-3 animate-spin text-blue-400" />
                  <span>Kamera ulanmoqda...</span>
                </div>
              )}

              {/* Error / Permission Block - Shown only when camera is truly blocked */}
              {cameraError && !stream && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-3.5 z-30 bg-slate-950/90 backdrop-blur-sm">
                  <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <div className="max-w-md">
                    <p className="text-xs font-bold text-slate-200 leading-snug">
                      {cameraError}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {language === 'uz'
                        ? 'Smartfon yoki kompyuteringizdan suratni yuklashingiz yoki telefon kamerasini to\'g\'ridan-to\'g\'ri ochishingiz mumkin.'
                        : 'You can upload a photo or open the device camera.'}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={startCamera}
                      className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>{language === 'uz' ? 'Qayta urinish' : 'Retry'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => nativeCameraInputRef.current?.click()}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue-600/30 transition-all"
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>{language === 'uz' ? 'Telefon kamerasini ochish' : 'Open Device Camera'}</span>
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Hidden Canvas & Inputs */}
          <canvas ref={canvasRef} className="hidden" />
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <input
            type="file"
            ref={nativeCameraInputRef}
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Quick Sample Snapshots Strip (Ideal for testing on devices without physical webcams) */}
        {!capturedImage && (
          <div className="px-3.5 py-2.5 bg-slate-950 border-t border-slate-800/80">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                {language === 'uz' ? 'Namuna yoki fayldan tanlash:' : 'Quick items or browse:'}
              </span>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
              >
                <Upload className="w-3 h-3" />
                {language === 'uz' ? 'Fayl tanlash' : 'Browse File'}
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2">
              {SAMPLE_SNAPSHOTS.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setCapturedImage(sample.url);
                    if (stream) {
                      stopCurrentStream(stream);
                      setStream(null);
                    }
                  }}
                  className="group p-1 rounded-xl border border-slate-800 hover:border-blue-500 bg-slate-900/70 hover:bg-slate-800 transition-all text-left cursor-pointer flex items-center gap-2"
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
        <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-2.5 sm:gap-3">
          {capturedImage ? (
            <>
              <button
                type="button"
                onClick={handleRetake}
                className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>{language === 'uz' ? 'Qayta suratga olish' : t('camera.retakePhoto')}</span>
              </button>

              <button
                type="button"
                onClick={handleConfirmPhoto}
                className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold transition-all shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>{language === 'uz' ? 'Suratni tasdiqlash' : t('camera.usePhoto')}</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handleClose}
                className="py-2 px-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
              >
                {t('camera.cancel')}
              </button>

              {/* Center Shutter Button */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleCaptureSnapshot}
                  className="w-14 h-14 rounded-full bg-white hover:bg-blue-50 p-1 flex items-center justify-center shadow-lg shadow-blue-500/30 transition-transform active:scale-95 cursor-pointer ring-4 ring-blue-500/25"
                  aria-label={t('camera.capturePhoto')}
                  title="Suratga olish"
                >
                  <div className="w-11 h-11 rounded-full border-2 border-slate-900 bg-blue-600 flex items-center justify-center text-white">
                    <Camera className="w-5 h-5" />
                  </div>
                </button>
              </div>

              {/* Direct mobile camera button */}
              <button
                type="button"
                onClick={() => nativeCameraInputRef.current?.click()}
                className="py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                title="Telefon kamerasini ochish"
              >
                <Smartphone className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden sm:inline">{language === 'uz' ? 'Kamera ilovasi' : 'Camera App'}</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

