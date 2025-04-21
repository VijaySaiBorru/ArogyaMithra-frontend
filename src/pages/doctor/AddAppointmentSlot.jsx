import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import {
  useAddSlotMutation,
  useGenerateWeeklySlotsMutation,
} from '../../redux/appointment/appointmentApi';

const AddAppointmentSlot = ({ doctorId }) => {
  const [slotData, setSlotData] = useState({
    date: '',
    time: '',
    endTime: '',
    isRecurring: false,
    recurrenceDay: '',
    repeatUntil: '',
  });

  const [addSlot, { isLoading }] = useAddSlotMutation();
  const [generateWeeklySlots, { isLoading: isGenerating }] =
    useGenerateWeeklySlotsMutation();
  const [errorMessage, setErrorMessage] = useState('');

  // Automatically set the day of the week based on the selected date
  useEffect(() => {
    if (slotData.date) {
      const selectedDate = new Date(slotData.date);
      const dayOfWeek = selectedDate.toLocaleString('en-us', { weekday: 'long' });
      setSlotData((prevState) => ({
        ...prevState,
        recurrenceDay: dayOfWeek,
      }));
    }
  }, [slotData.date]);

  const handleRecurringChange = (e) => {
    setSlotData((prevState) => ({
      ...prevState,
      isRecurring: e.target.checked,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSlotData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { date, time, endTime, isRecurring, recurrenceDay, repeatUntil } =
      slotData;

    if (!date || !time || !endTime) {
      setErrorMessage('Date, start time, and end time are required.');
      return;
    }

    if (time >= endTime) {
      setErrorMessage('End time must be after start time.');
      return;
    }

    try {
      if (isRecurring) {
        if (!recurrenceDay || !repeatUntil) {
          setErrorMessage(
            'Recurrence day and repeat until date are required for recurring slots.'
          );
          return;
        }

        const response = await generateWeeklySlots({
          hcp_id: doctorId,
          day_of_week: recurrenceDay,
          start_time: time,
          end_time: endTime,
          repeat_until: repeatUntil,
          start_date: date,
        }).unwrap();

        if (response) {
          Swal.fire({
            title: 'Recurring Slots Created!',
            text: response.message || 'Weekly slots added successfully.',
            icon: 'success',
            confirmButtonText: 'OK',
          });
          resetForm();
        }
      } else {
        const response = await addSlot({
          hcp_id: doctorId,
          slot_date: date,
          start_time: time,
          end_time: endTime,
        }).unwrap();

        if (response) {
          Swal.fire({
            title: 'Slot Added!',
            text: 'The appointment slot has been added successfully.',
            icon: 'success',
            confirmButtonText: 'OK',
          });
          resetForm();
        }
      }
    } catch (err) {
      const backendError =
        err?.data?.error || 'Something went wrong. Please try again.';
      const conflicts = err?.data?.conflict || [];

      let conflictMsg = backendError;
      if (conflicts.length > 0) {
        const formattedConflicts = conflicts
          .map(
            (slot) =>
              `• ${slot.slot_date} from ${slot.start_time} to ${slot.end_time}`
          )
          .join('\n');
        conflictMsg += `\n\nConflicting Slots:\n${formattedConflicts}`;
      }

      setErrorMessage(backendError);
      Swal.fire({
        title: 'Error',
        text: conflictMsg,
        icon: 'error',
        confirmButtonText: 'OK',
        customClass: {
          popup: 'whitespace-pre-wrap text-left',
        },
      });
    }
  };

  const resetForm = () => {
    setSlotData({
      date: '',
      time: '',
      endTime: '',
      isRecurring: false,
      recurrenceDay: '',
      repeatUntil: '',
    });
    setErrorMessage('');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-blue-600 mb-4">
        Add Appointment Slot
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            name="date"
            value={slotData.date}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div className="flex gap-4">
          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-700">
              Start Time
            </label>
            <input
              type="time"
              name="time"
              value={slotData.time}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-700">
              End Time
            </label>
            <input
              type="time"
              name="endTime"
              value={slotData.endTime}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border rounded-md"
            />
          </div>
        </div>

        <div>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              name="isRecurring"
              checked={slotData.isRecurring}
              onChange={handleRecurringChange}
              className="form-checkbox text-blue-600"
            />
            <span className="ml-2 text-sm">Recurring Slot</span>
          </label>
        </div>

        {slotData.isRecurring && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Recurrence Day (Based on Selected Date)
              </label>
              <input
                type="text"
                readOnly
                value={slotData.recurrenceDay || 'Select a date to see the day'}
                className="mt-1 block w-full px-3 py-2 border rounded-md bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Repeat Until
              </label>
              <input
                type="date"
                name="repeatUntil"
                value={slotData.repeatUntil}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border rounded-md"
              />
            </div>
          </>
        )}

        {errorMessage && (
          <div className="text-red-600 text-sm mt-2">{errorMessage}</div>
        )}

        <button
          type="submit"
          disabled={isLoading || isGenerating}
          className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
        >
          {isLoading || isGenerating ? 'Processing...' : 'Add Slot'}
        </button>
      </form>
    </div>
  );
};

export default AddAppointmentSlot;
