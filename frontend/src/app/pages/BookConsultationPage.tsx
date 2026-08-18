import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { SEO } from "../components/SEO";
import { CorporateFormLayout } from "../components/corporate/CorporateFormLayout";
import {
  TextField,
  PhoneField,
  SelectField,
  formButtonClass,
} from "../components/corporate/OutlinedField";
import API_BASE from "../../config/api";

const SERVICES_LIST = [
  "Private Limited Company",
  "LLP Registration",
  "One Person Company",
  "Partnership Firm",
  "Sole Proprietorship",
  "Public Limited Company",
  "GST Registration",
  "GST Filing",
  "ITR Filing",
  "TDS Filing",
  "Trademark Registration",
  "Accounting & Bookkeeping",
  "Compliance Support",
  "Virtual CFO",
  "Other",
] as const;

export function BookConsultationPage() {
  const [searchParams] = useSearchParams();
  const requestedService = searchParams.get("service") || "";

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    service: requestedService || "",
    email: "",
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  // Create dynamic options list ensuring the requested service is included if it's not in the default list
  const displayServices = [...SERVICES_LIST];
  if (requestedService && !displayServices.includes(requestedService as any)) {
    displayServices.unshift(requestedService as any);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const digits = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, phone: digits }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    if (!formData.name || !formData.phone || !formData.service || !formData.email) {
      setStatus("error");
      setMessage("Please fill all required fields.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      setStatus("error");
      setMessage("Please enter a valid 10-digit Indian mobile number.");
      return;
    }

    try {
      const payload = {
        name: formData.name,
        phone: formData.phone,
        service: formData.service,
        email: formData.email,
        businessName: "",
        businessCategory: "",
        city: "",
        otherService: "",
        description: `Email: ${formData.email}`,
      };

      const response = await fetch(`${API_BASE}/api/consultations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setStatus("success");
        setMessage("Your free consultation request has been submitted.");

        const whatsappMessage = `*New Free Consultation*\n\n*Name:* ${formData.name}\n*Phone:* +91 ${formData.phone}\n*Email:* ${formData.email}\n*Service:* ${formData.service}`;
        window.open(
          `https://wa.me/919153832948?text=${encodeURIComponent(whatsappMessage)}`,
          "_blank",
        );

        setFormData({ name: "", phone: "", service: "", email: "" });
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
        title="Finovert - Free Consultation"
        description="Choose your business structure and get started with company registration, GST, ITR, and compliance with Finovert."
        path="/book-consultation"
      />

      <CorporateFormLayout title="Choose your business structure and get started with your company registration">
        {status === "success" && (
          <div className="mb-5 flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
            <CheckCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {status === "error" && (
          <div className="mb-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          <TextField
            id="name"
            label="Full Name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter Your Name"
          />

          <PhoneField
            id="phone"
            name="phone"
            required
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter your PhoneNo."
          />

          <SelectField
            id="service"
            label="Service"
            name="service"
            required
            value={formData.service}
            onChange={handleChange}
          >
            <option value="">-Select-</option>
            {displayServices.map((service) => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
          </SelectField>

          <TextField
            id="email"
            label="Enter Your Email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your Email"
          />

          <button type="submit" disabled={status === "loading"} className={formButtonClass}>
            {status === "loading" ? (
              <span className="inline-flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting...
              </span>
            ) : (
              "Claim your Free Consultation"
            )}
          </button>

          <p className="text-balance text-center text-xs leading-relaxed text-slate-500">
            By clicking, you consent to receiving updates about our services as outlined in our{" "}
            <Link to="/privacy" className="font-semibold text-[#0F2A5F] underline underline-offset-2">
              Privacy Statement
            </Link>
            .
          </p>
        </form>
      </CorporateFormLayout>
    </>
  );
}
