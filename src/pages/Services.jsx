import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Animation variants for header
const headerVariants = {
  hidden: { opacity: 0, y: -50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

// Animation variants for service cards
const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, delay: i * 0.2, ease: 'easeOut' },
  }),
};

// Animation variants for CTA section
const ctaVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const Services = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header Section */}
      <motion.section
        className="bg-gradient-to-r from-blue-800 to-blue-600 text-white py-16 px-4 sm:px-6 lg:px-8"
        initial="hidden"
        animate="visible"
        variants={headerVariants}
      >
        <div className="max-w-6xl mx-auto text-center">
          <motion.h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 tracking-tight"
            variants={headerVariants}
          >
            Our Healthcare Services
          </motion.h1>
          <motion.p
            className="text-lg sm:text-xl font-light max-w-2xl mx-auto"
            variants={headerVariants}
          >
            Discover how our platform streamlines operations and enhances patient care with innovative solutions.
          </motion.p>
        </div>
      </motion.section>

      {/* Services Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.h2
          className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-12 text-gray-800"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={headerVariants}
        >
          Core Services
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {[
            {
              title: 'Patient Management',
              description:
                'Efficiently manage patient records, appointments, and medical histories with our intuitive system.',
              icon: '/image2.png',
            },
            {
              title: 'Doctor Scheduling',
              description:
                'Optimize doctor schedules and resource allocation to ensure seamless operations.',
              icon: '/image1.png',
            },
            {
              title: 'Billing & Invoicing',
              description:
                'Simplify financial operations with automated billing and payment tracking.',
              icon: '/image3.png',
            },
          ].map((service, index) => (
            <motion.div
              key={service.title}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={cardVariants}
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
            >
              <div className="flex justify-center items-center mb-6">
                <img
                  src={service.icon}
                  alt={service.title}
                  className="w-20 h-20 sm:w-24 sm:h-24 object-contain"
                />
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800 text-center">
                {service.title}
              </h3>
              <p className="text-gray-600 text-base sm:text-lg leading-relaxed text-center">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Call to Action Section */}
      <motion.section
        className="bg-gradient-to-r from-blue-800 to-blue-600 text-white py-16 px-4 sm:px-6 lg:px-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={ctaVariants}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 tracking-tight"
            variants={ctaVariants}
          >
            Transform Your Healthcare Operations
          </motion.h2>
          <motion.p
            className="text-lg sm:text-xl mb-8 font-light max-w-2xl mx-auto"
            variants={ctaVariants}
          >
            Get started today and see how our services can improve efficiency and patient satisfaction.
          </motion.p>
          <motion.div className="flex flex-col sm:flex-row justify-center gap-4" variants={ctaVariants}>
            <Link
              to="/appointments"
              className="inline-block bg-white text-blue-700 px-8 py-3 rounded-full font-semibold text-lg shadow-md hover:bg-blue-50 hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300"
            >
              Book an Appointment
            </Link>
            <Link
              to="/contact"
              className="inline-block bg-transparent text-white border-2 border-white px-8 py-3 rounded-full font-semibold text-lg hover:bg-white hover:text-blue-700 hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white"
            >
              Contact Us
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default Services;