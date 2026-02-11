import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  CreditCard,
  ShieldCheck,
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  Stethoscope,
  MapPin,
  Lock,
  FileText,
  AlertCircle,
  CheckCircle,
  IndianRupee,
  Building,
  Heart
} from "lucide-react";

// Declare Razorpay type globally to avoid TypeScript errors
declare global {
  interface Window {
    Razorpay: any; // Razorpay SDK instance
  }
}

// Test Razorpay key (in production, this should be stored securely)
const RAZORPAY_TEST_KEY = "rzp_test_1DP5mmOlF5G5ag";

// Interface for payment data passed through navigation state
interface PaymentData {
  doctor?: string;
  date?: any;
  time?: string;
  total?: number;
  mode?: string;
  specialization?: string;
  image?: string;
  doctorImage?: string;
  price?: string;
  therapist?: any;
  location?: {
    name: string;
    description: string;
    facilities: string[];
  };
}

export default function ReviewAndPayPage() {
  // Navigation hooks
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract payment data from navigation state or use empty object
  const paymentData = (location.state as PaymentData) || {};
  
  // Destructure and format data from booking page with fallbacks
  const amount = paymentData.total || paymentData.therapist?.price;
  const doctorName = paymentData.doctor || paymentData.therapist?.name || "Doctor";
  const doctorImage = paymentData.doctorImage || paymentData.therapist?.image || "";
  const doctorSpecialization = paymentData.specialization || paymentData.therapist?.role || "Consultation Specialist";
  const appointmentDate = paymentData.date;
  const appointmentTime = paymentData.time || "Not selected";
  const consultationMode = paymentData.mode || "in-person";
  const hospitalLocation = paymentData.location?.name || "MindCare Hospital";
  const consultationFee = paymentData.price || `₹${amount}`;
  
  // Form state for patient information
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isProcessing, setIsProcessing] = useState(false); // Payment processing state

  // Load Razorpay SDK script dynamically
  useEffect(() => {
    // Skip if Razorpay is already loaded
    if (window.Razorpay) return;
    
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // Format date for display (supports both Date objects and strings)
  const formatDate = (date: any) => {
    if (!date) return "Not selected";
    
    // Handle Date objects
    if (date instanceof Date) {
      return date.toLocaleDateString("en-IN", {
        weekday: 'long',
        day: "numeric",
        month: "long",
        year: "numeric"
      });
    }
    
    // Return string representation for other types
    return String(date);
  };

  // Validate patient information form
  const validateForm = () => {
    // Name validation (minimum 3 characters)
    if (name.trim().length < 3) {
      alert("Please enter a valid name (minimum 3 characters)");
      return false;
    }
    
    // Email validation (basic format check)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert("Please enter a valid email address");
      return false;
    }
    
    // Phone validation (10 digits)
    if (!/^\d{10}$/.test(phone.replace(/\D/g, ''))) {
      alert("Please enter a valid 10-digit phone number");
      return false;
    }
    
    return true;
  };

  // Handle payment initiation
  const handlePayment = () => {
    // Validate form before proceeding
    if (!validateForm()) return;
    
    // Check if Razorpay SDK is loaded
    if (!window.Razorpay) {
      alert("Payment gateway is loading. Please wait a moment.");
      return;
    }

    // Set processing state to true
    setIsProcessing(true);

    // Razorpay payment options configuration
    const options = {
      key: RAZORPAY_TEST_KEY, // Razorpay test key
      amount: amount * 100, // Convert to paise (1 INR = 100 paise)
      currency: "INR",
      name: "MindCare Hospital",
      description: `Appointment with ${doctorName}`,
      image: "https://cdn.razorpay.com/logos/BUVwvgaqFyyDuv_large.png", // Razorpay logo

      // Prefill customer information
      prefill: {
        name,
        email,
        contact: phone
      },

      // Theme customization
      theme: {
        color: "#059669" // Emerald green color
      },

      // Payment success handler
      handler: function (response: any) {
        setIsProcessing(false);
        // Navigate to success page with all relevant data
        navigate("/payment-success", {
          state: {
            ...paymentData,
            name,
            phone,
            email,
            appointmentDate: formatDate(appointmentDate),
            appointmentTime,
            doctorName,
            amount,
            mode: consultationMode
          }
        });
      },

      // Payment modal dismissal handler
      modal: {
        ondismiss: function () {
          setIsProcessing(false);
          alert("Payment cancelled");
        }
      },

      // Additional notes for payment reference
      notes: {
        doctor: doctorName,
        specialization: doctorSpecialization,
        date: formatDate(appointmentDate),
        time: appointmentTime,
        patient: name
      }
    };

    // Initialize and open Razorpay checkout
    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  return (
    <div className="min-h-screen">
      {/* Professional Header */}
      <nav className="bg-white shadow-sm border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Back button */}
            <div className="flex items-center">
              <button 
                onClick={() => navigate(-1)}
                className="flex items-center gap-1.5 sm:gap-2 text-gray-600 hover:text-emerald-600 transition-colors group"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-emerald-200 group-hover:bg-emerald-50 transition-all">
                  <ArrowLeft size={18} />
                </div>
                <span className="font-medium text-xs sm:text-sm">Back</span>
              </button>
            </div>
            
            {/* Security and hospital info */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Lock className="text-emerald-600" size={16} />
              </div>
              <div className="text-right">
                <h1 className="text-lg font-semibold text-gray-800">Secure Payment</h1>
                <p className="text-xs text-emerald-600">Nila Hospital</p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Patient Details and Appointment Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Patient Registration Form */}
            <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="bg-emerald-100 p-3 rounded-full">
                  <FileText className="text-emerald-600" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Patient Registration Form</h2>
                  <p className="text-gray-600">Please provide accurate information for medical records</p>
                </div>
              </div>

              {/* Form content */}
              <div className="space-y-6">
                {/* Medical security notice */}
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                  <div className="flex items-center gap-2 text-blue-800 font-medium mb-1">
                    <AlertCircle size={18} />
                    Medical Information Security
                  </div>
                  <p className="text-sm text-blue-700">
                    Your information is protected under HIPAA regulations and will only be used for medical purposes.
                  </p>
                </div>

                {/* Form fields in two columns on medium screens */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name field */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <span className="flex items-center gap-2">
                        <User size={16} />
                        Full Legal Name
                      </span>
                      <span className="text-xs text-gray-500 font-normal mt-1">As per government ID</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full p-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    />
                  </div>
                  
                  {/* Phone field */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <span className="flex items-center gap-2">
                        <Phone size={16} />
                        Contact Number
                      </span>
                      <span className="text-xs text-gray-500 font-normal mt-1">For appointment reminders</span>
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="10-digit mobile number"
                      className="w-full p-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                      maxLength={10}
                    />
                  </div>
                </div>

                {/* Email field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <span className="flex items-center gap-2">
                      <Mail size={16} />
                      Email Address
                    </span>
                    <span className="text-xs text-gray-500 font-normal mt-1">For digital prescriptions & receipts</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="w-full p-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  />
                </div>

                {/* Medical consent notice */}
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mt-6">
                  <div className="flex items-start gap-3">
                    <div className="bg-white p-2 rounded-lg">
                      <CheckCircle className="text-emerald-600" size={18} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Medical Consent</p>
                      <p className="text-sm text-gray-600 mt-1">
                        By proceeding, you consent to share this information with healthcare providers for treatment purposes.
                        All data is encrypted and securely stored.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Appointment Details Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                <Stethoscope className="text-emerald-600" />
                Medical Appointment Details
              </h3>

              <div className="space-y-6">
                {/* Doctor information card */}
                <div className="flex items-center gap-6 p-6 bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl border border-emerald-200">
                  {doctorImage && (
                    <img 
                      src={doctorImage} 
                      alt={doctorName}
                      className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-md"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-gray-800">{doctorName}</h4>
                    <p className="text-emerald-600 font-medium mt-1">{doctorSpecialization}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Building size={16} />
                        <span className="text-sm">{hospitalLocation}</span>
                      </div>
                      <div className="flex items-center gap-2 text-emerald-600">
                        <IndianRupee size={16} />
                        <span className="font-medium">{consultationFee}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Appointment date and time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Date card */}
                  <div className="bg-gray-50 rounded-xl p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-emerald-100 p-2 rounded-lg">
                        <Calendar className="text-emerald-600" size={20} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Appointment Date</p>
                        <p className="font-semibold text-gray-800 text-lg">{formatDate(appointmentDate)}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Time card */}
                  <div className="bg-gray-50 rounded-xl p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-emerald-100 p-2 rounded-lg">
                        <Clock className="text-emerald-600" size={20} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Appointment Time</p>
                        <p className="font-semibold text-gray-800 text-lg">{appointmentTime}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Medical instructions */}
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
                  <h4 className="font-semibold text-amber-800 mb-4 flex items-center gap-2">
                    <AlertCircle size={20} />
                    Important Medical Instructions
                  </h4>
                  <ul className="space-y-3 text-amber-700">
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
                      <span>Please arrive 15 minutes before your scheduled appointment time</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
                      <span>Carry your government photo ID and insurance card (if applicable)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
                      <span>Bring previous medical records, prescriptions, and test reports</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Payment Summary (sticky) */}
          <div className="space-y-6">
            {/* Payment summary card */}
            <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-8 sticky top-6">
              <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-100">
                <div className="bg-emerald-100 p-3 rounded-lg">
                  <CreditCard className="text-emerald-600" size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Medical Payment Summary</h2>
                  <p className="text-sm text-gray-600">Hospital Invoice #MC{Date.now().toString().slice(-6)}</p>
                </div>
              </div>

              {/* Bill breakdown */}
              <div className="space-y-4 mb-8">
                {/* Consultation fee */}
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <div>
                    <p className="text-gray-700 font-medium">Doctor Consultation</p>
                    <p className="text-xs text-gray-500">{doctorName}</p>
                  </div>
                  <span className="font-semibold">{consultationFee}</span>
                </div>
                
                {/* Platform fee (free) */}
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <div>
                    <p className="text-gray-700 font-medium">Platform Fee</p>
                    <p className="text-xs text-gray-500">Online booking support</p>
                  </div>
                  <span className="font-semibold text-emerald-600">Free</span>
                </div>
                
                {/* Total amount */}
                <div className="pt-6 mt-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-bold text-gray-800 text-lg">Total Payable</p>
                      <p className="text-sm text-gray-500">Inclusive of all taxes</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-emerald-700 flex items-center gap-1">
                        <IndianRupee size={24} />
                        {amount}
                      </p>
                      <p className="text-xs text-gray-500">To be paid now</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pay button with loading state */}
              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed hover:scale-[1.02]"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <CreditCard size={20} />
                    Pay Securely with Razorpay
                  </>
                )}
              </button>

              {/* Security badge */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="flex items-center justify-center gap-3 text-sm">
                  <div className="flex items-center gap-2 text-emerald-600">
                    <ShieldCheck size={18} />
                    <span>HIPAA Compliant</span>
                  </div>
                  <div className="h-4 w-px bg-gray-300"></div>
                  <div className="text-gray-500">Medical Data Protected</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}