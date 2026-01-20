import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faInstagram,
  faLinkedinIn,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";


export default function Footer() {
  return (
    <footer className="bg-[#5E8F6E] text-[#0F172A]">
      {/* Footer Wrapper */}
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            
          {/* Service */}
          <div>
            <h4 className="font-bold text-lg mb-6">Service</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-800 hover:text-gray-900 transition-colors font-medium">
                  Individual Therapy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-800 hover:text-gray-900 transition-colors font-medium">
                  Couple Therapy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-800 hover:text-gray-900 transition-colors font-medium">
                  Follow Up Session
                </a>
              </li>
            </ul>
          </div>

          {/* Partnership */}
          <div>
            <h4 className="font-bold text-lg mb-6">Partnership Programs</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-800 hover:text-gray-900 transition-colors font-medium">
                  Nila Corporate
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-800 hover:text-gray-900 transition-colors font-medium">
                  Nila Campus
                </a>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="font-bold text-lg mb-6">About</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-800 hover:text-gray-900 transition-colors font-medium">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-800 hover:text-gray-900 transition-colors font-medium">
                  Locations
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-800 hover:text-gray-900 transition-colors font-medium">
                  Concerns
                </a>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-bold text-lg mb-6">Connect Us</h4>

            <p className="mb-2 font-medium text-gray-900">
              <a href="tel:+918590925353">+91 85909 25353</a>
            </p>
            <p className="mb-4 font-medium text-gray-900">
              <a href="mailto:help@nila.me">help@nila.me</a>
            </p>

            {/* Social Icons */}
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-[#0F172A] rounded-full flex items-center justify-center">
                <FontAwesomeIcon icon={faFacebookF} className="text-white text-sm" />
              </div>
              <div className="w-10 h-10 bg-[#0F172A] rounded-full flex items-center justify-center">
                <FontAwesomeIcon icon={faInstagram} className="text-white text-sm" />
              </div>
              <div className="w-10 h-10 bg-[#0F172A] rounded-full flex items-center justify-center">
                <FontAwesomeIcon icon={faLinkedinIn} className="text-white text-sm" />
              </div>
              <div className="w-10 h-10 bg-[#0F172A] rounded-full flex items-center justify-center">
                <FontAwesomeIcon icon={faYoutube} className="text-white text-sm" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-16">
          {/* Conditions */}
          <div>
            <h4 className="font-bold text-lg mb-4">Conditions</h4>
            <ul className="space-y-1 text-sm">
              <li>Anxiety & Stress</li>
              <li>Depression & Mood Disorder</li>
              <li>Trauma & PTSD</li>
              <li>Relationship Issues</li>
              <li>Grief Counselling</li>
              <li>Anger Management</li>
              <li>Queer Affirmative Therapy</li>
              <li>Work Stress & Burnout</li>
              <li>Parenting & Child Behavioral Issues</li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="font-bold text-lg mb-4">Policies</h4>
            <ul className="space-y-1 text-sm">
              <li>Return & Refund Policy</li>
              <li>Terms & Conditions</li>
              <li>Privacy Policy</li>
              <li>Minor Reporting Policy</li>
              <li>Information & Security Policy</li>
              <li>Clinical Report Release Policy</li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="font-bold text-lg mb-3">Join Our Community</h4>
            <p className="mb-4 text-sm">
              Join us at Nila and let's navigate this path together!
            </p>

            <button className="w-full bg-cyan-400 text-black font-semibold py-2 rounded-full mb-3">
              Join community
            </button>

            <button className="w-full border-2 border-cyan-400 text-black font-semibold py-2 rounded-full">
              We're Hiring
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-black/30 my-15"></div>

        {/* Copyright */}
        <p className="text-center text-sm pb-2">
          © 2025 Nila. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
