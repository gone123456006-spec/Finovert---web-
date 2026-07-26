import { useState, useEffect, type ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  CheckCircle,
  XCircle,
  User,
  Briefcase,
  Calendar,
  Building,
  FileText,
  BadgeCheck,
  RefreshCw,
  Loader2,
} from "lucide-react";
import API_BASE from "../../config/api";
import { SEO } from "../components/SEO";
import {
  TextField,
  formButtonClass,
  formInputClass,
} from "../components/corporate/OutlinedField";

type VerificationRecord = {
  id: string;
  name: string;
  institute: string;
  joinDate: string;
  endDate: string;
  role: string;
  remarks: string;
};

export function VerificationPage() {
  const [searchId, setSearchId] = useState("");
  const [result, setResult] = useState<VerificationRecord | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [captcha, setCaptcha] = useState("");
  const [userCaptcha, setUserCaptcha] = useState("");
  const [error, setError] = useState("");

  const generateCaptcha = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let next = "";
    for (let i = 0; i < 6; i++) {
      next += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptcha(next);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) return;

    if (userCaptcha.toUpperCase() !== captcha) {
      setError("CAPTCHA verification failed. Please enter the characters exactly as shown.");
      generateCaptcha();
      setUserCaptcha("");
      return;
    }

    setError("");
    setIsSearching(true);
    setHasSearched(false);

    fetch(`${API_BASE}/api/verifications/${encodeURIComponent(searchId.trim())}`)
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Not found");
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
    <>
      <SEO
        title="Finovert - Verification Portal"
        description="Verify Intern ID or Employee ID authenticity with Finovert's official verification portal."
        path="/verify"
      />

      <div className="min-h-[calc(100dvh-8rem)] bg-[#eef3f9] pt-20 pb-12 sm:pt-24 sm:pb-16">
        <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 text-center"
          >
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0F2A5F] text-white shadow-sm">
              <BadgeCheck className="h-7 w-7" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[#0F2A5F] sm:text-3xl">
              Verification Portal
            </h1>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-600 sm:text-[15px]">
              Enter an Intern ID or Employee ID to verify authenticity and view official profile details.
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            onSubmit={handleSearch}
            className="rounded-[20px] border border-slate-200/80 bg-white p-6 shadow-[0_12px_40px_rgba(15,42,95,0.12)] sm:p-8 lg:p-10"
          >
            <h2 className="text-center text-[15px] font-bold leading-snug text-[#0F2A5F] sm:text-base">
              Verify official records with Finovert
            </h2>

            <div className="mt-5 space-y-4 sm:mt-6 sm:space-y-5">
              <TextField
                id="verify-id"
                label="Intern / Employee ID"
                required
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="e.g. FIN-2026-INT-001"
                autoComplete="off"
              />

              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-600">
                  Security Code<span className="text-red-500">*</span>
                </label>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
                  <div className="flex items-center gap-2">
                    <div className="relative flex h-[42px] min-w-[140px] flex-1 items-center justify-center overflow-hidden rounded-lg border border-slate-300 bg-slate-50 select-none sm:flex-none">
                      <div className="pointer-events-none absolute inset-0 opacity-15" aria-hidden>
                        <div className="absolute left-0 top-1/2 h-px w-full rotate-3 bg-[#0F2A5F]" />
                        <div className="absolute left-0 top-1/3 h-px w-full -rotate-2 bg-[#0F2A5F]" />
                      </div>
                      <span className="relative flex gap-0.5 text-lg font-bold italic tracking-widest text-[#0F2A5F]">
                        {captcha.split("").map((char, i) => (
                          <span
                            key={`${char}-${i}`}
                            style={{
                              transform: `translateY(${(i % 3) - 1}px) rotate(${(i % 2 === 0 ? -1 : 1) * 4}deg)`,
                            }}
                          >
                            {char}
                          </span>
                        ))}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={generateCaptcha}
                      className="inline-flex h-[42px] items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 text-xs font-semibold text-[#0F2A5F] transition hover:bg-slate-50"
                      aria-label="Get new code"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      Refresh
                    </button>
                  </div>
                  <input
                    type="text"
                    value={userCaptcha}
                    onChange={(e) => setUserCaptcha(e.target.value)}
                    placeholder="Type the code shown"
                    required
                    autoComplete="off"
                    className={`${formInputClass} sm:flex-1`}
                  />
                </div>
              </div>
            </div>

            <button type="submit" disabled={isSearching} className={`mt-5 sm:mt-6 ${formButtonClass}`}>
              {isSearching ? (
                <span className="inline-flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Verifying...
                </span>
              ) : (
                "Verify Official Record"
              )}
            </button>

            {error ? (
              <motion.p
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-center text-sm font-medium text-red-700"
              >
                {error}
              </motion.p>
            ) : null}
          </motion.form>

          <AnimatePresence mode="wait">
            {hasSearched && !isSearching ? (
              <motion.div
                key={result ? "found" : "not-found"}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="mt-6"
              >
                {result ? (
                  <div className="overflow-hidden rounded-[20px] border border-slate-200/80 bg-white shadow-[0_12px_40px_rgba(15,42,95,0.1)]">
                    <div className="flex items-center gap-3 border-b border-green-100 bg-green-50 px-6 py-4">
                      <CheckCircle className="h-6 w-6 shrink-0 text-green-600" />
                      <div>
                        <h3 className="text-base font-semibold text-green-800">Verified Authenticity</h3>
                        <p className="text-sm text-green-700">This ID is officially registered with Finovert.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 sm:gap-8 sm:p-8">
                      <Detail
                        icon={<User className="h-4 w-4" />}
                        label="Full Name"
                        value={result.name}
                      />
                      <Detail
                        icon={<Briefcase className="h-4 w-4" />}
                        label="Role / Position"
                        value={result.role}
                      />
                      <Detail
                        icon={<Building className="h-4 w-4" />}
                        label="Institute Name"
                        value={result.institute || "N/A"}
                      />
                      <Detail
                        icon={<Calendar className="h-4 w-4" />}
                        label="Tenure"
                        value={`${result.joinDate} – ${result.endDate || "Present"}`}
                      />
                      <div className="sm:col-span-2">
                        <p className="mb-1.5 flex items-center gap-2 text-xs font-medium text-slate-500">
                          <FileText className="h-4 w-4" /> Remarks / Performance
                        </p>
                        <p className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-800">
                          {result.remarks}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-[20px] border border-red-100 bg-white p-8 text-center shadow-[0_12px_40px_rgba(15,42,95,0.08)]">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
                      <XCircle className="h-8 w-8" />
                    </div>
                    <h3 className="mb-2 text-xl font-bold text-[#0F2A5F]">Record Not Found</h3>
                    <p className="text-sm leading-relaxed text-slate-600">
                      The ID <strong className="text-slate-800">&quot;{searchId}&quot;</strong> does not match any
                      active or past records in our system. Please check the ID and try again.
                    </p>
                  </div>
                )}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}

function Detail({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="mb-1.5 flex items-center gap-2 text-xs font-medium text-slate-500">
        {icon}
        {label}
      </p>
      <p className="text-[15px] font-medium text-[#0F2A5F] sm:text-base">{value}</p>
    </div>
  );
}
