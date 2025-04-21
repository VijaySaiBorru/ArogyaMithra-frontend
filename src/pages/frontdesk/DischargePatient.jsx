import React, { useState } from 'react';
import { useDischargePatientMutation } from '../../redux/admission/admissionApi';
import { pdf } from '@react-pdf/renderer';
import BillingPDF from '../../components/pdf/BillingPDF'; // Make sure this is your PDF component

const DischargePatient = () => {
  const [admissionId, setAdmissionId] = useState('');
  const [formError, setFormError] = useState('');
  const [dischargeData, setDischargeData] = useState(null);

  const [dischargePatient, { isLoading, isError, error }] = useDischargePatientMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!admissionId) {
      setFormError('Admission ID is required.');
      return;
    }

    try {
      const response = await dischargePatient(admissionId).unwrap();
      setFormError('');
      setDischargeData({
        billing: response.billing,
        patient: response.patient,
      });
      setAdmissionId('');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error discharging patient.';
      console.error('Discharge error:', err);
      setDischargeData(null);
      setFormError(message);
    }
  };

  const hospitalInfo = {
    name: 'ArogyaMithra',
    address: '#123, Main Road, Hyderabad, Telangana, India | Phone: 12345 67890 | www.arogyamithra.com',
    logoUrl: '/logo.png', // you can upload your logo to any CDN
  };

  const handleDownloadPDF = async () => {
    if (dischargeData) {
      const doc = (
        <BillingPDF hospital={hospitalInfo} patient={dischargeData.patient[0]} billing={dischargeData.billing} />
      );

      // Generate PDF and trigger download
      const blob = await pdf(doc).toBlob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `Discharge_Billing_${dischargeData.patient[0].admission_id}.pdf`;
      link.click();
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold text-center mb-4">Discharge Patient</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="admissionId" className="block text-sm font-semibold">Admission ID</label>
          <input
            id="admissionId"
            name="admissionId"
            type="text"
            value={admissionId}
            onChange={(e) => setAdmissionId(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="Enter Admission ID"
          />
        </div>

        {formError && <p className="text-red-500 text-sm">{formError}</p>}

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-all duration-200"
        >
          {isLoading ? 'Discharging...' : 'Discharge Patient'}
        </button>

        {isError && <p className="text-red-500 text-sm">Error: {error?.data?.error || 'Discharge failed'}</p>}
      </form>

      {dischargeData && (
        <div className="mt-6 p-4 border rounded shadow bg-gray-50">
          <h2 className="text-lg font-semibold mb-2 text-center">Billing Summary</h2>
          <p><strong>Patient:</strong> {dischargeData.patient.name}</p>
          <p><strong>Total Fees:</strong> ₹{dischargeData.billing.total_fees}</p>
          <p><strong>Fee Paid:</strong> ₹{dischargeData.billing.fee_paid}</p>
          <p><strong>Remaining Fees:</strong> ₹{dischargeData.billing.remaining_fees}</p>

          <button
            onClick={handleDownloadPDF}
            className="inline-block mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-all duration-200"
          >
            Download Discharge PDF
          </button>
        </div>
      )}
    </div>
  );
};

export default DischargePatient;
