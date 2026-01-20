import { useState } from "react";
import { therapists, Therapist } from "./therapists";
import { Search } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBolt, faPlay } from "@fortawesome/free-solid-svg-icons";

// Helper function to calculate progress bar width from "current/total" string
const getProgressWidth = (progress?: string): string => {
  if (!progress) return "0%";
  const [current, total] = progress.split("/").map((v) => Number(v.trim()));
  if (!total || isNaN(current) || isNaN(total)) return "0%";
  return `${(current / total) * 100}%`;
};

export default function TherapistsPage() {
  const [search, setSearch] = useState("");

  // Filter therapists based on search input
  const filteredTherapists = therapists.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      style={{
        fontFamily: `"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`,
      }}
    >
       
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Search bar */}
        <div className="bg-white rounded-xl p-6 shadow-xl mb-10">
          <div className="flex items-center gap-3 border-2 border-gray-200 rounded-lg px-5 py-4">
            <Search size={18} className="text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search therapist by name"
              className="w-full text-base font-medium outline-none placeholder:text-gray-400 py-2"
            />
          </div>
        </div>

        {/* Therapist cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTherapists.map((t: Therapist) => (
            <div
              key={t.id}
              className="bg-[#E9FFF3] rounded-[32px] p-5 border-2 border-[#B9F5CF] shadow-lg hover:shadow-2xl flex flex-col"
            >
              {/* Header: Image, name, role, experience */}
              <div className="flex gap-4 mb-3">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-20 h-20 rounded-2xl object-cover"
                />
                <div>
                  <h3 className="text-xl font-bold">{t.name}</h3>
                  <p className="text-sm text-gray-700">{t.role}</p>
                  <span className="inline-block mt-1 bg-[#C6F7DA] text-green-900 px-3 py-1 rounded-full text-xs font-semibold">
                    {t.experience}
                  </span>
                </div>
              </div>

              {/* Therapy hours */}
              <div className="flex items-center gap-2 mb-3">
                <p className="text-sm font-medium">{t.hours}</p>
                <FontAwesomeIcon icon={faBolt} className="text-yellow-500" />
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {t.tags.map((tag) => (
                  <span
                    key={`${t.id}-${tag}`}
                    className="bg-white px-3 py-1 rounded-full text-[12px] font-medium text-gray-700 shadow-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Audio player */}
              <div className="flex items-center gap-3 mb-4">
                {/* Play button */}
                <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md ">
                  <FontAwesomeIcon
                    icon={faPlay}
                    className="text-green-700 text-sm group-hover:scale-110 transition-transform"
                  />
                </button>

                {/* Progress bar */}
                <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-700 rounded-full transition-all duration-300"
                    style={{ width: getProgressWidth(t.progress) }}
                  ></div>
                </div>

                {/* Audio duration */}
                <span className="text-xs text-gray-600">{t.audioDuration}</span>
              </div>

              {/* Next available slot & price */}
              <div className="flex justify-between mb-4">
                <div>
                  <p className="text-xs text-gray-500">Next available</p>
                  <p className="font-bold">{t.nextSlot}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Starts from</p>
                  <p className="font-bold">₹{t.price}</p>
                </div>
              </div>

              {/* Call-to-action button */}
              <button className="w-full py-3 rounded-full text-base font-bold text-white bg-gradient-to-r from-gray-900 to-black">
                Book Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
