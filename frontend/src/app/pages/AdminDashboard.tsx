import { useState, useEffect, useMemo } from "react";
import { motion } from "motion/react";
import { Lock, FileText, CheckCircle, AlertCircle, BadgeCheck, Users, Clock, Briefcase, Trash2, Download, XCircle, Check, Mail, Building, Calendar, RefreshCw, PhoneCall, Filter, Search, LogOut, FileSpreadsheet, Receipt, Eye, CheckSquare } from "lucide-react";

const AUTH_STORAGE_KEY = "finovert_admin_session";
const SESSION_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

type AdminSession = {
  role: "main_admin" | "sub_admin";
  user: { name: string; username: string };
  loggedInAt: number;
};

function readAdminSession(): AdminSession | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as AdminSession;
    if (!session?.role || !session?.loggedInAt || !session?.user) return null;
    if (Date.now() - session.loggedInAt > SESSION_MAX_AGE_MS) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }
    return session;
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

function saveAdminSession(role: AdminSession["role"], user: AdminSession["user"]) {
  const session: AdminSession = { role, user, loggedInAt: Date.now() };
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
}

function clearAdminSession() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

function escapeCsvCell(value: unknown) {
  const s = String(value ?? "").replace(/"/g, '""');
  return /[",\n\r]/.test(s) ? `"${s}"` : s;
}

function exportInternsToExcel(interns: {
  fullName?: string;
  phone?: string;
  email?: string;
  collegeName?: string;
  course?: string;
  branch?: string;
  yearOfStudy?: string;
  preferredRole?: string;
  eligibilityReason?: string;
  status?: string;
  createdAt?: string;
  resumeUrl?: string;
}[]) {
  const headers = [
    "S.No.",
    "Full Name",
    "Phone",
    "Email",
    "College",
    "Course",
    "Branch",
    "Year of Study",
    "Preferred Role",
    "Why Eligible",
    "Status",
    "Applied Date",
    "Resume Uploaded",
  ];
  const rows = interns.map((intern, index) => [
    index + 1,
    intern.fullName ?? "",
    intern.phone ?? "",
    intern.email ?? "",
    intern.collegeName ?? "",
    intern.course ?? "",
    intern.branch ?? "",
    intern.yearOfStudy ?? "",
    intern.preferredRole ?? "",
    intern.eligibilityReason ?? "",
    intern.status || "pending",
    intern.createdAt ? new Date(intern.createdAt).toLocaleString() : "",
    "Yes", // Resume is a required field
  ]);
  const csv = [headers, ...rows]
    .map((row) => row.map(escapeCsvCell).join(","))
    .join("\r\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `join-our-team-applications-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

const INTERN_PREFERRED_ROLES = [
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
  "Marketing and Tech",
] as const;
import API_BASE from "../../config/api";

export function AdminDashboard() {
  const [authRole, setAuthRole] = useState<"main_admin" | "sub_admin" | null>(null);
  const [authRestored, setAuthRestored] = useState(false);
  const [currentUser, setCurrentUser] = useState<{name: string, username: string} | null>(null);
  const [loginMode, setLoginMode] = useState<"main" | "sub_login" | "sub_request">("main");
  
  // Login States
  const [password, setPassword] = useState(""); // Main Admin
  const [subUsername, setSubUsername] = useState("");
  const [subPassword, setSubPassword] = useState("");
  const [subName, setSubName] = useState("");
  const [subEmail, setSubEmail] = useState("");
  
  const [captcha, setCaptcha] = useState({ q: "", a: 0 });
  const [userCaptcha, setUserCaptcha] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Dashboard States
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error" | "fetching">("idle");
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [fetchMessage, setFetchMessage] = useState("");
  const [activeTab, setActiveTab] = useState<
    "blog" | "verification" | "requests" | "interns" | "consultations" | "taxFilings" | "email" | "confirmations"
  >("blog");
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [allBlogs, setAllBlogs] = useState<any[]>([]);
  const [interns, setInterns] = useState<any[]>([]);
  const [internSearch, setInternSearch] = useState("");
  const [internFilterStatus, setInternFilterStatus] = useState<"all" | "pending" | "selected" | "rejected">("all");
  const [internFilterRole, setInternFilterRole] = useState("all");
  const [internFilterCourse, setInternFilterCourse] = useState("all");
  const [consultations, setConsultations] = useState<any[]>([]);
  const [taxFilings, setTaxFilings] = useState<any[]>([]);
  const [allVerifications, setAllVerifications] = useState<any[]>([]);
  const [confirmations, setConfirmations] = useState<any[]>([]);
  const [expandedSubAdmin, setExpandedSubAdmin] = useState<string | null>(null);
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [selectedIntern, setSelectedIntern] = useState<any | null>(null);

  // Email Broadcaster
  const [emailTo, setEmailTo] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [emailStatus, setEmailStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [emailResult, setEmailResult] = useState("");
  const [internEmailStatus, setInternEmailStatus] = useState("all");

  // Forms
  const [formData, setFormData] = useState({ title: "", excerpt: "", content: "", category: "Technology", author: "", image: "", readTime: "5 min read" });
  const [verificationData, setVerificationData] = useState({ id: "", name: "", institute: "", joinDate: "", endDate: "", role: "", remarks: "" });
  const [uploadingImage, setUploadingImage] = useState(false);

  const generateCaptcha = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptcha({ q: result, a: 0 }); 
  };

  useEffect(() => {
    document.title = "Admin Dashboard | Finovert";
    generateCaptcha();

    const session = readAdminSession();
    if (session) {
      setAuthRole(session.role);
      setCurrentUser(session.user);
      if (session.role === "sub_admin") {
        setFormData((prev) => ({ ...prev, author: session.user.name }));
        setActiveTab("blog");
      }
    }
    setAuthRestored(true);
  }, []);

  const handleLogout = () => {
    clearAdminSession();
    setAuthRole(null);
    setCurrentUser(null);
    setPassword("");
    setSubUsername("");
    setSubPassword("");
    setUserCaptcha("");
    setError("");
    setSuccessMsg("");
    setLoginMode("main");
    generateCaptcha();
  };

  const fetchPendingRequests = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/subadmins/requests`);
      if (res.ok) setPendingRequests(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  const fetchVerifications = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/verifications`);
      if (res.ok) {
        const data = await res.json();
        setAllVerifications(data);
        // Refresh the ID to stay sequential with current count
        setVerificationData(prev => ({ ...prev, id: generateVerificationId() }));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const generateVerificationId = () => {
    const randomNum = Math.floor(100000 + Math.random() * 900000); // Random 6-digit number
    return `FINT/INT/${randomNum}`;
  };

  const fetchAllBlogs = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/blogs`);
      if (res.ok) setAllBlogs(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  const fetchInterns = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/internships`);
      if (res.ok) setInterns(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  const fetchConsultations = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/consultations`);
      if (res.ok) setConsultations(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  const fetchTaxFilings = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/tax-filings`);
      if (res.ok) setTaxFilings(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  const fetchConfirmations = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/confirmations`);
      if (res.ok) setConfirmations(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsFetchingData(true);
      try {
        const promises = [];
        if (authRole) promises.push(fetchAllBlogs());
        if (authRole === "main_admin") {
          if (activeTab === "requests") promises.push(fetchPendingRequests());
          if (activeTab === "interns") promises.push(fetchInterns());
          if (activeTab === "consultations") promises.push(fetchConsultations());
          if (activeTab === "taxFilings") promises.push(fetchTaxFilings());
          if (activeTab === "verification") promises.push(fetchVerifications());
          if (activeTab === "confirmations") promises.push(fetchConfirmations());
        }
        await Promise.all(promises);
      } finally {
        setIsFetchingData(false);
      }
    };
    if (authRole) loadData();
  }, [authRole, activeTab]);

  const internCourseOptions = useMemo(() => {
    const courses = new Set<string>();
    interns.forEach((i) => {
      if (i.course) courses.add(i.course);
    });
    return Array.from(courses).sort();
  }, [interns]);

  const filteredInterns = useMemo(() => {
    const q = internSearch.trim().toLowerCase();
    return interns.filter((intern) => {
      const status = intern.status || "pending";
      if (internFilterStatus !== "all" && status !== internFilterStatus) return false;
      if (internFilterRole !== "all" && intern.preferredRole !== internFilterRole) return false;
      if (internFilterCourse !== "all" && intern.course !== internFilterCourse) return false;
      if (!q) return true;
      const haystack = [
        intern.fullName,
        intern.email,
        intern.phone,
        intern.collegeName,
        intern.course,
        intern.branch,
        intern.preferredRole,
        intern.eligibilityReason,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [interns, internSearch, internFilterStatus, internFilterRole, internFilterCourse]);

  const clearInternFilters = () => {
    setInternSearch("");
    setInternFilterStatus("all");
    setInternFilterRole("all");
    setInternFilterCourse("all");
  };

  const handleExportInterns = () => {
    if (interns.length === 0) {
      alert("No applications to export.");
      return;
    }
    exportInternsToExcel(interns);
  };

  const handleInternStatus = async (id: string, newStatus: 'selected' | 'rejected') => {
    try {
      const res = await fetch(`${API_BASE}/api/internships/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) fetchInterns();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDownload = (e: React.MouseEvent, url: string, filename: string) => {
    e.preventDefault();
    if (!url) return;
    
    try {
      if (url.startsWith('data:')) {
        // Convert base64 to blob to prevent browser crashing or about:blank on large data URLs
        const arr = url.split(',');
        const mime = arr[0].match(/:(.*?);/)?.[1] || '';
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        const blob = new Blob([u8arr], { type: mime });
        const blobUrl = URL.createObjectURL(blob);
        
        // Infer extension
        let ext = "";
        if (mime === "image/jpeg") ext = ".jpg";
        else if (mime === "image/png") ext = ".png";
        else if (mime === "application/pdf") ext = ".pdf";
        else if (mime.includes("word")) ext = ".docx";
        
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = filename + ext;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
      } else {
        // Legacy relative URL fix
        const finalUrl = url.startsWith('/') ? `${API_BASE}${url}` : url;
        const a = document.createElement("a");
        a.href = finalUrl;
        // add target blank as fallback for external URLs if download fails
        a.target = "_blank";
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } catch (err) {
      console.error("Download failed:", err);
      window.open(url, '_blank');
    }
  };

  const handleDownloadResume = async (e: React.MouseEvent, internId: string, internName: string) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/api/internships/${internId}/resume`);
      if (!res.ok) throw new Error("Failed to fetch resume");
      const data = await res.json();
      const url = data.resumeUrl;
      handleDownload(e, url, `${internName.replace(/\s+/g, '_')}_Resume`);
    } catch (err) {
      console.error(err);
      alert("Could not download resume.");
    }
  };

  const handleMainLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    if (userCaptcha.toUpperCase() !== captcha.q) {
      setError("CAPTCHA verification failed.");
      generateCaptcha();
      setUserCaptcha("");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/auth/main-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok) {
        const user = { name: "Main Admin", username: "admin" };
        setAuthRole("main_admin");
        setCurrentUser(user);
        saveAdminSession("main_admin", user);
        setPassword("");
        setUserCaptcha("");
        setError("");
      } else {
        setError(data.message || "Login failed.");
        generateCaptcha();
      }
    } catch (err) {
      setError("Server connection failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubAdminRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (subUsername.length > 16) return setError("Username must be max 16 characters.");
    if (subPassword.length < 8) return setError("Password must be at least 8 characters.");
    
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/subadmins/request`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: subName, username: subUsername, password: subPassword, email: subEmail })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccessMsg("Request sent! Wait for main admin approval.");
        setError("");
        setSubName(""); setSubUsername(""); setSubPassword(""); setSubEmail("");
        // Refresh immediately in same page as requested
        setTimeout(() => window.location.reload(), 1500);
      } else {
        setError(data.message || "Failed to request access.");
      }
    } catch {
      setError("Server error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/subadmins/login`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: subUsername, password: subPassword })
      });
      const data = await res.json();
      if (res.ok) {
        setAuthRole("sub_admin");
        setCurrentUser(data.user);
        saveAdminSession("sub_admin", data.user);
        setFormData(prev => ({ ...prev, author: data.user.name }));
        setActiveTab("blog"); // Sub-admins only see blogs
        setSubPassword("");
        setError("");
      } else {
        setError(data.message);
      }
    } catch {
      setError("Server error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestAction = async (id: string, action: 'approved' | 'rejected') => {
    try {
      await fetch(`${API_BASE}/api/subadmins/requests/${id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: action })
      });
      fetchPendingRequests();
    } catch (e) {
      console.error(e);
    }
  };

  const handleEditClick = (blog: any) => {
    setEditingBlogId(blog._id);
    setFormData({
      title: blog.title,
      excerpt: blog.excerpt,
      content: blog.content,
      category: blog.category || "Technology",
      author: blog.author,
      image: blog.image,
      readTime: blog.readTime || "5 min read",
    });
    setActiveTab("blog");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingBlogId(null);
    setFormData({ title: "", excerpt: "", content: "", category: "Technology", author: currentUser?.name || (authRole === "sub_admin" ? (currentUser?.name || "") : ""), image: "", readTime: "5 min read" });
  };

  // Content Submit Handlers
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const url = editingBlogId ? `${API_BASE}/api/blogs/${editingBlogId}` : `${API_BASE}/api/blogs`;
      const method = editingBlogId ? "PUT" : "POST";

      const response = await fetch(url, {
        method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData),
      });
      if (response.ok) {
        setStatus("success");
        setFetchMessage(editingBlogId ? "Blog successfully updated!" : "Blog successfully published to the live database!");
        handleCancelEdit();
        fetchAllBlogs();
        setTimeout(() => setStatus("idle"), 3000);
      } else setStatus("error");
    } catch { setStatus("error"); }
  };

  const handleDeleteBlog = async (id: string) => {
    if(!confirm("Are you sure you want to permanently delete this blog?")) return;
    try {
      await fetch(`${API_BASE}/api/blogs/${id}`, { method: "DELETE" });
      fetchAllBlogs();
      setStatus("success");
      setFetchMessage("Blog deleted successfully");
      setTimeout(() => setStatus("idle"), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const response = await fetch(`${API_BASE}/api/verifications`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(verificationData),
      });
      if (response.ok) {
        setStatus("success");
        setFetchMessage("Verification record added successfully!");
        setVerificationData({ id: generateVerificationId(), name: "", institute: "", joinDate: "", endDate: "", role: "", remarks: "" });
        fetchVerifications();
        setTimeout(() => setStatus("idle"), 3000);
      } else {
        const err = await response.json();
        setStatus("error");
        setFetchMessage(err.message || "Failed to add record.");
      }
    } catch { setStatus("error"); }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append('image', file);

    setUploadingImage(true);
    try {
      const response = await fetch(`${API_BASE}/api/upload`, {
        method: 'POST',
        body: formDataUpload
      });
      if (response.ok) {
        const imagePath = await response.text();
        // Server returns a full data URL (base64), no need to prefix API_BASE
        setFormData(prev => ({ ...prev, image: imagePath }));
      } else {
        alert('Failed to upload image');
      }
    } catch (error) {
      console.error(error);
      alert('Error uploading image');
    } finally {
      setUploadingImage(false);
    }
  };

  if (!authRestored) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!authRole) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full border border-gray-100">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8" />
          </div>
          
          <div className="flex gap-2 bg-gray-100 p-1 rounded-lg mb-6">
            <button onClick={() => { setLoginMode("main"); setError(""); setSuccessMsg(""); }} className={`flex-1 py-2 rounded-md text-sm font-semibold transition-all ${loginMode === "main" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}>Main Admin</button>
            <button onClick={() => { setLoginMode("sub_login"); setError(""); setSuccessMsg(""); }} className={`flex-1 py-2 rounded-md text-sm font-semibold transition-all ${loginMode !== "main" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}>Sub-Admin</button>
          </div>

          {loginMode === "main" && (
            <form onSubmit={handleMainLogin} className="space-y-4">
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Master Password" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none" required />
              <div className="flex items-center gap-4 border border-gray-200 rounded-xl p-3 bg-[#f9f9f9]">
                <div className="font-bold tracking-widest text-lg italic text-gray-700 bg-white px-4 py-2 rounded select-none shadow-inner border border-gray-100">{captcha.q}</div>
                <input type="text" value={userCaptcha} onChange={(e) => setUserCaptcha(e.target.value)} placeholder="Type CAPTCHA" className="w-full px-3 py-2 bg-white border border-gray-300 rounded outline-none" required />
              </div>
              <button disabled={isSubmitting} type="submit" className="w-full bg-gray-900 text-white font-semibold py-3 rounded-xl hover:bg-gray-800 disabled:opacity-70">
                {isSubmitting ? "Unlocking..." : "Unlock Dashboard"}
              </button>
            </form>
          )}

          {loginMode !== "main" && (
            <div className="space-y-4">
              <div className="flex gap-4 text-sm font-medium mb-2 border-b pb-2">
                <button onClick={() => { setLoginMode("sub_login"); setError(""); setSuccessMsg(""); }} className={loginMode === "sub_login" ? "text-blue-600 border-b-2 border-blue-600 pb-1" : "text-gray-500"}>Login</button>
                <button onClick={() => { setLoginMode("sub_request"); setError(""); setSuccessMsg(""); }} className={loginMode === "sub_request" ? "text-blue-600 border-b-2 border-blue-600 pb-1" : "text-gray-500"}>Request Access</button>
              </div>

              {loginMode === "sub_login" ? (
                <form onSubmit={handleSubAdminLogin} className="space-y-4">
                  <input type="text" value={subUsername} onChange={(e) => setSubUsername(e.target.value)} placeholder="Username" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none" required />
                  <input type="password" value={subPassword} onChange={(e) => setSubPassword(e.target.value)} placeholder="Password" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none" required />
                  <button disabled={isSubmitting} type="submit" className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 disabled:opacity-70">
                    {isSubmitting ? "Logging in..." : "Login"}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleSubAdminRequest} className="space-y-4">
                  <input type="text" value={subName} onChange={(e) => setSubName(e.target.value)} placeholder="Your Full Name" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none" required />
                  <input type="email" value={subEmail} onChange={(e) => setSubEmail(e.target.value)} placeholder="Your Email Address" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none" required />
                  <input type="text" value={subUsername} onChange={(e) => setSubUsername(e.target.value.replace(/\s/g, ''))} maxLength={16} placeholder="Username (max 16 chars)" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none" required />
                  <input type="password" value={subPassword} onChange={(e) => setSubPassword(e.target.value)} placeholder="Password (min 8 chars)" minLength={8} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none" required />
                  <button disabled={isSubmitting} type="submit" className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 disabled:opacity-70">
                    {isSubmitting ? "Sending Request..." : "Send Request to Admin"}
                  </button>
                </form>
              )}
            </div>
          )}

          {error && <p className="mt-4 text-red-500 text-sm font-semibold text-center">{error}</p>}
          {successMsg && <p className="mt-4 text-green-600 text-sm font-semibold text-center">{successMsg}</p>}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-6 pb-12">
      <div className={`w-full max-w-full ${activeTab === "interns" ? "px-2 sm:px-3" : "px-3 sm:px-4 lg:px-6"}`}>
        
        <div className="sticky top-0 z-40 -mx-3 sm:-mx-4 lg:-mx-6 px-3 sm:px-4 lg:px-6 py-2.5 mb-4 bg-gray-50/95 backdrop-blur-md border-b border-gray-200/80">
          <div className="flex items-center gap-3 min-w-0">
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2 shrink-0 whitespace-nowrap">
              <Lock className="w-5 h-5 text-blue-600 shrink-0" />
              <span className="hidden sm:inline">
                {authRole === "main_admin" ? "Master Portal" : `Writer Portal — ${currentUser?.name}`}
              </span>
              <span className="sm:hidden">{authRole === "main_admin" ? "Portal" : "Writer"}</span>
            </h1>

            <div className="flex items-center gap-2 min-w-0 flex-1 justify-end overflow-x-auto">
              {authRole === "main_admin" && (
                <div className="flex gap-1 bg-white p-1 rounded-lg shadow-sm border border-gray-200 shrink-0">
                  {([
                    ["blog", FileText, "Blogs"],
                    ["verification", BadgeCheck, "Verify"],
                    ["requests", Users, "Team"],
                    ["interns", Briefcase, "Join Our Team"],
                    ["consultations", PhoneCall, "Consultations"],
                    ["taxFilings", Receipt, "Tax Filing"],
                    ["email", Mail, "Email"],
                    ["confirmations", CheckSquare, "Confirmations"],
                  ] as const).map(([tab, Icon, label]) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      className={`px-2.5 py-1.5 rounded-md font-medium text-xs flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                        activeTab === tab
                          ? "bg-blue-600 text-white shadow-sm"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      {label}
                    </button>
                  ))}
                </div>
              )}
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-red-50 text-red-600 border border-red-200 text-xs font-semibold hover:bg-red-100 transition-colors whitespace-nowrap shrink-0"
              >
                <LogOut className="w-3.5 h-3.5" /> Logout
              </button>
            </div>
          </div>
        </div>

        {status === "success" && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 text-green-700 font-medium"><CheckCircle className="w-6 h-6" /> {fetchMessage}</motion.div>}
        {status === "error" && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 font-medium"><AlertCircle className="w-6 h-6" /> {fetchMessage || "An error occurred."}</motion.div>}

        {isFetchingData && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-center gap-3 text-blue-700 font-medium shadow-sm">
            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            Loading latest data...
          </motion.div>
        )}

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`bg-white shadow-sm border border-gray-200 w-full ${
            activeTab === "interns" ? "rounded-2xl p-3 sm:p-4" : "rounded-3xl p-8"
          }`}
        >
          
          {activeTab === "blog" && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><FileText className="w-5 h-5 text-blue-600" /> {editingBlogId ? "Edit Blog Post" : "Publish New Blog"}</h2>
                {editingBlogId && (
                  <button type="button" onClick={handleCancelEdit} className="text-sm font-semibold text-gray-500 hover:text-gray-700 bg-gray-100 px-3 py-1.5 rounded-lg">Cancel Edit</button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input required type="text" name="title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none" placeholder="Blog Title" />
                <input required readOnly={authRole === "sub_admin"} type="text" name="author" value={formData.author} onChange={(e) => setFormData({...formData, author: e.target.value})} className={`w-full px-4 py-3 rounded-xl border border-gray-200 outline-none ${authRole === "sub_admin" ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""}`} placeholder="Author Name" />
              </div>
              <input required type="text" name="excerpt" value={formData.excerpt} onChange={(e) => setFormData({...formData, excerpt: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none" placeholder="Short Excerpt" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <select name="category" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none bg-white">
                  <option value="Technology">Technology</option>
                  <option value="Finance">Finance</option>
                  <option value="Company News">Company News</option>
                </select>
                <input required type="text" name="readTime" value={formData.readTime} onChange={(e) => setFormData({...formData, readTime: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none" placeholder="e.g. 5 min read" />
                <div className="relative">
                  <input required type="text" name="image" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none pr-[110px]" placeholder="Image URL" />
                  <div className="absolute inset-y-0 right-2 flex items-center">
                    <input type="file" id="image-upload" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    <label htmlFor="image-upload" className="cursor-pointer text-xs font-bold bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors whitespace-nowrap">
                      {uploadingImage ? "Uploading..." : "Upload File"}
                    </label>
                  </div>
                </div>
              </div>
              <textarea required name="content" value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} rows={10} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none resize-none" placeholder="Write full content here..."></textarea>
              <button disabled={status === "loading"} type="submit" className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700">{editingBlogId ? "Update Blog" : "Publish Blog"}</button>
            </form>
          )}

          {authRole === "sub_admin" && activeTab === "blog" && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2"><FileText className="w-5 h-5 text-blue-600" /> My Published Blogs</h2>
              {allBlogs.filter(b => b.author === currentUser?.name).length === 0 ? (
                <p className="text-gray-500 italic">You haven't published any blogs yet.</p>
              ) : (
                <div className="space-y-3">
                  {allBlogs.filter(b => b.author === currentUser?.name).map(blog => (
                    <div key={blog._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-200 rounded-xl bg-white shadow-sm gap-4">
                      <div className="truncate pr-4 flex-1">
                        <p className="font-bold text-gray-900 truncate">{blog.title}</p>
                        <p className="text-sm text-gray-500">{new Date(blog.createdAt).toLocaleDateString()} • {blog.category}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <a href={`/blog/${blog.slug}`} target="_blank" rel="noreferrer" className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-200">View</a>
                        <button onClick={() => handleEditClick(blog)} className="px-3 py-1.5 bg-blue-50 text-blue-600 text-sm font-semibold rounded-lg hover:bg-blue-100">Edit</button>
                        <button onClick={() => handleDeleteBlog(blog._id)} className="px-3 py-1.5 bg-red-50 text-red-600 text-sm font-semibold rounded-lg hover:bg-red-100">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {authRole === "main_admin" && activeTab === "verification" && (
            <div className="space-y-10">
              {/* ── Form ── */}
              <form onSubmit={handleVerificationSubmit} className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-4"><BadgeCheck className="w-5 h-5 text-blue-600" /> Add Official Record</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Auto-generated ID — read-only with a refresh button */}
                  <div className="relative">
                    <input required readOnly type="text" name="id" value={verificationData.id} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none uppercase bg-blue-50 font-mono text-blue-700 font-bold pr-28" placeholder="Auto-generated ID" />
                    <button type="button" onClick={() => setVerificationData(prev => ({ ...prev, id: generateVerificationId() }))} className="absolute inset-y-0 right-2 my-auto text-xs font-bold bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg hover:bg-blue-200 transition-colors whitespace-nowrap">Regenerate</button>
                  </div>
                  <input required type="text" name="name" value={verificationData.name} onChange={(e) => setVerificationData({...verificationData, name: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none" placeholder="Full Name" />
                  <input type="text" name="institute" value={verificationData.institute} onChange={(e) => setVerificationData({...verificationData, institute: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none" placeholder="Institute" />
                  <input required type="text" name="role" value={verificationData.role} onChange={(e) => setVerificationData({...verificationData, role: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none" placeholder="Role" />
                  <input required type="text" name="joinDate" value={verificationData.joinDate} onChange={(e) => setVerificationData({...verificationData, joinDate: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none" placeholder="Join Date (e.g. Jan 2024)" />
                  <input type="text" name="endDate" value={verificationData.endDate} onChange={(e) => setVerificationData({...verificationData, endDate: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none" placeholder="End Date (leave blank if ongoing)" />
                </div>
                <textarea required name="remarks" value={verificationData.remarks} onChange={(e) => setVerificationData({...verificationData, remarks: e.target.value})} rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none resize-none" placeholder="Remarks (e.g. Completed internship successfully)"></textarea>
                <button disabled={status === "loading"} type="submit" className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 disabled:opacity-70">
                  {status === "loading" ? "Saving..." : "Add Record"}
                </button>
              </form>

              {/* ── All Records List ── */}
              <div className="pt-8 border-t border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><BadgeCheck className="w-5 h-5 text-green-600" /> All Verification Records ({allVerifications.length})</h2>
                  <button onClick={fetchVerifications} className="text-sm font-semibold text-gray-500 hover:text-gray-700 bg-gray-100 px-3 py-1.5 rounded-lg">Refresh</button>
                </div>
                {allVerifications.length === 0 ? (
                  <div className="bg-gray-50 border border-dashed border-gray-200 rounded-2xl py-12 text-center">
                    <p className="text-gray-400 italic">No records found. New records will appear here automatically.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {allVerifications.map(v => (
                      <div key={v._id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-6 group">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-mono text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100 uppercase tracking-tight">{v.id}</span>
                            <h3 className="font-bold text-gray-900">{v.name}</h3>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mt-3">
                            <p className="text-xs text-gray-600 flex items-center gap-2"><Briefcase className="w-3 h-3 text-gray-400" /> <span className="font-semibold text-gray-800">{v.role}</span></p>
                            <p className="text-xs text-gray-600 flex items-center gap-2"><Building className="w-3 h-3 text-gray-400" /> {v.institute || 'N/A'}</p>
                            <p className="text-xs text-gray-600 flex items-center gap-2"><Calendar className="w-3 h-3 text-gray-400" /> {v.joinDate} — {v.endDate || 'Present'}</p>
                            <p className="text-xs text-gray-500 italic flex items-center gap-2 truncate max-w-[250px]"><FileText className="w-3 h-3 text-gray-400" /> {v.remarks}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 sm:border-l border-gray-50 sm:pl-6">
                          <button onClick={() => {
                            const text = `Verification ID: ${v.id}\nName: ${v.name}\nRole: ${v.role}\nVerify at: https://finovert.com/verification`;
                            navigator.clipboard.writeText(text);
                            alert("Copy success!");
                          }} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all" title="Copy Details">
                            <RefreshCw className="w-4 h-4" />
                          </button>
                          <button onClick={async () => {
                            if (confirm(`Are you sure you want to delete the record for ${v.name}?`)) {
                              const res = await fetch(`${API_BASE}/api/verifications/${v._id}`, { method: 'DELETE' });
                              if (res.ok) fetchVerifications();
                            }
                          }} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all" title="Delete Record">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {authRole === "main_admin" && activeTab === "requests" && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4"><Users className="w-5 h-5 text-blue-600" /> Manage Sub-Admins</h2>
              {pendingRequests.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No sub-admins found.</p>
              ) : (
                <div className="space-y-4">
                  {pendingRequests.map(req => (
                    <div key={req._id} className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
                      <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50 gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-bold text-gray-900">{req.name}</p>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${req.status === 'approved' ? 'bg-green-100 text-green-700' : req.status === 'rejected' ? 'bg-gray-200 text-gray-600' : 'bg-amber-100 text-amber-700'}`}>{req.status}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-blue-100 text-blue-700">Blogs: {allBlogs.filter(b => b.author === req.name).length}</span>
                          </div>
                          <p className="text-sm text-gray-500">Username: <span className="font-mono text-gray-700 bg-white px-1.5 py-0.5 rounded border border-gray-200">{req.username}</span></p>
                          <p className="text-sm text-gray-500 mt-1">Password: <span className="font-mono text-gray-700 bg-white px-1.5 py-0.5 rounded border border-gray-200">{req.password}</span></p>
                          <p className="text-xs text-gray-400 flex items-center gap-1 mt-2"><Clock className="w-3 h-3" /> Added on {new Date(req.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="flex flex-wrap gap-2 md:justify-end items-center">
                          <button onClick={() => setExpandedSubAdmin(expandedSubAdmin === req._id ? null : req._id)} className="px-4 py-2 bg-blue-50 text-blue-600 text-sm font-semibold rounded-lg hover:bg-blue-100 transition-colors">
                            {expandedSubAdmin === req._id ? "Hide Blogs" : "View Blogs"}
                          </button>
                          {req.status !== 'approved' && (
                            <button onClick={() => handleRequestAction(req._id, 'approved')} className="px-4 py-2 bg-green-100 text-green-700 text-sm font-semibold rounded-lg hover:bg-green-200 transition-colors">Approve</button>
                          )}
                          {req.status !== 'rejected' && (
                            <button onClick={() => handleRequestAction(req._id, 'rejected')} className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-300 transition-colors">Reject</button>
                          )}
                          <button onClick={async () => {
                            if(confirm("Are you sure you want to permanently delete this sub-admin?")) {
                              await fetch(`${API_BASE}/api/subadmins/requests/${req._id}`, { method: "DELETE" });
                              fetchPendingRequests();
                            }
                          }} className="px-4 py-2 bg-red-100 text-red-700 text-sm font-semibold rounded-lg hover:bg-red-200 transition-colors">Delete Sub-Admin</button>
                        </div>
                      </div>
                      
                      {expandedSubAdmin === req._id && (
                        <div className="p-4 bg-white border-t border-gray-200">
                          <h4 className="font-bold text-sm text-gray-700 mb-3">Blogs Published by {req.name}</h4>
                          {allBlogs.filter(b => b.author === req.name).length === 0 ? (
                            <p className="text-sm text-gray-500 italic">No blogs published yet.</p>
                          ) : (
                            <div className="space-y-2">
                              {allBlogs.filter(b => b.author === req.name).map(blog => (
                                <div key={blog._id} className="flex items-center justify-between p-3 border border-gray-100 rounded bg-gray-50">
                                  <div className="truncate pr-4 flex-1">
                                    <p className="font-semibold text-sm text-gray-900 truncate">{blog.title}</p>
                                    <p className="text-xs text-gray-500">{new Date(blog.createdAt).toLocaleDateString()}</p>
                                  </div>
                                  <div className="flex gap-2">
                                    <a href={`/blog/${blog.slug}`} target="_blank" rel="noreferrer" className="text-gray-600 hover:text-gray-800 text-xs font-bold px-2 py-1 bg-gray-100 rounded border border-gray-200 whitespace-nowrap">View</a>
                                    <button onClick={() => handleEditClick(blog)} className="text-blue-600 hover:text-blue-800 text-xs font-bold px-2 py-1 bg-blue-50 rounded border border-blue-100 whitespace-nowrap">Edit</button>
                                    <button onClick={() => handleDeleteBlog(blog._id)} className="text-red-500 hover:text-red-700 text-xs font-bold px-2 py-1 bg-red-50 rounded border border-red-100 whitespace-nowrap">Delete</button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {authRole === "main_admin" && activeTab === "interns" && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 border-b border-gray-100 pb-4">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-blue-600" /> Join Our Team Applications
                </h2>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleExportInterns}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-green-700 bg-green-50 border border-green-200 rounded-xl hover:bg-green-100 transition-colors"
                  >
                    <FileSpreadsheet className="w-4 h-4" /> Export Excel
                  </button>
                  <button
                    type="button"
                    onClick={fetchInterns}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" /> Refresh
                  </button>
                </div>
              </div>

              {/* Filters — single row */}
              <div className="mb-6 p-4 bg-gray-50 rounded-2xl border border-gray-200">
                <div className="flex flex-wrap items-end gap-3">
                  <div className="flex items-center gap-2 shrink-0 pb-2.5 pr-1">
                    <Filter className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-bold text-gray-800 whitespace-nowrap">Filter</span>
                  </div>
                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Search</label>
                    <div className="relative">
                      <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={internSearch}
                        onChange={(e) => setInternSearch(e.target.value)}
                        placeholder="Name, email, phone, college, role..."
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div className="w-[130px] shrink-0">
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Status</label>
                    <select
                      value={internFilterStatus}
                      onChange={(e) => setInternFilterStatus(e.target.value as typeof internFilterStatus)}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:border-blue-500"
                    >
                      <option value="all">All statuses</option>
                      <option value="pending">Pending</option>
                      <option value="selected">Selected</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                  <div className="w-[150px] shrink-0">
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Preferred role</label>
                    <select
                      value={internFilterRole}
                      onChange={(e) => setInternFilterRole(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:border-blue-500"
                    >
                      <option value="all">All roles</option>
                      {INTERN_PREFERRED_ROLES.map((role) => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  </div>
                  <div className="w-[130px] shrink-0">
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Course</label>
                    <select
                      value={internFilterCourse}
                      onChange={(e) => setInternFilterCourse(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:border-blue-500"
                    >
                      <option value="all">All courses</option>
                      {internCourseOptions.map((course) => (
                        <option key={course} value={course}>{course}</option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={clearInternFilters}
                    className="shrink-0 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors whitespace-nowrap"
                  >
                    Clear filters
                  </button>
                  <span className="shrink-0 text-sm text-gray-500 pb-2.5 whitespace-nowrap">
                    Showing <strong className="text-gray-800">{filteredInterns.length}</strong> of <strong className="text-gray-800">{interns.length}</strong>
                  </span>
                </div>
              </div>

              {interns.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No Join Our Team applications yet.</p>
              ) : filteredInterns.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No applications match your filters.</p>
              ) : (
                <div className="w-full rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <table className="w-full table-fixed border-collapse text-xs sm:text-sm bg-white">
                    <thead>
                      <tr className="bg-gray-100 text-gray-700">
                        <th className="w-[3%] px-1.5 py-2 font-semibold border border-gray-200 text-center">S.No.</th>
                        <th className="w-[8%] px-1.5 py-2 font-semibold border border-gray-200">Full Name</th>
                        <th className="w-[7%] px-1.5 py-2 font-semibold border border-gray-200">Phone</th>
                        <th className="w-[10%] px-1.5 py-2 font-semibold border border-gray-200">Email</th>
                        <th className="w-[9%] px-1.5 py-2 font-semibold border border-gray-200">College</th>
                        <th className="w-[6%] px-1.5 py-2 font-semibold border border-gray-200">Course</th>
                        <th className="w-[8%] px-1.5 py-2 font-semibold border border-gray-200">Branch</th>
                        <th className="w-[6%] px-1.5 py-2 font-semibold border border-gray-200">Year</th>
                        <th className="w-[6%] px-1.5 py-2 font-semibold border border-gray-200">Role</th>
                        <th className="w-[12%] px-1.5 py-2 font-semibold border border-gray-200">Why eligible</th>
                        <th className="w-[4%] px-1.5 py-2 font-semibold border border-gray-200 text-center">Resume</th>
                        <th className="w-[4%] px-1.5 py-2 font-semibold border border-gray-200 text-center">Status</th>
                        <th className="w-[6%] px-1.5 py-2 font-semibold border border-gray-200">Applied</th>
                        <th className="w-[11%] px-1.5 py-2 font-semibold border border-gray-200 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredInterns.map((intern, index) => (
                        <tr key={intern._id} className="hover:bg-gray-50 transition-colors align-top">
                          <td className="px-1.5 py-2 text-gray-500 font-medium border border-gray-200 text-center">{index + 1}</td>
                          <td className="px-1.5 py-2 font-semibold text-gray-900 border border-gray-200 break-words">{intern.fullName}</td>
                          <td className="px-1.5 py-2 text-gray-700 border border-gray-200 break-words">{intern.phone}</td>
                          <td className="px-1.5 py-2 text-gray-700 border border-gray-200 break-all">{intern.email}</td>
                          <td className="px-1.5 py-2 text-gray-700 border border-gray-200 break-words">{intern.collegeName || "—"}</td>
                          <td className="px-1.5 py-2 text-gray-700 border border-gray-200 break-words">{intern.course || "—"}</td>
                          <td className="px-1.5 py-2 text-gray-700 border border-gray-200 break-words">{intern.branch || "—"}</td>
                          <td className="px-1.5 py-2 text-blue-700 font-medium border border-gray-200 break-words">{intern.yearOfStudy || "—"}</td>
                          <td className="px-1.5 py-2 border border-gray-200 break-words">
                            {intern.preferredRole ? (
                              <span className="inline-block px-1.5 py-0.5 rounded-lg bg-blue-50 text-blue-800 text-[10px] sm:text-xs font-semibold leading-tight">{intern.preferredRole}</span>
                            ) : (
                              <span className="text-gray-400">—</span>
                            )}
                          </td>
                          <td className="px-1.5 py-2 text-gray-600 border border-gray-200 break-words">
                            {intern.eligibilityReason ? (
                              <p className="line-clamp-3" title={intern.eligibilityReason}>{intern.eligibilityReason}</p>
                            ) : (
                              <span className="text-gray-400 italic text-[10px]">Not provided</span>
                            )}
                          </td>
                          <td className="px-1.5 py-2 border border-gray-200 text-center">
                              <button onClick={(e) => handleDownloadResume(e, intern._id, intern.fullName)} className="inline-flex items-center justify-center text-blue-600 hover:bg-blue-50 rounded-lg p-1 transition-colors" title="Download Resume">
                                <Download className="w-4 h-4" />
                              </button>
                          </td>
                          <td className="px-1.5 py-2 border border-gray-200 text-center">
                            <span className={`w-6 h-6 inline-flex items-center justify-center rounded-full ${intern.status === 'selected' ? 'bg-green-100 text-green-700' : intern.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`} title={intern.status || 'pending'}>
                              {intern.status === 'selected' ? <Check className="w-3.5 h-3.5" /> : intern.status === 'rejected' ? <XCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                            </span>
                          </td>
                          <td className="px-1.5 py-2 text-gray-500 border border-gray-200 break-words text-[10px] sm:text-xs">
                            {intern.createdAt ? new Date(intern.createdAt).toLocaleDateString() : "—"}
                          </td>
                          <td className="px-1 py-2 border border-gray-200">
                            <div className="flex justify-center flex-wrap gap-1">
                              <button onClick={() => setSelectedIntern(intern)} className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Details">
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              {intern.status !== 'selected' && (
                                <button onClick={() => handleInternStatus(intern._id, 'selected')} className="p-1 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Select">
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                              )}
                              {intern.status !== 'rejected' && (
                                <button onClick={() => handleInternStatus(intern._id, 'rejected')} className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Reject">
                                  <XCircle className="w-3.5 h-3.5" />
                                </button>
                              )}
                              <button onClick={async () => {
                                if (confirm("Delete this application permanently?")) {
                                  await fetch(`${API_BASE}/api/internships/${intern._id}`, { method: "DELETE" });
                                  fetchInterns();
                                }
                              }} className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {selectedIntern && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                  <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
                    <div className="flex items-center justify-between p-6 border-b border-gray-100">
                      <h3 className="text-xl font-bold text-gray-900">Application Details</h3>
                      <button onClick={() => setSelectedIntern(null)} className="text-gray-400 hover:text-gray-600"><XCircle className="w-6 h-6" /></button>
                    </div>
                    <div className="p-6 overflow-y-auto space-y-4 text-sm text-gray-700">
                      <div className="grid grid-cols-2 gap-4">
                        <div><span className="font-semibold text-gray-900">Full Name:</span> {selectedIntern.fullName}</div>
                        <div><span className="font-semibold text-gray-900">Phone:</span> {selectedIntern.phone}</div>
                        <div><span className="font-semibold text-gray-900">Email:</span> {selectedIntern.email}</div>
                        <div><span className="font-semibold text-gray-900">College:</span> {selectedIntern.collegeName || "—"}</div>
                        <div><span className="font-semibold text-gray-900">Course:</span> {selectedIntern.course || "—"}</div>
                        <div><span className="font-semibold text-gray-900">Branch:</span> {selectedIntern.branch || "—"}</div>
                        <div><span className="font-semibold text-gray-900">Year of Study:</span> {selectedIntern.yearOfStudy || "—"}</div>
                        <div><span className="font-semibold text-gray-900">Preferred Role:</span> {selectedIntern.preferredRole || "—"}</div>
                        <div><span className="font-semibold text-gray-900">Status:</span> {selectedIntern.status || "pending"}</div>
                        <div><span className="font-semibold text-gray-900">Applied Date:</span> {selectedIntern.createdAt ? new Date(selectedIntern.createdAt).toLocaleString() : "—"}</div>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-900 block mb-1">Why eligible:</span>
                        <p className="bg-gray-50 p-3 rounded-lg border border-gray-200">{selectedIntern.eligibilityReason || "Not provided"}</p>
                      </div>
                      <div>
                        <button onClick={(e) => handleDownloadResume(e, selectedIntern._id, selectedIntern.fullName)} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 font-semibold rounded-xl hover:bg-blue-100 transition-colors">
                          <Download className="w-4 h-4" /> Download Resume
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {authRole === "main_admin" && activeTab === "taxFilings" && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
                <Receipt className="w-5 h-5 text-blue-600" /> Tax Filing (Chat)
              </h2>
              {taxFilings.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No tax filing submissions yet.</p>
              ) : (
                <div className="overflow-x-auto rounded-xl shadow-sm">
                  <table className="w-full min-w-max text-left border-collapse whitespace-nowrap border border-gray-200 bg-white">
                    <thead>
                      <tr className="bg-gray-100 text-gray-700 text-sm">
                        <th className="w-12 px-4 py-3 font-semibold border border-gray-200 text-center">S.No.</th>
                        <th className="px-4 py-3 font-semibold border border-gray-200">PAN</th>
                        <th className="px-4 py-3 font-semibold border border-gray-200">Email</th>
                        <th className="px-4 py-3 font-semibold border border-gray-200">Income Sources</th>
                        <th className="px-4 py-3 font-semibold border border-gray-200">Plan</th>
                        <th className="px-4 py-3 font-semibold border border-gray-200">Total (Rs)</th>
                        <th className="px-4 py-3 font-semibold border border-gray-200">Payment</th>
                        <th className="px-4 py-3 font-semibold border border-gray-200">Date</th>
                        <th className="px-4 py-3 font-semibold text-right border border-gray-200">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {taxFilings.map((row, index) => (
                        <tr key={row._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-sm text-gray-500 font-medium border border-gray-200 text-center">
                            {index + 1}
                          </td>
                          <td className="px-4 py-3 text-sm font-semibold text-gray-900 border border-gray-200">
                            {row.pan}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700 border border-gray-200">{row.email}</td>
                          <td className="px-4 py-3 text-sm text-gray-700 border border-gray-200 max-w-[220px] whitespace-normal">
                            {Array.isArray(row.incomeSources) ? row.incomeSources.join(", ") : "—"}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700 border border-gray-200">{row.planName}</td>
                          <td className="px-4 py-3 text-sm text-gray-700 border border-gray-200">{row.totalAmount}</td>
                          <td className="px-4 py-3 text-sm border border-gray-200">
                            <span
                              className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${
                                row.paymentStatus === "paid"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {row.paymentStatus === "paid" ? "Paid" : "Pending"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500 border border-gray-200">
                            {new Date(row.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 text-right border border-gray-200">
                            <button
                              type="button"
                              onClick={async () => {
                                if (confirm("Delete this tax filing record?")) {
                                  const res = await fetch(`${API_BASE}/api/tax-filings/${row._id}`, {
                                    method: "DELETE",
                                  });
                                  if (res.ok) fetchTaxFilings();
                                }
                              }}
                              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors inline-flex"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {authRole === "main_admin" && activeTab === "consultations" && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4"><PhoneCall className="w-5 h-5 text-blue-600" /> Consultation Requests</h2>
              {consultations.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No consultation requests found.</p>
              ) : (
                <div className="overflow-x-auto rounded-xl shadow-sm">
                  <table className="w-full min-w-max text-left border-collapse whitespace-nowrap border border-gray-200 bg-white">
                    <thead>
                      <tr className="bg-gray-100 text-gray-700 text-sm">
                        <th className="w-12 px-4 py-3 font-semibold border border-gray-200 text-center">S.No.</th>
                        <th className="px-4 py-3 font-semibold border border-gray-200">Name</th>
                        <th className="px-4 py-3 font-semibold border border-gray-200">Contact</th>
                        <th className="px-4 py-3 font-semibold border border-gray-200">Business Type</th>
                        <th className="px-4 py-3 font-semibold border border-gray-200">Date</th>
                        <th className="px-4 py-3 font-semibold text-right border border-gray-200">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {consultations.map((lead, index) => (
                        <tr key={lead._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-sm text-gray-500 font-medium border border-gray-200 text-center">{index + 1}</td>
                          <td className="px-4 py-3 text-sm font-semibold text-gray-900 border border-gray-200">{lead.name}</td>
                          <td className="px-4 py-3 text-sm text-gray-700 border border-gray-200">{lead.contact}</td>
                          <td className="px-4 py-3 text-sm text-gray-700 border border-gray-200">{lead.businessType}</td>
                          <td className="px-4 py-3 text-sm text-gray-500 border border-gray-200">{new Date(lead.createdAt).toLocaleDateString()}</td>
                          <td className="px-4 py-3 text-right border border-gray-200">
                            <button
                              onClick={async () => {
                                if (confirm("Delete this consultation request?")) {
                                  const res = await fetch(`${API_BASE}/api/consultations/${lead._id}`, { method: "DELETE" });
                                  if (res.ok) fetchConsultations();
                                }
                              }}
                              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors inline-flex"
                              title="Delete Request"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {authRole === "main_admin" && activeTab === "email" && (() => {
            const sendEmailAction = async (endpoint: string, payload: object) => {
              setEmailStatus("loading"); setEmailResult("");
              try {
                const res = await fetch(`${API_BASE}/api/email/${endpoint}`, {
                  method: "POST", headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(payload)
                });
                const data = await res.json();
                if (res.ok) { 
                  setEmailStatus("success"); 
                  setEmailResult(data.message); 
                  alert(data.message);
                }
                else { 
                  setEmailStatus("error"); 
                  setEmailResult(data.message || "Failed to send."); 
                  alert(data.message || "Failed to send.");
                }
              } catch { 
                setEmailStatus("error"); 
                setEmailResult("Network error."); 
                alert("Network error.");
              }
              setTimeout(() => setEmailStatus("idle"), 5000);
            };

            return (
              <div className="space-y-10">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-4"><Mail className="w-5 h-5 text-blue-600" /> Email Broadcaster</h2>

                {emailStatus === "success" && <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 text-green-700 font-semibold"><CheckCircle className="w-5 h-5 flex-shrink-0" />{emailResult}</div>}
                {emailStatus === "error" && <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 font-semibold"><AlertCircle className="w-5 h-5 flex-shrink-0" />{emailResult}</div>}

                {/* Common message fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Subject</label>
                    <input type="text" value={emailSubject} onChange={e => setEmailSubject(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500" placeholder="e.g. Important Update from Finovert" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Message Body</label>
                    <textarea rows={5} value={emailMessage} onChange={e => setEmailMessage(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 resize-none" placeholder="Type your message here..." />
                  </div>
                </div>

                {/* Section 1: Individual */}
                <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Mail className="w-4 h-4 text-blue-500" /> Send to Individual</h3>
                  <div className="flex gap-3">
                    <input type="email" value={emailTo} onChange={e => setEmailTo(e.target.value)} className="flex-1 px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500" placeholder="recipient@example.com" />
                    <button disabled={emailStatus === "loading" || !emailTo || !emailMessage} onClick={() => sendEmailAction("send", { to: emailTo, subject: emailSubject, message: emailMessage })} className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50 whitespace-nowrap">Send</button>
                  </div>
                </div>

                {/* Section 2: Broadcast */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-green-50 rounded-2xl border border-green-200 p-6 flex flex-col">
                    <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2"><Users className="w-4 h-4 text-green-600" /> All Sub-Admins</h3>
                    <p className="text-sm text-gray-500 flex-1 mb-4">Send to all writers who have provided their email.</p>
                    <button disabled={emailStatus === "loading" || !emailMessage} onClick={() => sendEmailAction("broadcast/subadmins", { subject: emailSubject, message: emailMessage })} className="w-full py-2.5 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 disabled:opacity-50 text-sm">Broadcast to Sub-Admins</button>
                  </div>
                  <div className="bg-blue-50 rounded-2xl border border-blue-200 p-6 flex flex-col">
                    <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2"><Briefcase className="w-4 h-4 text-blue-600" /> All Intern Applicants</h3>
                    <p className="text-sm text-gray-500 flex-1 mb-4">Send to everyone who submitted an internship application.</p>
                    <select 
                      value={internEmailStatus} 
                      onChange={(e) => setInternEmailStatus(e.target.value)} 
                      className="mb-4 w-full px-4 py-2 rounded-xl border border-blue-200 outline-none focus:border-blue-500 text-sm bg-white"
                    >
                      <option value="all">All Applicants</option>
                      <option value="pending">Pending</option>
                      <option value="selected">Selected</option>
                      <option value="rejected">Rejected</option>
                    </select>
                    <button disabled={emailStatus === "loading" || !emailMessage} onClick={() => sendEmailAction("broadcast/interns", { subject: emailSubject, message: emailMessage, status: internEmailStatus })} className="w-full py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50 text-sm">Broadcast to Interns</button>
                  </div>
                  <div className="bg-purple-50 rounded-2xl border border-purple-200 p-6 flex flex-col">
                    <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2"><Mail className="w-4 h-4 text-purple-600" /> Everyone</h3>
                    <p className="text-sm text-gray-500 flex-1 mb-4">Send to all sub-admins and all intern applicants at once.</p>
                    <button disabled={emailStatus === "loading" || !emailMessage} onClick={() => sendEmailAction("broadcast/all", { subject: emailSubject, message: emailMessage })} className="w-full py-2.5 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 disabled:opacity-50 text-sm">Broadcast to Everyone</button>
                  </div>
                </div>
              </div>
            );
          })()}

          {authRole === "main_admin" && activeTab === "confirmations" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-blue-600" /> Confirmations
                </h2>
                <button
                  onClick={fetchConfirmations}
                  className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 text-sm font-semibold rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <RefreshCw className={`w-4 h-4 ${isFetchingData ? "animate-spin" : ""}`} /> Refresh
                </button>
              </div>

              {confirmations.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-200 border-dashed">
                  <CheckSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">No confirmations found.</p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 font-semibold text-gray-900">S.No.</th>
                        <th className="px-6 py-4 font-semibold text-gray-900">Name</th>
                        <th className="px-6 py-4 font-semibold text-gray-900">Phone</th>
                        <th className="px-6 py-4 font-semibold text-gray-900">Email</th>
                        <th className="px-6 py-4 font-semibold text-gray-900">Submitted At</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {confirmations.map((conf, index) => (
                        <tr key={conf._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-gray-500">{index + 1}</td>
                          <td className="px-6 py-4 font-medium text-gray-900">{conf.name}</td>
                          <td className="px-6 py-4 text-gray-600">{conf.phone}</td>
                          <td className="px-6 py-4 text-gray-600">{conf.email}</td>
                          <td className="px-6 py-4 text-gray-500">
                            {new Date(conf.createdAt).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
