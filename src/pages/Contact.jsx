import React from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

const hospitalInfo = {
  name: 'ArogyaMithra',
  address: '#123, Main Road, Hyderabad, Telangana, India | Phone: 12345 67890 | www.arogyamithra.com',
  logoUrl: '/logo.png',
};

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const Contact = () => {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-teal-400 min-h-screen py-12 px-4">
      <motion.div
        className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-xl"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ staggerChildren: 0.2 }}
      >
        <motion.div variants={fadeInUp} className="flex justify-center mb-6">
          <img src={hospitalInfo.logoUrl} alt={hospitalInfo.name} className="h-16 w-auto" />
        </motion.div>

        <motion.h1 variants={fadeInUp} className="text-4xl font-extrabold text-center text-blue-700 mb-6">
          Contact Us
        </motion.h1>

        <motion.p variants={fadeInUp} className="text-center text-gray-600 text-lg mb-10">
          We'd love to hear from you. Whether you have a question, feedback, or need assistance—reach out to us!
        </motion.p>

        {/* Contact Form */}
        <motion.form
          className="space-y-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.1 }}
        >
          <motion.div variants={fadeInUp}>
            <label className="block text-gray-700 font-medium mb-2">Full Name</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-xl px-6 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Enter your name"
              required
            />
          </motion.div>

          <motion.div variants={fadeInUp}>
            <label className="block text-gray-700 font-medium mb-2">Email</label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded-xl px-6 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Enter your email"
              required
            />
          </motion.div>

          <motion.div variants={fadeInUp}>
            <label className="block text-gray-700 font-medium mb-2">Message</label>
            <textarea
              rows="5"
              className="w-full border border-gray-300 rounded-xl px-6 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Write your message"
              required
            ></textarea>
          </motion.div>

          <motion.div variants={fadeInUp} className="text-center">
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-600 text-white text-lg font-semibold px-8 py-3 rounded-lg hover:bg-blue-700 focus:outline-none transition"
            >
              Send Message
            </motion.button>
          </motion.div>
        </motion.form>

        {/* Careers Section */}
        <motion.div
          className="mt-16 bg-blue-100 p-8 rounded-lg shadow-lg"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.1 }}
        >
          <motion.h2 variants={fadeInUp} className="text-3xl font-semibold text-blue-700 text-center mb-4">
            Careers at {hospitalInfo.name}
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-center text-lg text-gray-700 mb-6">
            We're always looking for talented individuals to join our mission to provide excellent healthcare.
          </motion.p>
          <motion.div variants={fadeInUp} className="text-center">
            <a
              href="/careers"
              className="inline-block bg-teal-600 text-white px-8 py-3 rounded-lg hover:bg-teal-700 transition"
            >
              Explore Jobs
            </a>
          </motion.div>
        </motion.div>

        {/* Address Section */}
        <motion.div
          className="mt-12 text-center text-gray-600 text-sm"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.p variants={fadeInUp} className="mb-4">Or reach us at:</motion.p>
          <motion.div variants={fadeInUp} className="flex justify-center items-center space-x-4">
            <div className="flex items-center space-x-2">
              <FaMapMarkerAlt className="text-blue-600 text-xl" />
              <span>{hospitalInfo.address}</span>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Contact;
