import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, Loader2, Clock } from "lucide-react";

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const [loading, setLoading] = useState(true);

  // Simulate payment processing
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  // Auto redirect after success
  useEffect(() => {
    if (!loading) {
      const redirectTimer = setTimeout(() => {
        navigate("/dashboard", { state });
      }, 5000);

      return () => clearTimeout(redirectTimer);
    }
  }, [loading, navigate]);

  /* ---------------- LOADING SCREEN ---------------- */
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-emerald-600" size={48} />
        <p className="mt-4 text-gray-600 text-sm">
          Processing your payment...
        </p>
      </div>
    );
  }

  /* ---------------- SUCCESS SCREEN ---------------- */
  return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-50 px-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-8 text-center animate-fadeIn">

        {/* ICON */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
            <CheckCircle className="text-emerald-600" size={36} />
          </div>
        </div>

        {/* TITLE */}
        <h1 className="text-2xl font-bold text-emerald-700">
          Payment Successful!
        </h1>
        <p className="text-gray-500 mt-1">
          Your appointment has been confirmed
        </p>

        {/* SUMMARY */}
        <div className="mt-6 bg-emerald-50 rounded-xl p-4 text-left space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Appointment ID</span>
            <span className="font-medium text-gray-800">
              #{state?.paymentId?.slice(-6) || "N/A"}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Amount Paid</span>
            <span className="font-semibold text-emerald-700">
              ₹{state?.amount || "0"}
            </span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Status</span>
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-200 text-emerald-700">
              CONFIRMED
            </span>
          </div>
        </div>

        {/* APPOINTMENT DETAILS */}
        <div className="mt-5 bg-blue-50 rounded-xl p-4 text-left">
          <div className="flex items-center gap-2 text-blue-700 font-semibold mb-2">
            <Clock size={16} />
            Appointment Details
          </div>

          <p className="text-sm text-gray-700">
            {state?.appointmentDate || "Date"} at{" "}
            {state?.appointmentTime || "Time"}
          </p>
        </div>

        {/* REDIRECT INFO */}
        <div className="mt-6 text-sm text-gray-400 flex flex-col items-center gap-2">
          <span>Redirecting to dashboard...</span>
          <div className="flex gap-1">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" />
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce delay-150" />
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce delay-300" />
          </div>
        </div>

      </div>
    </div>
  );
};

export default PaymentSuccessPage;
