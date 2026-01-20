// Font Awesome core icon component
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Font Awesome library to register icons globally
import { library } from "@fortawesome/fontawesome-svg-core";

// Import all solid icons
import { fas } from "@fortawesome/free-solid-svg-icons";

// Register all solid icons once so they can be used anywhere in the app
library.add(fas);

export default function Header() {
  return (
    // Fixed header
    <header className="fixed top-0 left-0 bg-white/80 w-full backdrop-blur-md z-50 shadow-sm">
      
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo section */}
        <div className="flex items-center gap-3">
          
          <div className="w-10 h-10 bg-gradient-to-br from-[#247336] to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
            <FontAwesomeIcon
              icon={["fas", "leaf"]}
              style={{ color: "#ffffff", width: "20px", height: "24px" }}
            />
          </div>

          {/* Brand name */}
          <span
            className="text-2xl font-bold bg-gradient-to-r from-[#247336] to-emerald-600 bg-clip-text text-transparent"
            style={{
              fontFamily: `"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`,
              fontSize: "24px",
              letterSpacing: "0.05em",
            }}
          >
            Nila
          </span>
        </div>

        {/* Navigation links (hidden on small screens) */}
        <nav
          className="hidden md:flex gap-8 text-gray-700 font-medium"
          style={{
            fontFamily: `"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`,
            fontSize: "16px",
            letterSpacing: "0.05em",
          }}
        >
          <a href="#" className="hover:text-[#247336] transition-colors duration-200">Home</a>
          <a href="#" className="hover:text-[#247336] transition-colors duration-200">About Us</a>
          <a href="#" className="hover:text-[#247336] transition-colors duration-200">Services</a>
          <a href="#" className="hover:text-[#247336] transition-colors duration-200">Counselors</a>
          <a href="#" className="hover:text-[#247336] transition-colors duration-200">Resources</a>
          <a href="#" className="hover:text-[#247336] transition-colors duration-200">Contact</a>
        </nav>

        {/* Sign-in button */}
        <button
          className="bg-gradient-to-r from-[#247336] to-emerald-600 text-white px-6 py-2.5 rounded-full font-semibold"
          style={{
            fontFamily: `"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`,
            fontSize: "16px",
            letterSpacing: "0.05em",
          }}
        >
          Sign In
        </button>

      </div>
    </header>
  );
}
