import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
library.add(fas);

export default function CTASection() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-8">
      {/* CTA Container */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-700 via-green-600 to-green-700 rounded-3xl p-12 text-white flex flex-col md:flex-row items-center md:items-start justify-between">

        {/* Text content */}
        <div className="relative z-10 w-full md:w-2/3  md:text-left">
          <h2 className="text-4xl font-bold mb-6 leading-tight">
            Healing starts  <br className="md:hidden" /> 
            here
           <br className="hidden lg:block" />
            {/* Line break only on small screens */}
            <br className="md:hidden " />
            we'll walk with you
          </h2>
         
          <button className="bg-gray-900 px-8 py-3 rounded-full font-semibold hover:bg-black transition">
            Take Assessment
          </button>
        </div>

        {/* Heart icon: fixed on the right */}
        <FontAwesomeIcon
          icon={["fas", "heart-pulse"]}
          className="absolute right-8 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none"
          style={{ color: "#ffffff", width: "130px", height: "150px" }}
        />
      </div>
    </section>
  );
}
