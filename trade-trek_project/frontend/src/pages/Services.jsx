import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const serviceCategories = [
  {
    id: "popular",
    title: "Popular",
    services: [
      { name: "House Cleaning", imgSrc: "./house_cleaning.jpg" },
      { name: "Plumbing", imgSrc: "./plumbing.jpg" },
      { name: "Electrical", imgSrc: "./electrical.avif" },
    ],
  },
  {
    id: "cleaning",
    title: "Cleaning",
    services: [
      { n:"cleaning",name: "House Cleaning", imgSrc: "./house.webp" },
      { n:"cleaning",name: "Office Cleaning", imgSrc: "./office-cleaning.jpg" },
      { n:"cleaning",name: "Window Cleaning", imgSrc: "./window-cleaning.jpg" },
    ],
  },
  {
    id: "plumbing",
    title: "Plumbing",
    services: [
      { name: "Pipe Repairs", imgSrc: "./pipe-repair.jpg" },
      { name: "Drain Cleaning", imgSrc: "./drain-clean.jpg" },
    ],
  },
  {
    id: "roofing",
    title: "Roofing",
    services: [
      { name: "Roof Repairs", imgSrc: "./roof-repair.jpg" },
      { name: "Roof Replacement", imgSrc: "./roof-replace.jpg" },
    ],
  },
  {
    id: "carpentry",
    title: "Carpentry",
    services: [
      { name: "Furniture Making", imgSrc: "./furniture-make.webp" },
      { name: "Door Installation", imgSrc: "./door-installation.jpg" },
    ],
  },
  {
    id: "appliance-repair",
    title: "Appliance Repair",
    services: [
      { name: "Refrigerator Repairs", imgSrc: "./fride-repair.jpg" },
      { name: "Washing Machine Repair", imgSrc: "./washmachine-repair.jpg" },
    ],
  },
  {
    id: "security-services",
    title: "Security Services",
    services: [
      { name: "Alarm System Installation", imgSrc: "./alarm.webp" },
      { name: "Surveillance Camera Installation", imgSrc: "./cc_cam.jpg" },
      { name: "Locksmith Services", imgSrc: "./locksmith.jpg" },
    ],
  },
  {
    id: "moving-transport",
    title: "Moving & Transport",
    services: [
      { name: "Home/Office Moving", imgSrc: "./house_move.jpg" },
      { name: "Packing Services", imgSrc: "./packing.webp" },
      { name: "Furniture Delivery", imgSrc: "./delivery.webp" },
    ],
  },
  {
    id: "it-services",
    title: "IT Services",
    services: [
      { name: "Computer Repair", imgSrc: "./computer_repair.jpg" },
      { name: "Network Setup", imgSrc: "./netsetup.webp" },
      { name: "Software Installation", imgSrc: "./software-install.webp" },
    ],
  },
];

const Services = () => {
  const navigate = useNavigate(); // Ensure this is defined
  const handleSubmit = async () => {
    const service = document.getElementById("service").value;
    const location = document.getElementById("location").value;

    if (!service && !location) {
      alert("Please enter either a location or service.");
      return;
    }

    const searchData = { service, location };

    try {
      const baseUrl = process.env.NODE_ENV === "production"
  ? "https://tradetrek.onrender.com"
  : "http://localhost:5000";

      const response = await fetch('${baseUrl}/api/auth/nearby', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchData),
      });

      const data = await response.json();
      if (response.ok) {
        // Handle successful response (e.g., display the list of tradespeople)
        navigate("/tlist", {
          state: { tdata: data },
        });

        console.log(data);
      } else {
        alert(data.message || 'An error occurred.');
      }
    } catch (error) {
      console.error('Error during fetch:', error);
      alert('An error occurred.');
    }
  };

  return (
    <>
      <section
        className="relative h-96 bg-cover bg-center"
        style={{
          backgroundImage: 'url(./service.jpg)',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="flex justify-center items-center h-full bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full text-center">
            <h2 className="text-lg font-bold text-[#3A506B] mb-4">
              Choose a service to get started
            </h2>
            <div className="flex flex-wrap justify-center gap-3 mb-4">
              <input
                type="text"
                id="location"
                placeholder="Location"
                className="p-2 border rounded-md w-40 border-accent focus:ring-2 focus:ring-accent outline-none"
              />
              <input
                type="text"
                id="service"
                placeholder="Service Type"
                className="p-2 border rounded-md w-40 border-accent focus:ring-2 focus:ring-accent outline-none"
              />
              <button
                className="px-4 py-2 bg-[#98C379] text-white font-semibold rounded-md hover:bg-[#3A506B] transition duration-200 text-sm"
                onClick={handleSubmit}
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="flex">
        <section className="sticky top-0 h-screen w-1/4 bg-[#F7F3E9] rounded-lg shadow-lg p-6 md:p-8">
          <div className="flex flex-col gap-4">
            <h3 className="text-[#3A506B] pb-5 text-2xl md:text-3xl font-semibold">All Categories</h3>
            {serviceCategories.map((category) => (
              <a
                key={category.id}
                href={`#${category.id}`}
                className="text-[#3A506B] text-base md:text-xl hover:text-black transition-colors"
              >
                {category.title}
              </a>
            ))}
          </div>
        </section>

        <div className="flex-1 p-4">
          {serviceCategories.map((category) => (
            <section id={category.id} className="py-10" key={category.id}>
              <h3 className="text-3xl font-semibold text-[#3A506B] pb-5">{category.title}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.services.map((service, index) => (
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden" key={index}>
                     <Link to="/loc" state={{serv:category.title}} key={index}>
                      <img
                        src={service.imgSrc}
                        alt={service.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <p className="text-lg font-semibold text-[#3A506B]">{service.name}</p>
                      </div>
                      </Link>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </>
  );
};

export default Services;
