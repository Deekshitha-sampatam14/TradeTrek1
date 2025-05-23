import React from 'react';
import { Link } from 'react-router-dom';

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
  { id: "cleaning", title: "Cleaning", services: [
      { name: "House Cleaning", imgSrc: "./house.webp" },
      { name: "Office Cleaning", imgSrc: "./office-cleaning.jpg" },
      { name: "Window Cleaning", imgSrc: "./window-cleaning.jpg" },
    ]},
  { id: "plumbing", title: "Plumbing", services: [
      { name: "Pipe Repairs", imgSrc: "./pipe-repair.jpg" },
      { name: "Drain Cleaning", imgSrc: "./drain-clean.jpg" },
    ]},
  { id: "it-services", title: "IT Services", services: [
      { name: "Computer Repair", imgSrc: "./computer_repair.jpg" },
      { name: "Network Setup", imgSrc: "./netsetup.webp" },
      { name: "Software Installation", imgSrc: "./software-install.webp" },
    ]},
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


];

const AlternativeServices = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="relative h-64 bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: 'url(./service-banner.jpg)' }}>
        <h1 className="text-white text-4xl font-bold bg-black bg-opacity-50 px-6 py-3 rounded-md">Find Your Service</h1>
      </header>
      
      <div className="container mx-auto py-10">
        {serviceCategories.map((category) => (
          <section key={category.id} className="mb-12">
            <h3 className="text-3xl font-semibold text-gray-800 mb-6 border-b-2 pb-2">{category.title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.services.map((service, index) => (
                <Link to="/sign_login_req" key={index} className="block bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition">
                  <img src={service.imgSrc} alt={service.name} className="w-full h-52 object-cover" />
                  <div className="p-4">
                    <p className="text-lg font-semibold text-gray-700 text-center">{service.name}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default AlternativeServices;
