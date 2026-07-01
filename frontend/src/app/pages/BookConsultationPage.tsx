import { useState } from "react";
import { Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { SEO } from "../components/SEO";
import { CorporateFormLayout } from "../components/corporate/CorporateFormLayout";
import { FormSection } from "../components/corporate/FormSection";
import { OutlinedField, outlinedInputClass } from "../components/corporate/OutlinedField";
import API_BASE from "../../config/api";

const SERVICES_LIST = [
  "Company Registration",
  "GST Registration",
  "ITR Filing",
  "Trademark Registration",
  "Accounting & Bookkeeping",
  "Compliance Support",
  "Other",
] as const;

export function BookConsultationPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    businessName: "",
    businessCategory: "",
    city: "",
    service: "",
    otherService: "",
    description: "",
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    if (!formData.name || !formData.phone) {
      setStatus("error");
      setMessage("Name and phone are required.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/consultations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus("success");
        setMessage("Your inquiry has been submitted. Opening WhatsApp for follow-up...");

        const serviceText =
          formData.service === "Other" && formData.otherService ? formData.otherService : formData.service;
        const whatsappMessage = `*New Book Inquiry*\n\n*Name:* ${formData.name}\n*Phone:* ${formData.phone}\n*Business Name:* ${formData.businessName || "N/A"}\n*Category:* ${formData.businessCategory || "N/A"}\n*City:* ${formData.city || "N/A"}\n*Service Needed:* ${serviceText || "N/A"}\n*Description:* ${formData.description || "N/A"}`;

        const whatsappUrl = `https://wa.me/919153832948?text=${encodeURIComponent(whatsappMessage)}`;
        window.open(whatsappUrl, "_blank");

        setFormData({
          name: "",
          phone: "",
          businessName: "",
          businessCategory: "",
          city: "",
          service: "",
          otherService: "",
          description: "",
        });
      } else {
        const errorData = await response.json().catch(() => ({}));
        setStatus("error");
        setMessage(errorData.message || "Failed to submit request.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      setStatus("error");
      setMessage("Network error. Please try again later.");
    }
  };

  return (
    <>
      <SEO
        title="Finovert - Book Inquiry"
        description="Book a consultation with Finovert for finance, compliance, and business registration services in India."
        path="/book-consultation"
      />

      <CorporateFormLayout title="Book Inquiry" maxWidthClass="max-w-3xl">
        {status === "success" && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 flex items-start gap-3 text-green-800 text-sm">
            <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{message}</span>
          </div>
        )}

        {status === "error" && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 flex items-start gap-3 text-red-800 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <FormSection step={1} title="Contact Information" hideHeading>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
              <OutlinedField label="Full Name" required>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={outlinedInputClass}
                  required
                />
              </OutlinedField>
              <OutlinedField label="Phone Number" required>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={outlinedInputClass}
                  required
                />
              </OutlinedField>
            </div>
          </FormSection>

          <FormSection step={2} title="Business Details" hideHeading>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
              <OutlinedField label="Business Name">
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  className={outlinedInputClass}
                />
              </OutlinedField>
              <OutlinedField label="Business Category">
                <input
                  type="text"
                  name="businessCategory"
                  value={formData.businessCategory}
                  onChange={handleChange}
                  className={outlinedInputClass}
                />
              </OutlinedField>
              <div className="md:col-span-2">
                <OutlinedField label="City">
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={outlinedInputClass}
                  />
                </OutlinedField>
              </div>
            </div>
          </FormSection>

          <FormSection step={3} title="Service Request" hideHeading>
            <div className="space-y-5 md:space-y-6">
              <OutlinedField label="Service Needed">
                <select
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className={`${outlinedInputClass} cursor-pointer`}
                >
                  <option value="">Select a service</option>
                  {SERVICES_LIST.map((service) => (
                    <option key={service} value={service}>
                      {service}
                    </option>
                  ))}
                </select>
              </OutlinedField>

              {formData.service === "Other" && (
                <OutlinedField label="Specify Service">
                  <input
                    type="text"
                    name="otherService"
                    value={formData.otherService}
                    onChange={handleChange}
                    className={outlinedInputClass}
                  />
                </OutlinedField>
              )}

              <OutlinedField label="Brief Description" optional>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className={`${outlinedInputClass} resize-none min-h-[100px]`}
                />
              </OutlinedField>
            </div>
          </FormSection>

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full bg-[#0F2A5F] text-white font-semibold py-3.5 hover:bg-[#0b1f47] disabled:opacity-60 transition-colors flex items-center justify-center gap-2 text-sm uppercase tracking-wide"
          >
            {status === "loading" ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Book Inquiry
              </>
            )}
          </button>
        </form>
      </CorporateFormLayout>
    </>
  );
}
