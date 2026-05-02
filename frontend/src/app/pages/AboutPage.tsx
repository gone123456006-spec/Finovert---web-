import { motion } from "motion/react";
import { Target, Shield, Award, Linkedin, Twitter } from "lucide-react";
import { SEO } from "../components/SEO";

// Images generated for the team
import shreeRamImg from "@/assets/founder_shree_ram_raut_1777738754281.png";
import yuvrajImg from "@/assets/cofounder_yuvraj_singh_1777738899203.png";
import shyamImg from "@/assets/cto_shyam_kumar_1777739015230.png";

const LEADERSHIP = [
  {
    name: "CA Shree Ram Raut",
    role: "Founder & CEO",
    bio: "Leads financial strategy, taxation, and compliance at Finovert. Drives risk-managed systems, business structuring, and investment advisory while building scalable, compliant financial solutions for users and businesses.",
    image: shreeRamImg,
    linkedin: "#",
  },
  {
    name: "Yuvraj Singh",
    role: "Co-Founder & COO",
    bio: "Leading the vision execution across technology, growth, and operations. Building Finovert into a full-stack financial platform that simplifies compliance, finance, and business management.",
    image: yuvrajImg,
    linkedin: "#",
  },
  {
    name: "Shyam Kumar",
    role: "CTO",
    bio: "Driving the technology backbone of Finovert, leading product architecture, development, and innovation. Focused on building scalable, secure, and efficient systems to power a seamless financial ecosystem.",
    image: shyamImg,
    linkedin: "#",
  }
];

export function AboutPage() {
  return (
    <div className="min-h-screen bg-white pt-24 pb-20 overflow-hidden">
      <SEO 
        title="About Us | Our Story & Leadership" 
        description="Meet the visionaries behind Finovert. Learn about our mission to simplify financial compliance and business management through technology."
      />

      {/* Hero Section - Google Style */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-20 lg:py-32 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-8">
            Simplifying finance for <br className="hidden md:block" />
            <span className="text-blue-600">everyone, everywhere.</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Finovert is more than just a financial platform. We are a team of experts and innovators dedicated to breaking down the barriers of complex compliance and business management.
          </p>
        </motion.div>
      </section>

      {/* Stats / Mission Cards */}
      <section className="bg-gray-50 py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100"
            >
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                To empower businesses with professional financial expertise through a seamless, automated digital platform.
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100"
            >
              <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mb-6">
                <Shield className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                To become the global standard for full-stack financial compliance and virtual CFO services.
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100"
            >
              <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mb-6">
                <Award className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Values</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Integrity, innovation, and absolute transparency in every financial transaction we handle.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Leadership Section - The Core Part */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">Our Leadership Team</h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            The visionaries and builders driving the future of Finovert.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {LEADERSHIP.map((member, idx) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.15 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="relative mb-8 overflow-hidden rounded-[2rem] aspect-[4/5] shadow-lg group-hover:shadow-2xl transition-all duration-500">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                  <div className="flex gap-4">
                    <a href={member.linkedin} className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white hover:text-blue-600 transition-all">
                      <Linkedin className="w-5 h-5" />
                    </a>
                    <a href="#" className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white hover:text-blue-400 transition-all">
                      <Twitter className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{member.name}</h3>
              <p className="text-blue-600 font-semibold mb-4">{member.role}</p>
              <p className="text-gray-600 leading-relaxed text-[15px]">
                {member.bio}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Join Us Section */}
      <section className="bg-gray-900 rounded-[3rem] mx-4 sm:mx-8 lg:mx-20 py-20 px-8 text-center text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-600/20 blur-[100px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-600/20 blur-[100px] rounded-full" />
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-8 tracking-tight">Come build the future of <br className="hidden md:block" /> finance with us.</h2>
          <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
            We're always looking for talented individuals to join our mission. Explore open roles and help us simplify the world of business.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-full font-bold transition-all shadow-lg hover:shadow-blue-500/30">
              View Careers
            </button>
            <button className="border border-white/20 hover:bg-white/10 px-10 py-4 rounded-full font-bold transition-all">
              Contact Sales
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
