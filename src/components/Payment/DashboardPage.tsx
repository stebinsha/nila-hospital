import { useLocation, useNavigate } from "react-router-dom";
import { 
  User, 
  Phone, 
  Calendar, 
  Clock, 
  IndianRupee, 
  Stethoscope, 
  MapPin, 
  CheckCircle,
  Download,
  FileText,
  Shield,
  Bell,
  ChevronRight,
  Star,
  Award,
  MessageCircle,
  Printer,
  Share2,
  Home,
  Building2,
  Phone as PhoneCall,
  Video,
  Mail,
  CalendarDays,
  FileBadge,
  AlertCircle,
  Edit2,
  Plus,
  History,
  ChevronDown,
  X
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// Interface for dashboard data structure
interface DashboardData {
  name: string;
  phone: string;
  email: string;
  appointmentDate: string;
  appointmentTime: string;
  doctorName: string;
  mode: string;
  amount: number | string;
  doctor?: {
    name: string;
    specialization: string;
    image?: string;
    experience?: string;
    rating?: string;
    tags?: string[];
  };
  location?: {
    name: string;
    address?: string;
    facilities?: string[];
  };
  payment?: {
    id?: string;
    method?: string;
    status?: string;
    invoiceUrl?: string;
  };
  patientInfo?: {
    bloodType?: string;
    age?: string;
    gender?: string;
    emergencyContact?: string;
    allergies?: string[];
    medicalConditions?: string[];
  };
}

// Interface for appointment history items
interface AppointmentHistory {
  id: string;
  date: string;
  time: string;
  doctorName: string;
  specialization: string;
  status: "completed" | "cancelled";
  diagnosis?: string;
  prescriptionUrl?: string;
}

const DashboardPage = () => {
  // Navigation hooks
  const { state } = useLocation();
  const navigate = useNavigate();
  
  // State management
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPatientInfoModal, setShowPatientInfoModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [patientInfo, setPatientInfo] = useState({
    bloodType: "",
    age: "",
    gender: "",
    emergencyContact: "",
    allergies: [] as string[],
    medicalConditions: [] as string[],
  });
  const [newAllergy, setNewAllergy] = useState("");
  const [newCondition, setNewCondition] = useState("");

  // Simulated appointment history - empty array (would be populated from API in real app)
  const appointmentHistory: AppointmentHistory[] = [];

  // Create upcoming appointment object from current dashboard data
  const upcomingAppointment = dashboardData ? {
    id: "UPCOMING-001",
    date: dashboardData.appointmentDate,
    time: dashboardData.appointmentTime,
    doctorName: dashboardData.doctor?.name || dashboardData.doctorName,
    specialization: dashboardData.doctor?.specialization || "General Physician",
    mode: dashboardData.mode,
    location: dashboardData.location?.name || "Nila Hospital",
    status: "scheduled" as const
  } : null;

  // Effect to load dashboard data from state or localStorage
  useEffect(() => {
    if (state) {
      // If data passed through navigation state
      const data = state as DashboardData;
      setDashboardData(data);
      
      // Initialize patient info from state if available
      if (data.patientInfo) {
        setPatientInfo({
          bloodType: data.patientInfo.bloodType || "",
          age: data.patientInfo.age || "",
          gender: data.patientInfo.gender || "",
          emergencyContact: data.patientInfo.emergencyContact || "",
          allergies: data.patientInfo.allergies || [],
          medicalConditions: data.patientInfo.medicalConditions || [],
        });
      } else {
        // Try to load from localStorage if not in state
        const savedPatientInfo = localStorage.getItem('patientInfo');
        if (savedPatientInfo) {
          try {
            const parsedInfo = JSON.parse(savedPatientInfo);
            setPatientInfo(parsedInfo);
            // Update the state data with patient info
            data.patientInfo = parsedInfo;
          } catch (error) {
            console.error("Error parsing saved patient info:", error);
          }
        }
      }
      setLoading(false);
    } else {
      // If no state, try to get data from localStorage as fallback
      const savedData = localStorage.getItem('lastAppointment');
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          
          // Load patient info from localStorage
          const savedPatientInfo = localStorage.getItem('patientInfo');
          let patientInfoData = {};
          if (savedPatientInfo) {
            try {
              patientInfoData = JSON.parse(savedPatientInfo);
            } catch (error) {
              console.error("Error parsing saved patient info:", error);
            }
          }

          // Combine saved data into dashboard format
          const combinedData: DashboardData = {
            name: parsedData.payment?.name || "",
            phone: parsedData.payment?.phone || parsedData.otp?.phone || "",
            email: parsedData.payment?.email || "",
            appointmentDate: parsedData.payment?.appointmentDate || "",
            appointmentTime: parsedData.payment?.appointmentTime || "",
            doctorName: parsedData.payment?.doctorName || parsedData.booking?.therapist?.name || "",
            mode: parsedData.payment?.mode || parsedData.booking?.consultationType || "in-person",
            amount: parsedData.payment?.amount || parsedData.booking?.therapist?.price || "1200",
            doctor: {
              name: parsedData.payment?.doctorName || parsedData.booking?.therapist?.name || "",
              specialization: parsedData.payment?.specialization || parsedData.booking?.therapist?.role || "",
              image: parsedData.payment?.doctorImage || parsedData.booking?.therapist?.image,
              experience: parsedData.booking?.therapist?.experience,
              tags: parsedData.booking?.therapist?.tags
            },
            location: {
              name: parsedData.payment?.location?.name || parsedData.booking?.selectedLocation?.name || "Nila Hospital",
              address: parsedData.payment?.location?.description,
              facilities: parsedData.booking?.selectedLocation?.facilities
            },
            payment: {
              id: parsedData.payment?.paymentId,
              method: parsedData.payment?.method || "Razorpay",
              status: "Success",
              invoiceUrl: "#"
            },
            patientInfo: parsedData.patientInfo || patientInfoData
          };
          setDashboardData(combinedData);
          setPatientInfo({
            bloodType: combinedData.patientInfo?.bloodType || "",
            age: combinedData.patientInfo?.age || "",
            gender: combinedData.patientInfo?.gender || "",
            emergencyContact: combinedData.patientInfo?.emergencyContact || "",
            allergies: combinedData.patientInfo?.allergies || [],
            medicalConditions: combinedData.patientInfo?.medicalConditions || []
          });
        } catch (error) {
          console.error("Error parsing saved data:", error);
        }
      }
      setLoading(false);
    }
  }, [state]);

  // Save patient information to localStorage and update state
  const handleSavePatientInfo = () => {
    // Save to localStorage first
    localStorage.setItem('patientInfo', JSON.stringify(patientInfo));
    
    // Update dashboard data state
    setDashboardData(prev => prev ? {
      ...prev,
      patientInfo: patientInfo
    } : null);
    
    // Also save to lastAppointment in localStorage for persistence
    const savedData = localStorage.getItem('lastAppointment');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        parsedData.patientInfo = patientInfo;
        localStorage.setItem('lastAppointment', JSON.stringify(parsedData));
      } catch (error) {
        console.error("Error saving patient info to appointment:", error);
      }
    }
    
    setEditMode(false);
    setShowPatientInfoModal(false);
  };

  // Add new allergy to the list
  const addAllergy = () => {
    if (newAllergy.trim()) {
      setPatientInfo(prev => ({
        ...prev,
        allergies: [...prev.allergies, newAllergy.trim()]
      }));
      setNewAllergy("");
    }
  };

  // Remove allergy from the list
  const removeAllergy = (index: number) => {
    setPatientInfo(prev => ({
      ...prev,
      allergies: prev.allergies.filter((_, i) => i !== index)
    }));
  };

  // Add new medical condition to the list
  const addMedicalCondition = () => {
    if (newCondition.trim()) {
      setPatientInfo(prev => ({
        ...prev,
        medicalConditions: [...prev.medicalConditions, newCondition.trim()]
      }));
      setNewCondition("");
    }
  };

  // Remove medical condition from the list
  const removeMedicalCondition = (index: number) => {
    setPatientInfo(prev => ({
      ...prev,
      medicalConditions: prev.medicalConditions.filter((_, i) => i !== index)
    }));
  };

  // Loading state UI
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // No data state UI
  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center"
        >
          <AlertCircle className="text-amber-500 w-16 h-16 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Appointment Data</h2>
          <p className="text-gray-600 mb-6">Please book an appointment first to access the dashboard.</p>
          <button
            onClick={() => navigate("/specialists")}
            className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Book Appointment
          </button>
        </motion.div>
      </div>
    );
  }

  // Format consultation mode for display
  const formatMode = (mode: string) => {
    switch (mode) {
      case "in-person": return "In-Person";
      case "video": return "Video Consultation";
      case "phone": return "Phone Consultation";
      default: return mode.replace("-", " ");
    }
  };

  // Generate and download receipt as JSON file
  const handleDownloadReceipt = () => {
    const receipt = {
      receiptId: `REC-${Date.now().toString().slice(-8)}`,
      date: new Date().toLocaleDateString(),
      patient: {
        name: dashboardData.name,
        phone: dashboardData.phone,
        ...patientInfo
      },
      appointment: {
        date: dashboardData.appointmentDate,
        time: dashboardData.appointmentTime,
        doctor: dashboardData.doctor?.name || dashboardData.doctorName,
        mode: formatMode(dashboardData.mode),
        location: dashboardData.location?.name
      },
      payment: {
        amount: dashboardData.amount,
        status: "Completed",
        method: dashboardData.payment?.method || "Razorpay"
      }
    };

    const dataStr = JSON.stringify(receipt, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const link = document.createElement('a');
    link.setAttribute('href', dataUri);
    link.setAttribute('download', `receipt-${receipt.receiptId}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen">
      {/* Patient Info Modal - Fixed z-index for overlay */}
      {showPatientInfoModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[100]">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {editMode ? "Edit Patient Information" : "Patient Information"}
                </h3>
                <button
                  onClick={() => {
                    setShowPatientInfoModal(false);
                    setEditMode(false);
                    // Reset to saved data when closing without saving
                    if (dashboardData.patientInfo) {
                      setPatientInfo({
                        bloodType: dashboardData.patientInfo.bloodType || "",
                        age: dashboardData.patientInfo.age || "",
                        gender: dashboardData.patientInfo.gender || "",
                        emergencyContact: dashboardData.patientInfo.emergencyContact || "",
                        allergies: dashboardData.patientInfo.allergies || [],
                        medicalConditions: dashboardData.patientInfo.medicalConditions || [],
                      });
                    }
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Edit Mode Form */}
              {editMode ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Blood Type</label>
                      <select
                        value={patientInfo.bloodType}
                        onChange={(e) => setPatientInfo(prev => ({ ...prev, bloodType: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                      >
                        <option value="">Select</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                      <input
                        type="number"
                        value={patientInfo.age}
                        onChange={(e) => setPatientInfo(prev => ({ ...prev, age: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        min="0"
                        max="120"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select
                      value={patientInfo.gender}
                      onChange={(e) => setPatientInfo(prev => ({ ...prev, gender: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact</label>
                    <input
                      type="tel"
                      value={patientInfo.emergencyContact}
                      onChange={(e) => setPatientInfo(prev => ({ ...prev, emergencyContact: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      placeholder="+91 98765 43210"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Allergies</label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={newAllergy}
                        onChange={(e) => setNewAllergy(e.target.value)}
                        className="flex-1 p-2 border border-gray-300 rounded-lg"
                        placeholder="Add an allergy (e.g., Penicillin, Peanuts)"
                        onKeyPress={(e) => e.key === 'Enter' && addAllergy()}
                      />
                      <button
                        type="button"
                        onClick={addAllergy}
                        className="px-4 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors"
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {patientInfo.allergies.map((allergy, index) => (
                        <div key={index} className="flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded-full">
                          <span className="text-sm">{allergy}</span>
                          <button
                            type="button"
                            onClick={() => removeAllergy(index)}
                            className="ml-1 hover:text-red-900"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Medical Conditions</label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={newCondition}
                        onChange={(e) => setNewCondition(e.target.value)}
                        className="flex-1 p-2 border border-gray-300 rounded-lg"
                        placeholder="Add a medical condition (e.g., Diabetes, Hypertension)"
                        onKeyPress={(e) => e.key === 'Enter' && addMedicalCondition()}
                      />
                      <button
                        type="button"
                        onClick={addMedicalCondition}
                        className="px-4 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {patientInfo.medicalConditions.map((condition, index) => (
                        <div key={index} className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                          <span className="text-sm">{condition}</span>
                          <button
                            type="button"
                            onClick={() => removeMedicalCondition(index)}
                            className="ml-1 hover:text-blue-900"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setEditMode(false);
                        // Reset to original data
                        if (dashboardData.patientInfo) {
                          setPatientInfo({
                            bloodType: dashboardData.patientInfo.bloodType || "",
                            age: dashboardData.patientInfo.age || "",
                            gender: dashboardData.patientInfo.gender || "",
                            emergencyContact: dashboardData.patientInfo.emergencyContact || "",
                            allergies: dashboardData.patientInfo.allergies || [],
                            medicalConditions: dashboardData.patientInfo.medicalConditions || [],
                          });
                        }
                      }}
                      className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSavePatientInfo}
                      className="flex-1 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                /* View Mode */
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Blood Type</p>
                      <p className="font-medium">{patientInfo.bloodType || "Not specified"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Age</p>
                      <p className="font-medium">{patientInfo.age || "Not specified"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Gender</p>
                      <p className="font-medium">{patientInfo.gender || "Not specified"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Emergency Contact</p>
                      <p className="font-medium">{patientInfo.emergencyContact || "Not specified"}</p>
                    </div>
                  </div>

                  {patientInfo.allergies.length > 0 ? (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Allergies</p>
                      <div className="flex flex-wrap gap-2">
                        {patientInfo.allergies.map((allergy, index) => (
                          <span key={index} className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
                            {allergy}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4 bg-gray-50 rounded-xl">
                      <p className="text-gray-500">No allergies recorded</p>
                    </div>
                  )}

                  {patientInfo.medicalConditions.length > 0 ? (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Medical Conditions</p>
                      <div className="flex flex-wrap gap-2">
                        {patientInfo.medicalConditions.map((condition, index) => (
                          <span key={index} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                            {condition}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4 bg-gray-50 rounded-xl">
                      <p className="text-gray-500">No medical conditions recorded</p>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => setEditMode(true)}
                    className="w-full py-3 border-2 border-emerald-600 text-emerald-700 rounded-xl hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <Edit2 size={18} />
                    Edit Information
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Professional Header - Reduced z-index to stay below modal */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b border-emerald-100 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Hospital Logo and Title */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                <CheckCircle className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Nila Hospital</h1>
                <p className="text-xs text-emerald-600 font-medium">Patient Dashboard</p>
              </div>
            </div>
            
            {/* Notifications and User Profile */}
            <div className="flex items-center gap-4">
              <button className="relative p-2 hover:bg-emerald-50 rounded-lg transition-colors">
                <Bell size={20} className="text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="hidden md:flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {dashboardData.name.charAt(0)}
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{dashboardData.name}</p>
                  <p className="text-xs text-gray-500">Patient Portal</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl shadow-xl overflow-hidden mb-8"
        >
          <div className="p-8 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <CheckCircle size={32} className="text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <Award size={14} className="text-emerald-600" />
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-2">Appointment Confirmed</h1>
                  <p className="text-emerald-100 opacity-90">
                    Your consultation is scheduled successfully with Dr. {dashboardData.doctor?.name || dashboardData.doctorName}
                  </p>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-xl border border-white/20">
                <p className="text-sm font-medium">Appointment ID</p>
                <p className="text-xl font-bold tracking-wider">
                  APPT-{Date.now().toString().slice(-6)}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Patient & Appointment Info (2/3 width) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Patient & Appointment Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <User className="text-blue-600" size={20} />
                    </div>
                    Patient & Appointment Details
                  </h2>
                  <button
                    onClick={() => setShowPatientInfoModal(true)}
                    className="flex items-center gap-2 px-4 py-2 text-emerald-700 hover:bg-emerald-50 rounded-xl transition-colors border border-emerald-200"
                  >
                    <Edit2 size={16} />
                    Edit Medical Info
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Patient Info Section */}
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                          {dashboardData.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg">{dashboardData.name}</h3>
                          <p className="text-sm text-gray-500">Registered Patient</p>
                          <button
                            onClick={() => setShowPatientInfoModal(true)}
                            className="mt-2 text-sm text-emerald-600 hover:text-emerald-800 flex items-center gap-1 transition-colors"
                          >
                            View medical information
                            <ChevronDown size={14} />
                          </button>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                          <Phone className="text-emerald-600" size={18} />
                          <div>
                            <p className="text-sm text-gray-600">Contact Number</p>
                            <p className="font-medium">{dashboardData.phone}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                          <Mail className="text-emerald-600" size={18} />
                          <div>
                            <p className="text-sm text-gray-600">Email</p>
                            <p className="font-medium">{dashboardData.email}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Quick Patient Info Summary */}
                    <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                      <h4 className="font-medium text-emerald-800 mb-2 flex items-center gap-2">
                        <AlertCircle size={16} />
                        Medical Summary
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-emerald-600">Blood Type</p>
                          <p className="text-sm font-medium">{patientInfo.bloodType || "Not set"}</p>
                        </div>
                        <div>
                          <p className="text-xs text-emerald-600">Age</p>
                          <p className="text-sm font-medium">{patientInfo.age || "Not set"}</p>
                        </div>
                        {patientInfo.allergies.length > 0 && (
                          <div className="col-span-2">
                            <p className="text-xs text-emerald-600">Allergies</p>
                            <p className="text-sm font-medium">{patientInfo.allergies.length} recorded</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Appointment Info Section */}
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-5 border border-emerald-100">
                      <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <CalendarDays className="text-emerald-600" size={18} />
                        Appointment Schedule
                      </h4>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded-lg shadow-sm">
                              <Calendar className="text-emerald-600" size={18} />
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Date</p>
                              <p className="font-semibold text-gray-900">{dashboardData.appointmentDate}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded-lg shadow-sm">
                              <Clock className="text-emerald-600" size={18} />
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Time</p>
                              <p className="font-semibold text-gray-900">{dashboardData.appointmentTime}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="pt-4 border-t border-emerald-100">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded-lg shadow-sm">
                              {dashboardData.mode === "video" ? (
                                <Video className="text-blue-600" size={18} />
                              ) : dashboardData.mode === "phone" ? (
                                <PhoneCall className="text-purple-600" size={18} />
                              ) : (
                                <Stethoscope className="text-emerald-600" size={18} />
                              )}
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Consultation Type</p>
                              <p className="font-semibold text-gray-900">{formatMode(dashboardData.mode)}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Upcoming & Past Appointments Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Upcoming Appointment Card */}
              {upcomingAppointment && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                      <div className="p-2 bg-emerald-100 rounded-lg">
                        <Calendar className="text-emerald-600" size={20} />
                      </div>
                      Upcoming Appointment
                    </h2>
                  </div>
                  
                  <div className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        {dashboardData.doctor?.image ? (
                          <img 
                            src={dashboardData.doctor.image} 
                            alt={dashboardData.doctor.name}
                            className="w-16 h-16 rounded-xl object-cover border-2 border-white shadow-md"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                            <User className="text-white" size={24} />
                          </div>
                        )}
                        <div>
                          <h3 className="font-bold text-gray-900">{upcomingAppointment.doctorName}</h3>
                          <p className="text-emerald-600 text-sm">{upcomingAppointment.specialization}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Date</span>
                          <span className="font-medium">{upcomingAppointment.date}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Time</span>
                          <span className="font-medium">{upcomingAppointment.time}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Mode</span>
                          <span className="font-medium">{formatMode(upcomingAppointment.mode)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Location</span>
                          <span className="font-medium">{upcomingAppointment.location}</span>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                          <span className="text-sm font-medium text-emerald-700">Confirmed</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Past Appointments Card */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <History className="text-blue-600" size={20} />
                    </div>
                    Appointment History
                  </h2>
                </div>
                
                <div className="p-6">
                  {appointmentHistory.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                        <History className="text-gray-400" size={24} />
                      </div>
                      <h3 className="font-medium text-gray-700 mb-2">No Past Appointments</h3>
                      <p className="text-sm text-gray-500 mb-6">You haven't had any appointments yet</p>
                      <button
                        onClick={() => navigate("/specialists")}
                        className="px-6 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors"
                      >
                        Book First Appointment
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {appointmentHistory.slice(0, 3).map((appointment) => (
                        <div key={appointment.id} className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-gray-900">{appointment.doctorName}</h4>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              appointment.status === 'completed' 
                                ? 'bg-emerald-100 text-emerald-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {appointment.status === 'completed' ? 'Completed' : 'Cancelled'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{appointment.specialization}</p>
                          <div className="flex justify-between text-sm text-gray-500">
                            <span>{appointment.date}</span>
                            <span>{appointment.time}</span>
                          </div>
                        </div>
                      ))}
                      
                      {appointmentHistory.length > 3 && (
                        <button className="w-full py-3 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-xl transition-colors">
                          View All Appointments ({appointmentHistory.length})
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Payment & Actions (1/3 width) */}
          <div className="space-y-8">
            {/* Payment Information Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <IndianRupee className="text-emerald-600" size={20} />
                  </div>
                  Payment Information
                </h2>
              </div>
              
              <div className="p-6">
                <div className="space-y-6">
                  <div className="text-center p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
                    <p className="text-sm text-gray-600 mb-2">Total Amount Paid</p>
                    <div className="flex items-center justify-center gap-2">
                      <IndianRupee size={24} className="text-emerald-700" />
                      <span className="text-3xl font-bold text-emerald-800">
                        {typeof dashboardData.amount === 'string' ? dashboardData.amount.replace('₹', '') : dashboardData.amount}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-center gap-2">
                      <CheckCircle size={14} className="text-emerald-600" />
                      <span className="text-sm font-medium text-emerald-700">Payment Successful</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Payment Method</span>
                      <span className="font-medium flex items-center gap-2">
                        <Shield size={14} className="text-emerald-600" />
                        {dashboardData.payment?.method || "Razorpay"}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Transaction ID</span>
                      <span className="font-medium text-sm">
                        {dashboardData.payment?.id || `TXN${Date.now().toString().slice(-8)}`}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600">Date & Time</span>
                      <span className="font-medium text-sm">{new Date().toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-100">
                    <button 
                      onClick={handleDownloadReceipt}
                      className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                    >
                      <Download size={18} />
                      Download Receipt
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
              </div>
              
              <div className="p-6">
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-emerald-50 rounded-xl border border-gray-200 hover:border-emerald-300 transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg group-hover:bg-emerald-100 transition-colors">
                        <FileText size={18} className="text-gray-600 group-hover:text-emerald-600" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-gray-900 group-hover:text-emerald-700">View Prescription</p>
                        <p className="text-xs text-gray-500">Digital copy available</p>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-gray-400 group-hover:text-emerald-600" />
                  </button>
                  
                  <button className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-blue-50 rounded-xl border border-gray-200 hover:border-blue-300 transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg group-hover:bg-blue-100 transition-colors">
                        <Share2 size={18} className="text-gray-600 group-hover:text-blue-600" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-gray-900 group-hover:text-blue-700">Share Details</p>
                        <p className="text-xs text-gray-500">With family or caregiver</p>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-gray-400 group-hover:text-blue-600" />
                  </button>
                  
                  <button className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-amber-50 rounded-xl border border-gray-200 hover:border-amber-300 transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg group-hover:bg-amber-100 transition-colors">
                        <Printer size={18} className="text-gray-600 group-hover:text-amber-600" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-gray-900 group-hover:text-amber-700">Print Documents</p>
                        <p className="text-xs text-gray-500">Medical records & receipts</p>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-gray-400 group-hover:text-amber-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* Important Instructions Card */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-6">
              <h3 className="font-bold text-amber-900 mb-4 flex items-center gap-2">
                <AlertCircle size={20} className="text-amber-600" />
                Important Instructions
              </h3>
              <ul className="space-y-3 text-amber-800">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
                  <span className="text-sm">Please arrive 15 minutes before your appointment time</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
                  <span className="text-sm">Carry your government photo ID and insurance card</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
                  <span className="text-sm">Bring previous medical records and prescriptions</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
                  <span className="text-sm">Free cancellation up to 24 hours before appointment</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            onClick={() => navigate("/")}
            className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-3"
          >
            <Home size={20} />
            Go to Home
          </button>
          
          <button
            onClick={() => navigate("/specialists")}
            className="px-8 py-4 border-2 border-emerald-600 text-emerald-700 font-semibold rounded-xl hover:bg-emerald-50 transition-all duration-300 flex items-center gap-3"
          >
            <Calendar size={20} />
            Book Another Appointment
          </button>
        </motion.div>
      </main>

      {/* Footer Section */}
      <footer className="mt-12 border-t border-gray-200 bg-white/80 backdrop-blur-sm py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center">
                  <FileBadge className="text-white" size={16} />
                </div>
                <span className="font-bold text-gray-900">Nila Hospital Patient Portal</span>
              </div>
              <p className="text-xs text-gray-500">© 2024 Nila Hospital. All rights reserved.</p>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <p className="flex items-center gap-2">
                <Shield size={14} className="text-emerald-600" />
                <span>HIPAA Compliant • End-to-end Encrypted</span>
              </p>
              <p>Need help? Contact: support@nilahospital.com</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DashboardPage;