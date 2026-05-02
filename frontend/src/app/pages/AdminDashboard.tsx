import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Lock, FileText, CheckCircle, AlertCircle, BadgeCheck, Users, Clock, Briefcase, Trash2, Download, XCircle, Check, Mail } from "lucide-react";
import API_BASE from "../../config/api";

export function AdminDashboard() {
  const [authRole, setAuthRole] = useState<"main_admin" | "sub_admin" | null>(null);
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
  const [fetchMessage, setFetchMessage] = useState("");
  const [activeTab, setActiveTab] = useState<"blog" | "verification" | "requests" | "interns" | "email">("blog");
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [allBlogs, setAllBlogs] = useState<any[]>([]);
  const [interns, setInterns] = useState<any[]>([]);
  const [expandedSubAdmin, setExpandedSubAdmin] = useState<string | null>(null);
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);

  // Email Broadcaster
  const [emailTo, setEmailTo] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [emailStatus, setEmailStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [emailResult, setEmailResult] = useState("");

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
  }, []);

  const fetchPendingRequests = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/subadmins/requests`);
      if (res.ok) setPendingRequests(await res.json());
    } catch (e) {
      console.error(e);
    }
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

  useEffect(() => {
    if (authRole) {
      fetchAllBlogs();
    }
    if (authRole === "main_admin") {
      if (activeTab === "requests") fetchPendingRequests();
      if (activeTab === "interns") fetchInterns();
    }
  }, [authRole, activeTab]);

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

  const handleMainLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      if (password !== "admin123") {
        setError("Incorrect password.");
        generateCaptcha(); 
        setIsSubmitting(false);
        return;
      }
      if (userCaptcha.toUpperCase() !== captcha.q) {
        setError("CAPTCHA verification failed.");
        generateCaptcha(); setUserCaptcha(""); 
        setIsSubmitting(false);
        return;
      }
      setAuthRole("main_admin");
      setError("");
      setIsSubmitting(false);
    }, 500); // Simulate network delay for UX
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
        setFormData(prev => ({ ...prev, author: data.user.name }));
        setActiveTab("blog"); // Sub-admins only see blogs
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
        setVerificationData({ id: "", name: "", institute: "", joinDate: "", endDate: "", role: "", remarks: "" });
        setTimeout(() => setStatus("idle"), 3000);
      } else setStatus("error");
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
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Lock className="w-8 h-8 text-blue-600" />
              {authRole === "main_admin" ? "Master Portal" : `Writer Portal - Welcome, ${currentUser?.name}`}
            </h1>
          </div>
          
          {authRole === "main_admin" && (
            <div className="flex gap-2 bg-white p-1.5 rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
              <button onClick={() => setActiveTab("blog")} className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 whitespace-nowrap ${activeTab === "blog" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-50"}`}><FileText className="w-4 h-4" /> Blogs</button>
              <button onClick={() => setActiveTab("verification")} className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 whitespace-nowrap ${activeTab === "verification" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-50"}`}><BadgeCheck className="w-4 h-4" /> Verify</button>
              <button onClick={() => setActiveTab("requests")} className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 whitespace-nowrap ${activeTab === "requests" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-50"}`}><Users className="w-4 h-4" /> Team</button>
              <button onClick={() => setActiveTab("interns")} className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 whitespace-nowrap ${activeTab === "interns" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-50"}`}><Briefcase className="w-4 h-4" /> Intern Apps</button>
              <button onClick={() => setActiveTab("email")} className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 whitespace-nowrap ${activeTab === "email" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-50"}`}><Mail className="w-4 h-4" /> Email</button>
            </div>
          )}
        </div>

        {status === "success" && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 text-green-700 font-medium"><CheckCircle className="w-6 h-6" /> {fetchMessage}</motion.div>}
        {status === "error" && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 font-medium"><AlertCircle className="w-6 h-6" /> {fetchMessage || "An error occurred."}</motion.div>}

        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8">
          
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
            <form onSubmit={handleVerificationSubmit} className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4"><BadgeCheck className="w-5 h-5 text-blue-600" /> Add Official Record</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input required type="text" name="id" value={verificationData.id} onChange={(e) => setVerificationData({...verificationData, id: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none uppercase" placeholder="Verification ID (e.g. FIN-EMP-1042)" />
                <input required type="text" name="name" value={verificationData.name} onChange={(e) => setVerificationData({...verificationData, name: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none" placeholder="Full Name" />
                <input type="text" name="institute" value={verificationData.institute} onChange={(e) => setVerificationData({...verificationData, institute: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none" placeholder="Institute" />
                <input required type="text" name="role" value={verificationData.role} onChange={(e) => setVerificationData({...verificationData, role: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none" placeholder="Role" />
                <input required type="text" name="joinDate" value={verificationData.joinDate} onChange={(e) => setVerificationData({...verificationData, joinDate: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none" placeholder="Join Date" />
                <input type="text" name="endDate" value={verificationData.endDate} onChange={(e) => setVerificationData({...verificationData, endDate: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none" placeholder="End Date" />
              </div>
              <textarea required name="remarks" value={verificationData.remarks} onChange={(e) => setVerificationData({...verificationData, remarks: e.target.value})} rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none resize-none" placeholder="Remarks"></textarea>
              <button disabled={status === "loading"} type="submit" className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700">Add Record</button>
            </form>
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
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4"><Briefcase className="w-5 h-5 text-blue-600" /> Internship Applications</h2>
              {interns.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No internship applications found.</p>
              ) : (
                <div className="overflow-x-auto rounded-xl shadow-sm">
                  <table className="w-full min-w-max text-left border-collapse whitespace-nowrap border border-gray-200 bg-white">
                    <thead>
                      <tr className="bg-gray-100 text-gray-700 text-sm">
                        <th className="w-12 px-4 py-3 font-semibold border border-gray-200 text-center">S.No.</th>
                        <th className="px-4 py-3 font-semibold border border-gray-200">Candidate</th>
                        <th className="px-4 py-3 font-semibold border border-gray-200">Education</th>
                        <th className="px-4 py-3 font-semibold border border-gray-200">Documents</th>
                        <th className="px-4 py-3 font-semibold border border-gray-200 text-center">Status</th>
                        <th className="px-4 py-3 font-semibold border border-gray-200">Date</th>
                        <th className="px-4 py-3 font-semibold text-right border border-gray-200">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {interns.map((intern, index) => (
                        <tr key={intern._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-sm text-gray-500 font-medium border border-gray-200 text-center">{index + 1}</td>
                          <td className="px-4 py-3 border border-gray-200">
                            <p className="font-bold text-gray-900 text-sm">{intern.fullName}</p>
                            <p className="text-xs text-gray-500">{intern.email}</p>
                            <p className="text-xs text-gray-500">{intern.phone}</p>
                          </td>
                          <td className="px-4 py-3 border border-gray-200">
                            <p className="font-semibold text-gray-800 text-sm">{intern.course} - {intern.branch}</p>
                            <p className="text-xs text-gray-500">{intern.collegeName}</p>
                            <p className="text-xs text-blue-600 font-medium">{intern.yearOfStudy}</p>
                          </td>
                          <td className="px-4 py-3 border border-gray-200">
                            <div className="flex flex-col gap-1.5">
                              <a href={intern.resumeUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"><Download className="w-3 h-3" /> Resume</a>
                              <a href={intern.idProofUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"><Download className="w-3 h-3" /> ID Proof</a>
                              <a href={intern.collegeIdUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"><Download className="w-3 h-3" /> College ID</a>
                            </div>
                          </td>
                          <td className="px-4 py-3 border border-gray-200 text-center">
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${intern.status === 'selected' ? 'bg-green-100 text-green-700' : intern.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                              {intern.status || 'pending'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500 border border-gray-200 text-center">
                            {new Date(intern.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 text-right border border-gray-200">
                            <div className="flex justify-end gap-2">
                              {intern.status !== 'selected' && (
                                <button onClick={() => handleInternStatus(intern._id, 'selected')} className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors inline-flex" title="Select Candidate">
                                  <Check className="w-4 h-4" />
                                </button>
                              )}
                              {intern.status !== 'rejected' && (
                                <button onClick={() => handleInternStatus(intern._id, 'rejected')} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors inline-flex" title="Reject Candidate">
                                  <XCircle className="w-4 h-4" />
                                </button>
                              )}
                              <button onClick={async () => {
                                if(confirm("Are you sure you want to permanently delete this application?")) {
                                  await fetch(`${API_BASE}/api/internships/${intern._id}`, { method: "DELETE" });
                                  fetchInterns();
                                }
                              }} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors inline-flex" title="Delete Application">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
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
                if (res.ok) { setEmailStatus("success"); setEmailResult(data.message); }
                else { setEmailStatus("error"); setEmailResult(data.message || "Failed to send."); }
              } catch { setEmailStatus("error"); setEmailResult("Network error."); }
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
                    <button disabled={emailStatus === "loading" || !emailMessage} onClick={() => sendEmailAction("broadcast/interns", { subject: emailSubject, message: emailMessage })} className="w-full py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50 text-sm">Broadcast to Interns</button>
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
        </motion.div>
      </div>
    </div>
  );
}
