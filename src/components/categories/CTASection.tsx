import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
library.add(fas);

export default function CTASection() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-8">
      
      {/* CTA Container */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-700 via-green-600 to-green-700 rounded-3xl p-12 text-white flex items-center justify-between">
        
        {/* Left content */}
        <div className="relative z-10">
          <h2 className="text-4xl font-bold mb-6 leading-tight">
            Healing starts here <br />
            we'll walk with you
          </h2>

          <button className="bg-gray-900 px-8 py-3 rounded-full font-semibold hover:bg-black transition">
            Take Assessment
          </button>
        </div>

        {/* Right icon (transparent / opacity) */}
        <FontAwesomeIcon icon={["fas","heart-pulse"]} style={{color: "#ffffff",width: "130px", height: "150px",opacity:"0.2"}} />
      </div>
    </section>
  );
}
