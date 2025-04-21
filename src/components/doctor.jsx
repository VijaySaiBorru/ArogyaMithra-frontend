import React, { useEffect, useState } from "react";
import getBaseUrl from "../utils/baseURL";

const DoctorCard = ({ doctor }) => {
  const [imageSrc, setImageSrc] = useState("");

  useEffect(() => {
    if (doctor?.user_id) {
      fetchProfileImage(doctor.user_id);
    }
  }, [doctor]);

  const fetchProfileImage = async (userId) => {
    try {
      const response = await fetch(`${getBaseUrl()}/api/user/image/${userId}`);
      const data = await response.json();
      if (response.ok && data.base64) {
        setImageSrc(data.base64);
      } else {
        console.error("Failed to load image:", data.error);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  if (!doctor) return null;

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-300">
      <img
        src={imageSrc || doctor.profile_image || "https://via.placeholder.com/300x200.png?text=Doctor"}
        alt={doctor.name || "Doctor"}
        className="w-full h-48 object-cover"
      />
      <div className="p-4 text-center">
        <h4 className="text-xl font-semibold text-gray-800 mb-1">
          {doctor.name || "Unknown"}
        </h4>
        <p className="text-sm text-gray-500">
          {doctor.specialization || "Department not specified"}
        </p>
      </div>
    </div>
  );
};


export default DoctorCard;
