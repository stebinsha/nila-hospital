import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function HeroSection() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <div className="
        bg-gradient-to-r from-[#247336] via-emerald-600 to-teal-600
        rounded-3xl shadow-2xl
        min-h-[360px]
        flex flex-col items-center justify-center
        text-center text-white
      ">

         {/* Play icon (Font Awesome) */}
        <FontAwesomeIcon
          icon={["fas", "play-circle"]}
          className="text-7xl  opacity-80"
        />
        
        {/* Hero video label */}
        <p className="text-[1.65rem] font-semibold tracking-wide">
          Hero Video
        </p>
      </div>
    </section>
  );
}
