'use client';

import { useState, useEffect } from 'react';
import { messages } from '../../../../i18n';

export default function StatisticsTab({ params }) {
  const { locale } = params;
  const t = messages[locale] || messages.en;
  const [medicines, setMedicines] = useState([]);
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected

  useEffect(() => {
    const storedMedicines = localStorage.getItem('medicines');
    const storedPharmacies = localStorage.getItem('pharmacies');
    
    if (storedMedicines) {
      setMedicines(JSON.parse(storedMedicines));
    }
    if (storedPharmacies) {
      setPharmacies(JSON.parse(storedPharmacies));
    }
    setLoading(false);
  }, []);

  const getPharmacyName = (pharmacyId) => {
    const pharmacy = pharmacies.find((p) => p.id === pharmacyId);
    return pharmacy ? pharmacy.name : (locale === 'ar' ? 'غير معروف' : 'Unknown');
  };

  const updateMedicineStatus = (medicineId, approvalIndex, status) => {
    const updatedMedicines = medicines.map((med) => {
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

    setMedicines(updatedMedicines);
    localStorage.setItem('medicines', JSON.stringify(updatedMedicines));
    
    if (selectedMedicine && selectedMedicine.id === medicineId) {
      setSelectedMedicine(updatedMedicines.find((m) => m.id === medicineId));
    }
  };

  const stats = {
    totalMedicines: medicines.length,
    totalPharmacies: pharmacies.length,
    pending: medicines.filter((m) => m.status === 'pending').length,
    approved: medicines.filter((m) => m.status === 'approved').length,
    rejected: medicines.filter((m) => m.status === 'rejected').length,
  };

  // Filter medicines based on selected filter
  const filteredMedicines = filter === 'all' 
    ? medicines 
    : medicines.filter((m) => m.status === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <button
          onClick={() => setFilter('all')}
          className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border transition-all text-right w-full ${
            filter === 'all'
              ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-50'
              : 'border-gray-100 dark:border-gray-700 card-hover'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            {t.admin.totalMedicines}
          </h3>
          <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">{stats.totalMedicines}</p>
        </button>

        <button
          onClick={() => window.location.href = `/${locale}/admin?tab=companies`}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700 card-hover text-right w-full transition-all hover:scale-105"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            {t.pharmacy.title}
          </h3>
          <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">{stats.totalPharmacies}</p>
        </button>

        <button
          onClick={() => setFilter('pending')}
          className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border transition-all text-right w-full ${
            filter === 'pending'
              ? 'border-yellow-500 ring-2 ring-yellow-500 ring-opacity-50'
              : 'border-gray-100 dark:border-gray-700 card-hover'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            {t.admin.pendingApprovals}
          </h3>
          <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
        </button>

        <button
          onClick={() => setFilter('approved')}
          className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border transition-all text-right w-full ${
            filter === 'approved'
              ? 'border-green-500 ring-2 ring-green-500 ring-opacity-50'
              : 'border-gray-100 dark:border-gray-700 card-hover'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            {t.admin.approvedMedicines}
          </h3>
          <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
        </button>

        <button
          onClick={() => setFilter('rejected')}
          className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border transition-all text-right w-full ${
            filter === 'rejected'
              ? 'border-red-500 ring-2 ring-red-500 ring-opacity-50'
              : 'border-gray-100 dark:border-gray-700 card-hover'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            {t.medicine.rejected}
          </h3>
          <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
        </button>
      </div>

      {/* Medicines Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {filter === 'all'
                ? (locale === 'ar' ? 'جميع الأدوية' : 'All Medicines')
                : filter === 'pending'
                ? (locale === 'ar' ? 'الأدوية قيد الانتظار' : 'Pending Medicines')
                : filter === 'approved'
                ? (locale === 'ar' ? 'الأدوية الموافق عليها' : 'Approved Medicines')
                : (locale === 'ar' ? 'الأدوية المرفوضة' : 'Rejected Medicines')}
            </h2>
            {filter !== 'all' && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {locale === 'ar' 
                  ? `عرض ${filteredMedicines.length} من ${medicines.length} دواء`
                  : `Showing ${filteredMedicines.length} of ${medicines.length} medicines`}
              </p>
            )}
          </div>
          {filter !== 'all' && (
            <button
              onClick={() => setFilter('all')}
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium"
            >
              {locale === 'ar' ? 'إلغاء التصفية' : 'Clear Filter'}
            </button>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t.medicine.name}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t.pharmacy.title}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t.medicine.status}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t.medicine.progress}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t.admin.viewDetails}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredMedicines.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    {locale === 'ar' 
                      ? filter === 'pending' 
                        ? 'لا توجد أدوية قيد الانتظار'
                        : filter === 'approved'
                        ? 'لا توجد أدوية موافق عليها'
                        : filter === 'rejected'
                        ? 'لا توجد أدوية مرفوضة'
                        : 'لا توجد أدوية'
                      : filter === 'pending'
                      ? 'No pending medicines found'
                      : filter === 'approved'
                      ? 'No approved medicines found'
                      : filter === 'rejected'
                      ? 'No rejected medicines found'
                      : 'No medicines found'}
                  </td>
                </tr>
              ) : (
                filteredMedicines.map((medicine) => (
                  <tr key={medicine.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {medicine.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {medicine.pharmacyId ? getPharmacyName(medicine.pharmacyId) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                        medicine.status === 'approved'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : medicine.status === 'rejected'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}>
                        {t.medicine[medicine.status] || medicine.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                            style={{ width: `${medicine.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {medicine.progress}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => setSelectedMedicine(medicine)}
                        className="text-blue-600 hover:text-blue-500 dark:text-blue-400 font-medium"
                      >
                        {t.admin.viewDetails}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Medicine Details */}
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
                {selectedMedicine.pharmacyId && (
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {t.pharmacy.title}
                    </p>
                    <p className="text-gray-900 dark:text-white">{getPharmacyName(selectedMedicine.pharmacyId)}</p>
                  </div>
                )}
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

