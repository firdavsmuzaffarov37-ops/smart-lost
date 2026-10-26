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
} from 'lucide-react';

export default function CameraCaptureModal({ isOpen, onClose, onCapture }) {
  const { t } = useApp();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [facingMode, setFacingMode] = useState('environment'); // 'environment' (back) or 'user' (front)
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Check available camera devices
  useEffect(() => {
    async function checkDevices() {
      try {
        if (navigator.mediaDevices?.enumerateDevices) {
          const devices = await navigator.mediaDevices.enumerateDevices();
          const videoDevices = devices.filter((d) => d.kind === 'videoinput');
          setHasMultipleCameras(videoDevices.length > 1);
        }
      } catch (err) {
        console.warn('Device enumeration error:', err);
      }
    }
    if (isOpen) {
      checkDevices();
    }
  }, [isOpen]);

  // Start video stream when modal opens
  useEffect(() => {
    let activeStream = null;

    async function startCamera() {
      if (!isOpen) return;
      setIsLoading(true);
      setCameraError(null);
      setCapturedImage(null);

      // Stop any existing stream
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error(t('camera.deviceNotFound'));
        }

        const constraints = {
          video: {
            facingMode: { ideal: facingMode },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        };

        const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        activeStream = mediaStream;
        setStream(mediaStream);

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play().catch((e) => console.warn('Video play warning:', e));
        }
      } catch (err) {
        console.error('Camera access error:', err);
        setCameraError(
          err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError'
            ? t('camera.permissionDenied')
            : t('camera.deviceNotFound')
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

  // Clean up when unmounting or closing
  const handleClose = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setCapturedImage(null);
    setCameraError(null);
    onClose();
  };

  // Flip camera between front and back
  const handleFlipCamera = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  // Capture snapshot to canvas
  const handleCaptureSnapshot = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current || document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    // If facingMode is user (selfie), mirror horizontally
    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedImage(dataUrl);

    // Stop live stream to conserve battery
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  // Retake photo
  const handleRetake = () => {
    setCapturedImage(null);
    // Restart camera stream
    setFacingMode((prev) => (prev === 'environment' ? 'environment' : 'user'));
  };

  // Confirm photo selection
  const handleConfirmPhoto = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col text-white">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800/80 bg-slate-900/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600/30 text-blue-400 flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                {t('camera.takeSnapshotTitle')}
              </h3>
              <p className="text-[11px] text-slate-400">
                {t('camera.takeSnapshotSubtitle')}
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder / Preview Body */}
        <div className="relative aspect-4/3 sm:aspect-16/10 w-full bg-black flex items-center justify-center overflow-hidden">
          {cameraError ? (
            <div className="p-6 text-center max-w-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <p className="text-xs text-rose-300 font-medium">{cameraError}</p>
              <button
                onClick={handleClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-white font-semibold transition-colors"
              >
                {t('camera.cancel')}
              </button>
            </div>
          ) : capturedImage ? (
            <div className="relative w-full h-full">
              <img
                src={capturedImage}
                alt="Captured snapshot"
                className="w-full h-full object-contain"
              />
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-emerald-500/90 text-white text-[11px] font-bold flex items-center gap-1 shadow-xs">
                <Check className="w-3.5 h-3.5" />
                <span>{t('camera.cameraActive')}</span>
              </div>
            </div>
          ) : (
            <>
              {/* Live Video */}
              <video
                ref={videoRef}
                playsInline
                muted
                autoPlay
                className={`w-full h-full object-cover ${
                  facingMode === 'user' ? 'scale-x-[-1]' : ''
                }`}
              />

              {/* Viewfinder Framing Overlay */}
              <div className="absolute inset-8 pointer-events-none border border-white/20 rounded-2xl flex flex-col justify-between p-3">
                <div className="flex justify-between">
                  <div className="w-4 h-4 border-t-2 border-l-2 border-blue-400 rounded-tl-sm" />
                  <div className="w-4 h-4 border-t-2 border-r-2 border-blue-400 rounded-tr-sm" />
                </div>
                <div className="flex justify-between">
                  <div className="w-4 h-4 border-b-2 border-l-2 border-blue-400 rounded-bl-sm" />
                  <div className="w-4 h-4 border-b-2 border-r-2 border-blue-400 rounded-br-sm" />
                </div>
              </div>

              {/* Flip camera button (available if multiple cameras or on phones/tablets) */}
              <button
                type="button"
                onClick={handleFlipCamera}
                title={t('camera.switchCamera')}
                className="absolute top-3 right-3 p-2.5 rounded-full bg-black/50 hover:bg-black/75 text-white backdrop-blur-md transition-colors"
              >
                <RotateCw className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Hidden Canvas for capture processing */}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Footer Action Controls */}
        <div className="p-4 bg-slate-950 flex items-center justify-between gap-3">
          {capturedImage ? (
            <>
              <button
                type="button"
                onClick={handleRetake}
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>{t('camera.retakePhoto')}</span>
              </button>

              <button
                type="button"
                onClick={handleConfirmPhoto}
                className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold transition-all shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>{t('camera.usePhoto')}</span>
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
              {!cameraError && (
                <button
                  type="button"
                  onClick={handleCaptureSnapshot}
                  className="mx-auto w-14 h-14 rounded-full bg-white hover:bg-blue-50 p-1 flex items-center justify-center shadow-lg shadow-blue-500/30 transition-transform active:scale-95 cursor-pointer"
                  aria-label={t('camera.capturePhoto')}
                >
                  <div className="w-11 h-11 rounded-full border-2 border-slate-900 bg-blue-600 flex items-center justify-center text-white">
                    <Camera className="w-5 h-5" />
                  </div>
                </button>
              )}

              <div className="w-16" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
