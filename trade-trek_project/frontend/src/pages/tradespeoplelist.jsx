import React from "react";
import { useLocation, Link } from "react-router-dom";

const TradespeopleList = () => {
  const location = useLocation();
  const { tdata } = location.state || {}; // Use a fallback if state is undefined

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Available Tradespeople</h1>
      {tdata ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tdata.map((t) => (
            <div
              key={t.id}
              className="border rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200 cursor-pointer"
            >
              <img
                src={t.profileImage || "https://via.placeholder.com/300x200?text=No+Image"}
                alt={t.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{t.name}</h2>
                <p className="text-gray-600 mb-1">
                  <span className="font-bold">Location:</span> {t.location}
                </p>
                <p className="text-gray-600 mb-1">
                  <span className="font-bold">Services:</span> {t.services_offered.join(", ")}
                </p>
                <Link
                  to={{
                    pathname: "/tpview",
                  }}
                  state={{ t }}
                >
                  <button className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700">
                    View Profile
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No tradespeople found.</p>
      )}
    </div>
  );
};

export default TradespeopleList;
