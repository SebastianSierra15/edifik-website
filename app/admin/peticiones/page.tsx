"use client";

import React, { useState } from "react";
import Alert from "@/app/ui/alert";

const TestAlertPage: React.FC = () => {
  const [alert, setAlert] = useState({
    type: "success" as "success" | "warning" | "error" | "info",
    message: "",
    show: false,
  });

  const handleShowAlert = (type: "success" | "warning" | "error" | "info") => {
    setAlert({
      type,
      message: `This is a ${type} message!`,
      show: true,
    });

    setTimeout(() => {
      setAlert((prev) => ({ ...prev, show: false }));
    }, 5000); // Auto-hide after 5 seconds
  };

  return (
    <div className="pt-28 flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Test Alert Component</h1>
      <div className="flex space-x-4">
        <button
          onClick={() => handleShowAlert("success")}
          className="bg-green-500 text-white px-4 py-2 rounded-lg"
        >
          Show Success Alert
        </button>
        <button
          onClick={() => handleShowAlert("warning")}
          className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
        >
          Show Warning Alert
        </button>
        <button
          onClick={() => handleShowAlert("error")}
          className="bg-red-500 text-white px-4 py-2 rounded-lg"
        >
          Show Error Alert
        </button>
        <button
          onClick={() => handleShowAlert("info")}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Show Info Alert
        </button>
      </div>

      {/* Render Alert Component */}
      {alert.show && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert((prev) => ({ ...prev, show: false }))}
        />
      )}
    </div>
  );
};

export default TestAlertPage;
