import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Github, Linkedin, Twitter, ExternalLink, User } from "lucide-react";

const CONTRIBUTORS = [
  {
    name: "Shyam Kumar",
    role: "Lead Full Stack Developer",
    bio: "Architected the core platform and led the transition to the new microservices architecture. Passionate about clean code and scalable systems.",
    links: { 
      linkedin: "https://www.linkedin.com/in/shyam-kumar-6b80501b4?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app"
    }
  },
  {
    name: "Rohan Kumar",
    role: "UI/UX Designer",
    bio: "Crafted the design system and user experience. Focused on building intuitive and accessible interfaces for financial applications.",
    links: { linkedin: "#", twitter: "#" }
  },
  {
    name: "Priya Sharma",
    role: "Backend Engineer Intern",
    bio: "Implemented secure payment gateways and optimized database queries to reduce load times significantly.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
    links: { github: "#" }
  }
];

export function ContributorsPage() {
  useEffect(() => {
    document.title = "Contributors | Finovert";
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Contributors
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            The incredible team of developers, designers, and visionaries who brought Finovert to life. We are grateful for their dedication and expertise.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CONTRIBUTORS.map((contributor, idx) => (
            <motion.div
              key={contributor.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow border border-gray-100 group"
            >
              <div className="flex flex-col items-center text-center h-full">
                {contributor.image ? (
                  <div className="relative mb-6">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-50 group-hover:border-blue-50 transition-colors">
                      <img 
                        src={contributor.image} 
                        alt={contributor.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute inset-0 rounded-full shadow-inner pointer-events-none" />
                  </div>
                ) : (
                  <div className="mb-6 flex items-center justify-center w-24 h-24 rounded-full border-4 border-gray-50 bg-gray-200 group-hover:border-gray-100 transition-colors overflow-hidden">
                    <User className="w-16 h-16 text-white mt-5" fill="currentColor" />
                  </div>
                )}
                
                <h3 className="text-xl font-bold text-gray-900 mb-1">{contributor.name}</h3>
                <p className="text-sm font-medium text-blue-600 mb-4">{contributor.role}</p>
                
                <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow">
                  {contributor.bio}
                </p>

                <div className="flex items-center gap-4 mt-auto pt-6 border-t border-gray-100 w-full justify-center">
                  {contributor.links.linkedin && (
                    <a href={contributor.links.linkedin} className="text-gray-400 hover:text-[#0A66C2] transition-colors" target="_blank" rel="noopener noreferrer">
                      <Linkedin className="w-5 h-5" />
                    </a>
                  )}
                  {contributor.links.github && (
                    <a href={contributor.links.github} className="text-gray-400 hover:text-gray-900 transition-colors" target="_blank" rel="noopener noreferrer">
                      <Github className="w-5 h-5" />
                    </a>
                  )}
                  {contributor.links.twitter && (
                    <a href={contributor.links.twitter} className="text-gray-400 hover:text-[#1DA1F2] transition-colors" target="_blank" rel="noopener noreferrer">
                      <Twitter className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-20 text-center bg-blue-600 rounded-3xl p-10 text-white shadow-xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-black opacity-10 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Want to join the team?</h2>
            <p className="text-blue-100 mb-8 max-w-xl mx-auto">
              We are always looking for talented individuals to help us build the future of finance. Check out our open positions.
            </p>
            <Link to="/careers" className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-50 transition-colors">
              View Careers <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
