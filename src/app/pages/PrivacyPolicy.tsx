import { motion } from "motion/react";
import { Shield, Trash2, Lock, Eye, FileText } from "lucide-react";

export function PrivacyPolicy() {
  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-800 to-blue-900 px-8 py-12 text-white">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-8 h-8 text-purple-300" />
              <h1 className="text-3xl font-bold">Privacy & Policies</h1>
            </div>
            <p className="text-purple-100 text-lg opacity-90">
              Your trust is our priority. Learn how we handle and protect your information.
            </p>
          </div>

          <div className="p-8 md:p-12 space-y-12">
            {/* Privacy Policy Section */}
            <section id="privacy" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Lock className="w-6 h-6 text-purple-700" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Privacy Policy</h2>
              </div>
              
              <div className="space-y-6 text-gray-600 leading-relaxed">
                <p>
                  This Privacy Policy explains how the Company ("Company," "we," "our," or "us") collects, uses, stores, and protects your personal information when you access our website, mobile application, or financial services. By using our services, you consent to the practices described in this Policy.
                </p>

                <div className="grid md:grid-cols-2 gap-6 mt-8">
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-2 mb-3 text-purple-700 font-semibold">
                      <Eye className="w-5 h-5" />
                      <h3>Information Collection</h3>
                    </div>
                    <p className="text-sm">
                      We collect personal info like name, contact details, ID info, financial data, and transaction history when you register or interact with our platform.
                    </p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-2 mb-3 text-blue-700 font-semibold">
                      <Shield className="w-5 h-5" />
                      <h3>Data Usage</h3>
                    </div>
                    <p className="text-sm">
                      Your info is used to verify identity, process requests, provide support, enhance security, and comply with legal requirements.
                    </p>
                  </div>
                </div>

                <p>
                  We do not sell your personal information. Data may be shared with trusted third-party partners, financial institutions, or regulatory authorities when required for service delivery, compliance, or legal enforcement. All partners are expected to maintain appropriate confidentiality and data protection standards.
                </p>

                <p>
                  The Company implements reasonable administrative, technical, and physical safeguards to protect your data against unauthorized access, disclosure, or misuse. However, no digital platform can guarantee absolute security, and users share information at their own risk.
                </p>

                <p>
                  You have the right to review, update, or request deletion of your personal information, subject to legal and regulatory requirements. Requests may be submitted through official support channels.
                </p>

                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100 text-sm text-purple-800 italic">
                  We may update this Privacy Policy periodically. Continued use of services after updates indicates acceptance of revised terms. This Policy is governed by applicable data protection laws.
                </div>
              </div>
            </section>

            <div className="h-px bg-gray-200" />

            {/* Account Deletion Section */}
            <section id="account-deletion" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Trash2 className="w-6 h-6 text-red-700" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Account Delete Policy</h2>
              </div>
              
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  We understand that you may choose to discontinue using our services. Our account deletion process is designed to be straightforward while ensuring the security of your financial data.
                </p>
                <div className="bg-red-50 p-6 rounded-xl border border-red-100">
                  <h3 className="font-semibold text-red-900 mb-2">How to Request Deletion:</h3>
                  <ul className="list-disc list-inside space-y-2 text-sm text-red-800">
                    <li>Send an email to <span className="font-bold">Fintaxcoach@gmail.com</span> from your registered email address.</li>
                    <li>Include your full name and account identification details.</li>
                    <li>Specify "Account Deletion Request" in the subject line.</li>
                  </ul>
                </div>
                <p>
                  Upon receiving your request, we will verify your identity to protect against unauthorized deletions. Once verified, we will systematically remove your personal information from our active databases.
                </p>
                <div className="flex items-start gap-2 text-sm bg-yellow-50 p-4 rounded-lg border border-yellow-100 text-yellow-800">
                  <FileText className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p>
                    <span className="font-bold">Important Note:</span> Some information may be retained for a period of time if required by applicable legal, regulatory, or tax laws governing financial services. These records are kept in a highly secure, restricted environment.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
