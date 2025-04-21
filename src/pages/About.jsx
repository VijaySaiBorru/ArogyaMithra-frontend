import React from 'react';
import { motion } from 'framer-motion';
import { FaEdit, FaPlus } from 'react-icons/fa';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const buttonVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  hover: { scale: 1.05, boxShadow: '0 4px 12px rgba(0,0,0,0.2)' },
  tap: { scale: 0.95 },
};

const About = () => {
  const missionVision = [
    {
      title: 'Our Mission',
      content:
        'To empower healthcare providers with cutting-edge digital solutions that reduce administrative burden, optimize patient care delivery, and enable better decision-making through real-time data access.',
    },
    {
      title: 'Our Vision',
      content:
        'We envision a future where technology bridges the gap between medical professionals and patients, ensuring that every hospital — no matter how big or small — can provide efficient, high-quality, and personalized healthcare.',
    },
  ];

  const benefits = [
    ['Seamless Integration', 'Easily integrates with your existing hospital systems and workflows.'],
    ['Cloud-Based Access', 'Access patient data securely from anywhere, anytime.'],
    ['Modular Design', 'Choose only the modules you need — from OPD to pharmacy management.'],
    ['Robust Security', 'HIPAA-compliant with full data encryption and user-level access control.'],
    ['Real-Time Reporting', 'Get instant insights on hospital performance and patient metrics.'],
    ['24/7 Expert Support', 'Our technical team is always on standby to help you succeed.'],
  ];

  return (
    <div className="bg-gradient-to-br from-blue-50 to-white min-h-screen py-16 px-6">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Header Section */}
        <motion.div
          className="flex flex-col md:flex-row items-center gap-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ staggerChildren: 0.2 }}
        >
          <motion.div variants={fadeInUp} className="w-full md:w-1/3 flex justify-center">
            <img
              src="/aboutus.png"
              alt="About Hospital"
              className="rounded-xl shadow-lg object-cover w-[320px] h-[320px] bg-white"
            />
          </motion.div>
          <motion.div variants={fadeInUp} className="w-full md:w-2/3 text-center md:text-left">
            <h1 className="text-5xl font-bold text-blue-700 mb-6">About Our Hospital Management System</h1>
            <p className="text-gray-700 text-lg max-w-3xl leading-relaxed">
              We are transforming healthcare through technology. Our all-in-one Hospital Management System
              streamlines operations, improves patient care, and enhances clinical workflows with secure,
              efficient tools.
            </p>
          </motion.div>
        </motion.div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-10">
          {missionVision.map((item, index) => (
            <motion.div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              variants={fadeInUp}
            >
              <h2 className="text-3xl font-semibold text-blue-600 mb-4">{item.title}</h2>
              <p className="text-gray-600 leading-relaxed">{item.content}</p>
            </motion.div>
          ))}
        </div>

        {/* Record Management */}
        <motion.div
          className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.2 }}
        >
          <motion.h2 variants={fadeInUp} className="text-3xl font-semibold text-blue-600 mb-4">
            Patient Record Management
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-gray-600 leading-relaxed mb-6">
            Easily manage diagnostic tests and medications with intuitive controls. Healthcare professionals
            can update patient records in real-time, ensuring precise and efficient care.
          </motion.p>
          <motion.div className="flex flex-wrap gap-3" transition={{ staggerChildren: 0.1 }}>
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              className="bg-yellow-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <FaEdit /> Edit Medications
            </motion.button>
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              className="bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <FaEdit /> Edit Tests
            </motion.button>
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              className="bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <FaPlus /> Add Tests
            </motion.button>
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <FaPlus /> Add Medications
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Why Choose Us */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ staggerChildren: 0.1 }}
        >
          <motion.h3 variants={fadeInUp} className="text-2xl font-semibold text-gray-800 mb-4">
            Why Choose Our System?
          </motion.h3>
          <motion.ul
            variants={fadeInUp}
            className="list-disc list-inside space-y-3 text-gray-700 max-w-3xl mx-auto text-lg"
          >
            {benefits.map(([title, desc], idx) => (
              <li key={idx}>
                <span className="font-medium text-blue-600">{title}:</span> {desc}
              </li>
            ))}
          </motion.ul>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
