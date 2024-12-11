import React from "react";

const NotFoundPage = () => {
  return (
    <div>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg text-center">
          <h1 className="text-4xl font-semibold text-red-600 mb-4">
            404 - Page Not Found
          </h1>
          <p className="text-lg text-gray-700 mb-6">
            Sorry, the page you&apos;re looking for does not exist.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
