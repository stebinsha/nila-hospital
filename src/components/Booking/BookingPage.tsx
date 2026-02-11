import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { therapists } from "../Therapist/therapists";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, Clock, CheckCircle, ChevronLeft, ChevronRight, UserRound, AlertTriangle, Stethoscope, Hospital, Video, Phone, ClipboardList, Info, X } from "lucide-react";

// Mock data for time slots and dates
const timeSlots = { morning: ["09:00", "09:30", "10:00", "10:30", "11:00"], afternoon: ["12:00", "12:30", "13:00", "13:30", "14:00"], evening: ["15:00", "15:30", "16:00", "16:30", "17:00"] };
const dates = [
  { date: "2024-02-10", day: "10", weekday: "Mon", month: "Feb", available: true },
  { date: "2024-02-11", day: "11", weekday: "Tue", month: "Feb", available: true },
  { date: "2024-02-12", day: "12", weekday: "Wed", month: "Feb", available: true },
  { date: "2024-02-13", day: "13", weekday: "Thu", month: "Feb", available: false },
  { date: "2024-02-14", day: "14", weekday: "Fri", month: "Feb", available: true },
  { date: "2024-02-15", day: "15", weekday: "Sat", month: "Feb", available: false },
  { date: "2024-02-16", day: "16", weekday: "Sun", month: "Feb", available: false },
];

// Custom calendar component with popup functionality
const ModernCalendar = ({ selectedDate, setSelectedDate }) => {
  const [openCalendar, setOpenCalendar] = useState(false);
  const ref = useRef(null);
  const popupRef = useRef(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target) && popupRef.current && !popupRef.current.contains(e.target)) {
        setOpenCalendar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Generate days for current month
  const days = [...Array(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()).keys()].map(i => new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i + 1));
  const weekdays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

  // Helper functions for date logic
  const isToday = (date) => date.toDateString() === new Date().toDateString();
  const isSelected = (date) => selectedDate && date.toDateString() === selectedDate.toDateString();
  const isPastDate = (date) => date < new Date(new Date().setHours(0, 0, 0, 0));
  const handleDateSelect = (date) => { if (!isPastDate(date)) { setSelectedDate(date); setOpenCalendar(false); } };
  const changeMonth = (inc) => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + inc, 1));

  return (
    <div className="relative inline-block" ref={ref}>
      {/* Calendar trigger button */}
      <button onClick={() => setOpenCalendar(!openCalendar)} className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-emerald-200 rounded-xl shadow-sm hover:shadow-md transition-all text-emerald-600 font-medium hover:bg-emerald-50 text-sm sm:text-base">
        <Calendar size={18} className="sm:w-5 sm:h-5" />
        {selectedDate ? selectedDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Select Date"}
      </button>

      {/* Popup calendar modal */}
      <AnimatePresence>
        {openCalendar && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div ref={popupRef} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
              {/* Modal header */}
              <div className="p-4 sm:p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div><h3 className="font-bold text-gray-900 text-base sm:text-lg">Select Date</h3><p className="text-xs sm:text-sm text-gray-500 mt-1">Choose your appointment date</p></div>
                  <button onClick={() => setOpenCalendar(false)} className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"><X size={18} className="text-gray-500" /></button>
                </div>
              </div>

              {/* Calendar grid */}
              <div className="p-4 sm:p-6">
                {/* Month navigation */}
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <button onClick={() => changeMonth(-1)} className="p-1.5 sm:p-2 hover:bg-gray-50 rounded-lg transition-colors"><ChevronLeft size={18} className="text-gray-600" /></button>
                  <div className="text-center"><div className="font-bold text-gray-900 text-lg sm:text-xl">{months[currentMonth.getMonth()]}</div><div className="text-xs sm:text-sm text-gray-500">{currentMonth.getFullYear()}</div></div>
                  <button onClick={() => changeMonth(1)} className="p-1.5 sm:p-2 hover:bg-gray-50 rounded-lg transition-colors"><ChevronRight size={18} className="text-gray-600" /></button>
                </div>

                {/* Weekday headers */}
                <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-3 sm:mb-4">
                  {weekdays.map((day) => <div key={day} className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider">{day}</div>)}
                </div>

                {/* Day cells */}
                <div className="grid grid-cols-7 gap-1 sm:gap-2">
                  {/* Empty cells for days before month start */}
                  {[...Array(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay()).keys()].map(i => <div key={`empty-${i}`} className="h-8 sm:h-10" />)}
                  {days.map((date) => {
                    const past = isPastDate(date);
                    const today = isToday(date);
                    const selected = isSelected(date);
                    const weekend = date.getDay() === 0 || date.getDay() === 6;

                    return (
                      <button key={date.toISOString()} onClick={() => handleDateSelect(date)} disabled={past || weekend} className={`h-8 sm:h-10 rounded-lg flex items-center justify-center transition-all duration-200 text-xs sm:text-sm font-medium relative ${past || weekend ? 'text-gray-300 cursor-not-allowed' : selected ? 'bg-emerald-500 text-white shadow-md' : today ? 'text-emerald-600 hover:bg-emerald-50' : 'text-gray-700 hover:bg-gray-50 hover:text-emerald-600'} ${!past && !weekend && 'hover:scale-105'}`}>
                        {date.getDate()}
                        {/* Today indicator dot */}
                        {today && !selected && <div className="absolute bottom-0.5 sm:bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-emerald-500 rounded-full" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quick action buttons */}
              <div className="p-4 sm:p-6 border-t border-gray-100">
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <button onClick={() => { const today = new Date(); if (!isPastDate(today) && today.getDay() !== 0 && today.getDay() !== 6) { setSelectedDate(today); setOpenCalendar(false); }}} className="py-2 sm:py-3 px-3 sm:px-4 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl text-xs sm:text-sm font-medium transition-colors flex items-center justify-center gap-1.5 sm:gap-2"><div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-500 rounded-full" />Today</button>
                  <button onClick={() => { const today = new Date(); const nextWeek = new Date(today.setDate(today.getDate() + 7)); setSelectedDate(nextWeek); setCurrentMonth(nextWeek); setOpenCalendar(false);}} className="py-2 sm:py-3 px-3 sm:px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs sm:text-sm font-medium transition-colors flex items-center justify-center gap-1.5 sm:gap-2"><div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-600 rounded-full" />Next Week</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Main booking page component
export default function BookingPage() {
  const { id } = useParams(); // Get therapist ID from URL
  const navigate = useNavigate();
  const therapist = therapists.find(t => t.id.toString() === id); // Find therapist data
  
  // State for booking details
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [consultationType, setConsultationType] = useState("in-person");
  const selectedLocation = { name: "Nila Hospital", description: "Main Building - Medical Complex", facilities: ["Emergency", "ICU", "Pharmacy", "Parking"] };

  // Navigate to OTP verification with booking data
  const handleContinue = () => {
    navigate("/otp-verification", { 
      state: { therapist, date: selectedDate, time: selectedTime, type: consultationType, location: selectedLocation } 
    });
  };

  // Handle therapist not found
  if (!therapist) return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 sm:p-8">
        <div className="text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6"><AlertTriangle className="text-red-500 sm:w-8 sm:h-8" size={24} /></div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Doctor Not Available</h2>
          <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">The requested specialist is not currently available.</p>
          <div className="space-y-3 sm:space-y-4">
            <button onClick={() => navigate("/specialists")} className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-medium py-3 sm:py-3.5 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base">View Available Doctors</button>
            <button onClick={() => navigate(-1)} className="w-full border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-3 sm:py-3.5 rounded-xl transition-colors text-sm sm:text-base">Go Back</button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      {/* Fixed header */}
      <header className="bg-white/90 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="relative flex items-center h-14 sm:h-16">
            <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 sm:gap-2 text-gray-600 hover:text-emerald-600 transition-colors group">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-emerald-200 group-hover:bg-emerald-50 transition-all"><span className="text-sm">←</span></div>
              <span className="font-medium text-xs sm:text-sm">Back</span>
            </button>
            <div className="absolute left-1/2 transform -translate-x-1/2 text-center">
              <h1 className="text-base sm:text-lg font-semibold text-gray-900">Book Appointment</h1>
              <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-0.5 sm:mt-1">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-500 rounded-full"></div>
                <span className="text-xs text-gray-500">Nila Hospital • Secure Booking</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-5">
        {/* Therapist info card */}
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 mb-5 sm:mb-7">
          <div className="flex flex-col md:flex-row gap-4 sm:gap-6 md:gap-8">
            <div className="flex-shrink-0 mx-auto md:mx-0">
              <div className="relative">
                <img src={therapist.image} alt={therapist.name} className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-2xl object-cover border-4 border-white shadow-lg" />
                <div className="absolute -bottom-1.5 -right-1.5 sm:-bottom-2 sm:-right-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">{therapist.experience}</div>
              </div>
            </div>
            
            <div className="flex-1 text-center md:text-left mt-4 sm:mt-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{therapist.name}</h1>
              <div className="flex items-center justify-center md:justify-start gap-2 sm:gap-3 mt-1">
                <UserRound className="text-emerald-600 w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-emerald-600 font-semibold text-sm sm:text-base">{therapist.role}</span>
              </div>
              
              {/* Therapist tags */}
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-1.5 sm:gap-2 mt-2 sm:mt-3">
                {therapist.tags.map((tag, idx) => (
                  <span key={idx} className="px-2 py-0.5 sm:px-2.5 sm:py-1 text-xs font-medium rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {tag}
                  </span>
                ))}
              </div>
              
              {/* Location card */}
              <div className="mt-4 sm:mt-6 lg:mt-8 pt-3 sm:pt-4 lg:pt-5 border-t border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4 gap-1.5 sm:gap-2">
                  <div className="text-center sm:text-left">
                    <label className="block text-sm font-semibold text-gray-900 mb-0.5 sm:mb-1">Hospital Location</label>
                    <p className="text-xs sm:text-sm text-gray-500">Your consultation will be held at</p>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 text-emerald-600 mt-1 sm:mt-0">
                    <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="text-xs sm:text-sm font-medium">Selected Location</span>
                  </div>
                </div>
                
                <div className="w-full p-3 sm:p-4 border border-emerald-200 rounded-xl bg-emerald-50/50">
                  <div className="flex flex-col sm:flex-row items-start gap-2.5 sm:gap-3 lg:gap-4">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0">
                      <MapPin className="text-emerald-600 w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div className="text-center sm:text-left mt-2 sm:mt-0">
                      <div className="font-semibold text-gray-900 text-sm sm:text-base">{selectedLocation.name}</div>
                      <div className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1">{selectedLocation.description}</div>
                      <div className="flex flex-wrap justify-center sm:justify-start items-center gap-1.5 sm:gap-2 mt-1.5 sm:mt-2">
                        {selectedLocation.facilities.slice(0, 3).map((f, idx) => (
                          <span key={idx} className="inline-flex items-center gap-0.5 sm:gap-1 text-xs bg-white border border-emerald-100 text-emerald-700 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                            <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main booking layout - 2/3 + 1/3 grid */}
        <div className="grid lg:grid-cols-3 gap-4 sm:gap-5">
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Consultation type selection */}
            <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 md:p-8">
              <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-3 sm:mb-4 lg:mb-6 flex items-center gap-1.5 sm:gap-2">
                <Stethoscope className="text-emerald-600 w-4 h-4 sm:w-5 sm:h-5" />
                Consultation Type
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 sm:gap-3 lg:gap-4">
                {[
                  {id:"in-person",label:"In-Person",icon:<Hospital className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7"/>,desc:"Clinic visit",highlight:"Most Recommended",stethoscope:<Stethoscope className="text-emerald-600 w-3.5 h-3.5 sm:w-4 sm:h-4" />},
                  {id:"video",label:"Video",icon:<Video className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7"/>,desc:"Virtual consultation",highlight:"Convenient",stethoscope:<Video className="text-emerald-600 w-3.5 h-3.5 sm:w-4 sm:h-4" />},
                  {id:"phone",label:"Phone",icon:<Phone className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7"/>,desc:"Telephone advice",highlight:"Quick & Easy",stethoscope:<Phone className="text-emerald-600 w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                ].map(type => (
                  <button key={type.id} onClick={() => setConsultationType(type.id)} className={`relative p-2.5 sm:p-3 lg:p-4 rounded-xl border-2 transition-all duration-300 ${consultationType === type.id ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-emerald-200 hover:bg-emerald-50/50'}`}>
                    {/* Selected checkmark */}
                    {consultationType === type.id && (
                      <div className="absolute -top-1 -right-1 sm:-top-1.5 sm:-right-1.5 lg:-top-2 lg:-right-2 w-4 h-4 sm:w-4.5 sm:h-4.5 lg:w-5 lg:h-5 bg-emerald-500 rounded-full flex items-center justify-center shadow-md">
                        <CheckCircle className="text-white w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      </div>
                    )}
                    {/* Highlight badge */}
                    {type.highlight && (
                      <div className={`absolute -top-1 sm:-top-1.5 lg:-top-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r ${type.highlight === 'Most Recommended' ? 'from-emerald-500 to-teal-600' : type.highlight === 'Convenient' ? 'from-blue-500 to-blue-600' : 'from-purple-500 to-purple-600'} text-white text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full whitespace-nowrap`}>
                        {type.highlight}
                      </div>
                    )}
                    <div className="flex flex-col items-center pt-0.5 sm:pt-1 lg:pt-2">
                      <div className={`w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 xl:w-14 xl:h-14 rounded-full flex items-center justify-center mb-2 sm:mb-3 lg:mb-4 ${consultationType === type.id ? 'bg-emerald-100 border-2 border-emerald-300' : 'bg-gray-100'}`}>
                        {type.icon}
                      </div>
                      <div className="text-center mb-1 sm:mb-2">
                        <span className="font-bold text-gray-900 text-sm sm:text-base lg:text-lg">{type.label}</span>
                        <div className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1 lg:mt-2 px-0.5">{type.desc}</div>
                      </div>
                      <div className="w-full mt-1 sm:mt-1.5 lg:mt-2 pt-1.5 sm:pt-2 lg:pt-3 border-t border-gray-100">
                        <div className="flex items-center justify-center gap-1 sm:gap-1.5 lg:gap-2">
                          {type.stethoscope}
                          <span className="text-xs sm:text-sm font-medium text-emerald-600">Available</span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Date and time selection */}
            <div className="bg-white rounded-2xl shadow-sm p-3 sm:p-4 lg:p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4 lg:mb-5 gap-2 sm:gap-3">
                <div>
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-2 sm:mb-3 lg:mb-5 flex items-center gap-1.5 sm:gap-2">
                    <Calendar className="text-emerald-600 w-4 h-4 sm:w-5 sm:h-5" />
                    Select Date & Time
                  </h3>
                  <p className="text-gray-500 text-xs sm:text-sm mt-0.5">Choose your preferred slot</p>
                </div>
                <div className="flex justify-center sm:justify-end mt-2 sm:mt-0">
                  <ModernCalendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
                </div>
              </div>
              
              {/* Quick date pills */}
              <div className="pb-2 sm:pb-3 mb-3 sm:mb-4 lg:mb-5 overflow-x-auto">
                <div className="flex gap-1.5 sm:gap-2 lg:gap-3 min-w-max pb-1 sm:pb-2">
                  {dates.map((dateItem, idx) => (
                    <button
                      key={idx}
                      onClick={() => dateItem.available && setSelectedDate(new Date(dateItem.date))}
                      disabled={!dateItem.available}
                      className={`flex flex-col items-center justify-center min-w-[60px] sm:min-w-[70px] lg:min-w-[80px] py-0.5 sm:py-1 rounded-xl transition-all duration-300 ${!dateItem.available ? 'opacity-40 cursor-not-allowed' : ''} ${selectedDate && selectedDate.toISOString().split('T')[0] === dateItem.date ? 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg' : 'bg-gray-50 hover:bg-gray-100'}`}
                    >
                      <div className="text-xs font-medium opacity-80">{dateItem.weekday}</div>
                      <div className="text-lg sm:text-xl lg:text-2xl font-bold mt-0.5 sm:mt-1 lg:mt-2">{dateItem.day}</div>
                      <div className="text-xs sm:text-sm opacity-80">{dateItem.month}</div>
                      {!dateItem.available && <div className="mt-0.5 sm:mt-1 lg:mt-2 text-xs text-gray-500">Unavailable</div>}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Time slot selection (only shows when date selected) */}
              {selectedDate && (
                <div className="border-t border-gray-200 pt-4 sm:pt-6 lg:pt-8">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4 lg:mb-6 gap-2 sm:gap-3">
                    <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 flex items-center gap-1.5 sm:gap-2">
                      <Clock className="text-emerald-600 w-4 h-4 sm:w-5 sm:h-5" />
                      Available Time Slots
                    </h3>
                    <div className="flex items-center gap-1.5 sm:gap-2 text-emerald-600 bg-emerald-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
                      <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      <span className="text-xs sm:text-sm font-medium">30 min sessions</span>
                    </div>
                  </div>
                  
                  {/* Time slots grouped by period */}
                  <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                    {Object.entries(timeSlots).map(([period, slots]) => (
                      <div key={period} className="bg-gray-50 rounded-xl p-3 sm:p-4 lg:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 sm:mb-3 lg:mb-4 gap-1.5 sm:gap-2">
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-500 rounded-full"></div>
                            <span className="font-semibold text-gray-700 text-sm sm:text-base capitalize">{period} Session</span>
                          </div>
                          <span className="text-xs sm:text-sm text-gray-500">Select one slot</span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1.5 sm:gap-2 lg:gap-3">
                          {slots.map(time => (
                            <button
                              key={time}
                              onClick={() => setSelectedTime(time)}
                              className={`py-2 sm:py-2.5 lg:py-3.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 ${selectedTime === time ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md' : 'bg-white border border-gray-200 hover:border-emerald-300 hover:shadow-sm'}`}
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Continue to OTP button with validation */}
            <button
              disabled={!selectedDate || !selectedTime}
              onClick={handleContinue}
              className={`w-full rounded-xl overflow-hidden transition-all duration-300 transform ${
                selectedDate && selectedTime 
                  ? 'hover:-translate-y-0.5 hover:shadow-xl' 
                  : ''
              }`}
            >
              {/* Status bar */}
              <div className={`px-4 py-2 text-xs font-medium text-center ${
                selectedDate && selectedTime 
                  ? 'bg-emerald-400/20 text-emerald-700' 
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {selectedDate && selectedTime 
                  ? '✓ All details verified - Ready to proceed' 
                  : 'Please select date & time to continue'}
              </div>
              
              {/* Main button */}
              <div className={`p-4 transition-all duration-300 ${
                selectedDate && selectedTime 
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white' 
                  : 'bg-gray-100 text-gray-400'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Shield icon */}
                    <div className={`p-2 rounded-lg ${
                      selectedDate && selectedTime 
                        ? 'bg-white/20' 
                        : 'bg-gray-200'
                    }`}>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    
                    <div>
                      <div className="font-semibold text-sm sm:text-base">Proceed to OTP Verification</div>
                      <div className="text-xs opacity-90 mt-0.5">Secure booking process</div>
                    </div>
                  </div>
                  
                  {/* Arrow indicator (only when enabled) */}
                  {selectedDate && selectedTime && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Continue</span>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            </button>
          </div>

          {/* Right sidebar - Summary and info */}
          <div className="space-y-3 sm:space-y-4 lg:space-y-6">
            {/* Appointment summary card */}
            <div className="bg-white rounded-2xl shadow-sm p-3 sm:p-4 lg:p-6 xl:p-8">
              <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-2 sm:mb-3 lg:mb-5 flex items-center gap-1.5 sm:gap-2">
                <ClipboardList className="text-emerald-600 w-4 h-4 sm:w-5 sm:h-5" />
                Appointment Summary
              </h3>
              
              <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                {/* Therapist info in summary */}
                <div className="pb-3 sm:pb-4 lg:pb-6 border-b border-gray-200">
                  <div className="flex items-start gap-2 sm:gap-3 lg:gap-4">
                    <img src={therapist.image} alt={therapist.name} className="w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 xl:w-14 xl:h-14 rounded-xl object-cover border border-gray-200" />
                    <div>
                      <div className="font-semibold text-gray-900 text-sm sm:text-base">{therapist.name}</div>
                      <div className="text-xs sm:text-sm text-gray-500 mt-0.5">{therapist.role}</div>
                    </div>
                  </div>
                </div>
                
                {/* Booking details */}
                <div className="space-y-1.5 sm:space-y-2 lg:space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 sm:gap-2 text-gray-600">
                      <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span className="text-xs sm:text-sm">Date</span>
                    </div>
                    <span className="font-medium text-xs sm:text-sm">
                      {selectedDate ? selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : "—"}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 sm:gap-2 text-gray-600">
                      <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span className="text-xs sm:text-sm">Time</span>
                    </div>
                    <span className="font-medium text-xs sm:text-sm">{selectedTime || "—"}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 sm:gap-2 text-gray-600">
                      <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span className="text-xs sm:text-sm">Location</span>
                    </div>
                    <span className="font-medium text-right text-xs sm:text-sm">{selectedLocation.name}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-gray-600 text-xs sm:text-sm">Consultation Type</div>
                    <span className="font-medium text-xs sm:text-sm capitalize">{consultationType.replace("-", " ")}</span>
                  </div>
                </div>
                
                {/* Pricing section */}
                <div className="pt-2 sm:pt-3 lg:pt-4 border-t border-gray-200">
                  <div className="space-y-1.5 sm:space-y-2 lg:space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="text-gray-600 text-sm">Consultation Fee</div>
                      <div className="font-medium text-sm sm:text-base">{therapist.price}</div>
                    </div>
                  </div>
                  
                  <div className="mt-3 sm:mt-4 lg:mt-6 pt-3 sm:pt-4 lg:pt-6 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-bold text-gray-900 text-sm sm:text-base lg:text-lg">Total Amount</div>
                        <div className="text-xs sm:text-sm text-gray-500">Inclusive of all charges</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{therapist.price}</div>
                        <div className="text-xs text-emerald-600">Insurance applicable</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Important information card */}
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-emerald-100 p-3 sm:p-4 lg:p-6">
              <h4 className="font-bold text-gray-900 mb-2 sm:mb-3 lg:mb-4 flex items-center gap-1.5 sm:gap-2">
                <Info className="text-emerald-600 w-4 h-4 sm:w-5 sm:h-5" />
                Important Information
              </h4>
              <ul className="space-y-1.5 sm:space-y-2 lg:space-y-3">
                {["Please carry valid photo ID","Arrive 15 minutes before appointment","Free cancellation up to 24 hours before","Bring previous medical records","Digital prescriptions provided"].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1 sm:mt-1.5 flex-shrink-0"></div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}