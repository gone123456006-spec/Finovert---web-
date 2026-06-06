import { useEffect, useRef, useState } from "react";
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
    locked: true,
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
    script.onload  = () => resolve(true);
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

  const focusChatInput = () => {
    requestAnimationFrame(() => {
      inputRef.current?.focus({ preventScroll: true });
    });
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

  const replyAssistant = (text: string, delay = 700) => {
    setIsTyping(true);
    window.setTimeout(() => {
      appendAssistantMessage(text);
      setIsTyping(false);
      focusChatInput();
    }, delay);
  };

  const processTaxFlowMessage = (trimmed: string) => {
    if (flowStep === "completed" || flowStep === "declined") {
      replyAssistant("Your tax filing session is complete. Message us anytime if you need more help.");
      return;
    }
    if (flowStep === "intro_done") {
      setFlowStep("awaiting_pan");
      replyAssistant(MSG.TAX_WELCOME);
      return;
    }
    if (flowStep === "awaiting_pan") {
      const pan = normalizePan(trimmed);
      if (!isValidPan(pan)) { replyAssistant(MSG.PAN_INVALID); return; }
      setFilingData((prev) => ({ ...prev, pan }));
      setFlowStep("awaiting_email");
      replyAssistant(MSG.ASK_EMAIL);
      return;
    }
    if (flowStep === "awaiting_email") {
      const email = trimmed.trim();
      if (!isValidEmail(email)) { replyAssistant(MSG.EMAIL_INVALID); return; }
      setFilingData((prev) => ({ ...prev, email }));
      setFlowStep("awaiting_income");
      setSelectedIncome([]);
      replyAssistant(MSG.ASK_INCOME);
      return;
    }
    if (flowStep === "awaiting_income") {
      replyAssistant("Please select your income sources using the checkboxes below, then tap Continue.");
      return;
    }
    if (flowStep === "awaiting_proceed") {
      if (isYes(trimmed)) { void submitFilingAndShowPayment(); return; }
      if (isNo(trimmed))  { setFlowStep("declined"); replyAssistant(MSG.DECLINED); return; }
      replyAssistant(MSG.ASK_YES_NO);
      return;
    }
    if (flowStep === "awaiting_payment") {
      replyAssistant("Please use the Pay Now button below to complete your payment.");
      return;
    }
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
        key:         order.keyId,
        amount:      order.amount,          // paise
        currency:    order.currency,
        order_id:    order.orderId,
        name:        "Finovert",
        description: "Income Tax Return (ITR) Filing",
        image:       "https://www.finovert.com/app-logo.png",
        prefill: {
          email: order.prefill.email,
          name:  "Valued Customer",
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
                razorpay_order_id:   response.razorpay_order_id,
                razorpay_signature:  response.razorpay_signature,
                filingId:            filingData.filingId,
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

  const startTaxFilingFlow = () => {
    if (flowStep !== "intro_done") return;
    setFlowStep("awaiting_pan");
    replyAssistant(MSG.TAX_WELCOME);
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
    processTaxFlowMessage(trimmed);
  };

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
      setMessages((prev) => [...prev, { id: createId(), role: "user", text: item.label }]);
      startTaxFilingFlow();
      return;
    }
    sendMessage(item.prompt);
  };

  const userHasMessaged = messages.some((m) => m.role === "user");
  const hasChat = userHasMessaged || isTyping;

  return (
    <>
      <section className="relative z-10 -mt-2 sm:-mt-8 pb-6 sm:pb-12 bg-gradient-to-b from-transparent via-white to-white">
        <div
          className={`max-w-4xl lg:max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 ${
            hasChat ? "sticky top-2 sm:top-5 z-50" : ""
          }`}
        >
          <div className="rounded-xl sm:rounded-[1.75rem] bg-white overflow-hidden flex flex-col shadow-[0_16px_56px_rgba(15,42,95,0.18)] transition-shadow">
            <div
              ref={chatScrollRef}
              data-chat-messages
              className="min-h-[220px] max-h-[300px] sm:min-h-[260px] sm:max-h-[400px] overflow-y-auto overscroll-contain scrollbar-hide px-3 sm:px-6 pt-4 sm:pt-6 pb-3 space-y-3 sm:space-y-4 bg-gray-50/50 border-b border-gray-100 cursor-default touch-pan-y"
            >
              {messages.map((msg) =>
                msg.role === "user" ? (
                  <div key={msg.id} className="flex justify-end">
                    <div className="max-w-[88%] sm:max-w-[75%] rounded-2xl rounded-br-md bg-gray-900 text-white px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-base leading-relaxed">
                      {msg.text}
                    </div>
                  </div>
                ) : (
                  <div key={msg.id} className="flex justify-start">
                    <div className="max-w-[85%] sm:max-w-[75%] rounded-2xl rounded-bl-md bg-white border border-gray-200/90 text-gray-800 px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-base leading-relaxed shadow-sm whitespace-pre-line">
                      {msg.text}
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
                  <div className="max-w-[85%] sm:max-w-[75%] rounded-2xl rounded-bl-md bg-white border border-gray-200/90 px-3 py-2 sm:px-4 sm:py-3 shadow-sm">
                    <p className="text-xs sm:text-base text-gray-500 animate-pulse">Raj Typing ...</p>
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
                <div className="flex h-12 sm:h-14 flex-1 min-w-0 items-center rounded-full border border-gray-200/90 bg-gray-100/90 px-1.5 sm:px-2 focus-within:border-[#1428A0]/25 focus-within:ring-2 focus-within:ring-[#1428A0]/10 transition-[box-shadow,border-color]">
                  <button
                    type="button"
                    data-chat-input-action
                    className="inline-flex h-10 w-10 sm:h-11 sm:w-auto sm:px-2 shrink-0 items-center justify-center gap-1 rounded-full text-gray-600 hover:text-gray-900 hover:bg-white/60 transition-colors"
                    aria-label="Attach files"
                    onMouseDown={keepKeyboardOnPress}
                    onTouchStart={keepKeyboardOnPress}
                    onClick={(e) => {
                      e.preventDefault();
                      sendMessage("I want to share documents for finance review.");
                    }}
                  >
                    <Paperclip className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                    <span className="hidden sm:inline text-sm whitespace-nowrap">Attach files</span>
                  </button>

                  <button
                    type="button"
                    data-chat-input-action
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-gray-500 hover:bg-white/60 transition-colors"
                    aria-label="Voice input"
                    onMouseDown={keepKeyboardOnPress}
                    onTouchStart={keepKeyboardOnPress}
                    onClick={(e) => {
                      e.preventDefault();
                      sendMessage(query || "Hey");
                    }}
                  >
                    <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>

                  <textarea
                    ref={inputRef}
                    id="finance-ai-prompt"
                    rows={1}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 min-w-0 resize-none border-0 bg-transparent px-1 sm:px-2 text-base text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-0 touch-manipulation leading-6 py-3 sm:py-4 overflow-y-auto align-middle"
                    style={{ fontSize: "16px" }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage(query);
                      }
                    }}
                  />
                </div>

                <button
                  type="submit"
                  data-chat-input-action
                  disabled={!query.trim() || isTyping}
                  onMouseDown={keepKeyboardOnPress}
                  onTouchStart={keepKeyboardOnPress}
                  className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-full bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-md"
                  aria-label="Send message"
                >
                  <ArrowUp className="w-4 h-4 sm:w-6 sm:h-6" strokeWidth={2.5} />
                </button>
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
                      ${
                        item.locked
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
                className="mt-1 rounded-xl bg-[#0F2A5F] text-white font-semibold py-3.5 hover:bg-[#0b1f47] transition-colors disabled:opacity-60"
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
