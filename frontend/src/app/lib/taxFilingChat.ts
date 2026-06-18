export const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]$/i;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const INCOME_SOURCE_OPTIONS = [
  "Salary",
  "One House Property",
  "More Than One House Property",
  "Business and Profession",
  "Capital Gains",
  "Future and Options",
  "Resident having Foreign Income",
  "Non Resident (NRI) Filing",
  "Cryptocurrency",
] as const;

export const MSG = {
  TAX_WELCOME:
    "Welcome to Finovert! Ready to file your taxes today? Please provide your PAN to start filing your income tax return.",
  PAN_INVALID:
    "The PAN format seems incorrect. Please double-check and provide a valid PAN card number.",
  ASK_EMAIL: "Please share your email address.",
  EMAIL_INVALID:
    "The email format seems incorrect. Please provide a valid email address (for example: name@gmail.com).",
  ASK_INCOME:
    "Please select your income sources for this financial year.",
  PRICING: `For your income source, the Assisted Salary Plan applies:

Base Price: Rs 649
GST (18%): Rs 117
Total Payable: Rs 766

Would you like to proceed?`,
  ASK_YES_NO: 'Please reply with "Yes" to continue or "No" to stop.',
  DECLINED: "No problem. If you want to file later, just message me anytime.",
  PAYMENT_INTRO: "Great! Click Pay Now below to complete your payment securely.",
  PAYMENT_DONE:
    "Thank you! Your payment is recorded. Our team will process your income tax return and contact you on your registered email.",
};

export type TaxFlowStep =
  | "intro_done"
  | "awaiting_pan"
  | "awaiting_email"
  | "awaiting_income"
  | "awaiting_proceed"
  | "awaiting_payment"
  | "awaiting_consultation_form"
  | "consultation_booked"
  | "completed"
  | "declined";

export function normalizePan(value: string) {
  return value.trim().toUpperCase();
}

export function isValidPan(value: string) {
  return PAN_REGEX.test(normalizePan(value));
}

export function isValidEmail(value: string) {
  return EMAIL_REGEX.test(value.trim());
}

export function isYes(text: string) {
  return /^(yes|y|yeah|yep|sure|ok|okay|proceed|continue)\b/i.test(text.trim());
}

export function isNo(text: string) {
  return /^(no|n|nope|cancel|stop|decline)\b/i.test(text.trim());
}
