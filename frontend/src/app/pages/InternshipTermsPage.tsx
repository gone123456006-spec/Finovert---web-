import { useEffect, useRef, useState, type ReactNode } from "react";
import { CheckCircle, Info } from "lucide-react";
import { SEO } from "../components/SEO";
import { SignaturePad } from "../components/SignaturePad";
import { FaceVerificationCamera } from "../components/FaceVerificationCamera";
import API_BASE from "../../config/api";

const BLUE = "#1a73e8";
const TEXT = "#202124";
const MUTED = "#5f6368";
const LINE = "#dadce0";
const ERROR = "#d93025";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const INDIAN_MOBILE_REGEX = /^[6-9]\d{9}$/;
const AADHAAR_REGEX = /^\d{12}$/;

type FormData = {
  fullName: string;
  email: string;
  phone: string;
  date: string;
  aadhaarNumber: string;
};

type FormErrors = Partial<Record<keyof FormData | "signature" | "faceVerification" | "accepted", string>>;

function sanitizePhoneDigits(value: string) {
  return value.replace(/\D/g, "").slice(0, 10);
}

function validateForm(
  form: FormData,
  hasSignature: boolean,
  facePhoto: string,
  accepted: boolean[],
): FormErrors {
  const errors: FormErrors = {};

  if (!form.fullName.trim()) errors.fullName = "Full name is required";
  if (!form.email.trim()) {
    errors.email = "Email is required";
  } else if (!EMAIL_REGEX.test(form.email.trim())) {
    errors.email = "Enter a valid email address";
  }
  if (!form.phone) {
    errors.phone = "Phone is required";
  } else if (!INDIAN_MOBILE_REGEX.test(form.phone)) {
    errors.phone = "Enter a valid 10-digit mobile number";
  }
  if (!form.date) errors.date = "Date is required";
  if (!form.aadhaarNumber) {
    errors.aadhaarNumber = "Aadhaar number is required";
  } else if (!AADHAAR_REGEX.test(form.aadhaarNumber)) {
    errors.aadhaarNumber = "Enter a valid 12-digit Aadhaar number";
  }
  if (!hasSignature) errors.signature = "Signature is required";
  if (!facePhoto) errors.faceVerification = "Face verification is required";
  if (!accepted.every(Boolean)) errors.accepted = "Please accept all terms above";

  return errors;
}

const NAV = [
  { id: "about", label: "About this internship" },
  { id: "work", label: "Your responsibilities" },
  { id: "learning", label: "Learning" },
  { id: "confidential", label: "Confidential information" },
  { id: "sharing", label: "Sharing and disclosure" },
  { id: "code", label: "Source code" },
  { id: "access", label: "Credentials and access" },
  { id: "data", label: "Data protection" },
  { id: "ip", label: "Intellectual property" },
  { id: "outside", label: "Personal projects" },
  { id: "portfolio", label: "Portfolios and publicity" },
  { id: "conduct", label: "Professional conduct" },
  { id: "future", label: "Future opportunities" },
  { id: "property", label: "Company property" },
  { id: "security", label: "Security incidents" },
  { id: "ending", label: "Ending the internship" },
  { id: "after", label: "After the internship" },
  { id: "no-job", label: "No job guarantee" },
  { id: "accepting", label: "Accepting these terms" },
];

const RESPONSIBILITIES = [
  "Mobile application development",
  "Web application development",
  "Frontend development",
  "Backend development",
  "API development and integration",
  "Database development and management",
  "UI/UX implementation",
  "Testing and debugging",
  "Bug fixing",
  "Performance optimization",
  "Cloud and deployment work",
  "DevOps-related activities",
  "Security-related development",
  "Automation",
  "Technical research",
  "Documentation",
  "Product development",
  "Admin-panel development",
  "Internal tools",
  "Other technology-related projects assigned by Finovert",
];

const CONFIDENTIAL_INFORMATION = [
  "Business ideas",
  "Product ideas",
  "Product concepts",
  "Business models",
  "Business strategies",
  "Product roadmaps",
  "Future plans",
  "Internal processes",
  "Workflows",
  "Marketing strategies",
  "Pricing information",
  "Customer information",
  "User information",
  "Lead information",
  "Financial information",
  "Partner information",
  "Vendor information",
  "Source code",
  "Software",
  "APIs",
  "Database structures",
  "Database information",
  "Technical architecture",
  "Algorithms",
  "Technical documentation",
  "System architecture",
  "Cloud infrastructure",
  "Credentials",
  "API keys",
  "Security mechanisms",
  "Internal dashboards",
  "Admin panels",
  "Internal tools",
  "Designs",
  "UI/UX concepts",
  "Prototypes",
  "Unreleased features",
  "Research",
  "Analytics",
  "Internal communications",
  "Internal documents",
  "Technical experiments",
  "Any other non-public information belonging to Finovert",
];

const DISCLOSURE_CHANNELS = [
  "WhatsApp",
  "Telegram",
  "Discord",
  "Slack",
  "Email",
  "Social media",
  "Reddit",
  "Online communities",
  "Public forums",
  "GitHub or other repositories",
  "Portfolio websites",
  "Personal websites",
  "Presentations",
  "Academic submissions",
  "Videos",
  "Blogs",
  "Articles",
  "Any other public or private platform",
];

const INTELLECTUAL_PROPERTY = [
  "Source code",
  "Software",
  "Scripts",
  "APIs",
  "Technical documentation",
  "Database structures",
  "Workflows",
  "Technical architecture",
  "Designs",
  "UI/UX implementation",
  "Product specifications",
  "Technical solutions",
  "Automation",
  "Internal tools",
  "Other project deliverables",
];

const PORTFOLIO_RESTRICTIONS = [
  "Source code",
  "Screenshots of private systems",
  "Internal dashboards",
  "Technical architecture",
  "Internal documents",
  "Customer/user information",
  "Confidential designs",
  "Unreleased features",
  "Product roadmap",
  "Private business information",
  "Confidential technology",
];

const FUTURE_OPPORTUNITIES = [
  "Paid internships",
  "Full-time employment",
  "Part-time employment",
  "Freelance projects",
  "Contract opportunities",
  "Technology projects",
  "Product-development roles",
  "Leadership opportunities",
  "Other paid opportunities",
];

const SECURITY_INCIDENTS = [
  "Data breach",
  "Credential leak",
  "Unauthorized access",
  "Lost company device",
  "Accidental disclosure",
  "Source-code leak",
  "Security vulnerability",
  "Unauthorized repository access",
  "Suspicious activity",
];

export function InternshipTermsPage() {
  const [active, setActive] = useState(NAV[0].id);
  const [accepted, setAccepted] = useState([false, false, false, false]);
  const [form, setForm] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    date: "",
    aadhaarNumber: "",
  });
  const [hasSignature, setHasSignature] = useState(false);
  const [signature, setSignature] = useState("");
  const [facePhoto, setFacePhoto] = useState("");
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [submitMessage, setSubmitMessage] = useState("");
  const scrollRef = useRef<HTMLElement>(null);
  const mobileNavRef = useRef<HTMLElement>(null);
  const acceptFormRef = useRef<HTMLDivElement>(null);

  const errors = attemptedSubmit ? validateForm(form, hasSignature, facePhoto, accepted) : {};
  const hasErrors = Object.keys(errors).length > 0;

  const updateForm = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSuccessClose = () => {
    window.location.reload();
  };

  const handleSubmit = async () => {
    setAttemptedSubmit(true);
    const nextErrors = validateForm(form, hasSignature, facePhoto, accepted);
    if (Object.keys(nextErrors).length > 0) {
      acceptFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      const firstErrorId =
        (["fullName", "email", "phone", "date", "aadhaarNumber", "signature", "faceVerification"] as const).find(
          (key) => nextErrors[key],
        ) ?? (nextErrors.accepted ? "accept-checkboxes" : undefined);
      if (firstErrorId) {
        document.getElementById(firstErrorId)?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    if (!signature) {
      setSubmitStatus("error");
      setSubmitMessage("Please draw your signature before submitting.");
      return;
    }

    setSubmitStatus("loading");
    setSubmitMessage("");

    try {
      const response = await fetch(`${API_BASE}/api/terms-acceptances`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          phone: form.phone,
          date: form.date,
          aadhaarNumber: form.aadhaarNumber,
          signature,
          facePhoto,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.message || "Failed to submit. Please try again.");
      }
      setSubmitStatus("success");
    } catch (error) {
      setSubmitStatus("error");
      setSubmitMessage(error instanceof Error ? error.message : "Failed to submit. Please try again.");
    }
  };

  useEffect(() => {
    const id = "google-roboto-font";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap";
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
      document.documentElement.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;

    const onScroll = () => {
      const top = root.getBoundingClientRect().top;
      let current = NAV[0].id;
      for (const item of NAV) {
        const el = document.getElementById(item.id);
        if (el && el.getBoundingClientRect().top - top <= 48) current = item.id;
      }
      setActive((prev) => (prev === current ? prev : current));
    };

    onScroll();
    root.addEventListener("scroll", onScroll, { passive: true });
    return () => root.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const nav = mobileNavRef.current;
    const chip = nav?.querySelector<HTMLElement>(`[data-nav-id="${active}"]`);
    if (!nav || !chip) return;

    const navRect = nav.getBoundingClientRect();
    const chipRect = chip.getBoundingClientRect();
    const left = nav.scrollLeft + chipRect.left - navRect.left - nav.clientWidth / 2 + chipRect.width / 2;
    nav.scrollTo({ left: Math.max(0, left), behavior: "smooth" });
  }, [active]);

  const scrollToSection = (id: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <SEO
        title="Unpaid Technology Internship Terms"
        description="Terms for Finovert’s unpaid technology internship — what you can expect from us, and what we expect from you."
        path="/internship-terms"
      />

      {submitStatus === "success" ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-6"
          style={{ background: "rgba(32, 33, 36, 0.6)" }}
          onClick={handleSuccessClose}
        >
          <div
            role="dialog"
            aria-labelledby="terms-success-title"
            aria-describedby="terms-success-desc"
            className="w-full max-w-[560px] overflow-hidden rounded-[28px] bg-white"
            style={{
              fontFamily: 'Roboto, "Google Sans", Arial, sans-serif',
              boxShadow: "0 24px 38px rgba(0,0,0,0.14), 0 9px 46px rgba(0,0,0,0.12), 0 11px 15px rgba(0,0,0,0.2)",
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="px-6 pb-2 pt-6 sm:px-7 sm:pt-7">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full" style={{ background: "#e6f4ea" }}>
                <CheckCircle className="h-6 w-6" style={{ color: "#188038" }} strokeWidth={2.25} />
              </div>
              <h2
                id="terms-success-title"
                className="text-[22px] font-normal leading-7 tracking-normal sm:text-[24px]"
                style={{ color: TEXT }}
              >
                Terms submitted successfully
              </h2>
              <p
                id="terms-success-desc"
                className="mt-3 text-[14px] leading-[1.6] sm:text-[15px]"
                style={{ color: MUTED }}
              >
                Your signed terms, details, face verification, and signature have been saved in the
                Finovert admin panel. A copy has also been sent to your Gmail.
              </p>
            </div>
            <div className="flex justify-end gap-2 px-4 py-4 sm:px-6 sm:pb-5">
              <button
                type="button"
                onClick={handleSuccessClose}
                className="rounded-full px-6 py-2.5 text-sm font-medium transition-colors hover:bg-[#f6fafe]"
                style={{ color: BLUE }}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div
        className="flex h-full min-h-0 flex-col overflow-hidden bg-white"
        style={{ fontFamily: 'Roboto, "Google Sans", Arial, sans-serif', color: TEXT }}
      >
        <nav
          ref={mobileNavRef}
          className="scrollbar-hide z-40 shrink-0 overflow-x-auto px-4 py-2.5 lg:hidden"
          style={{ background: "#fff" }}
        >
          <div className="flex w-max gap-2">
            {NAV.map((item) => (
              <a
                key={item.id}
                data-nav-id={item.id}
                href={`#${item.id}`}
                onClick={scrollToSection(item.id)}
                className="shrink-0 rounded-full px-3 py-1.5 text-[12px] leading-none whitespace-nowrap"
                style={{
                  color: active === item.id ? "#fff" : TEXT,
                  background: active === item.id ? BLUE : "#f1f3f4",
                  fontWeight: active === item.id ? 500 : 400,
                }}
              >
                {item.label}
              </a>
            ))}
          </div>
        </nav>

        <div className="mx-auto flex min-h-0 w-full max-w-[1100px] flex-1 gap-0 px-4 sm:px-6 lg:gap-16 lg:px-8">
          <aside className="hidden h-full shrink-0 lg:flex lg:w-[220px] lg:flex-col lg:py-8">
            <nav className="scrollbar-hide space-y-0.5 overflow-y-auto border-l border-[#dadce0] py-2">
              {NAV.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={scrollToSection(item.id)}
                  className="block py-1.5 pl-4 text-[13px] leading-snug transition-colors"
                  style={{
                    color: active === item.id ? BLUE : MUTED,
                    borderLeft: active === item.id ? `2px solid ${BLUE}` : "2px solid transparent",
                    marginLeft: "-1px",
                    fontWeight: active === item.id ? 500 : 400,
                  }}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </aside>

          <article
            ref={scrollRef}
            className="scrollbar-hide min-h-0 w-full max-w-[720px] flex-1 overflow-x-hidden overflow-y-auto overscroll-contain py-5 pb-[max(5rem,env(safe-area-inset-bottom))] sm:py-8"
          >
            <h1 className="text-[26px] font-normal leading-tight tracking-tight sm:text-[32px] lg:text-[40px]">
              Unpaid Technology Internship Terms
            </h1>
            <p className="mt-3 text-sm" style={{ color: MUTED }}>
              Last updated: 18 August 2026
            </p>

            <p className="mt-5 text-[15px] leading-[1.7] sm:mt-8 sm:text-[16px] sm:leading-[1.75]" style={{ color: TEXT }}>
              We know it’s tempting to skip these terms, but they explain what you can expect from a
              Finovert unpaid technology internship, and what we expect from you.
            </p>
            <p className="mt-4 text-[15px] leading-[1.7] sm:text-[16px] sm:leading-[1.75]" style={{ color: TEXT }}>
              By submitting an application and checking the boxes below, you confirm that you have
              read, understood, and agreed to these Internship Terms & Conditions (“Terms”) with
              Finovert (“Company”).
            </p>

            <Section id="about" title="1. About this internship">
              <P>
                This is an unpaid internship, unless you and Finovert separately agree in writing to a
                stipend, salary, or other compensation.
              </P>
              <P>
                The point of the internship is practical experience: learning, professional
                development, and exposure to real-world technology and product development.
              </P>
              <P>
                Taking part does not automatically entitle you to salary, stipend, equity, partnership,
                employment, or any other compensation.
              </P>
              <P>The internship and these terms are subject to applicable laws and regulations.</P>
            </Section>

            <Section id="work" title="2. Your responsibilities">
              <P>
                You’ll be expected to carry out the technical and product work assigned to you
                responsibly.
              </P>
              <P>That work may include, but isn’t limited to:</P>
              <List items={RESPONSIBILITIES} />
              <P>Please make a reasonable effort to finish assigned work within the timelines we share.</P>
              <P>
                If something is blocked — a technical issue, a delay, or anything else that affects
                your work — tell us promptly and honestly.
              </P>
              <P>
                You may be asked to learn new technologies or processes when that’s reasonably needed
                for your work.
              </P>
            </Section>

            <Section id="learning" title="3. Learning">
              <P>
                We intend to give you practical exposure to real-world product and technology
                development.
              </P>
              <P>
                You may receive mentorship, feedback, technical guidance, and a chance to work on
                meaningful product features.
              </P>
              <P>
                Throughout the internship, we may look at your performance, learning, ownership,
                technical skills, communication, reliability, and professional conduct.
              </P>
              <P>
                Please take part in the learning process and take reasonable ownership of your
                development.
              </P>
            </Section>

            <Section id="confidential" title="4. Confidential information">
              <P>
                During the internship, you may see confidential, proprietary, technical, commercial,
                financial, operational, or strategic information that belongs to Finovert.
              </P>
              <P>Keep all of that information strictly confidential.</P>
              <P>Confidential information may include, but isn’t limited to:</P>
              <List items={CONFIDENTIAL_INFORMATION} />
              <P>
                Don’t share confidential information with anyone who isn’t authorized — including
                another person, company, organization, competitor, friend, colleague, classmate,
                client, or third party.
              </P>
              <P>
                Confidentiality applies whether information is shared verbally, electronically,
                visually, in documents, in source code, or through access to company systems.
              </P>
            </Section>

            <Section id="sharing" title="5. Sharing and disclosure">
              <P>
                Don’t share, publish, reproduce, distribute, sell, transfer, license, disclose, or
                otherwise make available Finovert’s ideas, processes, data, technology, source code,
                architecture, product information, or confidential information without prior written
                authorization.
              </P>
              <P>
                Don’t discuss confidential Finovert information in public or private groups where
                unauthorized people might see it.
              </P>
              <P>And don’t share confidential information through:</P>
              <List items={DISCLOSURE_CHANNELS} />
              <P>unless Finovert specifically authorizes it.</P>
            </Section>

            <Section id="code" title="6. Source code">
              <P>Finovert’s source code and repositories are confidential company assets.</P>
              <P>Don’t copy Finovert source code for personal projects or outside work.</P>
              <P>
                Don’t upload Finovert code to personal or unauthorized GitHub, GitLab, or Bitbucket
                repositories.
              </P>
              <P>Don’t share repository access with anyone else.</P>
              <P>Don’t download or keep unnecessary copies of Finovert source code.</P>
              <P>Don’t use Finovert source code to build a competing or unrelated product.</P>
              <P>
                Don’t intentionally remove, bypass, or weaken security controls without authorization.
              </P>
            </Section>

            <Section id="access" title="7. Credentials and access">
              <P>
                Keep Finovert passwords, API keys, authentication tokens, database credentials, cloud
                credentials, repository access, and other security information confidential.
              </P>
              <P>Don’t share your Finovert credentials with anyone else.</P>
              <P>Don’t use someone else’s credentials without authorization.</P>
              <P>
                Don’t try to access systems, databases, repositories, accounts, or information beyond
                the permissions you’ve been given.
              </P>
              <P>
                If a credential is compromised, or you notice unauthorized access, tell Finovert
                immediately.
              </P>
            </Section>

            <Section id="data" title="8. Data protection">
              <P>
                You may be given access to business, customer, user, lead, financial, or other
                sensitive information.
              </P>
              <P>Only access what’s reasonably needed for your assigned work.</P>
              <P>Don’t use Finovert data for personal purposes.</P>
              <P>Don’t sell, transfer, publish, or disclose Finovert data.</P>
              <P>Don’t intentionally download or keep company data you don’t need.</P>
              <P>
                If you suspect a data leak, unauthorized access, a security vulnerability, or an
                accidental disclosure, report it to Finovert immediately.
              </P>
            </Section>

            <Section id="ip" title="9. Intellectual property">
              <P>
                Technology, code, documentation, designs, workflows, technical solutions, product
                specifications, and other work you create specifically for Finovert as part of your
                assigned internship work is intended to be owned by Finovert, to the extent permitted
                by applicable law.
              </P>
              <P>That may include:</P>
              <List items={INTELLECTUAL_PROPERTY} />
              <P>
                If we need documentation or extra steps to establish or protect these rights, please
                cooperate reasonably.
              </P>
              <P>
                Intellectual property you created independently before joining Finovert — and that
                wasn’t created using Finovert’s resources or confidential information — remains yours.
              </P>
            </Section>

            <Section id="outside" title="10. Personal projects">
              <P>
                Don’t use Finovert’s confidential information, source code, data, technology, systems,
                or internal processes for personal projects or work for another organization.
              </P>
              <P>Don’t reproduce Finovert’s confidential technology for another client or business.</P>
              <P>
                If assigned work overlaps with a personal project or intellectual property you already
                had, tell us promptly.
              </P>
            </Section>

            <Section id="portfolio" title="11. Portfolios and publicity">
              <P>
                You’re welcome to say that you completed or took part in a Finovert internship on your
                resume, LinkedIn, or professional portfolio.
              </P>
              <P>Please get written permission before publicly showing Finovert’s:</P>
              <List items={PORTFOLIO_RESTRICTIONS} />
              <P>
                Mentioning the internship is fine. Disclosing confidential company information is not.
              </P>
            </Section>

            <Section id="conduct" title="12. Professional conduct">
              <P>
                Treat Finovert’s founders, employees, interns, customers, partners, vendors, and other
                stakeholders with professionalism and respect.
              </P>
              <P>Communicate professionally.</P>
              <P>Follow reasonable instructions from your reporting manager or assigned team.</P>
              <P>Don’t misrepresent your work or progress.</P>
              <P>Don’t knowingly submit copied or plagiarized work as your own.</P>
              <P>
                Don’t engage in fraud, harassment, malicious activity, theft, deliberate misuse of
                company resources, or unauthorized disclosure.
              </P>
            </Section>

            <Section id="future" title="13. Future opportunities">
              <P>
                We value interns who show technical ability, ownership, reliability, integrity,
                learning ability, communication skills, and strong performance.
              </P>
              <P>
                Successful interns may receive priority consideration for suitable future opportunities
                with Finovert. That might include:
              </P>
              <List items={FUTURE_OPPORTUNITIES} />
              <P>
                Priority consideration isn’t a guarantee of employment, compensation, or future work.
              </P>
              <P>
                Any future opportunity depends on performance, available roles, business needs, skills,
                conduct, and mutual agreement.
              </P>
            </Section>

            <Section id="property" title="14. Company property">
              <P>
                Take care of Finovert devices, accounts, documents, credentials, software, code, data,
                and other company property provided to you.
              </P>
              <P>
                When your internship ends, return or delete Finovert materials as we reasonably
                instruct, subject to applicable law and legitimate security or backup requirements.
              </P>
              <P>
                Don’t intentionally keep confidential Finovert materials after your access or
                internship ends.
              </P>
            </Section>

            <Section id="security" title="15. Security incidents">
              <P>Tell us immediately if you suspect any of the following:</P>
              <List items={SECURITY_INCIDENTS} />
              <P>
                Reporting a mistake or security issue promptly matters. Intentionally hiding a serious
                security incident may be a breach of these Terms.
              </P>
            </Section>

            <Section id="ending" title="16. Ending the internship">
              <P>
                The internship may be ended in line with the applicable internship arrangement and
                applicable law.
              </P>
              <P>
                Serious misconduct, unauthorized disclosure, security violations, misuse of company
                resources, fraud, or a material breach of these Terms may result in termination,
                subject to applicable law.
              </P>
              <P>
                If the internship ends, please follow reasonable instructions about returning or
                deleting confidential company information and access credentials.
              </P>
            </Section>

            <Section id="after" title="17. After the internship">
              <P>
                Your confidentiality and non-disclosure responsibilities don’t automatically end when
                the internship does.
              </P>
              <P>
                Continue protecting Finovert’s confidential information for as long as it remains
                confidential, or as otherwise required by applicable law.
              </P>
              <P>
                Intellectual-property obligations and restrictions on unauthorized use of Finovert’s
                confidential technology may also continue after the internship.
              </P>
            </Section>

            <Section id="no-job" title="18. No job guarantee">
              <P>
                Completing the internship successfully doesn’t automatically guarantee a job, salary,
                stipend, equity, partnership, or paid project.
              </P>
              <P>
                Finovert may consider high-performing interns first when suitable opportunities come
                up, but any future engagement needs a separate agreement.
              </P>
            </Section>

            <Section id="accepting" title="19. Accepting these terms">
              <P>
                Checking the boxes below and submitting your internship application is your electronic
                acknowledgement and acceptance of these Terms, subject to applicable law.
              </P>
              <P>
                The information you provide in your application should be accurate to the best of your
                knowledge.
              </P>
              <P>Please read and understand these Terms before you accept them.</P>
              <P>
                You’ll be expected to follow Finovert’s applicable internship policies, confidentiality
                requirements, security procedures, and professional standards.
              </P>
            </Section>

            <div
              ref={acceptFormRef}
              id="accept-form"
              className="mt-10 border-t pt-8 sm:mt-14 sm:pt-10"
              style={{ borderColor: LINE }}
            >
              <h2 className="text-[20px] font-normal sm:text-[22px]">Accept</h2>
              <p className="mt-2 text-sm" style={{ color: MUTED }}>
                Please confirm the following before you apply. Fields marked with * are required.
              </p>

              <div id="accept-checkboxes" className="mt-6 space-y-5">
                {[
                  "I have read, understood, and voluntarily agree to Finovert’s Unpaid Technology Internship Terms & Conditions, including the confidentiality, non-disclosure, data-security, intellectual-property, company-system, and professional-conduct provisions stated above.",
                  "I understand that this internship is unpaid unless otherwise agreed in writing, and that future paid opportunities may be offered based on performance and business requirements but are not guaranteed.",
                  "I agree not to disclose or misuse Finovert’s confidential ideas, processes, data, source code, technology, architecture, product information, or other non-public information during or after my internship, subject to applicable law.",
                  "I agree to follow Finovert’s policies and instructions and accept responsibility for complying with these Terms.",
                ].map((label, i) => (
                  <label key={label} className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      required
                      checked={accepted[i]}
                      onChange={() =>
                        setAccepted((prev) => prev.map((v, idx) => (idx === i ? !v : v)))
                      }
                      className="mt-0.5 h-5 w-5 shrink-0 rounded-[2px] border border-[#5f6368] accent-[#1a73e8]"
                    />
                    <span className="min-w-0 text-[13px] leading-relaxed sm:text-sm" style={{ color: TEXT }}>
                      {label}
                    </span>
                  </label>
                ))}
                {errors.accepted ? (
                  <p className="text-[12px]" style={{ color: ERROR }}>
                    {errors.accepted}
                  </p>
                ) : null}
              </div>

              <h3 className="mt-10 text-[16px] font-medium">Your details</h3>
              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                <Field
                  id="fullName"
                  label="Full Name"
                  required
                  value={form.fullName}
                  onChange={(value) => updateForm("fullName", value)}
                  autoComplete="name"
                  error={errors.fullName}
                />
                <Field
                  id="email"
                  label="Email"
                  required
                  type="email"
                  value={form.email}
                  onChange={(value) => updateForm("email", value)}
                  autoComplete="email"
                  error={errors.email}
                />
                <Field
                  id="phone"
                  label="Phone"
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(value) => updateForm("phone", sanitizePhoneDigits(value))}
                  autoComplete="tel"
                  inputMode="numeric"
                  maxLength={10}
                  error={errors.phone}
                />
                <Field
                  id="date"
                  label="Date"
                  required
                  type="date"
                  value={form.date}
                  onChange={(value) => updateForm("date", value)}
                  error={errors.date}
                />
                <div className="sm:col-span-2">
                  <Field
                    id="aadhaarNumber"
                    label="Aadhaar Number"
                    required
                    value={form.aadhaarNumber}
                    onChange={(value) => updateForm("aadhaarNumber", value.replace(/\D/g, "").slice(0, 12))}
                    inputMode="numeric"
                    maxLength={12}
                    autoComplete="off"
                    error={errors.aadhaarNumber}
                  />
                  <p className="mt-2 flex items-start gap-1.5 text-[12px] leading-relaxed sm:text-[13px]" style={{ color: MUTED }}>
                    <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    <span>
                      Your Aadhaar number is collected solely for identity verification and will not
                      be used or shared for any other purpose.
                    </span>
                  </p>
                </div>
                <div id="signature" className="sm:col-span-2">
                  <SignaturePad
                    required
                    error={errors.signature}
                    onChange={setHasSignature}
                    onSignature={setSignature}
                  />
                </div>
                <div id="faceVerification" className="sm:col-span-2">
                  <FaceVerificationCamera
                    required
                    error={errors.faceVerification}
                    onCapture={setFacePhoto}
                    onClear={() => setFacePhoto("")}
                  />
                </div>
              </div>

              {attemptedSubmit && hasErrors ? (
                <p className="mt-6 text-[13px]" style={{ color: ERROR }}>
                  Please complete all required fields before submitting.
                </p>
              ) : null}

              {submitStatus === "error" && submitMessage ? (
                <p className="mt-6 text-[13px]" style={{ color: ERROR }}>
                  {submitMessage}
                </p>
              ) : null}

              <button
                type="button"
                onClick={() => void handleSubmit()}
                disabled={submitStatus === "loading" || submitStatus === "success"}
                className="mt-8 inline-flex min-h-11 w-full items-center justify-center rounded px-6 text-sm font-medium text-white hover:brightness-95 disabled:opacity-60 sm:mt-8 sm:h-9 sm:min-h-0 sm:w-auto"
                style={{ background: BLUE }}
              >
                {submitStatus === "loading"
                  ? "Submitting…"
                  : submitStatus === "success"
                    ? "Submitted"
                    : "I accept and Submit"}
              </button>
            </div>
          </article>
        </div>
      </div>
    </>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-4 pt-8 sm:pt-10">
      <h2 className="text-[19px] font-normal leading-snug sm:text-[22px]">{title}</h2>
      <div className="mt-3 space-y-4 sm:mt-4">{children}</div>
    </section>
  );
}

function P({ children }: { children: ReactNode }) {
  return <p className="text-[15px] leading-[1.7] break-words sm:text-[16px] sm:leading-[1.75]">{children}</p>;
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="ml-4 list-disc space-y-1 text-[15px] leading-[1.65] sm:ml-5 sm:text-[16px] sm:leading-[1.7]" style={{ color: TEXT }}>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function Field({
  id,
  label,
  type = "text",
  value,
  onChange,
  autoComplete,
  inputMode,
  maxLength,
  required = false,
  error,
}: {
  id?: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  maxLength?: number;
  required?: boolean;
  error?: string;
}) {
  const [focused, setFocused] = useState(false);
  const floated = focused || value.length > 0 || type === "date";
  const borderColor = error ? ERROR : focused ? BLUE : LINE;

  return (
    <div id={id} className="min-w-0">
      <label className="relative block min-w-0">
        <span
          className="pointer-events-none absolute z-[1] max-w-[calc(100%-1.5rem)] truncate bg-white px-1 transition-all duration-150"
          style={{
            left: 12,
            top: floated ? -8 : 14,
            fontSize: floated ? 12 : 16,
            lineHeight: "16px",
            color: error ? ERROR : focused ? BLUE : MUTED,
          }}
        >
          {label}
          {required ? <span style={{ color: ERROR }}> *</span> : null}
        </span>
        <input
          type={type}
          value={value}
          required={required}
          autoComplete={autoComplete}
          inputMode={inputMode}
          maxLength={maxLength}
          onChange={(event) => onChange(event.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          aria-invalid={Boolean(error)}
          className="h-12 w-full min-w-0 rounded bg-white px-3.5 text-[16px] outline-none sm:h-14"
          style={{
            color: TEXT,
            border: error || focused ? `2px solid ${borderColor}` : `1px solid ${LINE}`,
            paddingLeft: error || focused ? 13 : 14,
            paddingRight: error || focused ? 13 : 14,
          }}
        />
      </label>
      {error ? (
        <p className="mt-1.5 text-[12px]" style={{ color: ERROR }}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
