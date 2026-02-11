import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Shield, Phone, Clock, CheckCircle, AlertCircle, Stethoscope, Lock } from "lucide-react";
// Font Awesome core icon component
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Font Awesome library to register icons globally
import { library } from "@fortawesome/fontawesome-svg-core";

// Import all solid icons
import { fas } from "@fortawesome/free-solid-svg-icons";

// Register all solid icons once so they can be used anywhere in the app
library.add(fas);

export default function OTPVerification() {
  // Navigation and routing hooks
  const navigate = useNavigate();
  const location = useLocation();
  // Retrieve appointment data passed from previous page
  const appointmentData = location.state || {};

  // Phone number state management
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneSubmitted, setPhoneSubmitted] = useState(false);
  const [phoneError, setPhoneError] = useState("");

  // OTP state management
  const [otp, setOtp] = useState(["", "", "", "", "", ""]); // 6-digit OTP array
  const [activeOtpIndex, setActiveOtpIndex] = useState(0); // Currently focused OTP input
  const [otpError, setOtpError] = useState(""); // OTP validation error
  const [timer, setTimer] = useState(30); // Countdown timer for OTP expiry
  const [canResend, setCanResend] = useState(false); // Resend OTP eligibility
  
  // Loading and progress states
  const [isVerifying, setIsVerifying] = useState(false); // OTP verification in progress
  const [verificationProgress, setVerificationProgress] = useState(0); // Progress percentage

  // Refs for OTP input elements
  const inputRefs = useRef([]);

  // Handle phone number form submission
  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    const phoneRegex = /^[0-9]{10}$/;
    
    // Validate phone number presence
    if (!phoneNumber.trim()) {
      setPhoneError("Phone number is required");
      return;
    }
    
    // Validate phone number format (10 digits)
    if (!phoneRegex.test(phoneNumber)) {
      setPhoneError("Please enter a valid 10-digit phone number");
      return;
    }
    
    // Clear errors and proceed to OTP screen
    setPhoneError("");
    setPhoneSubmitted(true);
    setTimer(30); // Reset timer
    setCanResend(false); // Disable resend initially
    console.log("OTP sent to:", phoneNumber);
  };

  // Handle OTP digit input
  const handleOtpChange = (value, index) => {
    // Allow only single digit (0-9)
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      setOtpError(""); // Clear any previous errors

      // Auto-advance to next input if digit entered
      if (value && index < 5) {
        setActiveOtpIndex(index + 1);
      }
    }
  };

  // Handle keyboard navigation in OTP inputs
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      // Handle backspace: move to previous input if current is empty
      if (!otp[index] && index > 0) {
        setActiveOtpIndex(index - 1);
      } else if (otp[index]) {
        // Clear current input if it has a value
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      // Move focus left with arrow key
      setActiveOtpIndex(index - 1);
    } else if (e.key === "ArrowRight" && index < 5) {
      // Move focus right with arrow key
      setActiveOtpIndex(index + 1);
    }
  };

  // Verify the entered OTP
  const verifyOTP = () => {
    const enteredOtp = otp.join("");
    
    // Check if all 6 digits are entered
    if (enteredOtp.length !== 6) {
      setOtpError("Please enter all 6 digits");
      return;
    }

    // Demo OTP: 123456 (for testing purposes)
    if (enteredOtp === "123456") {
      setIsVerifying(true);
      setOtpError("");
      
      // Simulate verification progress with interval
      const progressInterval = setInterval(() => {
        setVerificationProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            
            // Navigate to next page after progress completes
            setTimeout(() => {
              navigate("/review-pay", { 
                state: { 
                  ...appointmentData, 
                  phone: phoneNumber,
                  verified: true
                } 
              });
            }, 300);
            
            return 100;
          }
          return prev + 25; // Increment progress by 25% each interval
        });
      }, 300);
      
    } else {
      // Show error for invalid OTP
      setOtpError("Invalid OTP. Please try again or use 123456 for demo");
    }
  };

  // Resend OTP functionality
  const handleResendOTP = () => {
    if (!canResend) return;
    
    // Reset OTP state and timer
    setOtp(["", "", "", "", "", ""]);
    setActiveOtpIndex(0);
    setOtpError("");
    setTimer(30);
    setCanResend(false);
    console.log("OTP resent to:", phoneNumber);
  };

  // Timer countdown effect
  useEffect(() => {
    if (phoneSubmitted && timer > 0) {
      // Decrease timer every second
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      // Enable resend when timer reaches 0
      setCanResend(true);
    }
  }, [phoneSubmitted, timer]);

  // Auto-focus active OTP input
  useEffect(() => {
    if (inputRefs.current[activeOtpIndex]) {
      inputRefs.current[activeOtpIndex].focus();
    }
  }, [activeOtpIndex]);

  // Format phone number input (remove non-digits, limit to 10)
  const formatPhoneNumber = (value) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 10);
    if (phoneError) setPhoneError(""); // Clear error on input
    return cleaned;
  };

  return (
    <div className="min-h-screen">
      {/* Modern Medical Header */}
      <header className="bg-white border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="relative flex items-center justify-between h-16">
            {/* Back button */}
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-700 hover:text-emerald-700 transition-all duration-200 group px-3 py-1.5 rounded-lg hover:bg-emerald-50"
            >
              <div className="w-8 h-8 rounded-full border border-gray-200 group-hover:border-emerald-300 flex items-center justify-center transition-all">
                <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
              </div>
              <span className="font-medium text-sm hidden sm:inline">Back</span>
            </button>
            
            {/* Hospital Logo and Name */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#247336] to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <FontAwesomeIcon
                    icon={["fas", "leaf"]}
                    style={{ color: "#ffffff", width: "20px", height: "24px" }}
                  />
                </div>
                <div className="flex flex-col">
                  <h1 className="text-lg font-bold text-gray-900 tracking-tight">Nila Hospital</h1>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-xs text-emerald-600">
                      <Lock size={10} />
                      <span className="font-medium">Secure Patient Portal</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Spacer for alignment */}
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-8 sm:py-12">
        {/* Medical Progress Indicator - Shows 3-step process */}
        <div className="flex items-center justify-center mb-10">
          <div className="flex items-center space-x-1">
            {/* Step 1: Details */}
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold">
                1
              </div>
              <span className="text-xs font-medium text-gray-600 mt-2">Details</span>
            </div>
            <div className="w-16 h-1 bg-gradient-to-r from-emerald-400 to-teal-400"></div>
            
            {/* Step 2: Verify (Current Step) */}
            <div className="flex flex-col items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${
                phoneSubmitted 
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white' 
                  : 'bg-white border-2 border-emerald-200 text-gray-400'
              }`}>
                2
              </div>
              <span className="text-xs font-medium text-gray-600 mt-2">Verify</span>
            </div>
            <div className="w-16 h-1 bg-gradient-to-r from-teal-300 to-emerald-100"></div>
            
            {/* Step 3: Confirm */}
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white border-2 border-emerald-200 text-gray-400 font-semibold">
                3
              </div>
              <span className="text-xs font-medium text-gray-600 mt-2">Confirm</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-8">
          {/* Phone Number Form - Medical Style */}
          <AnimatePresence mode="wait">
            {/* Phone Input Screen - Shows when phone not submitted */}
            {!phoneSubmitted ? (
              <motion.div
                key="phone"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl border border-emerald-100 overflow-hidden"
              >
                <div className="relative">
                  {/* Medical Header Gradient */}
                  <div className="h-2 bg-gradient-to-r from-emerald-600 via-teal-500 to-green-400"></div>
                  
                  <div className="p-8">
                    <div className="text-center mb-8">
                      <div className="relative inline-block mb-4">
                        <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto">
                          <Phone className="text-white" size={32} />
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white">
                          <CheckCircle size={14} className="text-white" />
                        </div>
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-3">Patient Verification</h2>
                      <p className="text-gray-600">Secure your appointment with phone verification</p>
                    </div>

                    <form onSubmit={handlePhoneSubmit}>
                      <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          <div className="flex items-center gap-2">
                            <Phone size={14} />
                            <span>Contact Number</span>
                          </div>
                        </label>
                        <div className="relative">
                          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center gap-3">
                            <span className="font-semibold text-gray-700">+91</span>
                            <div className="w-px h-6 bg-gray-300"></div>
                          </div>
                          <input
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
                            placeholder="Enter 10-digit mobile number"
                            className="w-full pl-20 pr-4 py-4 border-2 border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-lg font-medium placeholder:text-gray-400 hover:border-emerald-300"
                            maxLength={10}
                            required
                          />
                        </div>
                        {phoneError && (
                          <motion.div 
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2 mt-3 p-3 bg-red-50 border border-red-100 rounded-lg"
                          >
                            <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
                            <span className="text-sm text-red-600">{phoneError}</span>
                          </motion.div>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={phoneNumber.length !== 10}
                        className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-3 ${
                          phoneNumber.length === 10
                            ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <span>Send Verification Code</span>
                        <ArrowLeft size={18} className="rotate-180" />
                      </button>
                    </form>
                    
                    {/* Medical Security Note */}
                    <div className="mt-8 p-5 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          <Shield size={18} className="text-emerald-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-emerald-900 mb-1">Medical Privacy Assured</h4>
                          <p className="text-sm text-emerald-700">
                            Your contact information is encrypted and protected under HIPAA guidelines. 
                            We use secure channels for all communications.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
             
              <motion.div
                key="otp"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl border border-emerald-100 overflow-hidden"
              >
                <div className="relative">
                  {/* Medical Header Gradient */}
                  <div className="h-2 bg-gradient-to-r from-teal-600 via-emerald-500 to-green-400"></div>
                  
                  <div className="p-8">
                    <div className="text-center mb-8">
                      <div className="relative inline-block mb-4">
                        <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto">
                          <Shield className="text-white" size={32} />
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white">
                          <CheckCircle size={14} className="text-white" />
                        </div>
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Secure Verification</h2>
                      <div className="space-y-1">
                        <p className="text-gray-600">
                          Code sent to <span className="font-semibold text-emerald-700">+91 {phoneNumber}</span>
                        </p>
                        <button
                          onClick={() => {
                            setPhoneSubmitted(false);
                            setOtpError("");
                          }}
                          className="text-sm text-emerald-600 hover:text-emerald-800 font-medium transition-colors hover:underline"
                        >
                          Need to change number?
                        </button>
                      </div>
                    </div>

                    {/* Modern Underline OTP Input */}
                    <div className="mb-5">
                      <label className="block text-sm font-semibold text-gray-700 mb-4">
                        <div className="flex items-center gap-2">
                          <Lock size={14} />
                          <span>Enter 6-digit Verification Code</span>
                        </div>
                      </label>
                      
                      {/* OTP Input Boxes */}
                      <div className="flex justify-between gap-3 mb-5">
                        {otp.map((digit, index) => (
                          <div key={index} className="relative flex-1">
                            <input
                              ref={(el) => {
                                if (el) {
                                  inputRefs.current[index] = el;
                                }
                              }}
                              type="tel"
                              value={digit}
                              onChange={(e) => handleOtpChange(e.target.value, index)}
                              onKeyDown={(e) => handleKeyDown(e, index)}
                              onFocus={() => setActiveOtpIndex(index)}
                              maxLength={1}
                              className={`w-full text-center text-1xl font-bold bg-transparent outline-none border-b-3 transition-all duration-200 ${
                                digit 
                                  ? 'border-emerald-600 text-emerald-700' 
                                  : activeOtpIndex === index 
                                    ? 'border-emerald-400 text-gray-800' 
                                    : 'border-emerald-200 text-gray-600 hover:border-emerald-300'
                              } ${isVerifying ? 'opacity-50 cursor-not-allowed' : ''}`}
                              disabled={isVerifying}
                            />
                            {/* Active input indicator */}
                            {activeOtpIndex === index && (
                              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-500 to-transparent"></div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* OTP Error Display */}
                      {otpError && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-3 p-4 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl mb-4"
                        >
                          <AlertCircle size={18} className="text-red-500 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-red-700">Verification Failed</p>
                            <p className="text-sm text-red-600 mt-0.5">{otpError}</p>
                          </div>
                        </motion.div>
                      )}

                      {/* Timer and Resend - Medical Style */}
                      <div className="text-center space-y-4">
                        <div className="flex items-center justify-center gap-3">
                          <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-full border border-emerald-100">
                            <Clock size={14} className="text-emerald-600" />
                            {timer > 0 ? (
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-emerald-800">Code expires in</span>
                                <span className="font-mono font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 px-3 py-1 rounded-lg">
                                  {timer.toString().padStart(2, '0')}s
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-emerald-800">Code expired</span>
                                <button
                                  onClick={handleResendOTP}
                                  className={`font-semibold text-sm px-3 py-1 rounded-lg transition-all ${
                                    canResend 
                                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white' 
                                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                  }`}
                                  disabled={!canResend || isVerifying}
                                >
                                  Resend Now
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Demo OTP Note */}
                        <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-emerald-200">
                          <p className="text-sm text-gray-700">
                            <span className="font-semibold text-emerald-700">Demo Note:</span> Use code 
                            <code className="font-mono font-bold mx-2 px-3 py-1 bg-white border border-emerald-300 rounded-lg text-emerald-700">
                              123456
                            </code>
                            to continue
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Medical Verification Progress Bar */}
                    {isVerifying && (
                      <div className="mb-6 space-y-4">
                        <div className="flex justify-between items-center text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                            <span className="font-medium text-gray-700">Verifying Patient Identity</span>
                          </div>
                          <span className="font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                            {verificationProgress}%
                          </span>
                        </div>
                        <div className="w-full h-2.5 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-emerald-400 via-teal-500 to-green-500"
                            initial={{ width: "0%" }}
                            animate={{ width: `${verificationProgress}%` }}
                            transition={{ duration: 1, ease: "easeInOut" }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 text-center font-medium">
                          Securing your medical appointment details...
                        </p>
                      </div>
                    )}

                    {/* Verify Button */}
                    <button
                      onClick={verifyOTP}
                      disabled={otp.join("").length !== 6 || isVerifying}
                      className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-3 ${
                        otp.join("").length === 6 && !isVerifying
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {isVerifying ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Verifying Patient Identity...</span>
                        </>
                      ) : (
                        <>
                          <span>Verify & Continue to Appointment</span>
                          <ArrowLeft size={18} className="rotate-180" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Medical Trust Indicators */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl border border-emerald-100 p-6"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* HIPAA Compliance */}
              <div className="flex flex-col items-center text-center">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mb-2">
                  <Shield size={14} className="text-emerald-600" />
                </div>
                <span className="text-xs font-medium text-gray-700">HIPAA Compliant</span>
              </div>
              
              {/* Encryption */}
              <div className="flex flex-col items-center text-center">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mb-2">
                  <Lock size={14} className="text-emerald-600" />
                </div>
                <span className="text-xs font-medium text-gray-700">End-to-end Encrypted</span>
              </div>
              
              {/* Medical Security */}
              <div className="flex flex-col items-center text-center">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mb-2">
                  <Stethoscope size={14} className="text-emerald-600" />
                </div>
                <span className="text-xs font-medium text-gray-700">Medical Grade Security</span>
              </div>
              
              {/* ISO Certification */}
              <div className="flex flex-col items-center text-center">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mb-2">
                  <CheckCircle size={14} className="text-emerald-600" />
                </div>
                <span className="text-xs font-medium text-gray-700">ISO Certified</span>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}