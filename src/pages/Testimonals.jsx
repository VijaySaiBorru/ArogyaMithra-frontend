import Slider from "react-slick";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Dr. Asha Mehta",
    role: "Cardiologist, Apollo Hospitals",
    quote:
      "This digital health system has transformed our workflow. Smooth, reliable, and very Indian user-friendly.",
    image: "/aboutus.png",
  },
  {
    name: "Rahul Sharma",
    role: "Patient from Delhi",
    quote:
      "I booked an appointment in seconds! Getting my reports online saved me so much time.",
    image: "/patient1.png",
  },
  {
    name: "Priya Nair",
    role: "Nutritionist",
    quote:
      "The intuitive dashboard and secure patient records make my consultations much more efficient.",
    image: "/aboutus.png",
  },
  {
    name: "Anand Verma",
    role: "Chronic Care Patient",
    quote:
      "Finally a system that understands Indian healthcare needs. Kudos to the developers!",
    image: "/patient2.png",
  },
];

const settings = {
  dots: true,
  infinite: true,
  autoplay: true,
  speed: 1000,
  autoplaySpeed: 5000,
  slidesToShow: 2,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 1,
      },
    },
  ],
};

export default function TestimonialsSection() {
  return (
    <motion.section
      className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-100 to-white"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
      }}
    >
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-20 text-gray-800">
        What Our Users Say
      </h2>
      <div className="max-w-6xl mx-auto px-2 md:px-4">
  <Slider {...settings}>
    {testimonials.map((testimonial, index) => (
      <motion.div
        key={index}
        className="!mx-2 md:!mx-4 bg-white px-8 py-10 rounded-3xl shadow-xl hover:shadow-2xl transition duration-300 border border-gray-200"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: index * 0.2 }}
      >
        <p className="text-gray-700 text-lg leading-relaxed italic mb-8">
          “{testimonial.quote}”
        </p>
        <div className="flex items-center gap-5">
          <img
            src={testimonial.image}
            alt={testimonial.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500 shadow-md"
          />
          <div>
            <p className="font-bold text-lg text-gray-800">
              {testimonial.name}
            </p>
            <p className="text-sm text-indigo-600 font-medium">
              {testimonial.role}
            </p>
          </div>
        </div>
      </motion.div>
    ))}
  </Slider>
</div>

    </motion.section>
  );
}
