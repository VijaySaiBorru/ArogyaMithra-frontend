import React, { useState } from "react";
import { useUpdateFeesMutation } from "../../redux/admission/admissionApi";
import Swal from "sweetalert2";

const UpdateFeesForm = () => {
  const [admissionId, setAdmissionId] = useState("");
  const [extraAmount, setExtraAmount] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [method, setMethod] = useState("");
  const [note, setNote] = useState("");

  const [updateFees, { isLoading }] = useUpdateFeesMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!admissionId) {
        return Swal.fire({
            icon: "warning",
            title: "Missing Admission ID",
            text: "Please enter an admission ID.",
        });
    }

    if (extraAmount == null || paidAmount == null) {
        return Swal.fire({
            icon: "warning",
            title: "Missing Amount",
            text: "Please enter both extra amount and paid amount.",
        });
    }

    // Round extraAmount and paidAmount to 2 decimal places
    const roundedExtraAmount = parseFloat(extraAmount.toFixed(2));
    const roundedPaidAmount = parseFloat(paidAmount.toFixed(2));

    try {
        const feesData = {
            extra_amount: roundedExtraAmount,
            paid_amount: roundedPaidAmount,
            method: method,
            note: note,
        };

        await updateFees({ admission_id: admissionId, feesData }).unwrap();

        Swal.fire({
            icon: "success",
            title: "Success",
            text: "Fees updated successfully!",
        });

        // Optional: reset form
        setAdmissionId("");
        setExtraAmount(0);
        setPaidAmount(0);
        setMethod("");
        setNote("");
    } catch (error) {
        console.error("Update error:", error);
        Swal.fire({
            icon: "error",
            title: "Error",
            text: error?.data?.error || "Failed to update fees.",
        });
    }
};


  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto"
    >
      <h2 className="text-2xl font-semibold mb-4 text-blue-600">Update Fees</h2>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Admission ID</label>
        <input
          type="text"
          value={admissionId}
          onChange={(e) => setAdmissionId(e.target.value)}
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Extra Amount</label>
        <input
          type="number"
          value={extraAmount}
          onChange={(e) => setExtraAmount(Number(e.target.value))}
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Paid Amount from the above extra</label>
        <input
          type="number"
          value={paidAmount}
          onChange={(e) => setPaidAmount(Number(e.target.value))}
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Payment Method</label>
        <input
          type="text"
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Transaction ID (optional if online payment)</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        {isLoading ? "Updating..." : "Update Fees"}
      </button>
    </form>
  );
};

export default UpdateFeesForm;
