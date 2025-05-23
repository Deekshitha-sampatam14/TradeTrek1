import React from "react";
import { Link } from "react-router-dom";
import FAQ from '../FAQ';

const Home = () => {

  

  const steps = [
    {
      img: "./search-icon.jpg",
      title: "Search For Services",
      description: "Find local professionals by searching for the service you need and your location.",
    },
    {
      img: "./connect-icon.png",
      title: "Choose and Connect",
      description: "View profiles, read reviews, and reach out to the tradesperson that fits your needs.",
    },
    {
      img: "./job-done-icon.png",
      title: "Get the Job Done",
      description: "Book the service, leave a review, and complete the job with confidence.",
    },
  ];
  
  const services = [
    {
      title: "Plumbing",
      name:"plumber",
      description: "Need a plumber? Our experts can fix leaks, install fixtures, and more.",
      image: "./plumbing.jpg",
    },
    {
      title: "Electrician",
      name:"electrician",
      description: "Our electricians are here to help with wiring, repairs, and installations.",
      image: "./electrical.avif",
    },
    {
      title: "Handyman",
      name:"handyman",
      description: "From small repairs to major improvements, our handymen get the job done.",
      image: "./handy.webp",
    },
    {
      title: "Carpentry",
      name:"carpenter",
      description:
        "Our carpenters provide custom woodworking, furniture repair, and more for your home and office.",
      image: "./carpentry.avif",
    },
    {
      title: "HVAC",
      name:"hvac",
      description:
        "Stay comfortable all year round with our HVAC installation, maintenance, and repair services.",
      image: "./hvac.jpg",
    },
    {
      title: "Painting",
      name:"painter",
      description: "Our expert painters offer interior and exterior painting to refresh your home or business.",
      image: "./painting.jpg",
    },
    {
      title: "Roof Repairs",
      name:"roof_repair",
      description:
        "Protect your home with professional roof repairs and maintenance from our skilled team.",
      image: "./roof_repair.avif",
    },
    {
      title: "House Cleaning",
      name:"cleaning",
      description:
        "Our cleaning services will keep your home spotless, offering everything from basic cleaning to deep cleaning.",
      image: "./house_cleaning.jpg",
    },
    {
      title: "Appliance Installation",
      name:"appliance installation",
      description:
        "We provide professional installation for all major household appliances, ensuring they run smoothly.",
      image: "./appliance_installation.avif",
    },
  ];
  


  return (
    <div className="bg-[#F7F3E9]">
      {/* Hero Section */}
      <section className="bg-[#F7F3E9] py-20 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl lg:text-6xl">
            Find Skilled Tradespeople Near You, Fast.
          </h1>
          <p className="mt-6 text-lg text-gray-600">
            Whether you need a plumber, electrician, or handyman, TradeTrek
            connects you with trusted professionals in your area for all your
            small repairs and projects.
          </p>

          <div className="mt-10 flex justify-center gap-4">
            <input
              type="text"
              id="service"
              placeholder="Enter Service"
              className="w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#98C379]"
            />
            <input
              type="text"
              id="location"
              placeholder="Enter Location"
              className="w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#98C379]"
            />
             <Link to="/sign_login_req">
            <div className="w-12 h-12 flex items-center justify-center bg-[#98C379] hover:bg-green-700 text-white rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11 16l4-4m0 0l-4-4m4 4H7"
                />
              </svg>
            </div>
            </Link>
          </div>
          <Link to="/alt_services">
            <button
              className="mt-8 justify-center bg-[#98C379] text-white rounded-full px-4 py-2 w-80 h-20 text-2xl hover:bg-green-700"
              
            >
              Our Services
            </button>
          </Link>
        </div>
      </section>

      {/* Popular Services Section */}
      <section className="py-20 bg-gray-100">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-extrabold text-center text-[#3A506B] mb-12" data-aos="fade-up">
          Popular Services
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Link to="/sign_login_req">
            <div
              key={index}
              className="block rounded-lg overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-xl"
              data-aos="fade-up"
            >
              <div className="relative">
                <img
                  src={service.image}
                  alt={`${service.title} Service`}
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="p-6 bg-white">
                <h3 className="text-xl font-semibold text-[#3A506B]">{service.title}</h3>
                <p className="mt-2 text-gray-600">{service.description}</p>
              </div>
            </div>
            </Link>
          ))}
          <Link
            to="/alt_services"
            className="block rounded-lg overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-xl"
            data-aos="fade-up"
          >
            <div className="relative bg-[#F7F3E9] h-48 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-[#3A506B]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <div className="p-6 bg-white text-center">
              <h3 className="text-xl font-semibold text-[#3A506B]">See All Services</h3>
              <p className="mt-2 text-gray-600">
                Explore all the services we offer to meet your needs.
              </p>
            </div>
          </Link>
        </div>
      </div>
    </section>

      {/* Additional Sections */}
      <section className="bg-[#F7F3E9] py-10"  data-aos="fade-up">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row bg-white p-6 rounded-lg shadow-lg gap-6">
          <div className="flex-[2] flex flex-col gap-5">
            <h3 className="text-[#3A506B] font-extrabold text-2xl pt-5">
              Your Happiness Guaranteed
            </h3>
            <p className="text-gray-600 mt-2">
              Your happiness is our goal. If you’re not happy, we’ll work to
              make it right. Our friendly customer service agents are available
              24 hours a day, 7 days a week. The Handy Happiness Guarantee only
              applies when you book and pay for a service directly through the
              Handy platform.
            </p>
          </div>
          <div className="flex-[3]">
            <img
              src="./happy.jpg"
              alt="Happiness Guaranteed"
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-[#F7F3E9] py-10" data-aos="fade-up">
  <div className="max-w-6xl mx-auto bg-white p-10 rounded-lg shadow-lg text-center">
    <h2 className="text-[#3A506B] font-extrabold text-3xl pb-8">How it Works</h2>
    <div className="flex flex-col md:flex-row gap-8 justify-center items-start">
      {steps.map((step, idx) => (
        <div key={idx} className="rounded-lg shadow-lg flex flex-col items-center bg-[#F7F3E9] p-6 w-full md:w-1/3">
          <img src={step.img} alt={step.title} className="w-16 h-16 mb-4" />
          <h4 className="text-[#3A506B] font-extrabold text-xl">{step.title}</h4>
          <p className="text-gray-600 mt-2 text-center">{step.description}</p>
        </div>
      ))}
    </div>
  </div>
</section>


<section className="bg-[#F7F3E9] py-16"  data-aos="fade-up">
  <div className="max-w-6xl mx-auto px-6">

    <h2 className="text-4xl font-extrabold text-center text-[#3A506B] mb-12">Why Choose Us?</h2>
    
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      
    
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h3 className="text-2xl font-bold text-[#3A506B] mb-4">For Users</h3>
        <ul className="space-y-4 text-gray-600">
          <li className="flex items-start">
            <svg className="w-6 h-6 text-[#98C379] mr-3" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20 6l-8.5 11L4 10.5l1.5-1.5L11.5 14 18.5 5 20 6z"/></svg>
            <span>Easy access to trusted local professionals</span>
          </li>
          <li className="flex items-start">
            <svg className="w-6 h-6 text-[#98C379] mr-3" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20 6l-8.5 11L4 10.5l1.5-1.5L11.5 14 18.5 5 20 6z"/></svg>
            <span>Verified profiles for reliability and trust</span>
          </li>
          <li className="flex items-start">
            <svg className="w-6 h-6 text-[#98C379] mr-3" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20 6l-8.5 11L4 10.5l1.5-1.5L11.5 14 18.5 5 20 6z"/></svg>
            <span>Real user reviews to guide your choice</span>
          </li>
        </ul>
      </div>
      
      
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h3 className="text-2xl font-bold text-[#3A506B] mb-4">For Tradespeople</h3>
        <ul className="space-y-4 text-gray-600">
          <li className="flex items-start">
            <svg className="w-6 h-6 text-[#98C379] mr-3" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20 6l-8.5 11L4 10.5l1.5-1.5L11.5 14 18.5 5 20 6z"/></svg>
            <span>Platform to grow your business and reach more clients</span>
          </li>
          <li className="flex items-start">
            <svg className="w-6 h-6 text-[#98C379] mr-3" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20 6l-8.5 11L4 10.5l1.5-1.5L11.5 14 18.5 5 20 6z"/></svg>
            <span>Connect with local clients who need your skills</span>
          </li>
          <li className="flex items-start">
            <svg className="w-6 h-6 text-[#98C379] mr-3" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20 6l-8.5 11L4 10.5l1.5-1.5L11.5 14 18.5 5 20 6z"/></svg>
            <span>Showcase your expertise and build your reputation</span>
          </li>
        </ul>
      </div>
      
    </div>
  </div>
</section>

<section className="bg-gray-100 py-10"  data-aos="fade-up">
  <div className="max-w-6xl mx-auto flex items-center bg-white rounded-lg shadow-lg overflow-hidden">
    
    
    <div className="flex-1">
      <img src="./excite.png" alt="Service professionals" className="w-full h-full object-cover" />
    </div>

    
    <div className="flex-1 p-8 text-gray-800 space-y-6">
      <h2 className="text-3xl font-extrabold text-[#3A506B]">Why We Stand Out</h2>

      <div>
        <h3 className="text-xl font-semibold text-[#98C379]">1. Verified Professionals</h3>
        <p className="text-gray-600">
          All tradespeople are carefully vetted to ensure high-quality, professional services.
        </p>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-[#98C379]">2. Transparent Reviews</h3>
        <p className="text-gray-600">
          Read authentic reviews to choose the right professional for your needs.
        </p>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-[#98C379]">3. Easy Booking</h3>
        <p className="text-gray-600">
          Book your service in just a few clicks and get the job done quickly.
        </p>
      </div>
    </div>
  </div>
</section>


<section className="bg-gray-100 py-10"  data-aos="fade-up">
  <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
    <h2 className="text-3xl font-extrabold text-[#3A506B] mb-8">Get Started</h2>

    
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
      
      <div className="bg-[#F7F3E9] rounded-lg p-6 shadow-md flex flex-col items-center text-gray-800">
        <h3 className="text-xl font-bold text-[#3A506B] mb-4">For Users</h3>
        <p className="text-gray-600 mb-6">Find and save your favorite tradespeople easily.</p>
       <Link to="/signup"> <button className="bg-[#98C379] text-white font-semibold px-4 py-2 rounded-lg hover:bg-green-700">
          Join as a User
        </button>
        </Link>
      </div>

      
      <div className="bg-[#F7F3E9] rounded-lg p-6 shadow-md flex flex-col items-center text-gray-800">
        <h3 className="text-xl font-bold text-[#3A506B] mb-4">For Tradespeople</h3>
        <p className="text-gray-600 mb-6">List your services and connect with local clients.</p>
        <Link to="/signup"><button className="bg-[#98C379] text-white font-semibold px-4 py-2 rounded-lg hover:bg-green-700">
          Join as a Tradesperson
        </button>
        </Link>
      </div>
      
    </div>
  </div>
</section>

<section className="bg-[#F7F3E9] py-16"  data-aos="fade-up">
  <div className="max-w-6xl mx-auto px-6">
    <h2 className="text-4xl font-extrabold text-center text-[#3A506B] mb-12">
      What Our Customers Say
    </h2>

    <div className="flex flex-wrap justify-center gap-8">
      {/* Testimonial 1 */}
      <div className="max-w-sm rounded-lg bg-white shadow-lg p-6 text-center">
        <img src="./testimonial1.jpg" alt="Customer" className="w-16 h-16 rounded-full mx-auto mb-4" />
        <p className="text-lg text-gray-600 mb-4">
          "TradeTrek helped me find a reliable plumber in my area. The service was quick, and the prices were fair!"
        </p>
        <h4 className="text-[#3A506B] font-semibold">Jane D.</h4>
        <p className="text-gray-500">Homeowner</p>
      </div>

      {/* Testimonial 2 */}
      <div className="max-w-sm rounded-lg bg-white shadow-lg p-6 text-center">
        <img src="./testimonial2.jpg" alt="Customer" className="w-16 h-16 rounded-full mx-auto mb-4" />
        <p className="text-lg text-gray-600 mb-4">
          "The handyman I hired from TradeTrek was punctual and professional. I couldn't have asked for better service!"
        </p>
        <h4 className="text-[#3A506B] font-semibold">John R.</h4>
        <p className="text-gray-500">Business Owner</p>
      </div>

      {/* Testimonial 3 */}
      <div className="max-w-sm rounded-lg bg-white shadow-lg p-6 text-center">
        <img src="./testimonial3.jpg" alt="Customer" className="w-16 h-16 rounded-full mx-auto mb-4" />
        <p className="text-lg text-gray-600 mb-4">
          "I found an excellent electrician through TradeTrek. They came out quickly and fixed the problem in no time!"
        </p>
        <h4 className="text-[#3A506B] font-semibold">Alice W.</h4>
        <p className="text-gray-500">Apartment Resident</p>
      </div>
    </div>
  </div>
</section>

<FAQ/>


    </div>
  );
};

export default Home;
