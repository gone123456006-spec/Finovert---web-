import { useState } from "react";
import { Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { SEO } from "../components/SEO";
import { CorporateFormLayout } from "../components/corporate/CorporateFormLayout";
import { FormSection } from "../components/corporate/FormSection";
import { OutlinedField, outlinedInputClass } from "../components/corporate/OutlinedField";
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

      <CorporateFormLayout title="Confirmation Form" subtitle="For internship program — all fields marked * are required">
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
          <FormSection step={1} title="Your Details">
            <div className="space-y-5 md:space-y-6">
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

              <OutlinedField label="Gmail Address" required>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={outlinedInputClass}
                  required
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
                Submit Confirmation
              </>
            )}
          </button>
        </form>
      </CorporateFormLayout>
    </>
  );
}
