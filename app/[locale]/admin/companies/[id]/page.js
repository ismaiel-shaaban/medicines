'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { messages } from '../../../../../i18n';

// Static files from public/files directory
const STATIC_FILES = [
  {
    name: 'images.jfif',
    path: '/files/images.jfif',
    type: 'image',
  },
  {
    name: 'فرع الاندلس مول_2025-10-29.pdf',
    path: '/files/فرع الاندلس مول_2025-10-29.pdf',
    type: 'pdf',
  },
];

export default function CompanyDetailPage({ params }) {
  const { locale, id } = params;
  const router = useRouter();
  const t = messages[locale] || messages.en;
  const [pharmacy, setPharmacy] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingMedicine, setEditingMedicine] = useState(null);
  const [selectedMedicine, setSelectedMedicine] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      router.push(`/${locale}/login`);
      return;
    }

    // Load pharmacy
    const storedPharmacies = JSON.parse(localStorage.getItem('pharmacies') || '[]');
    const foundPharmacy = storedPharmacies.find((p) => p.id === id);
    
    if (foundPharmacy) {
      setPharmacy(foundPharmacy);
      
      // Load medicines for this pharmacy
      const storedMedicines = JSON.parse(localStorage.getItem('medicines') || '[]');
      const pharmacyMedicines = storedMedicines.filter((m) => m.pharmacyId === id);
      setMedicines(pharmacyMedicines);
    }
    setLoading(false);
  }, [id, locale, router]);

  const handleEditMedicine = (medicine) => {
    setEditingMedicine({ ...medicine });
  };

  const handleSaveMedicine = () => {
    const storedMedicines = JSON.parse(localStorage.getItem('medicines') || '[]');
    const updatedMedicines = storedMedicines.map((m) =>
      m.id === editingMedicine.id ? editingMedicine : m
    );
    localStorage.setItem('medicines', JSON.stringify(updatedMedicines));
    setMedicines(updatedMedicines.filter((m) => m.pharmacyId === id));
    setEditingMedicine(null);
  };

  const handleDeleteMedicine = (medicineId) => {
    if (confirm(locale === 'ar' ? 'هل أنت متأكد من حذف هذا الدواء؟' : 'Are you sure you want to delete this medicine?')) {
      const storedMedicines = JSON.parse(localStorage.getItem('medicines') || '[]');
      const updatedMedicines = storedMedicines.filter((m) => m.id !== medicineId);
      localStorage.setItem('medicines', JSON.stringify(updatedMedicines));
      setMedicines(medicines.filter((m) => m.id !== medicineId));
    }
  };

  const updateMedicineStatus = (medicineId, approvalIndex, status) => {
    const storedMedicines = JSON.parse(localStorage.getItem('medicines') || '[]');
    const updatedMedicines = storedMedicines.map((med) => {
      if (med.id === medicineId) {
        const updatedApprovals = [...med.approvals];
        updatedApprovals[approvalIndex].status = status;
        
        const approvedCount = updatedApprovals.filter((a) => a.status === 'approved').length;
        const progress = (approvedCount / updatedApprovals.length) * 100;
        
        let overallStatus = 'pending';
        if (approvedCount === updatedApprovals.length) {
          overallStatus = 'approved';
        } else if (updatedApprovals.some((a) => a.status === 'rejected')) {
          overallStatus = 'rejected';
        }

        return {
          ...med,
          approvals: updatedApprovals,
          progress: Math.round(progress),
          status: overallStatus,
        };
      }
      return med;
    });

    localStorage.setItem('medicines', JSON.stringify(updatedMedicines));
    const updatedPharmacyMedicines = updatedMedicines.filter((m) => m.pharmacyId === id);
    setMedicines(updatedPharmacyMedicines);
    
    if (selectedMedicine && selectedMedicine.id === medicineId) {
      setSelectedMedicine(updatedMedicines.find((m) => m.id === medicineId));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!pharmacy) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {locale === 'ar' ? 'المكتب العلمي غير موجود' : 'Scientific Office not found'}
          </p>
          <Link
            href={`/${locale}/admin`}
            className="text-blue-600 hover:text-blue-500 dark:text-blue-400"
          >
            {t.common.back}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8 gradient-bg">
      <div className="max-w-7xl mx-auto">
        <Link
          href={`/${locale}/admin`}
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 mb-6 font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {t.common.back}
        </Link>

        {/* Pharmacy Info */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8 border border-gray-100 dark:border-gray-700">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-lg">
              {pharmacy.name.charAt(0)}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {pharmacy.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {pharmacy.address}
              </p>
            </div>
            <Link
              href={`/${locale}/medicine/register?pharmacyId=${pharmacy.id}`}
              className="btn-primary flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {t.pharmacy.addMedicine}
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-xl">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                {t.pharmacy.ownerName}
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{pharmacy.ownerName}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-xl">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                {t.pharmacy.licenseNumber}
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{pharmacy.licenseNumber}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-xl">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                {t.pharmacy.totalMedicines}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{medicines.length}</p>
            </div>
          </div>
        </div>

        {/* Medicines List */}
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400 mb-6">
            {t.pharmacy.medicines}
          </h2>

          {medicines.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-16 text-center border border-gray-100 dark:border-gray-700">
              <div className="mb-4">
                <svg className="mx-auto h-20 w-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">
                {t.pharmacy.noMedicines}
              </p>
              <Link
                href={`/${locale}/medicine/register?pharmacyId=${pharmacy.id}`}
                className="btn-primary inline-flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                {t.pharmacy.addMedicine}
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {medicines.map((medicine) => (
                <div
                  key={medicine.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 card-hover border border-gray-100 dark:border-gray-700"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white flex-1">
                      {medicine.name}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      medicine.status === 'approved'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : medicine.status === 'rejected'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}>
                      {t.medicine[medicine.status] || medicine.status}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                    {medicine.company}
                  </p>
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {t.medicine.progress}
                      </p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {medicine.progress}%
                      </p>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${medicine.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedMedicine(medicine)}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-xl transition-all text-sm shadow-md hover:shadow-lg"
                    >
                      {t.admin.viewDetails}
                    </button>
                    <button
                      onClick={() => handleEditMedicine(medicine)}
                      className="px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-xl transition-colors text-sm"
                    >
                      {t.common.edit}
                    </button>
                    <button
                      onClick={() => handleDeleteMedicine(medicine.id)}
                      className="px-4 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-xl transition-colors text-sm"
                    >
                      {t.common.delete}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* View Medicine Details Modal with Status Management */}
      {selectedMedicine && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedMedicine.name}
                </h2>
                <button
                  onClick={() => setSelectedMedicine(null)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {t.medicine.company}
                  </p>
                  <p className="text-gray-900 dark:text-white">{selectedMedicine.company}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {t.medicine.description}
                  </p>
                  <p className="text-gray-900 dark:text-white">{selectedMedicine.description}</p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {t.medicine.approvals}
                </h3>
                <div className="space-y-3">
                  {selectedMedicine.approvals.map((approval, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl"
                    >
                      <span className="text-gray-900 dark:text-white font-medium">{approval.name}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateMedicineStatus(selectedMedicine.id, index, 'approved')}
                          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                            approval.status === 'approved'
                              ? 'bg-green-600 text-white'
                              : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-green-500'
                          }`}
                        >
                          {t.admin.approve}
                        </button>
                        <button
                          onClick={() => updateMedicineStatus(selectedMedicine.id, index, 'rejected')}
                          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                            approval.status === 'rejected'
                              ? 'bg-red-600 text-white'
                              : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-red-500'
                          }`}
                        >
                          {t.admin.reject}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  {t.medicine.progress}
                </p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all"
                    style={{ width: `${selectedMedicine.progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {selectedMedicine.progress}%
                </p>
              </div>

              {/* Files Section */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {t.medicine.files}
                </h3>
                
                {/* Static Files from public/files - Always displayed */}
                <div className="space-y-2 mb-4">
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                    {locale === 'ar' ? 'الملفات الثابتة' : 'Static Files'}
                  </h4>
                  {STATIC_FILES.map((file, index) => (
                    <a
                      key={`static-${index}`}
                      href={file.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-900/30 dark:hover:to-purple-900/30 transition-all cursor-pointer border border-blue-200 dark:border-blue-800"
                    >
                      <div className="flex items-center gap-3">
                        {file.type === 'image' ? (
                          <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        ) : (
                          <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                        )}
                        <span className="text-gray-900 dark:text-white text-sm font-semibold">{file.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {locale === 'ar' ? 'عرض' : 'View'}
                        </span>
                        <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </div>
                    </a>
                  ))}
                </div>

                {/* Dynamic Files from medicine data */}
                {selectedMedicine.files && selectedMedicine.files.length > 0 ? (
                  <>
                    <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                      {locale === 'ar' ? 'الملفات المرفقة' : 'Attached Files'}
                    </h4>
                    <div className="space-y-2">
                      {selectedMedicine.files.map((file, index) => {
                        const fileName = typeof file === 'string' ? file : (file?.name || 'Unknown File');
                        const fileType = typeof file === 'object' && file?.type ? file.type.split('/')[0] : 'file';
                        const isImage = fileType === 'image';
                        const isPdf = typeof file === 'object' && file?.type && file.type.includes('pdf');
                        return (
                          <div
                            key={`dynamic-${index}`}
                            className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                          >
                            {isImage ? (
                              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            ) : isPdf ? (
                              <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                              </svg>
                            ) : (
                              <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                              </svg>
                            )}
                            <span className="text-gray-900 dark:text-white text-sm font-medium flex-1 truncate">{fileName}</span>
                            {file.size && (
                              <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                                {(file.size / 1024).toFixed(2)} KB
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                    {locale === 'ar' ? 'لا توجد ملفات مرفقة' : 'No attached files'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Medicine Modal */}
      {editingMedicine && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
            {/* Fixed Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t.common.edit} {t.medicine.name}
              </h2>
              <button
                onClick={() => setEditingMedicine(null)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
              >
                ✕
              </button>
            </div>
            {/* Scrollable Content */}
            <div className="overflow-y-auto flex-1 p-6">
              <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t.medicine.name}
                </label>
                <input
                  type="text"
                  value={editingMedicine.name}
                  onChange={(e) => setEditingMedicine({ ...editingMedicine, name: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t.medicine.company}
                </label>
                <input
                  type="text"
                  value={editingMedicine.company}
                  onChange={(e) => setEditingMedicine({ ...editingMedicine, company: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t.medicine.description}
                </label>
                <textarea
                  value={editingMedicine.description}
                  onChange={(e) => setEditingMedicine({ ...editingMedicine, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
              
              {/* Files Section in Edit Modal */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t.medicine.files}
                </label>
                
                {/* Existing Files */}
                {editingMedicine.files && editingMedicine.files.length > 0 && (
                  <div className="space-y-2 mb-4">
                    {editingMedicine.files.map((file, index) => {
                      const fileName = typeof file === 'string' ? file : (file?.name || 'Unknown File');
                      return (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <span className="text-gray-700 dark:text-gray-300 text-sm">{fileName}</span>
                        <button
                          onClick={() => {
                            const updatedFiles = [...editingMedicine.files];
                            updatedFiles.splice(index, 1);
                            setEditingMedicine({ ...editingMedicine, files: updatedFiles });
                          }}
                          className="text-red-600 hover:text-red-700 dark:text-red-400 text-sm"
                        >
                          {locale === 'ar' ? 'حذف' : 'Remove'}
                        </button>
                      </div>
                      );
                    })}
                  </div>
                )}

                {/* Add Files */}
                <input
                  type="file"
                  multiple
                  onChange={(e) => {
                    const newFiles = Array.from(e.target.files);
                    const existingFiles = editingMedicine.files || [];
                    const fileObjects = newFiles.map((file) => ({
                      name: file.name,
                      size: file.size,
                      type: file.type,
                      lastModified: file.lastModified,
                    }));
                    setEditingMedicine({ ...editingMedicine, files: [...existingFiles, ...fileObjects] });
                    e.target.value = ''; // Reset input
                  }}
                  className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {locale === 'ar' ? 'يمكنك اختيار ملفات متعددة' : 'You can select multiple files'}
                </p>
              </div>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={handleSaveMedicine}
                    className="flex-1 btn-primary"
                  >
                    {t.common.save}
                  </button>
                  <button
                    onClick={() => setEditingMedicine(null)}
                    className="flex-1 btn-secondary"
                  >
                    {t.common.cancel}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

