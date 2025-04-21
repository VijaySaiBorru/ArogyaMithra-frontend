import React from 'react';
import { motion } from 'framer-motion';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: 'easeOut'
    }
  })
};

const AboutHospital = () => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-white min-h-screen py-16 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Hero Section */}
        <motion.div
          className="flex flex-col md:flex-row items-center gap-10 mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <motion.div className="md:w-1/3 w-full flex justify-center" variants={fadeInUp}>
            <motion.img
              src="/hospital.png"
              alt="Hospital"
              className="rounded-2xl shadow-lg object-cover w-[320px] h-[320px] bg-white"
              whileHover={{ scale: 1.05 }}
            />
          </motion.div>
          <motion.div className="md:w-2/3 w-full text-center md:text-left" variants={fadeInUp}>
            <h1 className="text-5xl font-bold text-blue-700 mb-4">
              About Our Hospital
            </h1>
            <p className="text-gray-700 text-lg leading-relaxed max-w-2xl">
              Dedicated to healing. Driven by innovation. Our hospital is a beacon of hope and care, offering state-of-the-art medical services and compassionate healthcare for over two decades.
            </p>
          </motion.div>
        </motion.div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-10 mb-20">
          {[
            {
              title: '🎯 Our Mission',
              content:
                'To deliver high-quality, patient-centered healthcare services with integrity, empathy, and innovation — enhancing lives and communities through advanced medical care and education.'
            },
            {
              title: '🚀 Our Vision',
              content:
                'To be the most trusted and advanced healthcare provider in the region, known for excellence in clinical care, research, and medical innovation.'
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-md border border-blue-100 hover:bg-blue-50 transition-all duration-300"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={index}
            >
              <h2 className="text-2xl font-semibold text-blue-600 mb-3 flex items-center gap-2">
                {item.title}
              </h2>
              <p className="text-gray-600 leading-relaxed">{item.content}</p>
            </motion.div>
          ))}
        </div>

        {/* Core Values */}
        <div className="mb-20 text-center">
          <motion.h2
            className="text-3xl font-bold text-blue-700 mb-8"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            Our Core Values
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            {[
              { icon: '💙', title: 'Compassion', desc: 'We treat every patient with kindness, empathy, and respect.' },
              { icon: '🏆', title: 'Excellence', desc: 'We strive for the highest standards in care and continuous improvement.' },
              { icon: '🤝', title: 'Integrity', desc: 'We are honest, ethical, and transparent in everything we do.' }
            ].map((val, idx) => (
              <motion.div
                key={val.title}
                className="bg-white p-8 rounded-2xl shadow-md border border-blue-100 hover:bg-blue-50 transition-all duration-300"
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={idx}
              >
                <div className="text-blue-500 text-2xl mb-2">{val.icon}</div>
                <h3 className="text-xl font-semibold text-blue-500 mb-2">{val.title}</h3>
                <p className="text-gray-600">{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Journey Section */}
        <motion.div
          className="mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h2 className="text-3xl font-bold text-blue-700 mb-4 text-center">Our Journey</h2>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 text-center md:text-right">
              <div className="inline-block border-l-4 border-blue-400 pl-6">
                <p className="text-gray-700 text-lg leading-relaxed max-w-2xl">
                  <span className="font-bold text-blue-700">2003:</span> Established as a 50-bed facility with a vision to provide accessible and quality healthcare.
                  <br /><br />
                  <span className="font-bold text-blue-700">Today:</span> Now a 500+ bed multi-specialty hospital with world-class doctors, modern infrastructure, and a legacy of saving lives and serving communities across the country.
                </p>
              </div>
            </div>
            <div className="flex-1 flex justify-center">
              <motion.img
                src="/hospital-journey.png"
                alt="Hospital Journey"
                className="rounded-xl shadow-lg object-cover w-[320px] h-[220px] bg-white"
                whileHover={{ scale: 1.05 }}
              />
            </div>
          </div>
        </motion.div>

        {/* Why Choose Us */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-blue-700 mb-8 text-center">Why Choose Our Hospital?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '👩‍⚕️', title: 'Expert Staff', desc: 'Highly qualified and compassionate medical professionals.' },
              { icon: '🏥', title: 'Modern Facilities', desc: 'Advanced medical equipment and hygienic environment.' },
              { icon: '💡', title: 'Patient-Centric', desc: 'Personalized care, transparent pricing, and 24/7 support.' }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                className="bg-white p-8 rounded-2xl shadow-md border border-blue-100 hover:bg-blue-50 transition-all duration-300 flex flex-col items-center text-center"
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={index}
              >
                <div className="text-4xl mb-2 text-blue-500">{item.icon}</div>
                <h3 className="font-semibold text-blue-600 mb-2">{item.title}</h3>
                <p className="text-gray-700">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutHospital;
