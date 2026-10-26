import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { categories, citiesInUzbekistan } from '../data/initialData';
import CameraCaptureModal from '../components/common/CameraCaptureModal';
import {
  CheckCircle2,
  Upload,
  Camera,
  MapPin,
  Calendar,
  Shield,
  HelpCircle,
  AlertCircle,
  Sparkles,
  Lock,
} from 'lucide-react';

export default function ReportFoundPage() {
  const navigate = useNavigate();
  const { addReport, currentUser, t, language } = useApp();

  const fileInputRef = useRef(null);
  const mobileCameraInputRef = useRef(null);

  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'electronics',
    description: '',
    city: 'Tashkent',
    district: '',
    locationAddress: '',
    coordinates: { lat: 41.311081, lng: 69.279737 },
    date: new Date().toISOString().split('T')[0],
    time: '12:00',
    custodyLocation: 'Kept safely with me',
    image: 'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=800&q=80',
    contactPreference: 'in_app_chat',
    secretQuestion: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Preset sample photos for fast demo testing
  const samplePresets = [
    {
      label: language === 'uz' ? 'Smartfon' : language === 'ru' ? 'Смартфон' : 'Smartphone',
      url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80',
      category: 'electronics',
    },
    {
      label: language === 'uz' ? 'Quloqchinlar' : language === 'ru' ? 'Наушники' : 'Earphones',
      url: 'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=800&q=80',
      category: 'electronics',
    },
    {
      label: language === 'uz' ? 'Hamyon' : language === 'ru' ? 'Кошелек' : 'Wallet',
      url: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80',
      category: 'wallets-cards',
    },
    {
      label: language === 'uz' ? 'Uy hayvoni' : language === 'ru' ? 'Питомец' : 'Pet / Dog',
      url: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?auto=format&fit=crop&w=800&q=80',
      category: 'pets',
    },
    {
      label: language === 'uz' ? 'Ko\'zoynak' : language === 'ru' ? 'Очки' : 'Sunglasses',
      url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
      category: 'jewelry',
    },
  ];

  const handleCityChange = (cityName) => {
    const foundCity = citiesInUzbekistan.find((c) => c.name === cityName);
    setFormData((prev) => ({
      ...prev,
      city: cityName,
      coordinates: foundCity ? { lat: foundCity.lat, lng: foundCity.lng } : prev.coordinates,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = (imageDataUrl) => {
    setFormData((prev) => ({ ...prev, image: imageDataUrl }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = t('reportForm.errors.titleRequired');
    if (!formData.description.trim()) newErrors.description = t('reportForm.errors.descRequired');
    if (!formData.locationAddress.trim()) newErrors.locationAddress = t('reportForm.errors.locationRequired');
    if (!formData.date) newErrors.date = t('reportForm.errors.dateRequired');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const created = addReport({
        type: 'found',
        ...formData,
      });
      setIsSubmitting(false);
      navigate(`/item/${created.id}`);
    }, 500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Title Card */}
      <div className="p-5 sm:p-6 bg-white rounded-3xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {t('reportForm.foundTitle')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {t('reportForm.foundSubtitle')}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Core Details */}
        <div className="p-5 sm:p-6 bg-white rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
          <h2 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[11px] flex items-center justify-center shrink-0">
              1
            </span>
            {t('reportForm.step1')}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Title */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {t('reportForm.itemTitleLabel')} <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder={t('reportForm.itemTitlePlaceholder')}
                className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all ${
                  errors.title ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                }`}
              />
              {errors.title && (
                <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.title}
                </p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {t('reportForm.categoryLabel')} <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all cursor-pointer"
              >
                {categories.filter((c) => c.id !== 'all').map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {t(`categories.${cat.id}`) || cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Custody Location */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {t('reportForm.custodyLocationLabel')}
              </label>
              <input
                type="text"
                value={formData.custodyLocation}
                onChange={(e) => setFormData({ ...formData, custodyLocation: e.target.value })}
                placeholder={t('reportForm.custodyLocationPlaceholder')}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {t('reportForm.descriptionLabel')} <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder={t('reportForm.descriptionPlaceholder')}
                className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all ${
                  errors.description ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                }`}
              />
              {errors.description && (
                <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Step 2: Photo Upload & Camera Feature */}
        <div className="p-5 sm:p-6 bg-white rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
          <h2 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[11px] flex items-center justify-center shrink-0">
              2
            </span>
            {t('reportForm.step2')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
            {/* Preview Box */}
            <div className="md:col-span-5 aspect-4/3 sm:aspect-16/10 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 relative group">
              <img
                src={formData.image}
                alt="Item snapshot"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                <button
                  type="button"
                  onClick={() => setIsCameraModalOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1 shadow-md cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>{t('camera.takePhoto')}</span>
                </button>
              </div>
            </div>

            {/* Action Buttons & Presets */}
            <div className="md:col-span-7 space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* 1. Take Snapshot with Web/Mobile Camera */}
                <button
                  type="button"
                  onClick={() => setIsCameraModalOpen(true)}
                  className="p-3.5 rounded-2xl border-2 border-emerald-500/80 bg-emerald-50/50 hover:bg-emerald-50 text-emerald-800 transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer shadow-xs hover:shadow-md group"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Camera className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-center">
                    {t('camera.takePhoto')}
                  </span>
                  <span className="text-[10px] text-emerald-600/80 text-center">
                    Webcam / Live Camera
                  </span>
                </button>

                {/* 2. Choose File from Device */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-3.5 rounded-2xl border-2 border-dashed border-slate-300 hover:border-slate-400 bg-slate-50/60 hover:bg-slate-50 text-slate-700 transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer shadow-xs hover:shadow-md group"
                >
                  <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Upload className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-center">
                    {t('camera.uploadFromDevice')}
                  </span>
                  <span className="text-[10px] text-slate-400 text-center">
                    PNG, JPG, WEBP &lt; 5MB
                  </span>
                </button>

                {/* Hidden File Picker */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                {/* Hidden Native Mobile Camera Trigger */}
                <input
                  ref={mobileCameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              {/* Sample Presets for Quick Demo */}
              <div className="pt-1">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  {t('reportForm.presetLabel')}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {samplePresets.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          image: preset.url,
                          category: preset.category,
                        }))
                      }
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200/80 transition-colors cursor-pointer"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step 3: Location and Date */}
        <div className="p-5 sm:p-6 bg-white rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
          <h2 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[11px] flex items-center justify-center shrink-0">
              3
            </span>
            {t('reportForm.step3')}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* City */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {t('reportForm.cityLabel')} <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.city}
                onChange={(e) => handleCityChange(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all cursor-pointer"
              >
                {citiesInUzbekistan.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name} ({c.region})
                  </option>
                ))}
              </select>
            </div>

            {/* Landmark / Address */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {t('reportForm.districtLabel')} <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={formData.locationAddress}
                  onChange={(e) => setFormData({ ...formData, locationAddress: e.target.value })}
                  placeholder={t('reportForm.districtPlaceholder')}
                  className={`w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all ${
                    errors.locationAddress ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                  }`}
                />
              </div>
              {errors.locationAddress && (
                <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.locationAddress}
                </p>
              )}
            </div>

            {/* Date Found */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {t('reportForm.dateLabel')} <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            {/* Approximate Time */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {t('reportForm.timeLabel')}
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Step 4: Verification Question for Claimants */}
        <div className="p-5 sm:p-6 bg-white rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
          <h2 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[11px] flex items-center justify-center shrink-0">
              4
            </span>
            {t('reportForm.step4')}
          </h2>

          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-xs text-emerald-900 leading-relaxed flex items-start gap-2.5">
            <Shield className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong>Secure Verification:</strong> To protect the item from impostors, set a secret question only the true owner can answer.
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {t('reportForm.secretQuestionLabel')}
            </label>
            <input
              type="text"
              value={formData.secretQuestion}
              onChange={(e) => setFormData({ ...formData, secretQuestion: e.target.value })}
              placeholder={t('reportForm.secretQuestionPlaceholder')}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              {t('reportForm.secretQuestionHint')}
            </p>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate('/found')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors text-center cursor-pointer"
          >
            {t('camera.cancel')}
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-500/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>{t('reportForm.submitting')}</span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>{t('reportForm.submitFoundBtn')}</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Live Camera Modal */}
      <CameraCaptureModal
        isOpen={isCameraModalOpen}
        onClose={() => setIsCameraModalOpen(false)}
        onCapture={handleCameraCapture}
      />
    </div>
  );
}
