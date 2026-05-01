import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle, XCircle, Search, User, Briefcase, Calendar, Building, FileText, BadgeCheck, RefreshCw } from "lucide-react";

const DUMMY_RECORDS = [
  {
    id: "FIN-2026-INT-001",
    name: "Alice Sharma",
    institute: "IIT Delhi",
    joinDate: "Jan 15, 2026",
    endDate: "Jun 15, 2026",
    role: "Software Engineering Intern",
    remarks: "Excellent performance, strong problem-solving skills and team collaboration."
  },
  {
    id: "FIN-EMP-1042",
    name: "Bob Verma",
    institute: "N/A",
    joinDate: "Apr 10, 2023",
    endDate: "Present",
    role: "Senior Frontend Developer",
    remarks: "Key contributor to the new dashboard UI and mobile-first experience."
  }
];

export function VerificationPage() {
  const [searchId, setSearchId] = useState("");
  const [result, setResult] = useState<typeof DUMMY_RECORDS[0] | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [captcha, setCaptcha] = useState({ q: "", a: 0 });
  const [userCaptcha, setUserCaptcha] = useState("");
  const [error, setError] = useState("");

  const generateCaptcha = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptcha({ q: result, a: 0 }); // 'a' is not used for string captcha
  };

  useEffect(() => {
    document.title = "Verify Authenticity | Finovert";
    generateCaptcha();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) return;

    if (userCaptcha.toUpperCase() !== captcha.q) {
      setError("CAPTCHA verification failed. Please enter the characters exactly as shown.");
      generateCaptcha();
      setUserCaptcha("");
      return;
    }

    setError("");
    setIsSearching(true);
    setHasSearched(false);

    // Fetch from backend API
    fetch(`http://localhost:5000/api/verifications/${searchId.trim()}`)
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Not found');
      })
      .then((data) => {
        setResult(data);
      })
      .catch(() => {
        setResult(null);
      })
      .finally(() => {
        setHasSearched(true);
        setIsSearching(false);
        setUserCaptcha("");
        generateCaptcha();
      });
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center p-3 bg-blue-100 text-blue-700 rounded-full mb-4">
            <BadgeCheck className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Verification Portal
          </h1>
          <p className="text-gray-600 text-lg max-w-xl mx-auto">
            Enter an Intern ID or Employee ID to verify authenticity and view official profile details.
          </p>
        </motion.div>

        {/* Search Box */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 mb-8"
        >
          <form onSubmit={handleSearch} className="relative">
            <div className="relative flex items-center">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="block w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all sm:text-lg"
                placeholder="e.g. FIN-2026-INT-001"
                required
              />
            </div>
            <div className="mt-8 bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm w-full">
              <div className="flex items-center gap-4 p-4">
                <div className="flex-shrink-0 flex flex-col items-center gap-2">
                  <div className="bg-[#f9f9f9] border border-gray-200 rounded p-3 select-none flex items-center justify-center min-w-[140px] h-12 relative overflow-hidden">
                    {/* Background noise lines */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none">
                      <div className="absolute top-1/2 left-0 w-full h-[1px] bg-black rotate-3"></div>
                      <div className="absolute top-1/3 left-0 w-full h-[1px] bg-black -rotate-2"></div>
                    </div>
                    <span className="relative text-xl font-bold tracking-tighter text-gray-700 italic flex gap-0.5">
                      {captcha.q.split('').map((char, i) => (
                        <span key={i} style={{ transform: `translateY(${Math.random() * 4 - 2}px) rotate(${Math.random() * 10 - 5}deg)` }}>
                          {char}
                        </span>
                      ))}
                    </span>
                  </div>
                  <button 
                    type="button" 
                    onClick={generateCaptcha}
                    className="text-[10px] text-blue-600 font-bold hover:underline flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" /> Get new code
                  </button>
                </div>
                
                <div className="flex-grow">
                  <input 
                    type="text"
                    value={userCaptcha}
                    onChange={(e) => setUserCaptcha(e.target.value)}
                    placeholder="Type code"
                    className="w-full px-3 py-3 bg-white border border-gray-300 rounded focus:border-blue-500 focus:outline-none text-gray-900 font-medium text-sm"
                    required
                  />
                </div>
              </div>
              
              <div className="bg-[#f9f9f9] px-4 py-2 border-t border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img src="https://www.gstatic.com/recaptcha/api2/logo_48.png" alt="reCAPTCHA" className="w-5 h-5 opacity-70" />
                  <span className="text-[10px] text-gray-500 font-medium">reCAPTCHA Verification</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-[10px] text-gray-400 hover:underline cursor-pointer">Privacy</span>
                  <span className="text-[10px] text-gray-400 hover:underline cursor-pointer">Terms</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSearching}
              className="mt-8 w-full bg-[#1a73e8] text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg disabled:opacity-70 flex items-center justify-center gap-3"
            >
              {isSearching ? (
                <>
                  <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                  Verifying Identity...
                </>
              ) : (
                <>Verify Official Record</>
              )}
            </button>

            {error && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm font-semibold mt-4 bg-red-900/20 p-4 rounded-xl border border-red-900/30 text-center"
              >
                {error}
              </motion.p>
            )}
          </form>
        </motion.div>

        {/* Results Area */}
        <AnimatePresence mode="wait">
          {hasSearched && !isSearching && (
            <motion.div
              key={result ? "found" : "not-found"}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {result ? (
                <div className="bg-white rounded-2xl shadow-lg border border-green-100 overflow-hidden relative">
                  {/* Success Banner */}
                  <div className="bg-green-50 px-6 py-4 border-b border-green-100 flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <div>
                      <h3 className="text-green-800 font-semibold text-lg">Verified Authenticity</h3>
                      <p className="text-green-600 text-sm">This ID is officially registered with Finovert.</p>
                    </div>
                  </div>

                  {/* Profile Details */}
                  <div className="p-6 sm:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div>
                          <p className="text-sm text-gray-500 mb-1 flex items-center gap-2">
                            <User className="w-4 h-4" /> Full Name
                          </p>
                          <p className="text-lg font-medium text-gray-900">{result.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1 flex items-center gap-2">
                            <Briefcase className="w-4 h-4" /> Role / Position
                          </p>
                          <p className="text-lg font-medium text-gray-900">{result.role}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1 flex items-center gap-2">
                            <Building className="w-4 h-4" /> Institute Name
                          </p>
                          <p className="text-lg font-medium text-gray-900">{result.institute}</p>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <p className="text-sm text-gray-500 mb-1 flex items-center gap-2">
                            <Calendar className="w-4 h-4" /> Tenure
                          </p>
                          <p className="text-lg font-medium text-gray-900">
                            {result.joinDate} – {result.endDate}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1 flex items-center gap-2">
                            <FileText className="w-4 h-4" /> Remarks / Performance
                          </p>
                          <p className="text-gray-900 leading-relaxed bg-gray-50 p-4 rounded-lg text-sm border border-gray-100">
                            {result.remarks}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-8 text-center">
                  <div className="inline-flex items-center justify-center p-3 bg-red-100 text-red-600 rounded-full mb-4">
                    <XCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Record Not Found</h3>
                  <p className="text-gray-600">
                    The ID <strong>"{searchId}"</strong> does not match any active or past records in our system. Please check the ID and try again.
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
