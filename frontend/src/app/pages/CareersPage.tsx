import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Send, CheckCircle, AlertCircle, UploadCloud, GraduationCap, FileCheck, User } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { SEO } from "../components/SEO";
import API_BASE from "../../config/api";

export function CareersPage() {
  const [formData, setFormData] = useState({
    fullName: "", phone: "", email: "",
    collegeName: "", course: "", branch: "", yearOfStudy: "1st Year",
    resumeUrl: "", idProofUrl: "", collegeIdUrl: "",
    declared: false
  });
  
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingField(fieldName);
    const uploadData = new FormData();
    uploadData.append('image', file);

    try {
      const response = await fetch(`${API_BASE}/api/upload`, {
        method: 'POST',
        body: uploadData
      });
      if (response.ok) {
        const filePath = await response.text();
        // Server returns a full data URL (base64), no need to prefix API_BASE
        setFormData(prev => ({ ...prev, [fieldName]: filePath }));
      } else {
        alert("Upload failed. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("Error uploading file.");
    } finally {
      setUploadingField(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.resumeUrl || !formData.idProofUrl || !formData.collegeIdUrl) {
      setErrorMsg("Please upload all required documents.");
      return;
    }
    if (!formData.declared) {
      setErrorMsg("You must declare that the details are correct.");
      return;
    }
    setErrorMsg("");
    setStatus("loading");
    try {
      const response = await fetch(`${API_BASE}/api/internships`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMsg("Failed to submit application.");
      }
    } catch (error) {
      setStatus("error");
      setErrorMsg("Network error.");
    }
  };

  return (
    <>
      <SEO 
        title="Careers | Finovert"
        description="Join Finovert. We are looking for talented individuals to help us build the future of finance."
      />
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-32 pb-20 px-4">
        <div className="max-w-3xl mx-auto">
          
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Join Our Team</h1>
            <p className="text-xl text-gray-600">Apply for our internship program and start your career at Finovert.</p>
          </div>

          {status === "success" ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 text-center">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Application Submitted!</h2>
              <p className="text-lg text-gray-600 mb-8">Thank you for your interest in Finovert. Our team will review your application and get back to you shortly.</p>
              <a href="/" className="inline-flex items-center justify-center px-8 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors">Return to Home</a>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="p-8 md:p-10">
                <form onSubmit={handleSubmit} className="space-y-8">
                  
                  {/* 1. Personal Information */}
                  <section>
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3 mb-6"><User className="w-5 h-5 text-blue-600" /> 1. Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="col-span-1 md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                        <input required type="text" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 bg-gray-50 focus:bg-white transition-colors" placeholder="John Doe" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
                        <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 bg-gray-50 focus:bg-white transition-colors" placeholder="+91 9876543210" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
                        <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 bg-gray-50 focus:bg-white transition-colors" placeholder="john@example.com" />
                      </div>
                    </div>
                  </section>

                  {/* 2. Educational Details */}
                  <section>
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3 mb-6 mt-10"><GraduationCap className="w-5 h-5 text-blue-600" /> 2. Educational Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="col-span-1 md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">College/University Name *</label>
                        <input required type="text" value={formData.collegeName} onChange={e => setFormData({...formData, collegeName: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 bg-gray-50 focus:bg-white transition-colors" placeholder="Indian Institute of Technology" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Course *</label>
                        <select required value={formData.course} onChange={e => setFormData({...formData, course: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 bg-gray-50 focus:bg-white transition-colors">
                          <option value="">Select Course</option>
                          <option value="B.Tech">B.Tech</option>
                          <option value="M.Tech">M.Tech</option>
                          <option value="BBA">BBA</option>
                          <option value="MBA">MBA</option>
                          <option value="B.Sc">B.Sc</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Branch / Specialization *</label>
                        <input required type="text" value={formData.branch} onChange={e => setFormData({...formData, branch: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 bg-gray-50 focus:bg-white transition-colors" placeholder="Computer Science" />
                      </div>
                      <div className="col-span-1 md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Year of Study *</label>
                        <select required value={formData.yearOfStudy} onChange={e => setFormData({...formData, yearOfStudy: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 bg-gray-50 focus:bg-white transition-colors">
                          <option value="1st Year">1st Year</option>
                          <option value="2nd Year">2nd Year</option>
                          <option value="3rd Year">3rd Year</option>
                          <option value="4th Year">4th Year</option>
                          <option value="Graduated">Graduated</option>
                        </select>
                      </div>
                    </div>
                  </section>

                  {/* 3. Documents Upload */}
                  <section>
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3 mb-6 mt-10"><FileCheck className="w-5 h-5 text-blue-600" /> 3. Documents Upload</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      
                      {/* Resume */}
                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-col items-center justify-center text-center relative group">
                        <UploadCloud className="w-8 h-8 text-gray-400 mb-2 group-hover:text-blue-500 transition-colors" />
                        <span className="text-sm font-bold text-gray-900 mb-1">Resume / CV</span>
                        {uploadingField === 'resumeUrl' ? (
                          <span className="text-xs text-blue-600 font-semibold">Uploading...</span>
                        ) : formData.resumeUrl ? (
                          <span className="text-xs text-green-600 font-semibold truncate w-full px-2">Uploaded!</span>
                        ) : (
                          <span className="text-xs text-gray-500">PDF, DOC, IMG</span>
                        )}
                        <input type="file" required={!formData.resumeUrl} onChange={e => handleFileUpload(e, 'resumeUrl')} accept=".pdf,.doc,.docx,image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                      </div>

                      {/* ID Proof */}
                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-col items-center justify-center text-center relative group">
                        <UploadCloud className="w-8 h-8 text-gray-400 mb-2 group-hover:text-blue-500 transition-colors" />
                        <span className="text-sm font-bold text-gray-900 mb-1">ID Proof</span>
                        {uploadingField === 'idProofUrl' ? (
                          <span className="text-xs text-blue-600 font-semibold">Uploading...</span>
                        ) : formData.idProofUrl ? (
                          <span className="text-xs text-green-600 font-semibold truncate w-full px-2">Uploaded!</span>
                        ) : (
                          <span className="text-xs text-gray-500">Aadhaar/PAN</span>
                        )}
                        <input type="file" required={!formData.idProofUrl} onChange={e => handleFileUpload(e, 'idProofUrl')} accept=".pdf,.doc,.docx,image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                      </div>

                      {/* College ID */}
                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-col items-center justify-center text-center relative group">
                        <UploadCloud className="w-8 h-8 text-gray-400 mb-2 group-hover:text-blue-500 transition-colors" />
                        <span className="text-sm font-bold text-gray-900 mb-1">College ID Card</span>
                        {uploadingField === 'collegeIdUrl' ? (
                          <span className="text-xs text-blue-600 font-semibold">Uploading...</span>
                        ) : formData.collegeIdUrl ? (
                          <span className="text-xs text-green-600 font-semibold truncate w-full px-2">Uploaded!</span>
                        ) : (
                          <span className="text-xs text-gray-500">Front/Back</span>
                        )}
                        <input type="file" required={!formData.collegeIdUrl} onChange={e => handleFileUpload(e, 'collegeIdUrl')} accept=".pdf,.doc,.docx,image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                      </div>

                    </div>
                  </section>

                  {/* 4. Declaration */}
                  <section className="mt-10 bg-blue-50 p-6 rounded-xl border border-blue-100">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <div className="mt-1">
                        <input type="checkbox" required checked={formData.declared} onChange={e => setFormData({...formData, declared: e.target.checked})} className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      </div>
                      <span className="text-sm text-gray-800 font-medium">
                        <strong>Declaration:</strong> I confirm that the above details are correct and I understand that any false information may result in the rejection of my application.
                      </span>
                    </label>
                  </section>

                  {errorMsg && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 font-semibold">
                      <AlertCircle className="w-5 h-5" /> {errorMsg}
                    </div>
                  )}

                  <button disabled={status === "loading"} type="submit" className="w-full bg-blue-600 text-white font-bold py-5 text-lg rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 flex items-center justify-center gap-2">
                    {status === "loading" ? "Submitting..." : <><Send className="w-5 h-5" /> Submit Application</>}
                  </button>

                </form>
              </div>
            </motion.div>
          )}

        </div>
      </div>
      <Footer />
    </>
  );
}
