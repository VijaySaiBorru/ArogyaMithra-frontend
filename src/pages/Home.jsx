import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Slider from "react-slick";
import TestimonialsSection from "./Testimonals";

const Home = () => {
  const heroVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, delay: i * 0.2, ease: "easeOut" },
    }),
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <motion.section
        className="relative bg-gradient-to-r from-blue-800 to-blue-600 text-white pt-16 px-4 sm:px-6 lg:px-8 overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={heroVariants}
      >
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: "url('/logo-pattern.png')" }}
        ></div>
        <div className="relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row items-center">
          <motion.div className="lg:w-1/2 text-left" variants={heroVariants}>
            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight tracking-tight"
              variants={heroVariants}
            >
              Book Appointment
              <br />
              With Trusted Doctors
            </motion.h1>

            <div className="flex flex-col sm:flex-row items-center mb-8 gap-6">
  {/* Avatars */}
  <div className="flex -space-x-4">
    {["/patient1.png", "/patient2.png", "/patient3.png"].map((src, i) => (
      <div
        key={i}
        className="w-12 h-12 rounded-full border-2 border-white overflow-hidden bg-gray-300"
      >
        <img src={src} alt="User" className="w-full h-full object-cover" />
      </div>
    ))}
  </div>

  {/* Message */}
  <motion.p
    className="text-lg sm:text-xl font-light max-w-xl text-center sm:text-left"
    variants={heroVariants}
  >
    Simply browse through our extensive list of trusted doctors,
    schedule your appointment hassle-free.
  </motion.p>
</div>


            <motion.div variants={heroVariants} className="space-x-4">
              <Link
                to="/appointments"
                className="inline-flex items-center bg-white text-blue-700 px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:bg-blue-50 hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300"
              >
                Book appointment
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
              <Link
                to="/about"
                className="inline-block bg-transparent text-white border-2 border-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-blue-700 hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white"
              >
                Learn More
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            className="lg:w-1/2 mt-10 lg:mt-0 flex justify-end"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <img
              src="/banner.png"
              alt="Trusted Doctors"
              className="max-h-[450px] object-contain"
            />
          </motion.div>
        </div>
      </motion.section>

      {/* Services */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.h2
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-16 text-gray-800"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariants}
        >
          Our Core Services
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {[
            {
              title: "Patient Management",
              description:
                "Efficiently manage patient records, appointments, and medical histories.",
              icon: "image2.png",
            },
            {
              title: "Doctor Scheduling",
              description:
                "Organize doctor schedules and ensure optimal resource allocation.",
              icon: "image1.png",
            },
            {
              title: "Billing & Invoicing",
              description:
                "Simplify billing with automated invoicing and payment tracking.",
              icon: "image3.png",
            },
          ].map((service, index) => (
            <motion.div
              key={service.title}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={cardVariants}
              custom={index}
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex justify-center items-center mb-6">
                <img
                  src={service.icon}
                  alt={service.title}
                  className="w-20 h-20 sm:w-24 sm:h-24 object-contain"
                />
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800">
                {service.title}
              </h3>
              <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      {/* <motion.section
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-100"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
      >
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-16 text-gray-800">
          What Our Users Say
        </h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              name: "Dr. Sarah Johnson",
              role: "Chief Physician",
              quote:
                "This system has revolutionized how we manage patient care. It’s intuitive and efficient.",
              image: "/aboutus.png", // 👈 First image
            },
            {
              name: "Emily Carter",
              role: "Patient",
              quote:
                "Booking appointments and accessing my records has never been easier. Highly recommend!",
              image: "/patient1.png", // 👈 Second image
            },
          ].map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              className="bg-white p-8 rounded-xl shadow-lg"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={cardVariants}
              custom={index}
            >
              <p className="text-gray-600 text-lg italic mb-6">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center gap-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-gray-800">{testimonial.name}</p>
                  <p className="text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section> */}
      <TestimonialsSection />


      {/* CTA Section */}
      <motion.section
        className="relative bg-gradient-to-r from-blue-800 to-blue-600 text-white py-20 px-4 sm:px-6 lg:px-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
      >
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('/logo-pattern-cta.png')" }}
        ></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.h2
            className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 tracking-tight"
            variants={sectionVariants}
          >
            Ready to Enhance Your Hospital’s Efficiency?
          </motion.h2>
          <motion.p
            className="text-lg sm:text-xl mb-10 font-light"
            variants={sectionVariants}
          >
            Contact us today to discover how our system can transform your
            healthcare operations.
          </motion.p>
          <motion.div variants={sectionVariants}>
            <Link
              to="/contact"
              className="inline-block bg-white text-blue-700 px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:bg-blue-50 hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white"
            >
              Contact Us
            </Link>
          </motion.div>
        </div>
      </motion.section>
      <motion.section
  className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50"
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
  variants={sectionVariants}
>
  <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
    <motion.div
      className="lg:w-1/2 flex justify-center"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
    >
      <img
        src="/create.png"
        alt="Create an Account"
        className="max-h-[400px] object-contain"
      />
    </motion.div>
    
    <motion.div
      className="lg:w-1/2 text-center lg:text-left"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h3 className="text-3xl font-semibold text-gray-800 mb-4">
        Don't have an account?
      </h3>
      <p className="text-lg text-gray-600 mb-6">
        Sign up today to book your appointments, manage your health records, and more!
      </p>
      <Link
        to="/register"
        className="inline-block bg-blue-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:bg-blue-700 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300"
      >
        Create an Account
      </Link>
    </motion.div>
  </div>
</motion.section>

    </div>
  );
};

export default Home;
