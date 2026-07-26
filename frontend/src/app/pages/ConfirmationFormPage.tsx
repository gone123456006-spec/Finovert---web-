import { useState } from "react";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { SEO } from "../components/SEO";
import { CorporateFormLayout } from "../components/corporate/CorporateFormLayout";
import {
  TextField,
  PhoneField,
  formButtonClass,
} from "../components/corporate/OutlinedField";
import API_BASE from "../../config/api";

export function ConfirmationFormPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    if (!formData.name || !formData.phone || !formData.email) {
      setStatus("error");
      setMessage("All fields are required.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      setStatus("error");
      setMessage("Please enter a valid 10-digit Indian mobile number.");
      return;
    }

    if (!formData.email.toLowerCase().endsWith("@gmail.com")) {
      setStatus("error");
      setMessage("Please enter a valid Gmail address.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/confirmations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus("success");
        setMessage("Your confirmation has been submitted successfully.");
        setFormData({ name: "", phone: "", email: "" });
      } else {
        const errorData = await response.json().catch(() => ({}));
        setStatus("error");
        setMessage(errorData.message || "Failed to submit form.");
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
        title="Finovert - Confirmation Form"
        description="Submit your internship program confirmation to Finovert."
        path="/confirmation-form"
      />

      <CorporateFormLayout
        title="Confirmation Form"
        subtitle="For internship program — all fields marked * are required"
      >
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

          <TextField
            id="email"
            label="Gmail Address"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your Gmail"
          />

          <button type="submit" disabled={status === "loading"} className={formButtonClass}>
            {status === "loading" ? (
              <span className="inline-flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting...
              </span>
            ) : (
              "Submit Confirmation"
            )}
          </button>
        </form>
      </CorporateFormLayout>
    </>
  );
}
