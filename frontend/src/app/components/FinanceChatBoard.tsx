import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Paperclip,
  Mic,
  ArrowUp,
  Calendar,
  Receipt,
  TrendingUp,
  ShieldCheck,
  FileText,
  BarChart3,
  Lock,
  CreditCard,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";
import API_BASE from "../../config/api";
import {
  INCOME_SOURCE_OPTIONS,
  MSG,
  type TaxFlowStep,
  isNo,
  isValidEmail,
  isValidPan,
  isYes,
  normalizePan,
} from "../lib/taxFilingChat";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

// ── Razorpay window type declaration ────────────────────────────────────────
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

const RAJ_WELCOME_ID = "raj-welcome";
const RAJ_INTRO = "Hey! I'm Raj. How can I help you today?";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

const SUGGESTIONS: {
  label: string;
  prompt: string;
  icon: LucideIcon;
  locked: boolean;
}[] = [
    {
      label: "Tax Filing",
      prompt: "Help me with tax filing for my business and list documents I need.",
      icon: Receipt,
      locked: false,
    },
    {
      label: "Forecast cash flow",
      prompt: "Forecast my cash flow for the next 90 days based on typical startup burn.",
      icon: TrendingUp,
      locked: true,
    },
    {
      label: "Compliance checklist",
      prompt: "Create a compliance checklist for my private limited startup in India.",
      icon: ShieldCheck,
      locked: true,
    },
    {
      label: "Book CFO session",
      prompt: "I want to book a free consultation with a Finovert finance expert.",
      icon: Calendar,
      locked: false,
    },
    {
      label: "ITR summary draft",
      prompt: "Draft an ITR preparation checklist for my business this financial year.",
      icon: FileText,
      locked: true,
    },
    {
      label: "Generate MIS report",
      prompt: "Generate a monthly MIS report outline for investor updates.",
      icon: BarChart3,
      locked: true,
    },
  ];

const BLOGS = [
  {
    title: "How to optimize your Startup Burn Rate",
    keywords: ["burn rate", "burn", "startup", "optimize"],
    desc: "Discover actionable strategies to reduce fixed costs and manage cash flow effectively.",
    link: "https://finovert.com/blog/startup-burn-rate"
  },
  {
    title: "New GST Changes for 2026",
    keywords: ["gst", "tax changes", "2026", "tax rate", "taxes"],
    desc: "A comprehensive breakdown of the latest GST council amendments and input credit rules.",
    link: "https://finovert.com/blog/gst-changes-2026"
  },
  {
    title: "The Ultimate ITR Filing Guide",
    keywords: ["itr", "filing", "income tax", "tax return", "guide", "returns"],
    desc: "Learn how to optimize returns, maximize deductions, and stay fully compliant.",
    link: "https://finovert.com/blog/itr-filing-guide"
  }
];

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/** Injects the Razorpay checkout script exactly once. */
function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function FinanceChatBoard() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: RAJ_WELCOME_ID, role: "assistant", text: RAJ_INTRO },
  ]);
  const [flowStep, setFlowStep] = useState<TaxFlowStep>("intro_done");
  const [filingData, setFilingData] = useState({
    pan: "",
    email: "",
    incomeSources: [] as string[],
    filingId: null as string | null,
  });
  const [selectedIncome, setSelectedIncome] = useState<string[]>([]);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [consultationOpen, setConsultationOpen] = useState(false);
  const [lockedFeature, setLockedFeature] = useState<string | null>(null);
  const [leadForm, setLeadForm] = useState({
    name: "",
    contact: "",
    businessType: "Startup",
  });
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  // Stores a follow-up nudge message to show after answering an off-topic question during filing
  const pendingNudgeRef = useRef<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const speechRef = useRef<any>(null);
  // Always points to the latest sendMessage to avoid stale closure in voice callbacks
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sendMessageRef = useRef<(text: string) => void>(() => {});

  const focusChatInput = () => {
    requestAnimationFrame(() => {
      inputRef.current?.focus({ preventScroll: true });
    });
  };

  // ── Voice input (Web Speech API) ─────────────────────────────────────────
  const startVoiceInput = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser. Please use Chrome or Safari.");
      return;
    }
    // Tap again to stop
    if (speechRef.current) {
      speechRef.current.stop();
      return;
    }
    const recognition = new SpeechRecognition();
    speechRef.current = recognition;
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = true;

    setIsListening(true);
    setQuery(""); // clear any existing typed text
    let finalTranscript = "";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalTranscript += t;
        else interim = t;
      }
      // Show live text in input — mic button stays visible because isListening=true
      setQuery(finalTranscript + interim);
    };

    recognition.onend = () => {
      setIsListening(false);
      speechRef.current = null;
      if (finalTranscript.trim()) {
        const textToSend = finalTranscript.trim();
        setQuery("");
        // Directly add the message and process it — bypasses sendMessage guards
        // (sendMessage can silently block if isTyping is true at that moment)
        window.setTimeout(() => {
          setMessages((prev) => [...prev, { id: createId(), role: "user", text: textToSend }]);
          processChatMessage(textToSend);
        }, 150);
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onerror = (e: any) => {
      console.error("Speech recognition error:", e.error);
      setIsListening(false);
      speechRef.current = null;
      if (e.error === "not-allowed") {
        alert("Microphone access was denied. Please allow microphone access in your browser settings.");
      }
    };

    recognition.start();
  };

  useEffect(() => {
    const el = chatScrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, isTyping, flowStep, selectedIncome.length]);

  useEffect(() => {
    const dismissKeyboardOnOutsideTap = (event: PointerEvent) => {
      const input = inputRef.current;
      if (!input || document.activeElement !== input) return;
      const target = event.target as Node;
      if (input === target || input.contains(target)) return;
      const el = target as HTMLElement;
      if (el.closest("[data-chat-input-action]")) return;
      if (el.closest("[data-chat-messages]")) return;
      if (el.closest("[data-chat-income-picker]")) return;
      if (el.closest("[data-chat-payment]")) return;
      input.blur();
    };
    document.addEventListener("pointerdown", dismissKeyboardOnOutsideTap);
    return () => document.removeEventListener("pointerdown", dismissKeyboardOnOutsideTap);
  }, []);

  const openConsultationModal = (featureLabel?: string) => {
    setLockedFeature(featureLabel ?? null);
    setConsultationOpen(true);
  };

  const appendAssistantMessage = (text: string) => {
    setMessages((prev) => [...prev, { id: createId(), role: "assistant", text }]);
  };

  const replyAssistant = (text: string, delay = 600) => {
    setIsTyping(true);
    window.setTimeout(() => {
      setIsTyping(false);
      const msgId = createId();
      setMessages((prev) => [...prev, { id: msgId, role: "assistant", text: "" }]);

      let i = 0;
      const interval = setInterval(() => {
        setMessages((prev) =>
          prev.map((m) => m.id === msgId ? { ...m, text: text.slice(0, i + 1) } : m)
        );
        i += 2; // Stream 2 chars at a time for faster, smoother AI feel
        if (chatScrollRef.current) {
          chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
        }
        if (i >= text.length) {
          clearInterval(interval);
          setMessages((prev) =>
            prev.map((m) => m.id === msgId ? { ...m, text: text } : m)
          );
          // After the answer finishes streaming, show the filing nudge if pending
          const nudge = pendingNudgeRef.current;
          if (nudge) {
            pendingNudgeRef.current = null;
            window.setTimeout(() => {
              replyAssistant(nudge, 400);
            }, 600);
          }
        }
      }, 10);
      focusChatInput();
    }, delay);
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // 🤖  Smart AI Engine — Raj (Finance Intelligence Core)
  // Covers: GST, ITR, TDS, Payroll, Startup Law, Cash Flow, Investment,
  //         Working Capital, Bookkeeping, ROC, MIS, Valuation, MSME, and more.
  // ─────────────────────────────────────────────────────────────────────────────
  const processChatMessage = (trimmed: string) => {
    const lower = trimmed.toLowerCase();

    // ── Guard: active tax-filing flow ────────────────────────────────────────
    // If the user's input matches the expected filing step, process it.
    // Otherwise, answer their general question and remind them to continue filing.
    // Consultation / completed / declined steps always fall through to topic matching.
    const isFreeFlowStep = (
      flowStep === "awaiting_consultation_form" ||
      flowStep === "consultation_booked" ||
      flowStep === "completed" ||
      flowStep === "declined"
    );

    if (flowStep !== "intro_done" && !isFreeFlowStep) {
      if (flowStep === "awaiting_pan") {
        const pan = normalizePan(trimmed);
        if (isValidPan(pan)) {
          setFilingData((prev) => ({ ...prev, pan }));
          setFlowStep("awaiting_email");
          replyAssistant(MSG.ASK_EMAIL);
          return;
        }
        // Not a PAN — treat as a general question, answer it, then nudge back
        pendingNudgeRef.current = "To continue your ITR filing, please share your PAN number.";
        // Fall through to topic matching below
      } else if (flowStep === "awaiting_email") {
        const email = trimmed.trim();
        if (isValidEmail(email)) {
          setFilingData((prev) => ({ ...prev, email }));
          setFlowStep("awaiting_income");
          setSelectedIncome([]);
          replyAssistant(MSG.ASK_INCOME);
          return;
        }
        // Not an email — answer the question and nudge back
        pendingNudgeRef.current = "To continue your ITR filing, please share your email address.";
        // Fall through to topic matching below
      } else if (flowStep === "awaiting_income") {
        // Always block during income picker — user must use the checkboxes
        replyAssistant("Please select your income sources using the checkboxes below, then tap Continue.");
        return;
      } else if (flowStep === "awaiting_proceed") {
        if (isYes(trimmed)) { void submitFilingAndShowPayment(); return; }
        if (isNo(trimmed)) { setFlowStep("declined"); replyAssistant(MSG.DECLINED); return; }
        // Not yes/no — answer the question and nudge back
        pendingNudgeRef.current = "To continue your ITR filing, please reply Yes to proceed or No to cancel.";
        // Fall through to topic matching below
      } else if (flowStep === "awaiting_payment") {
        replyAssistant("Please use the Pay Now button below to complete your payment.");
        return;
      }
      // Only stay in this block (don't topic-match) if no nudge was set
      if (!pendingNudgeRef.current) return;
    }

    // ════════════════════════════════════════════════════════════════════════
    //   INTELLIGENT TOPIC MATCHING ENGINE
    // Priority-ordered — more specific topics go first
    // ════════════════════════════════════════════════════════════════════════

    // ── 1. Greetings ─────────────────────────────────────────────────────────
    if (/\b(hi|hello|hey|namaste|howdy|sup|good morning|good evening|good afternoon|hii|helo|hai)\b/.test(lower)) {
      const hour = new Date().getHours();
      const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
      replyAssistant(`${greeting}! I am Raj, your finance assistant.`);
      return;
    }

    // ── 2. Thanks / Bye ──────────────────────────────────────────────────────
    if (/\b(thank|thanks|thank you|bye|goodbye|ok|okay|great|awesome|perfect|got it|noted)\b/.test(lower)) {
      replyAssistant("You are welcome. Let me know if you have any other questions.");
      return;
    }

    // ── 3. ITR / Income Tax Return ───────────────────────────────────────────
    if (/\b(itr|income tax return|tax return|file tax|tax filing|tax filling|file itr|it return|tax form|form 16|form 26as|26as|start tax|do tax|want to file|file my tax|file my return|file my itr|want itr|need itr|start itr|begin itr|start filing|begin filing|file return|do itr|submit itr|submit tax|tax submit)\b/.test(lower)) {
      if (lower.includes("deadline") || lower.includes("due date") || lower.includes("last date")) {
        replyAssistant("ITR Filing Deadlines (FY 2024-25):\n\n• Individuals & HUF (no audit): 31 July 2025\n• Businesses requiring audit: 31 October 2025\n• Businesses with transfer pricing: 30 November 2025\n\nMissing the deadline attracts a late fee of ₹1,000–₹5,000 under Section 234F, plus interest on unpaid taxes.");
        return;
      }
      if (lower.includes("penalty") || lower.includes("late fee") || lower.includes("fine")) {
        replyAssistant("ITR Late Filing Penalties:\n\n• After 31 July: ₹1,000 fee if income ≤ ₹5 lakh\n• After 31 July: ₹5,000 fee if income > ₹5 lakh\n• Interest under Sec 234A: 1% per month on unpaid tax\n• Interest under Sec 234B/C: 1% for advance tax shortfall\n\nPlus you lose the ability to carry forward business losses.");
        return;
      }
      if (lower.includes("which form") || lower.includes("itr 1") || lower.includes("itr 2") || lower.includes("itr 3") || lower.includes("itr 4")) {
        replyAssistant("Which ITR Form Should You Use?\n\n• ITR-1 (Sahaj): Salaried individuals, one house property, income < ₹50 lakh\n• ITR-2: Capital gains, foreign income, multiple properties\n• ITR-3: Business/profession income (non-presumptive)\n• ITR-4 (Sugam): Presumptive income under Sec 44AD/44ADA/44AE\n• ITR-5: LLP, AOP, BOI\n• ITR-6: Companies (except Section 11 exemption)\n• ITR-7: Trusts, political parties, research institutions");
        return;
      }
      setFlowStep("awaiting_pan");
      replyAssistant("Please share your PAN number to start your ITR filing:");
      return;
    }

    // ── 4. GST ───────────────────────────────────────────────────────────────
    if (/\b(gst|goods and service|gstr|gstin|input tax credit|itc|gst registration|gst number|gst return|gst filing|gst rate|gst exemption|reverse charge|rcm)\b/.test(lower)) {
      if (lower.includes("registration") || lower.includes("register") || lower.includes("apply")) {
        replyAssistant("GST Registration requirements:\n\nMandatory if:\n• Annual turnover > ₹40 lakh (goods) or > ₹20 lakh (services)\n• Interstate supply (any turnover)\n• E-commerce operator\n• Voluntary registration allowed at any turnover\n\nDocuments needed:\n• PAN card\n• Aadhaar card\n• Business address proof\n• Bank account details\n• Photographs of proprietor/directors\n\nGSTIN is typically issued within 3–7 working days.");
        return;
      }
      if (lower.includes("return") || lower.includes("gstr") || lower.includes("gstr-1") || lower.includes("gstr-3b") || lower.includes("filing")) {
        replyAssistant("GST Returns Filing Calendar:\n\n• GSTR-1 (Outward supplies): 11th of next month\n• GSTR-3B (Summary return + payment): 20th of next month\n• GSTR-9 (Annual return): 31 December of next FY\n• GSTR-4 (Composition): Annual, by 30 April\n\nQuarterly Return Monthly Payment (QRMP) scheme is available for turnover < ₹5 crore — files quarterly, pays monthly.\n\nLate fee: ₹50/day (nil return: ₹20/day) + 18% interest on unpaid tax.");
        return;
      }
      if (lower.includes("input tax credit") || lower.includes("itc") || lower.includes("credit")) {
        replyAssistant("Input Tax Credit (ITC) Rules:\n\nYou can claim ITC if:\n• You are a registered GST taxpayer\n• Goods/services are used for business\n• Supplier has filed GSTR-1 (credit appears in GSTR-2B)\n• Invoice is valid & payment made within 180 days\n\nITC NOT available on:\n• Motor vehicles (personal use)\n• Food, beverages, beauty treatments\n• Membership of clubs/health\n• Travel (air/train/taxi) for personal use\n\nIt is recommended to reconcile GSTR-2B monthly to maximize ITC and avoid mismatches.");
        return;
      }
      if (lower.includes("rate") || lower.includes("slab") || lower.includes("percentage")) {
        replyAssistant("GST Rate Slabs:\n\n• 0% — Essential goods (milk, eggs, fresh vegetables, books)\n• 5% — Basic necessities (packaged food, life-saving drugs)\n• 12% — Processed food, textiles, computers\n• 18% — Most services, electronic goods, financial services\n• 28% — Luxury goods, automobiles, tobacco, aerated drinks\n\nServices generally fall under 18% unless specifically exempted.");
        return;
      }
      replyAssistant("GST (Goods & Services Tax) covers registration, GSTR filing, ITC reconciliation, GSTR-9 annual returns, and audit support.");
      return;
    }

    // ── 5. TDS / TCS ─────────────────────────────────────────────────────────
    if (/\b(tds|tax deducted at source|tcs|tax collected at source|form 16|form 16a|26q|24q|tds return|tds certificate|tds rate|tds deduction)\b/.test(lower)) {
      if (lower.includes("rate") || lower.includes("how much") || lower.includes("percentage")) {
        replyAssistant("Common TDS Rates (FY 2024-25):\n\n• Salary (Sec 192): As per slab\n• Interest from banks (Sec 194A): 10%\n• Professional fees (Sec 194J): 10% (2% for technical)\n• Rent >₹50K/month (Sec 194-IB): 5%\n• Contractor payments (Sec 194C): 1-2%\n• Commission (Sec 194H): 5%\n• Property sale >₹50L (Sec 194IA): 1%\n• Dividend (Sec 194): 10%\n\nIf no PAN is provided, TDS is deducted at 20% or the higher of the rate/20%.");
        return;
      }
      if (lower.includes("return") || lower.includes("filing") || lower.includes("deadline")) {
        replyAssistant("TDS Return Filing Deadlines:\n\n• Q1 (Apr–Jun): 31 July\n• Q2 (Jul–Sep): 31 October\n• Q3 (Oct–Dec): 31 January\n• Q4 (Jan–Mar): 31 May\n\nForms:\n• 24Q — TDS on Salary\n• 26Q — TDS on non-salary payments\n• 27Q — TDS on NRI payments\n• 27EQ — TCS returns\n\nPenalty for late filing: ₹200/day under Sec 234E.");
        return;
      }
      replyAssistant("TDS (Tax Deducted at Source) requires deducting tax before making qualifying payments, depositing it by the 7th of the next month, issuing Form 16/16A, and filing quarterly returns.");
      return;
    }

    // ── 6. Advance Tax ───────────────────────────────────────────────────────
    if (/\b(advance tax|self assessment|234b|234c|quarterly tax|pay tax advance)\b/.test(lower)) {
      replyAssistant("Advance Tax Installment Schedule:\n\n• 15 June: 15% of estimated annual tax\n• 15 September: 45% cumulative\n• 15 December: 75% cumulative\n• 15 March: 100% cumulative\n\nApplicable to anyone with an estimated annual tax liability exceeding ₹10,000 after TDS credit.\n\nInterest under Sec 234B: 1%/month if <90% tax paid by 31 March.\nInterest under Sec 234C: 1%/month for shortfall in installments.");
      return;
    }

    // ── 7. Capital Gains ─────────────────────────────────────────────────────
    if (/\b(capital gain|stcg|ltcg|short term|long term|equity|mutual fund|property sale|indexation|111a|112a|real estate tax)\b/.test(lower)) {
      replyAssistant("Capital Gains Tax (India) Slabs:\n\nShort-Term Capital Gains (STCG):\n• Listed equity/MF held < 12 months: 20% (Sec 111A)\n• Other assets held < 24–36 months: As per slab\n\nLong-Term Capital Gains (LTCG):\n• Listed equity/MF > ₹1.25 lakh gain: 12.5% (Sec 112A)\n• Property/Other assets: 12.5% without indexation or 20% with indexation (transitional rules apply)");
      return;
    }

    // ── 8. Salary & Perks / Form 16 ──────────────────────────────────────────
    if (/\b(salary|form 16|hra|house rent allowance|lta|leave travel|standard deduction|sec 10|perquisite|perk|ctc|in-hand|take home|salary slip|gratuity)\b/.test(lower)) {
      if (lower.includes("form 16") || lower.includes("form16")) {
        replyAssistant("Form 16 is issued by employers by 15 June each year. Part A shows TDS deposited, and Part B shows the salary breakdown and deductions. You use it to file your ITR.");
        return;
      }
      if (lower.includes("hra") || lower.includes("house rent")) {
        replyAssistant("HRA Exemption (Section 10(13A)) is the minimum of:\n1. Actual HRA received\n2. 50% of salary (metro: Delhi, Mumbai, Kolkata, Chennai) or 40% (others)\n3. Rent paid − 10% of salary\n\nLandlord PAN is mandatory if rent exceeds ₹1 lakh per year.");
        return;
      }
      replyAssistant("Salary Taxation:\n• Standard Deduction: ₹75,000 (New Regime) / ₹50,000 (Old Regime)\n\nNew Regime Slabs (FY 2024-25):\n• Up to ₹3 lakh: 0%\n• ₹3L to ₹7L: 5%\n• ₹7L to ₹10L: 10%\n• ₹10L to ₹12L: 15%\n• ₹12L to ₹15L: 20%\n• Above ₹15L: 30%\n\nSection 87A Rebate: Zero tax if total income is under ₹7 lakh in the New Regime.");
      return;
    }

    // ── 9. Section 80C / Deductions ──────────────────────────────────────────
    if (/\b(80c|80d|80e|80g|nps|ppf|elss|life insurance|health insurance|deduction|tax saving|section 80|80ccd|80gg|80tta|80ttb)\b/.test(lower)) {
      replyAssistant("Tax-Saving Deductions (Old Regime Only):\n\nSection 80C (Max ₹1.5 lakh):\n• ELSS Mutual Funds\n• PPF (7.1% p.a.)\n• NSC, SCSS, Tax-saving FD\n• LIC premium, EPF contribution, home loan principal\n\nSection 80D (Health Insurance):\n• Self + family: ₹25,000\n• Parents (senior citizen): ₹50,000 additional\n\nSection 80E: Education Loan interest (unlimited)\nSection 24B: Home loan interest (₹2 lakh)\nSection 80CCD(1B): NPS extra ₹50,000\n\nNote: These deductions are not available in the New Tax Regime.");
      return;
    }

    // ── 10. New vs Old Tax Regime ─────────────────────────────────────────────
    if (/\b(new regime|old regime|which regime|tax regime|regime comparison|87a|rebate|tax slab)\b/.test(lower)) {
      replyAssistant("New vs Old Tax Regime comparison:\n\nNew Regime:\n• Lower tax rates with a ₹75,000 standard deduction, but no deductions (80C, 80D, HRA).\n\nOld Regime:\n• Higher tax rates but allows deductions (80C, 80D, HRA, home loan interest).\n\nBreak-even rule: If total deductions exceed ₹3.75 lakh, the Old Regime usually saves more tax.");
      return;
    }

    // ── 11. Cash Flow / Burn Rate / Runway ───────────────────────────────────
    if (/\b(cash flow|burn rate|runway|working capital|liquidity|cash crunch|cash management|operating cash|free cash flow|fcf|dso|days sales|payable days)\b/.test(lower)) {
      if (lower.includes("runway") || lower.includes("how long")) {
        replyAssistant("Startup Runway is calculated as:\nRunway (months) = Cash in Bank ÷ Monthly Burn Rate\n\nIt is recommended to maintain at least 12–18 months of runway to ensure operational safety.");
        return;
      }
      if (lower.includes("forecast") || lower.includes("project") || lower.includes("predict")) {
        replyAssistant("Cash Flow Forecasting involves mapping inflows (receivables, revenue) and outflows (fixed costs, variable costs, one-time payments) over the next 90 days to identify any liquidity gaps.");
        return;
      }
      replyAssistant("Cash Flow Management key metrics:\n• Monthly Burn Rate: Total monthly cash outflow.\n• Net Burn: Cash outflow minus revenue.\n• Runway: Cash divided by Net Burn.");
      return;
    }

    // ── 12. GST / Compliance Checklist ───────────────────────────────────────
    if (/\b(compliance|checklist|roc|mca|annual return|aoc-4|mgt-7|board meeting|agm|secretarial|statutory|llp|pvt ltd|private limited|company law)\b/.test(lower)) {
      if (lower.includes("llp") || lower.includes("limited liability")) {
        replyAssistant("LLP Annual Compliance Checklist:\n\n• LLP Form 8 (Statement of Account): By 30 October\n• LLP Form 11 (Annual Return): By 30 May\n• Income Tax Return: By 31 July (non-audit) / 31 Oct (audit)\n• GST & TDS returns: As applicable\n\nPenalty for late filing of Form 8 & 11 is ₹100/day.");
        return;
      }
      replyAssistant("Pvt Ltd Company Annual Compliance:\n\nKey Deadlines:\n• AOC-4 (Financial Statements): 30 days from AGM\n• MGT-7 (Annual Return): 60 days from AGM\n• ADT-1 (Auditor Appointment): 15 days from AGM\n• DIR-3 KYC (Director KYC): By 30 September every year\n• AGM: Within 6 months from end of financial year\n• Board Meetings: Minimum 4 per year, every 120 days gap\n\nMonthly:\n• GST returns (GSTR-1, GSTR-3B)\n• TDS deposit by 7th\n• Advance tax installments");
      return;
    }

    // ── 13. Payroll & Salary Processing ──────────────────────────────────────
    if (/\b(payroll|salary processing|salary slip|pf|provident fund|esi|esic|professional tax|pt|employee|staff|hr|gratuity|bonus|pay stub)\b/.test(lower)) {
      if (lower.includes("pf") || lower.includes("provident fund") || lower.includes("epf")) {
        replyAssistant("EPF (Employees' Provident Fund) is mandatory for establishments with 20+ employees. Employee contribution is 12% of basic salary + DA, matched by the employer's contribution (allocated to EPF and EPS). Deposit due by the 15th of the next month.");
        return;
      }
      if (lower.includes("esi") || lower.includes("esic")) {
        replyAssistant("ESIC is mandatory for establishments with 10+ employees earning ≤ ₹21,000/month. Employee contribution is 0.75% of gross wages; employer contribution is 3.25%. Deposit due by the 15th of the next month.");
        return;
      }
      replyAssistant("Payroll Processing includes CTC structuring, monthly salary calculations, pay slip generation, TDS on salary, PF/ESI/PT management, and Form 16 issuance.");
      return;
    }

    // ── 14. Bookkeeping & Accounting ─────────────────────────────────────────
    if (/\b(bookkeeping|accounting|tally|accounts|ledger|journal|balance sheet|p&l|profit loss|trial balance|bank reconciliation|brs|accounts payable|accounts receivable|ar|ap)\b/.test(lower)) {
      replyAssistant("Bookkeeping and Accounting involves transaction recording, bank and credit card reconciliations, accounts payable and receivable management, and preparing standard financial statements (P&L, Balance Sheet, Cash Flow).");
      return;
    }

    // ── 15. MIS Reports / Investor Reporting ─────────────────────────────────
    if (/\b(mis|management information|investor report|board pack|monthly report|kpi|dashboard|variance|budget vs actual|p&l analysis)\b/.test(lower)) {
      replyAssistant("MIS reports typically include:\n• Financials: Revenue vs Budget, Gross Margin & EBITDA, Net Burn & Runway, Accounts Receivable aging.\n• Operations: CAC, LTV, Active Users, Churn rate.");
      return;
    }

    // ── 16. Virtual CFO / CFO Services ───────────────────────────────────────
    if (/\b(virtual cfo|vcfo|cfo|chief financial officer|finance head|fractional cfo|cfo service|cfo advisory|cfo session)\b/.test(lower)) {
      setFlowStep("awaiting_consultation_form");
      replyAssistant("Virtual CFO services provide senior finance expertise, including monthly financial reviews, cash flow planning, fundraising support, budgeting, and board/investor reporting.");
      return;
    }

    // ── 17. Startup Incorporation & Registration ──────────────────────────────
    if (/\b(incorporate|registration|startup india|pvt ltd register|company registration|llp registration|trademark|ip|patent|msme|udyam|dpiit)\b/.test(lower)) {
      if (lower.includes("trademark") || lower.includes("ip") || lower.includes("brand")) {
        replyAssistant("Trademark Registration protects brand names, logos, or taglines. Valid for 10 years and renewable. Government fee is ₹4,500 (individual/startup) or ₹9,000 (company).");
        return;
      }
      if (lower.includes("startup india") || lower.includes("dpiit")) {
        replyAssistant("Startup India Recognition (DPIIT) benefits include a 3-year income tax holiday, self-certification under labor/environmental laws, fast-track patent examination, and access to government tenders.");
        return;
      }
      replyAssistant("Business Incorporation structures in India:\n1. Private Limited Company: Required for equity funding, minimum 2 directors.\n2. LLP: Partners have limited liability, lower compliance requirements.\n3. One Person Company (OPC): Solo founder, limited liability.\n4. Sole Proprietorship: Simplest structure, no separate legal entity.");
      return;
    }

    // ── 18. Fundraising & Valuation ───────────────────────────────────────────
    if (/\b(fundraising|valuation|investor|pitch deck|term sheet|convertible note|safe note|equity|vc|venture capital|angel investor|seed round|series a|dilution|cap table|equity split|esop)\b/.test(lower)) {
      if (lower.includes("valuation") || lower.includes("value my") || lower.includes("company worth")) {
        replyAssistant("Startup Valuation Methods include:\n1. DCF (Discounted Cash Flow): Discounts projected future cash flows.\n2. Revenue Multiple: Valued as a multiple of revenue.\n3. Berkus Method: Valued based on pre-revenue milestones.\n4. Comparable Transactions: Comparison with similar funded startups.");
        return;
      }
      if (lower.includes("esop") || lower.includes("equity plan") || lower.includes("stock option")) {
        replyAssistant("ESOP (Employee Stock Option Plan) grants employees the option to purchase shares at a set exercise price after a vesting period (typically 4 years with a 1-year cliff).");
        return;
      }
      replyAssistant("Fundraising preparation requires preparing financial statements, projections, a cap table, unit economics (CAC/LTV), legal documents, and a 10-12 slide pitch deck.");
      return;
    }

    // ── 19. Loans & Working Capital ───────────────────────────────────────────
    if (/\b(loan|working capital|overdraft|credit line|term loan|business loan|bank loan|cc limit|cash credit|nbfc|mudra|cgtmse|sid bi|msme loan|collateral|emi|interest rate)\b/.test(lower)) {
      replyAssistant("Business Loan options in India include bank cash credit/overdraft limits, NBFC invoice discounting, secured term loans, Mudra loans, and collateral-free SIDBI CGTMSE loans.");
      return;
    }

    // ── 20. Investments & Wealth ──────────────────────────────────────────────
    if (/\b(invest|mutual fund|sip|stocks|equity fund|debt fund|fd|fixed deposit|ppf|nps|gold|real estate investment|reit|portfolio|wealth|savings|insurance)\b/.test(lower)) {
      replyAssistant("Investment Options for Business surplus cash include liquid mutual funds and arbitrage funds for short-term holds, and equity index funds, ELSS, or NPS for long-term holds.");
      return;
    }

    // ── 21. Profit & Loss / Financial Analysis ────────────────────────────────
    if (/\b(profit|loss|revenue|ebitda|gross margin|net margin|cogs|operating expense|opex|capex|depreciation|amortization|break even|breakeven|unit economics|ltv|cac)\b/.test(lower)) {
      if (lower.includes("ebitda") || lower.includes("margin")) {
        replyAssistant("EBITDA and Margin metrics:\n• Gross Margin = (Revenue - COGS) / Revenue * 100\n• EBITDA = Revenue - COGS - Operating Expenses\n• EBITDA Margin = EBITDA / Revenue * 100\n• Net Profit Margin = Net Profit / Revenue * 100");
        return;
      }
      if (lower.includes("break even") || lower.includes("breakeven")) {
        replyAssistant("Break-Even calculations:\n• Break-Even Point (units) = Fixed Costs / (Selling Price - Variable Cost per unit)\n• Break-Even (Revenue) = Fixed Costs / Gross Margin %");
        return;
      }
      replyAssistant("P&L Analysis covers Revenue, COGS, Gross Profit, Operating Expenses, EBITDA, Depreciation, EBIT, Interest, EBT, Tax, and Net Profit.");
      return;
    }

    // ── 22. Budget Planning ───────────────────────────────────────────────────
    if (/\b(budget|budgeting|annual plan|financial plan|opex budget|capex budget|headcount plan|hiring plan|zero based|rolling budget)\b/.test(lower)) {
      replyAssistant("Annual Budgeting Framework involves setting bottom-up department budgets, tracking fixed vs variable costs, creating scenario plans (base/optimistic/pessimistic), and performing monthly variance analysis.");
      return;
    }

    // ── 23. MSME / Udyam ─────────────────────────────────────────────────────
    if (/\b(msme|udyam|small business|medium enterprise|udyam registration|msme registration|priority sector|msme benefit)\b/.test(lower)) {
      replyAssistant("MSME (Udyam) Registration benefits include eligibility for collateral-free loans, lower interest rates, seller priority on the government e-marketplace, and protection against delayed payments.");
      return;
    }

    // ── 24. Import / Export / Foreign Trade ───────────────────────────────────
    if (/\b(import|export|iec|import export code|fema|foreign currency|forex|nri|remittance|customs duty|dgft|ecgc|letter of credit|lc)\b/.test(lower)) {
      replyAssistant("Import-Export requirements include obtaining an Import Export Code (IEC) from DGFT, complying with FEMA regulations for foreign currency, and registering for GST zero-rating on exports.");
      return;
    }

    // ── 25. Section 44AD / Presumptive Taxation ───────────────────────────────
    if (/\b(44ad|44ada|44ae|presumptive|presumptive tax|small business tax|professional tax presumptive)\b/.test(lower)) {
      replyAssistant("Presumptive Taxation Schemes:\n• Section 44AD (Business): For turnover < ₹3 crore; deemed profit is 6% (digital) or 8% of turnover.\n• Section 44ADA (Professionals): For receipts < ₹75 lakh; deemed profit is 50% of gross receipts.");
      return;
    }

    // ── 26. Depreciation ─────────────────────────────────────────────────────
    if (/\b(depreciation|amortization|written down value|wdv|slm|straight line|asset|fixed asset|block of assets)\b/.test(lower)) {
      replyAssistant("Depreciation methods in India include the Written Down Value (WDV) method under the IT Act (e.g., computers at 40%, machinery at 15%) and the useful life-based method under the Companies Act.");
      return;
    }

    // ── 27. Audit ─────────────────────────────────────────────────────────────
    if (/\b(audit|statutory audit|tax audit|internal audit|3cd|3cb|44ab|auditor|ca audit|limited review)\b/.test(lower)) {
      replyAssistant("Audits in India include Statutory Audit (mandatory for all companies), Tax Audit under Sec 44AB (mandatory if business turnover exceeds ₹10 crore digital or ₹1 crore cash), and GST Audit.");
      return;
    }

    // ── 28. ROC / Company Filings ─────────────────────────────────────────────
    if (/\b(roc|mca|form inc|dir|mgt|aoc|spice|cin|din|dsc|digital signature|director|shareholder|share certificate|agm|egm|board meeting|minutes)\b/.test(lower)) {
      replyAssistant("ROC/MCA filings include INC-20A (Commencement of Business), auditor appointment (ADT-1), annual financial filing (AOC-4), annual return (MGT-7/7A), and director KYC (DIR-3 KYC).");
      return;
    }

    // ── 29. Dividend & Distribution ───────────────────────────────────────────
    if (/\b(dividend|distribution|shareholder payment|interim dividend|final dividend|ddt|buyback)\b/.test(lower)) {
      replyAssistant("Dividend Taxation: Dividend Distribution Tax (DDT) is abolished. Dividends are taxed in the hands of the shareholder, and TDS is deducted at 10% under Section 194.");
      return;
    }

    // ── 30. E-filing / Income Tax Portal ─────────────────────────────────────
    if (/\b(e filing|efiling|incometax|income tax portal|tax portal|26as|ais|tis|annual information|traces|form 26as|verify return)\b/.test(lower)) {
      replyAssistant("The Income Tax e-Filing Portal includes access to the Annual Information Statement (AIS), Form 26AS (TDS summary), and return e-verification options (Aadhaar OTP, net banking).");
      return;
    }

    // ── 31. Tax Notice / Scrutiny ─────────────────────────────────────────────
    if (/\b(tax notice|notice|scrutiny|143|148|tax demand|demand notice|assessment|faceless|intimation|defective return|high value)\b/.test(lower)) {
      replyAssistant("Income Tax Notices include Sec 143(1) (intimation), Sec 143(2) (scrutiny), Sec 139(9) (defective return), and Sec 148 (reassessment). Always check the section and the deadline for filing a response.");
      return;
    }

    // ── 32. Personal Finance ──────────────────────────────────────────────────
    if (/\b(personal finance|savings|emergency fund|retirement|financial planning|life insurance|term plan|health insurance|mediclaim|ulip|endowment)\b/.test(lower)) {
      replyAssistant("Personal Finance fundamentals include building a 6-month emergency fund, securing pure term life insurance, getting health insurance, and utilizing tax-saving instruments (PPF, ELSS, NPS).");
      return;
    }

    // ── 33. Crypto / Digital Assets ───────────────────────────────────────────
    if (/\b(crypto|cryptocurrency|bitcoin|ethereum|nft|virtual digital asset|vda|30% tax crypto|tds crypto|schedule vda)\b/.test(lower)) {
      replyAssistant("Cryptocurrency Taxation in India: Flat 30% tax on gains from Virtual Digital Assets (VDA) with no deductions. Crypto losses cannot be offset or carried forward. TDS is 1% on transactions exceeding ₹10,000.");
      return;
    }

    // ── 34. Foreign Income / NRI ──────────────────────────────────────────────
    if (/\b(nri|non resident|foreign income|dtaa|double taxation|foreign tax credit|form 67|rnor|resident|non-resident|india return nri)\b/.test(lower)) {
      replyAssistant("NRI Taxation: NRIs are taxed only on India-sourced income. Double Tax Avoidance Agreement (DTAA) provisions can be claimed using Form 10F and a Tax Residency Certificate.");
      return;
    }

    // ── 35. App Download ──────────────────────────────────────────────────────
    if (/\b(app|download|play store|android|mobile|phone app|google play)\b/.test(lower)) {
      replyAssistant("The Finovert Mobile App is available on Android: https://play.google.com/store/apps/details?id=com.brandovert.finovert");
      return;
    }

    // ── 36. Services Overview ─────────────────────────────────────────────────
    if (/\b(service|what do you do|offer|what can you do|help me with|what is finovert|features|capabilities)\b/.test(lower)) {
      replyAssistant("Finovert services cover ITR and GST filing, Virtual CFO advisory, company incorporation, trademark registration, payroll processing, and bookkeeping.");
      return;
    }

    // ── 37. About Finovert ────────────────────────────────────────────────────
    if (/\b(about|who are you|who is raj|what is raj|finovert|tell me about|who made|company info|contact|email|phone|support)\b/.test(lower)) {
      if (lower.includes("contact") || lower.includes("email") || lower.includes("phone") || lower.includes("whatsapp")) {
        replyAssistant("Contact Finovert support:\nWhatsApp: +91 62054 25499\nEmail: support@finovert.com\nWebsite: https://finovert.com");
        return;
      }
      replyAssistant("Finovert is a financial advisory platform for startups and SMEs. I am Raj, an AI Finance Assistant trained on Indian tax laws and compliance.");
      return;
    }

    // ── 38. Blogs & News ─────────────────────────────────────────────────────
    if (/\b(blog|article|news|read|guide|resource|learn|latest|update|finance guide)\b/.test(lower)) {
      const matchedBlog = BLOGS.find(b => b.keywords.some(kw => lower.includes(kw)));
      if (matchedBlog) {
        replyAssistant(`Match found:\n\n${matchedBlog.title}\n${matchedBlog.desc}\nLink: ${matchedBlog.link}`);
        return;
      }
      const list = BLOGS.map((b, i) => `${i + 1}. ${b.title}\n   ${b.desc}\n   Link: ${b.link}`).join("\n\n");
      replyAssistant(`Our Latest Finance Guides:\n\n${list}\n\nView all articles: https://finovert.com/blog`);
      return;
    }

    // ── 39. Book Consultation / CFO Call ─────────────────────────────────────
    if (/\b(book|schedule|appointment|consultation|meeting|call|session|talk to|speak to|expert|ca|chartered accountant)\b/.test(lower)) {
      setFlowStep("awaiting_consultation_form");
      replyAssistant("To book a free consultation, please fill out the form below. Our team will reach out to confirm your slot.");
      return;
    }

    // ── 40. Tax Saving Tips ───────────────────────────────────────────────────
    if (/\b(save tax|tax saving tip|reduce tax|tax planning|tax efficient|minimize tax|tax hack|tax optimization)\b/.test(lower)) {
      replyAssistant("Tax-saving strategies include using 80C deductions, NPS, health insurance (80D), home loan interest (24B) for individuals, and claiming business expenses, depreciation, or presumptive taxation for businesses.");
      return;
    }

    // ── 41. Company Registration for Startups ────────────────────────────────
    if (/\b(startup|new business|business idea|begin|start a company|entrepreneur|found a company|launch|solopreneur|first time founder)\b/.test(lower)) {
      replyAssistant("Starting a business in India requires choosing a legal structure (Pvt Ltd, LLP, OPC), obtaining PAN/TAN, opening a business bank account, and registering for GST and MSME if applicable.");
      return;
    }

    // ── 42. Internship / Careers at Finovert ─────────────────────────────────
    if (/\b(internship|intern|career|job|hiring|join finovert|work at|employment|opening|ca articleship|article)\b/.test(lower)) {
      replyAssistant("For careers and internships, visit https://finovert.com/careers or email careers@finovert.com.");
      return;
    }

    // ── 43. Expense Tracking ──────────────────────────────────────────────────
    if (/\b(expense|expense tracking|spend|invoice|receipt|reimbursement|petty cash|vendor payment|accounts payable|bills)\b/.test(lower)) {
      replyAssistant("Expense management best practices include tracking payroll, rent, software subscriptions, and travel. Keep GST invoices for at least 8 years for tax audit compliance.");
      return;
    }

    // ── 44. Pricing / Cost of Services ───────────────────────────────────────
    if (/\b(price|pricing|cost|how much|charges|fee|package|plan|affordable|cheap|rate card)\b/.test(lower)) {
      replyAssistant("Finovert pricing starting rates:\n• ITR-1: ₹499\n• ITR-3/4: ₹999–₹2,999\n• GST Registration: ₹1,499\n• GST Return Filing: From ₹499/month\n• Startup Compliance: ₹4,999/month\n• Virtual CFO: From ₹15,000/month");
      return;
    }

    // ── Fallback: Smart catch-all ─────────────────────────────────────────────
    replyAssistant("I am Raj, your finance assistant.");
  };

  const submitIncomeSelection = () => {
    if (selectedIncome.length === 0) return;
    const label = selectedIncome.join(", ");
    setMessages((prev) => [...prev, { id: createId(), role: "user", text: label }]);
    setFilingData((prev) => ({ ...prev, incomeSources: selectedIncome }));
    setFlowStep("awaiting_proceed");
    replyAssistant(MSG.PRICING);
    focusChatInput();
  };

  const submitFilingAndShowPayment = async () => {
    setIsTyping(true);
    try {
      const response = await fetch(`${API_BASE}/api/tax-filings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pan: filingData.pan,
          email: filingData.email,
          incomeSources: filingData.incomeSources,
          proceedConfirmed: true,
        }),
      });
      if (!response.ok) throw new Error("Could not save your filing details.");
      const created = await response.json();
      setFilingData((prev) => ({ ...prev, filingId: created._id }));
      setFlowStep("awaiting_payment");
    } catch {
      appendAssistantMessage("Something went wrong while saving your details. Please try again in a moment.");
    } finally {
      setIsTyping(false);
      focusChatInput();
    }
  };

  // ── Real Razorpay checkout ───────────────────────────────────────────────────
  const openRazorpayCheckout = async () => {
    if (!filingData.filingId || paymentLoading) return;
    setPaymentLoading(true);

    try {
      // 1. Load Razorpay script
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        alert("Could not load payment gateway. Please check your internet connection and try again.");
        return;
      }

      // 2. Create order on backend → get orderId, amount, key
      const orderRes = await fetch(`${API_BASE}/api/payments/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filingId: filingData.filingId }),
      });

      if (!orderRes.ok) {
        const err = await orderRes.json().catch(() => ({}));
        throw new Error((err as { message?: string }).message || "Failed to create payment order.");
      }

      const order = await orderRes.json() as {
        orderId: string;
        amount: number;
        currency: string;
        keyId: string;
        prefill: { email: string; name: string };
      };

      // 3. Open Razorpay checkout modal
      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,          // paise
        currency: order.currency,
        order_id: order.orderId,
        name: "Finovert",
        description: "Income Tax Return (ITR) Filing",
        image: "https://www.finovert.com/app-logo.png",
        prefill: {
          email: order.prefill.email,
          name: "Valued Customer",
        },
        theme: { color: "#0F2A5F" },

        // ── Success handler ──────────────────────────────────────────────────
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          try {
            // 4. Verify signature on backend
            const verifyRes = await fetch(`${API_BASE}/api/payments/verify`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                filingId: filingData.filingId,
              }),
            });

            if (!verifyRes.ok) {
              throw new Error("Payment verification failed. Please contact support.");
            }

            // 5. Mark flow as complete in chat
            setFlowStep("completed");
            appendAssistantMessage(MSG.PAYMENT_DONE);
          } catch (err) {
            appendAssistantMessage(
              err instanceof Error
                ? err.message
                : "Payment received but verification failed. Please contact support@finovert.com."
            );
          } finally {
            setPaymentLoading(false);
            focusChatInput();
          }
        },

        // ── Modal closed / dismissed ─────────────────────────────────────────
        modal: {
          ondismiss: () => {
            setPaymentLoading(false);
            focusChatInput();
          },
        },
      });

      rzp.open();
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Payment could not be initiated.";
      appendAssistantMessage(`⚠️ ${msg}`);
      setPaymentLoading(false);
      focusChatInput();
    }
  };

  const toggleIncome = (source: string) => {
    setSelectedIncome((prev) =>
      prev.includes(source) ? prev.filter((s) => s !== source) : [...prev, source],
    );
  };


  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLeadSubmitting(true);
    try {
      const response = await fetch(`${API_BASE}/api/consultations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leadForm),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error((data as { message?: string }).message || "Failed to submit consultation request.");
      setLeadForm({ name: "", contact: "", businessType: "Startup" });
      setConsultationOpen(false);
      setLockedFeature(null);
      appendAssistantMessage("Your free consultation is booked. Our team will contact you shortly.");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Could not submit right now. Please try again.");
    } finally {
      setLeadSubmitting(false);
    }
  };

  const handleInlineLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadForm.name.trim() || !leadForm.contact.trim()) return;
    setLeadSubmitting(true);

    // Always show success to the user immediately — API failure is silent
    setLeadForm({ name: "", contact: "", businessType: "Startup" });
    setFlowStep("consultation_booked");
    replyAssistant("Your free consultation is booked. Our team will review your details and contact you shortly.");
    setLeadSubmitting(false);
    focusChatInput();

    // Fire API in background (non-blocking)
    fetch(`${API_BASE}/api/consultations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(leadForm),
    }).catch((err) => console.warn("Consultation API error:", err));
  };

  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isTyping || paymentLoading) return;
    if (flowStep === "awaiting_income") {
      replyAssistant("Please use the checkboxes below and tap Continue.");
      return;
    }
    setMessages((prev) => [...prev, { id: createId(), role: "user", text: trimmed }]);
    setQuery("");
    focusChatInput();
    processChatMessage(trimmed);
  };
  // Keep the ref in sync so voice callback always calls the latest sendMessage
  sendMessageRef.current = sendMessage;

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(query);
  };

  const keepKeyboardOnPress = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
  };

  const handleSuggestionClick = (item: (typeof SUGGESTIONS)[number]) => {
    if (item.locked) { openConsultationModal(item.label); return; }
    if (item.label === "Tax Filing" && flowStep === "intro_done") {
      setMessages((prev) => [...prev, { id: createId(), role: "user", text: "I want to file my tax return" }]);
      setFlowStep("awaiting_pan");
      replyAssistant("Please share your PAN number to start your ITR filing:");
      return;
    }
    sendMessage(item.prompt);
  };

  const userHasMessaged = messages.some((m) => m.role === "user");
  const hasChat = userHasMessaged || isTyping;

  const renderMessageText = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.split(urlRegex).map((part, i) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#007AFF] hover:underline font-medium"
          >
            {part}
          </a>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  // ── Cycling heading phrases ──────────────────────────────────────────────────
  const PHRASES = [
    { label: "Ask", color: "#1d1d1f" },  // near-black
    { label: "Ask anything", color: "#7C3AED" },  // violet
    { label: "About finance", color: "#0EA5E9" },  // sky blue
    { label: "Tax filing", color: "#10B981" },  // emerald
    { label: "About this website", color: "#F59E0B" },  // amber
    { label: "App", color: "#EF4444" },  // red
  ] as const;
  const FINOVERT_COLORS = ["#1428A0", "#1C31AC", "#243AB8", "#2C44C4", "#344ED0", "#3C57DC", "#4461E8", "#4F6EF7"];
  const HOLD_MS = 1400;   // how long each phrase stays visible
  const TRANS_MS = 350;   // fade duration in ms (must match transition.duration * 1000)
  const FINOVERT_STAGGER = 80; // ms per letter
  const FINOVERT_IN_MS = "F".length + 8 * FINOVERT_STAGGER + 350; // time for all letters to arrive
  const FINOVERT_HOLD_MS = 1800; // hold "Ask Finovert" before looping

  const [phraseIdx, setPhraseIdx] = useState(0);
  const [visible, setVisible] = useState(true);       // controls fade-in/out of phrase
  const [showFinovert, setShowFinovert] = useState(false); // controls letter stagger

  useEffect(() => {
    const timers: number[] = [];
    let currentIdx = 0;

    const next = () => {
      // 1. Fade out current phrase
      setVisible(false);
      timers.push(window.setTimeout(() => {
        currentIdx = (currentIdx + 1) % (PHRASES.length + 1); // +1 for Finovert slide

        if (currentIdx === PHRASES.length) {
          // Show "Ask Finovert"
          setShowFinovert(false);
          setPhraseIdx(-1);           // -1 = signal to show "Ask Finovert" layout
          setVisible(true);
          // Trigger letter stagger after short delay
          timers.push(window.setTimeout(() => setShowFinovert(true), 100));
          // Hold then loop from beginning
          timers.push(window.setTimeout(() => {
            setVisible(false);
            timers.push(window.setTimeout(() => {
              currentIdx = 0;
              setShowFinovert(false);
              setPhraseIdx(0);
              setVisible(true);
              scheduleNext();
            }, TRANS_MS));
          }, FINOVERT_IN_MS + FINOVERT_HOLD_MS));
        } else {
          setPhraseIdx(currentIdx);
          setVisible(true);
          scheduleNext();
        }
      }, TRANS_MS));
    };

    const scheduleNext = () => {
      timers.push(window.setTimeout(next, HOLD_MS));
    };

    // Kick off
    setVisible(true);
    scheduleNext();

    return () => timers.forEach(window.clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <section className="relative z-10 pb-6 sm:pb-12 bg-gradient-to-b from-[#f4f8fc] via-white to-white pt-16 sm:pt-24">
        <div
          className="max-w-4xl lg:max-w-5xl mx-auto px-3 sm:px-6 lg:px-8"
        >

          {/* ── Big Heading ── */}
          {!hasChat && (
            <div className="text-center mb-6 sm:mb-10">
              <h1 className="text-[2rem] sm:text-[3.5rem] lg:text-[4rem] font-bold tracking-tight leading-[1.1] mb-3 sm:mb-4 min-h-[1.2em] flex justify-center items-baseline gap-x-2">

                {phraseIdx === -1 ? (
                  /* ── Ask Finovert layout ── */
                  <>
                    <motion.span
                      className="text-[#1d1d1f]"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: visible ? 1 : 0 }}
                      transition={{ duration: TRANS_MS / 1000 }}
                    >
                      Ask
                    </motion.span>
                    <AnimatePresence>
                      {showFinovert && (
                        <span className="inline-flex items-baseline select-none">
                          {["F", "i", "n", "o", "v", "e", "r", "t"].map((char, i) => (
                            <motion.span
                              key={i}
                              className="inline-block"
                              style={{ color: FINOVERT_COLORS[i] }}
                              initial={{ opacity: 0, y: 14 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.32, ease: "easeOut", delay: i * (FINOVERT_STAGGER / 1000) }}
                            >
                              {char}
                            </motion.span>
                          ))}
                        </span>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  /* ── Regular phrase ── */
                  <motion.span
                    key={phraseIdx}
                    style={{ color: PHRASES[phraseIdx].color }}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : -8 }}
                    transition={{ duration: TRANS_MS / 1000, ease: "easeInOut" }}
                  >
                    {PHRASES[phraseIdx].label}
                  </motion.span>
                )}
              </h1>
              <p className="hidden sm:block text-[#515154] text-base sm:text-[1.15rem] font-medium max-w-xl mx-auto leading-relaxed">
                Tax filing, compliance, cash flow — your AI finance expert is ready.
              </p>
            </div>
          )}

          <div className="rounded-xl sm:rounded-[1.75rem] bg-white overflow-hidden flex flex-col shadow-[0_16px_56px_rgba(15,42,95,0.18)] transition-shadow">
            <div
              ref={chatScrollRef}
              data-chat-messages
              className="min-h-[220px] max-h-[300px] sm:min-h-[260px] sm:max-h-[400px] overflow-y-auto overscroll-contain scrollbar-hide px-4 sm:px-6 pt-4 sm:pt-6 pb-3 space-y-4 sm:space-y-5 bg-white cursor-default touch-pan-y"
            >
              {messages.map((msg) =>
                msg.role === "user" ? (
                  <div key={msg.id} className="flex justify-end">
                    <div className="max-w-[85%] sm:max-w-[70%] rounded-[20px] rounded-br-[4px] bg-[#007AFF] text-white px-3.5 py-2.5 sm:px-4 sm:py-3 text-[15px] sm:text-[16px] leading-[1.35] shadow-sm">
                      {msg.text}
                    </div>
                  </div>
                ) : (
                  <div key={msg.id} className="flex justify-start">
                    <div className="max-w-[85%] sm:max-w-[70%] rounded-[20px] rounded-bl-[4px] bg-[#E9E9EB] text-black px-3.5 py-2.5 sm:px-4 sm:py-3 text-[15px] sm:text-[16px] leading-[1.35] whitespace-pre-line">
                      {renderMessageText(msg.text)}
                    </div>
                  </div>
                ),
              )}

              {/* Income source picker */}
              {flowStep === "awaiting_income" && (
                <div className="flex justify-start" data-chat-income-picker>
                  <div className="w-full max-w-full sm:max-w-[92%] rounded-2xl border border-gray-200 bg-white p-3 sm:p-4 shadow-sm space-y-2">
                    <p className="text-xs sm:text-sm font-medium text-gray-700">Select all that apply:</p>
                    <div className="grid grid-cols-1 gap-2 max-h-[160px] overflow-y-auto scrollbar-hide">
                      {INCOME_SOURCE_OPTIONS.map((source) => (
                        <label
                          key={source}
                          className="flex items-start gap-2.5 rounded-lg border border-gray-200 px-3 py-2 cursor-pointer hover:bg-gray-50 has-[:checked]:border-[#1428A0] has-[:checked]:bg-[#1428A0]/5"
                        >
                          <input
                            type="checkbox"
                            checked={selectedIncome.includes(source)}
                            onChange={() => toggleIncome(source)}
                            className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#1428A0] focus:ring-[#1428A0]"
                          />
                          <span className="text-xs sm:text-sm text-gray-800 leading-snug">{source}</span>
                        </label>
                      ))}
                    </div>
                    <button
                      type="button"
                      disabled={selectedIncome.length === 0 || isTyping}
                      onClick={submitIncomeSelection}
                      className="w-full rounded-xl bg-[#0F2A5F] text-white text-sm font-semibold py-2.5 hover:bg-[#0b1f47] disabled:opacity-50 transition-colors"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {/* ── Razorpay Payment Card ─────────────────────────────────── */}
              {flowStep === "awaiting_payment" && filingData.filingId && (
                <div className="flex justify-start" data-chat-payment>
                  <div className="w-full max-w-[92%] sm:max-w-[78%] rounded-2xl rounded-bl-md bg-white border border-gray-200/90 px-4 py-4 sm:px-5 sm:py-5 shadow-sm space-y-4">

                    {/* Header */}
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0F2A5F]/10">
                        <CreditCard className="w-4 h-4 text-[#0F2A5F]" strokeWidth={2} />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-semibold text-gray-900 leading-tight">
                          Secure Payment
                        </p>
                        <p className="text-[10px] sm:text-xs text-gray-500">Powered by Razorpay</p>
                      </div>
                    </div>

                    {/* Order summary */}
                    <div className="rounded-xl bg-gray-50 border border-gray-100 px-4 py-3 space-y-1.5">
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>Assisted Salary Plan</span>
                        <span>₹649</span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>GST (18%)</span>
                        <span>₹117</span>
                      </div>
                      <div className="h-px bg-gray-200 my-1" />
                      <div className="flex justify-between text-sm font-bold text-gray-900">
                        <span>Total Payable</span>
                        <span>₹766</span>
                      </div>
                    </div>

                    {/* Pay button */}
                    <button
                      type="button"
                      data-chat-payment
                      disabled={paymentLoading}
                      onMouseDown={keepKeyboardOnPress}
                      onTouchStart={keepKeyboardOnPress}
                      onClick={() => void openRazorpayCheckout()}
                      className="group w-full inline-flex items-center justify-center gap-2.5 rounded-xl bg-[#0F2A5F] text-white font-semibold text-sm sm:text-base px-5 py-3.5 shadow-lg hover:bg-[#0b1f47] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      {paymentLoading ? (
                        <>
                          <svg className="animate-spin h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                          </svg>
                          Opening payment…
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4 shrink-0 group-hover:scale-110 transition-transform" />
                          Pay ₹766 with Razorpay
                        </>
                      )}
                    </button>

                    {/* Trust badges */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="inline-flex items-center gap-1 text-[10px] text-gray-500 bg-gray-100 rounded-full px-2 py-0.5">
                        <svg className="w-3 h-3 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                        256-bit SSL
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] text-gray-500 bg-gray-100 rounded-full px-2 py-0.5">
                        <CheckCircle2 className="w-3 h-3 text-green-600" />
                        UPI • Cards • Net Banking
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] text-gray-500 bg-gray-100 rounded-full px-2 py-0.5">
                        <CheckCircle2 className="w-3 h-3 text-green-600" />
                        PCI DSS Compliant
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Consultation Form inside chat */}
              {flowStep === "awaiting_consultation_form" && (
                <div className="flex justify-start">
                  <div className="w-full max-w-[92%] sm:max-w-[78%] rounded-[20px] rounded-bl-[4px] bg-white border border-gray-200/90 p-4 sm:p-5 shadow-sm space-y-3">
                    <p className="text-[13px] sm:text-[15px] font-semibold text-gray-800">Book Free CFO Consultation</p>
                    <form onSubmit={handleInlineLeadSubmit} className="grid grid-cols-1 gap-2.5">
                      <input
                        required
                        type="text"
                        placeholder="Your Name"
                        value={leadForm.name}
                        onChange={(e) => setLeadForm((prev) => ({ ...prev, name: e.target.value }))}
                        className="rounded-xl border border-gray-200 px-3 py-2.5 text-[14px] sm:text-[15px] outline-none bg-gray-50 focus:border-[#007AFF] focus:bg-white transition-colors w-full"
                      />
                      <input
                        required
                        type="text"
                        placeholder="Phone or email"
                        value={leadForm.contact}
                        onChange={(e) => setLeadForm((prev) => ({ ...prev, contact: e.target.value }))}
                        className="rounded-xl border border-gray-200 px-3 py-2.5 text-[14px] sm:text-[15px] outline-none bg-gray-50 focus:border-[#007AFF] focus:bg-white transition-colors w-full"
                      />
                      <select
                        value={leadForm.businessType}
                        onChange={(e) => setLeadForm((prev) => ({ ...prev, businessType: e.target.value }))}
                        className="rounded-xl border border-gray-200 px-3 py-2.5 text-[14px] sm:text-[15px] outline-none bg-gray-50 focus:border-[#007AFF] focus:bg-white transition-colors w-full appearance-none"
                      >
                        <option>Startup</option>
                        <option>SME</option>
                        <option>Enterprise</option>
                      </select>
                      <button
                        type="submit"
                        disabled={leadSubmitting || isTyping}
                        className="mt-1 w-full rounded-xl bg-[#007AFF] text-white text-[14px] sm:text-[15px] font-semibold py-2.5 hover:bg-blue-600 disabled:opacity-50 transition-colors"
                      >
                        {leadSubmitting ? "Submitting…" : "Confirm Booking"}
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* Consultation success confirmation */}
              {flowStep === "consultation_booked" && (
                <div className="flex justify-start">
                  <div className="inline-flex items-center gap-2 rounded-[20px] rounded-bl-[4px] bg-green-50 border border-green-200 px-4 py-3 shadow-sm">
                    <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                    <span className="text-[14px] sm:text-[15px] text-green-800 font-medium">Your CFO consultation is successfully booked!</span>
                  </div>
                </div>
              )}

              {/* Payment success confirmation */}
              {flowStep === "completed" && (
                <div className="flex justify-start">
                  <div className="inline-flex items-center gap-2 rounded-2xl bg-green-50 border border-green-200 px-4 py-2.5 shadow-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                    <span className="text-xs sm:text-sm text-green-800 font-medium">Payment successful!</span>
                  </div>
                </div>
              )}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="rounded-[20px] rounded-bl-[4px] bg-[#E9E9EB] px-4 py-3.5 flex items-center gap-1.5 h-[38px] sm:h-[44px]">
                    <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
            </div>

            {/* ── Input bar ──────────────────────────────────────────────── */}
            <form
              onSubmit={handleChatSubmit}
              noValidate
              className="px-3 sm:px-5 pt-3 pb-4 sm:pt-4 sm:pb-5 border-t border-gray-100"
            >
              <label htmlFor="finance-ai-prompt" className="sr-only">
                Ask Finovert about finance and compliance
              </label>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex h-[42px] sm:h-[48px] flex-1 min-w-0 items-center rounded-full border border-gray-200 bg-white px-1 sm:px-1 focus-within:border-gray-300 shadow-sm transition-[box-shadow,border-color]">
                  <button
                    type="button"
                    data-chat-input-action
                    className="flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full text-gray-400 hover:text-gray-600 transition-colors ml-1"
                    aria-label="Attach files"
                    onMouseDown={keepKeyboardOnPress}
                    onTouchStart={keepKeyboardOnPress}
                    onClick={(e) => {
                      e.preventDefault();
                      sendMessage("I want to share documents for finance review.");
                    }}
                  >
                    <Paperclip className="w-5 h-5 sm:w-[22px] sm:h-[22px]" />
                  </button>

                  <textarea
                    ref={inputRef}
                    id="finance-ai-prompt"
                    rows={1}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={isListening ? "Listening..." : "Ask anything about finance"}
                    className="flex-1 min-w-0 resize-none border-0 bg-transparent px-2 sm:px-3 text-[15px] sm:text-[16px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-0 touch-manipulation leading-[42px] sm:leading-[48px] h-[42px] sm:h-[48px] overflow-y-auto align-middle"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage(query);
                      }
                    }}
                  />

                  {/* Show send button only when there's text AND not listening (mic takes priority while recording) */}
                  {(query.trim() && !isListening) ? (
                    <button
                      type="submit"
                      data-chat-input-action
                      disabled={isTyping}
                      onMouseDown={keepKeyboardOnPress}
                      onTouchStart={keepKeyboardOnPress}
                      className="flex h-[32px] w-[32px] sm:h-[36px] sm:w-[36px] shrink-0 items-center justify-center rounded-full bg-[#007AFF] text-white hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors mr-1"
                      aria-label="Send message"
                    >
                      <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      data-chat-input-action
                      className={`flex h-[32px] w-[32px] sm:h-[36px] sm:w-[36px] shrink-0 items-center justify-center rounded-full transition-all mr-1 ${
                        isListening
                          ? "bg-red-500 text-white animate-pulse shadow-lg shadow-red-300"
                          : "text-gray-400 hover:text-gray-600"
                      }`}
                      aria-label={isListening ? "Stop recording" : "Voice input"}
                      onMouseDown={keepKeyboardOnPress}
                      onTouchStart={keepKeyboardOnPress}
                      onClick={(e) => {
                        e.preventDefault();
                        startVoiceInput();
                      }}
                    >
                      <Mic className="w-5 h-5 sm:w-[22px] sm:h-[22px]" />
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>

          {/* ── Suggestion chips ──────────────────────────────────────────── */}
          <div className="mt-3 sm:mt-6 -mx-3 sm:-mx-2 pb-1">
            <div className="flex flex-nowrap items-center gap-2 sm:gap-3 overflow-x-auto overscroll-x-contain scrollbar-hide px-3 sm:px-2 snap-x snap-mandatory touch-pan-x">
              {SUGGESTIONS.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => handleSuggestionClick(item)}
                    disabled={isTyping}
                    className={`
                      inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 sm:gap-2 sm:px-5 sm:py-3
                      text-xs sm:text-base font-medium shadow-sm transition-colors shrink-0 snap-start disabled:opacity-50
                      ${item.locked
                        ? "border-gray-200 bg-gray-50/90 text-gray-600 hover:border-[#1428A0]/30 hover:bg-[#1428A0]/5"
                        : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                      }
                    `}
                  >
                    <Icon
                      className={`w-3.5 h-3.5 sm:w-5 sm:h-5 ${item.locked ? "text-gray-500" : "text-[#1428A0]"}`}
                      strokeWidth={2.2}
                    />
                    <span>{item.label}</span>
                    {item.locked && (
                      <Lock className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" aria-hidden />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── Consultation modal ──────────────────────────────────────────────── */}
      <Dialog open={consultationOpen} onOpenChange={setConsultationOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl p-0 gap-0 overflow-hidden">
          <div className="p-6 sm:p-8 bg-gray-50">
            <DialogHeader className="text-left space-y-2">
              <DialogTitle className="text-2xl font-bold text-gray-900">
                Book a{" "}
                <span className="text-emerald-600 font-bold">free</span> consultation
              </DialogTitle>
              <DialogDescription className="text-gray-600 text-base">
                {lockedFeature
                  ? `Unlock "${lockedFeature}" and get expert help from our finance team.`
                  : "Share your details and our team will connect with you."}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleLeadSubmit} className="mt-6 grid grid-cols-1 gap-3">
              <input
                required
                type="text"
                placeholder="Name"
                value={leadForm.name}
                onChange={(e) => setLeadForm((prev) => ({ ...prev, name: e.target.value }))}
                className="rounded-xl border border-gray-300 px-4 py-3 outline-none bg-white focus:border-blue-500"
              />
              <input
                required
                type="text"
                placeholder="Phone or email"
                value={leadForm.contact}
                onChange={(e) => setLeadForm((prev) => ({ ...prev, contact: e.target.value }))}
                className="rounded-xl border border-gray-300 px-4 py-3 outline-none bg-white focus:border-blue-500"
              />
              <select
                value={leadForm.businessType}
                onChange={(e) => setLeadForm((prev) => ({ ...prev, businessType: e.target.value }))}
                className="rounded-xl border border-gray-300 px-4 py-3 outline-none bg-white focus:border-blue-500"
              >
                <option>Startup</option>
                <option>SME</option>
                <option>Enterprise</option>
              </select>
              <button
                type="submit"
                disabled={leadSubmitting}
                className="mt-1 rounded-[20px] bg-[#1d1d1f] text-white font-semibold py-3.5 hover:bg-black transition-colors disabled:opacity-60 shadow-sm"
              >
                {leadSubmitting ? "Submitting…" : "Book Free Consultation"}
              </button>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
