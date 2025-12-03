'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { messages } from '../../../../i18n';
import { pharmaceuticalCompanies, commonMedicines } from '../../../../data/pharmaceuticalData';

function RegisterMedicineForm({ params }) {
  const { locale } = params;
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = messages[locale] || messages.en;
  const [pharmacies, setPharmacies] = useState([]);
  const [formData, setFormData] = useState({
    pharmacyId: '',
    name: '',
    company: '',
    description: '',
    files: [],
  });
  const [loading, setLoading] = useState(false);
  const [showMedicineSuggestions, setShowMedicineSuggestions] = useState(false);
  const [filteredMedicines, setFilteredMedicines] = useState([]);

  useEffect(() => {
    // Load pharmacies
    const storedPharmacies = JSON.parse(localStorage.getItem('pharmacies') || '[]');
    setPharmacies(storedPharmacies);

    // Set pharmacyId from URL if provided
    const pharmacyId = searchParams?.get('pharmacyId');
    if (pharmacyId) {
      setFormData((prev) => ({ ...prev, pharmacyId }));
    }
  }, [locale, router, searchParams]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Show medicine suggestions when typing medicine name
    if (name === 'name' && value.length > 0) {
      const filtered = commonMedicines.filter(
        (med) =>
          med.name.toLowerCase().includes(value.toLowerCase()) ||
          med.nameEn.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredMedicines(filtered);
      setShowMedicineSuggestions(filtered.length > 0);
    } else {
      setShowMedicineSuggestions(false);
    }
  };

  const selectMedicine = (medicine) => {
    setFormData((prev) => ({
      ...prev,
      name: locale === 'ar' ? medicine.name : medicine.nameEn,
      description: medicine.category || '',
    }));
    setShowMedicineSuggestions(false);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      files: [...prev.files, ...files],
    }));
  };

  const removeFile = (index) => {
    setFormData((prev) => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.pharmacyId) {
      alert(locale === 'ar' ? 'يرجى اختيار المكتب العلمي' : 'Please select a scientific office');
      return;
    }

    setLoading(true);

    // Create medicine object
    const medicine = {
      id: Date.now().toString(),
      ...formData,
      status: 'pending',
      progress: 0,
      registrationDate: new Date().toISOString(),
      approvals: [
        { name: locale === 'ar' ? 'موافقة الوزارة' : 'Ministry Approval', status: 'pending' },
        { name: locale === 'ar' ? 'مراقبة الجودة' : 'Quality Control', status: 'pending' },
        { name: locale === 'ar' ? 'مراجعة الوثائق' : 'Documentation Review', status: 'pending' },
      ],
    };

    // Save to localStorage (in real app, this would be an API call)
    const existingMedicines = JSON.parse(localStorage.getItem('medicines') || '[]');
    existingMedicines.push(medicine);
    localStorage.setItem('medicines', JSON.stringify(existingMedicines));

    setTimeout(() => {
      if (formData.pharmacyId) {
        router.push(`/${locale}/pharmacies/${formData.pharmacyId}`);
      } else {
        router.push(`/${locale}/dashboard`);
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen px-4 py-8 gradient-bg">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400 mb-2">
            {t.medicine.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {locale === 'ar' ? 'تسجيل دواء جديد في النظام' : 'Register a new medicine in the system'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-6 border border-gray-100 dark:border-gray-700">
          {/* First Input: Scientific Office (مكتب علمي) */}
          <div>
            <label htmlFor="pharmacyId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {locale === 'ar' ? 'المكتب العلمي' : 'Scientific Office'}
            </label>
            <select
              id="pharmacyId"
              name="pharmacyId"
              value={formData.pharmacyId}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm transition-all"
            >
              <option value="">{locale === 'ar' ? '-- اختر المكتب العلمي --' : '-- Select Scientific Office --'}</option>
              {pharmacies.map((pharmacy) => (
                <option key={pharmacy.id} value={pharmacy.id}>
                  {pharmacy.name}
                </option>
              ))}
            </select>
          </div>

          {/* Second Input: Medicine Name */}
          <div className="relative">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t.medicine.name}
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm transition-all"
              placeholder={t.medicine.namePlaceholder}
            />
            {showMedicineSuggestions && (
              <div className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                {filteredMedicines.map((medicine, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => selectMedicine(medicine)}
                    className="w-full text-right px-4 py-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 text-gray-900 dark:text-white transition-all border-b border-gray-100 dark:border-gray-700 last:border-0"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{locale === 'ar' ? medicine.name : medicine.nameEn}</span>
                      <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full">{medicine.category}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Third Input: Pharmaceutical Company */}
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {locale === 'ar' ? 'الشركة المصنعة' : 'Pharmaceutical Company'}
            </label>
            <select
              id="company"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm transition-all"
            >
              <option value="">{locale === 'ar' ? '-- اختر الشركة المصنعة --' : '-- Select Pharmaceutical Company --'}</option>
              {pharmaceuticalCompanies.map((company, index) => (
                <option key={index} value={company}>
                  {company}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t.medicine.description}
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm transition-all"
              placeholder={t.medicine.descriptionPlaceholder}
            />
          </div>

          <div>
            <label htmlFor="files" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t.medicine.files}
            </label>
            <input
              id="files"
              type="file"
              multiple
              onChange={handleFileChange}
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm transition-all"
            />
            {formData.files.length > 0 && (
              <div className="mt-4 space-y-2">
                {formData.files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-2 rounded">
                    <span className="text-sm text-gray-700 dark:text-gray-300">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-red-600 hover:text-red-700 dark:text-red-400"
                    >
                      {locale === 'ar' ? 'حذف' : 'Remove'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? t.common.loading : t.common.submit}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 btn-secondary"
            >
              {t.common.cancel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function RegisterMedicinePage({ params }) {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <RegisterMedicineForm params={params} />
    </Suspense>
  );
}

