import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Send, CheckCircle, AlertCircle, UploadCloud, GraduationCap, FileCheck, User, Briefcase, X } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { SEO } from "../components/SEO";
import API_BASE from "../../config/api";

const PREFERRED_ROLES = [
  "Marketing",
  "Tech",
  "Business and Sales",
  "Finance and Accounting",
  "Human Resources",
  "Operations",
  "Design and Creative",
  "Content and Social Media",
  "Product Management",
  "Data and Analytics",
  "Customer Support",
] as const;

const INDIAN_MOBILE_REGEX = /^[6-9]\d{9}$/;

function sanitizePhoneDigits(value: string) {
  return value.replace(/\D/g, "").slice(0, 10);
}

function isValidIndianMobile(phone: string) {
  return INDIAN_MOBILE_REGEX.test(phone);
}

export function CareersPage() {
  const [formData, setFormData] = useState({
    fullName: "", phone: "", email: "",
    collegeName: "", course: "", branch: "", yearOfStudy: "1st Year",
    preferredRole: "", eligibilityReason: "",
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

  const handlePhoneChange = (value: string) => {
    setFormData({ ...formData, phone: sanitizePhoneDigits(value) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidIndianMobile(formData.phone)) {
      setErrorMsg("Enter a valid 10-digit Indian mobile number (starts with 6, 7, 8, or 9).");
      return;
    }
    if (!formData.resumeUrl) {
      setErrorMsg("Please upload your resume.");
      return;
    }
    if (!formData.preferredRole) {
      setErrorMsg("Please select a preferred role.");
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
        body: JSON.stringify({
          ...formData,
          idProofUrl: formData.idProofUrl || "",
          collegeIdUrl: formData.collegeIdUrl || "",
        })
      });
      if (response.ok) {
        setFormData({
          fullName: "", phone: "", email: "",
          collegeName: "", course: "", branch: "", yearOfStudy: "1st Year",
          preferredRole: "", eligibilityReason: "",
          resumeUrl: "", idProofUrl: "", collegeIdUrl: "",
          declared: false
        });
        setStatus("success");
      } else {
        const data = await response.json().catch(() => ({}));
        setStatus("error");
        setErrorMsg(data.message || "Failed to submit application.");
      }
    } catch (error) {
      setStatus("error");
      setErrorMsg("Network error.");
    }
  };

  return (
    <>
      <SEO 
        title="Finovert - Careers | Join Our Team"
        description="Build your career at Finovert. Apply for internships and roles in finance, compliance, technology, marketing, and operations across India."
        path="/careers"
        keywords={["finovert careers", "join finovert", "finance internship india", "compliance jobs", "fintech careers"]}
      />
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-32 pb-20 px-4">
        <div className="max-w-3xl mx-auto">
          
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Join Our Team</h1>
            <p className="text-xl text-gray-600">Apply for our internship program and start your career at Finovert.</p>
          </div>

          {status === "success" && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl border border-gray-100 text-center max-w-md w-full relative"
              >
                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Application Submitted!</h2>
                <p className="text-gray-600 mb-2">Your application has been submitted successfully.</p>
                <p className="text-sm text-gray-500 mb-8">It will appear on our admin dashboard for review. We will get back to you shortly.</p>
                <a href="/" className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors w-full sm:w-auto">
                  Return to Home
                </a>
              </motion.div>
            </div>
          )}

          {status !== "success" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="p-8 md:p-10">
                <form onSubmit={handleSubmit} className="space-y-8">
                  
                  {/* 1. Personal Information */}
                  <section>
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3 mb-6"><User className="w-5 h-5 text-blue-600" /> 1. Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="col-span-1 md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                        <input required type="text" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 bg-gray-50 focus:bg-white transition-colors" placeholder="shyam" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
                        <input
                          required
                          type="tel"
                          inputMode="numeric"
                          autoComplete="tel-national"
                          value={formData.phone}
                          onChange={e => handlePhoneChange(e.target.value)}
                          maxLength={10}
                          pattern="[6-9][0-9]{9}"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 bg-gray-50 focus:bg-white transition-colors"
                          placeholder="9876543210"
                          title="10-digit Indian mobile number starting with 6, 7, 8, or 9"
                        />
                        <p className="mt-1.5 text-xs text-gray-500">10 digits only · Indian mobile (6–9XXXXXXXXX)</p>
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
                        <input required type="text" value={formData.collegeName} onChange={e => setFormData({...formData, collegeName: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 bg-gray-50 focus:bg-white transition-colors" placeholder="Enter your college or university name" />
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

                  {/* 3. Preferred Role */}
                  <section>
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3 mb-6 mt-10"><Briefcase className="w-5 h-5 text-blue-600" /> 3. Preferred Role</h3>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Select your preferred role *</label>
                    <select
                      required
                      value={formData.preferredRole}
                      onChange={e => setFormData({ ...formData, preferredRole: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 bg-gray-50 focus:bg-white transition-colors"
                    >
                      <option value="">Select a role</option>
                      {PREFERRED_ROLES.map((role, index) => (
                        <option key={role} value={role}>
                          {index + 1}. {role}
                        </option>
                      ))}
                    </select>
                  </section>

                  {/* 4. Why eligible */}
                  <section>
                    <h3 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3 mb-6 mt-10">4. Why are you eligible for this job?</h3>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Tell us why you are a good fit <span className="text-gray-400 font-normal">(optional)</span></label>
                    <textarea
                      rows={5}
                      value={formData.eligibilityReason}
                      onChange={e => setFormData({ ...formData, eligibilityReason: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 bg-gray-50 focus:bg-white transition-colors resize-none"
                      placeholder="Share your skills, experience, and why you want to join Finovert..."
                    />
                  </section>

                  {/* 5. Documents Upload */}
                  <section>
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3 mb-6 mt-10"><FileCheck className="w-5 h-5 text-blue-600" /> 5. Documents Upload</h3>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Resume / CV *</label>
                    <div className="w-full bg-gray-50 px-4 py-4 rounded-xl border border-gray-200 flex items-center gap-4 relative group hover:border-blue-400 focus-within:border-blue-500 transition-colors min-h-[56px]">
                      <UploadCloud className="w-8 h-8 shrink-0 text-gray-400 group-hover:text-blue-500 transition-colors" />
                      <div className="flex-1 min-w-0 text-left">
                        {uploadingField === 'resumeUrl' ? (
                          <p className="text-sm text-blue-600 font-semibold">Uploading...</p>
                        ) : formData.resumeUrl ? (
                          <p className="text-sm text-green-600 font-semibold">Resume uploaded successfully</p>
                        ) : (
                          <>
                            <p className="text-sm font-bold text-gray-900">Click or drag to upload your resume</p>
                            <p className="text-xs text-gray-500 mt-0.5">PDF, DOC, DOCX, or image</p>
                          </>
                        )}
                      </div>
                      <input type="file" required={!formData.resumeUrl} onChange={e => handleFileUpload(e, 'resumeUrl')} accept=".pdf,.doc,.docx,image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    </div>
                  </section>

                  {/* 6. Declaration */}
                  <section className="mt-10">
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
