import { useState, useEffect } from "react";
import { Send, CheckCircle, AlertCircle, UploadCloud, X } from "lucide-react";
import { SEO } from "../components/SEO";
import { OutlinedField, outlinedInputClass } from "../components/corporate/OutlinedField";
import { FormSection } from "../components/corporate/FormSection";
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
    fullName: "",
    phone: "",
    email: "",
    collegeName: "",
    course: "",
    branch: "",
    yearOfStudy: "1st Year",
    preferredRole: "",
    eligibilityReason: "",
    resumeUrl: "",
    idProofUrl: "",
    collegeIdUrl: "",
    declared: false,
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
    uploadData.append("image", file);

    try {
      const response = await fetch(`${API_BASE}/api/upload`, {
        method: "POST",
        body: uploadData,
      });
      if (response.ok) {
        const filePath = await response.text();
        setFormData((prev) => ({ ...prev, [fieldName]: filePath }));
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
      setErrorMsg("Enter a valid 10-digit Indian mobile number.");
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
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          idProofUrl: formData.idProofUrl || "",
          collegeIdUrl: formData.collegeIdUrl || "",
        }),
      });
      if (response.ok) {
        setFormData({
          fullName: "",
          phone: "",
          email: "",
          collegeName: "",
          course: "",
          branch: "",
          yearOfStudy: "1st Year",
          preferredRole: "",
          eligibilityReason: "",
          resumeUrl: "",
          idProofUrl: "",
          collegeIdUrl: "",
          declared: false,
        });
        setStatus("success");
      } else {
        const data = await response.json().catch(() => ({}));
        setStatus("error");
        setErrorMsg(data.message || "Failed to submit application.");
      }
    } catch {
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

      <div className="bg-slate-50 min-h-[calc(100dvh-8rem)] pt-20 sm:pt-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12">
          {status === "success" && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
                  <div className="bg-white p-8 border border-slate-200 text-center max-w-md w-full relative shadow-lg">
                    <button
                      type="button"
                      onClick={() => setStatus("idle")}
                      className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                      aria-label="Close"
                    >
                      <X className="w-5 h-5" />
                    </button>
                    <div className="w-14 h-14 bg-green-50 text-green-700 flex items-center justify-center mx-auto mb-5 border border-green-200">
                      <CheckCircle className="w-7 h-7" />
                    </div>
                    <h2 className="text-xl font-bold text-[#0F2A5F] mb-2">Application Submitted</h2>
                    <p className="text-slate-600 mb-6 text-sm leading-relaxed">
                      Your application has been received. Our HR team will review it and contact you shortly.
                    </p>
                    <a
                      href="/"
                      className="inline-flex items-center justify-center px-6 py-3 bg-[#0F2A5F] text-white text-sm font-semibold hover:bg-[#0b1f47] transition-colors"
                    >
                      Return to Home
                    </a>
                  </div>
            </div>
          )}

          {status !== "success" && (
            <div className="bg-white border border-slate-200 shadow-sm">
                  <div className="border-b border-slate-200 bg-slate-50 px-6 py-5">
                    <h1 className="text-xl sm:text-2xl font-bold text-[#0F2A5F]">Join Our Team</h1>
                    <p className="text-xs text-slate-500 mt-1">Complete all sections below</p>
                  </div>

                  <div className="p-6 sm:p-8">
                    <form onSubmit={handleSubmit}>
                      <FormSection step={1} title="Personal Information">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                          <div className="md:col-span-2">
                            <OutlinedField label="Full Name" required>
                              <input
                                required
                                type="text"
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                className={outlinedInputClass}
                              />
                            </OutlinedField>
                          </div>
                          <OutlinedField label="Phone Number" required>
                            <input
                              required
                              type="tel"
                              inputMode="numeric"
                              autoComplete="tel-national"
                              value={formData.phone}
                              onChange={(e) => handlePhoneChange(e.target.value)}
                              maxLength={10}
                              pattern="[6-9][0-9]{9}"
                              className={outlinedInputClass}
                            />
                          </OutlinedField>
                          <OutlinedField label="Email Address" required>
                            <input
                              required
                              type="email"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              className={outlinedInputClass}
                            />
                          </OutlinedField>
                        </div>
                      </FormSection>

                      <FormSection step={2} title="Educational Details">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                          <div className="md:col-span-2">
                            <OutlinedField label="College / University" required>
                              <input
                                required
                                type="text"
                                value={formData.collegeName}
                                onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
                                className={outlinedInputClass}
                              />
                            </OutlinedField>
                          </div>
                          <OutlinedField label="Course" required>
                            <select
                              required
                              value={formData.course}
                              onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                              className={`${outlinedInputClass} cursor-pointer`}
                            >
                              <option value="">Select course</option>
                              <option value="B.Tech">B.Tech</option>
                              <option value="M.Tech">M.Tech</option>
                              <option value="BBA">BBA</option>
                              <option value="MBA">MBA</option>
                              <option value="B.Sc">B.Sc</option>
                              <option value="Other">Other</option>
                            </select>
                          </OutlinedField>
                          <OutlinedField label="Branch" required>
                            <input
                              required
                              type="text"
                              value={formData.branch}
                              onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                              className={outlinedInputClass}
                            />
                          </OutlinedField>
                          <div className="md:col-span-2">
                            <OutlinedField label="Year of Study" required>
                              <select
                                required
                                value={formData.yearOfStudy}
                                onChange={(e) => setFormData({ ...formData, yearOfStudy: e.target.value })}
                                className={`${outlinedInputClass} cursor-pointer`}
                              >
                                <option value="1st Year">1st Year</option>
                                <option value="2nd Year">2nd Year</option>
                                <option value="3rd Year">3rd Year</option>
                                <option value="4th Year">4th Year</option>
                                <option value="Graduated">Graduated</option>
                              </select>
                            </OutlinedField>
                          </div>
                        </div>
                      </FormSection>

                      <FormSection step={3} title="Preferred Role">
                        <OutlinedField label="Role" required>
                          <select
                            required
                            value={formData.preferredRole}
                            onChange={(e) => setFormData({ ...formData, preferredRole: e.target.value })}
                            className={`${outlinedInputClass} cursor-pointer`}
                          >
                            <option value="">Select a role</option>
                            {PREFERRED_ROLES.map((role) => (
                              <option key={role} value={role}>
                                {role}
                              </option>
                            ))}
                          </select>
                        </OutlinedField>
                      </FormSection>

                      <FormSection step={4} title="Eligibility">
                        <OutlinedField label="Why you are a good fit" optional>
                          <textarea
                            rows={4}
                            value={formData.eligibilityReason}
                            onChange={(e) => setFormData({ ...formData, eligibilityReason: e.target.value })}
                            className={`${outlinedInputClass} resize-none min-h-[100px]`}
                          />
                        </OutlinedField>
                      </FormSection>

                      <FormSection step={5} title="Resume & Declaration">
                        <div className="space-y-6">
                          <OutlinedField label="Resume / CV" required>
                            <div className="flex items-center gap-3 relative min-h-[24px]">
                              <UploadCloud className="w-5 h-5 shrink-0 text-slate-400" />
                              <p className="flex-1 text-sm text-slate-700">
                                {uploadingField === "resumeUrl"
                                  ? "Uploading..."
                                  : formData.resumeUrl
                                    ? "File attached"
                                    : "Click to upload PDF, DOC, or image"}
                              </p>
                              <input
                                type="file"
                                required={!formData.resumeUrl}
                                onChange={(e) => handleFileUpload(e, "resumeUrl")}
                                accept=".pdf,.doc,.docx,image/*"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              />
                            </div>
                          </OutlinedField>

                          <label className="flex items-start gap-3 cursor-pointer border border-slate-200 bg-slate-50 p-4">
                            <input
                              type="checkbox"
                              required
                              checked={formData.declared}
                              onChange={(e) => setFormData({ ...formData, declared: e.target.checked })}
                              className="w-4 h-4 mt-0.5 border-slate-300 text-[#0F2A5F] focus:ring-[#0F2A5F]"
                            />
                            <span className="text-sm text-slate-700 leading-relaxed">
                              I confirm that all information provided is accurate. I understand that false details may
                              result in rejection of my application.
                            </span>
                          </label>
                        </div>
                      </FormSection>

                      {errorMsg && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 flex items-start gap-3 text-red-800 text-sm">
                          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                          <span>{errorMsg}</span>
                        </div>
                      )}

                      <button
                        disabled={status === "loading"}
                        type="submit"
                        className="w-full bg-[#0F2A5F] text-white font-semibold py-3.5 hover:bg-[#0b1f47] disabled:opacity-60 transition-colors flex items-center justify-center gap-2 text-sm uppercase tracking-wide"
                      >
                        {status === "loading" ? (
                          "Submitting..."
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            Submit Application
                          </>
                        )}
                      </button>
                    </form>
                  </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
