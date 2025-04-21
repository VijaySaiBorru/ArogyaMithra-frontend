import { FaFacebookF, FaTwitter, FaInstagram, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {/* Hospital Info */}
        <div>
          <h3 className="text-2xl font-semibold mb-2">Arogya Mithra</h3>
          <p className="text-sm text-gray-400">
            Dedicated to providing quality healthcare with the latest technology and a compassionate approach. Our aim is to make healthcare accessible to everyone, every day.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-2xl font-semibold mb-2">Quick Links</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><a href="/about-hospital" className="hover:underline hover:text-blue-400">About Us</a></li>
            <li><a href="/services" className="hover:underline hover:text-blue-400">Services</a></li>
            <li><a href="/appointments" className="hover:underline hover:text-blue-400">Appointments</a></li>
            <li><a href="/contact" className="hover:underline hover:text-blue-400">Contact</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-2xl font-semibold mb-2">Contact Us</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-center gap-2"><FaMapMarkerAlt className="text-blue-500" /> #123, Main Road, Hyderabad, Telangana, India</li>
            <li className="flex items-center gap-2"><FaPhoneAlt className="text-blue-500" /> +1 234 567 8901</li>
            <li className="flex items-center gap-2"><FaEnvelope className="text-blue-500" /> info@arogyamithra.com</li>
          </ul>

          {/* Social Media Links */}
          <div className="flex gap-6 mt-6 text-2xl text-gray-300">
            <a href="#" aria-label="Facebook" className="hover:text-blue-600">
              <FaFacebookF />
            </a>
            <a href="#" aria-label="Twitter" className="hover:text-blue-400">
              <FaTwitter />
            </a>
            <a href="#" aria-label="Instagram" className="hover:text-pink-500">
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="text-center text-xs text-gray-400 mt-8 border-t pt-4 border-gray-700">
        &copy; {new Date().getFullYear()} Arogya Mithra. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
