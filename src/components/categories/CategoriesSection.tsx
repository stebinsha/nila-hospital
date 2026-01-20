import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserDoctor,
  faHeart,
  faBrain,
  faStethoscope,
} from "@fortawesome/free-solid-svg-icons";

export default function CategoriesSection() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      {/* Section heading */}
      <h2 className="text-3xl font-bold text-center mb-12">
        How can we support you today?
      </h2>

      
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {/* ---------- Card 1: Consultant Psychologist ---------- */}
        <div className="bg-white rounded-2xl p-8 text-center 
                        hover:shadow-xl border-2 border-transparent 
                        hover:border-green-700 transition">
          
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-yellow-100 flex items-center justify-center">
            <FontAwesomeIcon icon={faUserDoctor} className="text-yellow-600 text-2xl" />
          </div>
          {/* Card title */}
          <h3 className="text-lg font-semibold text-gray-900">
            Consultant Psychologist
          </h3>
        </div>

        {/* ---------- Card 2: Sexual Wellness ---------- */}
        <div className="bg-white rounded-2xl p-8 text-center 
                        hover:shadow-xl border-2 border-transparent 
                        hover:border-green-700 transition">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-pink-100 flex items-center justify-center">
            <FontAwesomeIcon icon={faHeart} className="text-pink-600 text-2xl" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Sexual Wellness
          </h3>
        </div>

        {/* ---------- Card 3: Clinical Psychologist ---------- */}
        <div className="bg-white rounded-2xl p-8 text-center 
                        hover:shadow-xl border-2 border-transparent 
                        hover:border-green-700 transition">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-emerald-100 flex items-center justify-center">
            <FontAwesomeIcon icon={faBrain} className="text-emerald-600 text-2xl" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Clinical Psychologist
          </h3>
        </div>

        {/* ---------- Card 4: Psychiatrist ---------- */}
        <div className="bg-white rounded-2xl p-8 text-center 
                        hover:shadow-xl border-2 border-transparent 
                        hover:border-green-700 transition">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-orange-100 flex items-center justify-center">
            <FontAwesomeIcon icon={faStethoscope} className="text-orange-500 text-2xl" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Psychiatrist
          </h3>
        </div>

      </div>
    </section>
  );
}
