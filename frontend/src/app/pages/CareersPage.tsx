import { useState, useEffect } from "react";
import { CheckCircle, AlertCircle, UploadCloud, X } from "lucide-react";
import { SEO } from "../components/SEO";
import { CorporateFormLayout } from "../components/corporate/CorporateFormLayout";
import { FormSection } from "../components/corporate/FormSection";
import {
  TextField,
  PhoneField,
  SelectField,
  TextareaField,
  OutlinedField,
  formButtonClass,
} from "../components/corporate/OutlinedField";
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

      {status === "success" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="relative w-full max-w-md rounded-[20px] border border-slate-200 bg-white p-8 text-center shadow-[0_12px_40px_rgba(15,42,95,0.16)]">
            <button
              type="button"
              onClick={() => setStatus("idle")}
              className="absolute right-4 top-4 rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-green-200 bg-green-50 text-green-700">
              <CheckCircle className="h-7 w-7" />
            </div>
            <h2 className="mb-2 text-xl font-bold text-[#0F2A5F]">Application Submitted</h2>
            <p className="mb-6 text-sm leading-relaxed text-slate-600">
              Your application has been received. Our HR team will review it and contact you shortly.
            </p>
            <a
              href="/"
              className="inline-flex items-center justify-center rounded-lg bg-[#0F2A5F] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#163a7a]"
            >
              Return to Home
            </a>
          </div>
        </div>
      )}

      {status !== "success" && (
        <CorporateFormLayout
          title="Join Our Team"
          subtitle="Complete all sections below — fields marked * are required"
          maxWidthClass="max-w-3xl"
          largeTitle
        >
          <form onSubmit={handleSubmit}>
            <FormSection step={1} title="Personal Information" hideHeading>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
                <TextField
                  id="fullName"
                  label="Full Name"
                  required
                  fieldClassName="md:col-span-2"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Enter Your Name"
                />
                <PhoneField
                  id="phone"
                  required
                  value={formData.phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  placeholder="Enter your PhoneNo."
                />
                <TextField
                  id="email"
                  label="Email Address"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter your Email"
                />
              </div>
            </FormSection>

            <FormSection step={2} title="Educational Details" hideHeading>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
                <TextField
                  id="collegeName"
                  label="College / University"
                  required
                  fieldClassName="md:col-span-2"
                  value={formData.collegeName}
                  onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
                  placeholder="Enter college or university"
                />
                <SelectField
                  id="course"
                  label="Course"
                  required
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                >
                  <option value="">-Select-</option>
                  <option value="B.Tech">B.Tech</option>
                  <option value="M.Tech">M.Tech</option>
                  <option value="BBA">BBA</option>
                  <option value="MBA">MBA</option>
                  <option value="B.Sc">B.Sc</option>
                  <option value="Other">Other</option>
                </SelectField>
                <TextField
                  id="branch"
                  label="Branch"
                  required
                  value={formData.branch}
                  onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                  placeholder="Enter branch"
                />
                <SelectField
                  id="yearOfStudy"
                  label="Year of Study"
                  required
                  fieldClassName="md:col-span-2"
                  value={formData.yearOfStudy}
                  onChange={(e) => setFormData({ ...formData, yearOfStudy: e.target.value })}
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="Graduated">Graduated</option>
                </SelectField>
              </div>
            </FormSection>

            <FormSection step={3} title="Preferred Role" hideHeading>
              <SelectField
                id="preferredRole"
                label="Role"
                required
                value={formData.preferredRole}
                onChange={(e) => setFormData({ ...formData, preferredRole: e.target.value })}
              >
                <option value="">-Select-</option>
                {PREFERRED_ROLES.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </SelectField>
            </FormSection>

            <FormSection step={4} title="Eligibility" hideHeading>
              <TextareaField
                id="eligibilityReason"
                label="Why you are a good fit"
                optional
                rows={4}
                value={formData.eligibilityReason}
                onChange={(e) => setFormData({ ...formData, eligibilityReason: e.target.value })}
                placeholder="Tell us briefly why you're a good fit"
              />
            </FormSection>

            <FormSection step={5} title="Resume & Declaration" hideHeading>
              <div className="space-y-5">
                <OutlinedField label="Resume / CV" required htmlFor="resume">
                  <div className="relative flex min-h-[44px] items-center gap-3 rounded-lg border border-slate-300 bg-white px-3.5 py-2.5">
                    <UploadCloud className="h-5 w-5 shrink-0 text-slate-400" />
                    <p className="flex-1 text-sm text-slate-700">
                      {uploadingField === "resumeUrl"
                        ? "Uploading..."
                        : formData.resumeUrl
                          ? "File attached"
                          : "Click to upload PDF, DOC, or image"}
                    </p>
                    <input
                      id="resume"
                      type="file"
                      required={!formData.resumeUrl}
                      onChange={(e) => handleFileUpload(e, "resumeUrl")}
                      accept=".pdf,.doc,.docx,image/*"
                      className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    />
                  </div>
                </OutlinedField>

                <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <input
                    type="checkbox"
                    required
                    checked={formData.declared}
                    onChange={(e) => setFormData({ ...formData, declared: e.target.checked })}
                    className="mt-0.5 h-4 w-4 border-slate-300 text-[#0F2A5F] focus:ring-[#0F2A5F]"
                  />
                  <span className="text-sm leading-relaxed text-slate-700">
                    I confirm that all information provided is accurate. I understand that false details may
                    result in rejection of my application.
                  </span>
                </label>
              </div>
            </FormSection>

            {errorMsg && (
              <div className="mb-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button type="submit" disabled={status === "loading"} className={formButtonClass}>
              {status === "loading" ? "Submitting..." : "Submit Application"}
            </button>
          </form>
        </CorporateFormLayout>
      )}
    </>
  );
}
