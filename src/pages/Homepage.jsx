import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check, ChevronRight, ExternalLink, Terminal, Zap } from "lucide-react";
import { Link } from "react-router-dom";

// Placeholder for the Button component
const Button = ({ children, className, onClick, size }) => (
  <button 
    className={`inline-flex items-center justify-center font-medium ${className}`}
    onClick={onClick}
  >
    {children}
  </button>
);

// Placeholder for the createPageUrl function
const createPageUrl = (path) => path;

export default function Homepage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 to-indigo-950 text-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1639762681057-408e52192e55?q=80&w=2832&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-16"
          >
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/057ce2_TraigentLogoWhiteCropped.png" 
              alt="Traigent Logo" 
              className="h-12 w-auto"
            />
          </motion.div>
          <div className="max-w-3xl">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-6"
            >
              Systematically Optimize Your AI Agents for Peak Performance
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl md:text-2xl text-slate-300 mb-10 max-w-2xl"
            >
              Reduce costs, improve latency, and boost accuracy — automatically and safely with Traigent, the first true AI agent optimization platform.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Button 
                size="lg" 
                className="bg-white text-slate-900 hover:bg-gray-100 px-8 py-6 text-lg rounded-lg"
                onClick={() => window.open('https://cal.com/gil-rosenblum', '_blank')}
              >
                Request a Demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </div>
        </div>
        
        {/* Flowing gradient accent */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500"></div>
      </section>

      {/* Problem Statement */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
            >
              AI Teams Are Overpaying and Underperforming
            </motion.h2>
            <p className="text-xl text-gray-600">
              Today's AI implementations face critical challenges that limit their potential.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {[
              {
                title: "High Default Costs",
                description: "Defaulting to frontier models drives costs sky-high and locks teams in.",
                icon: <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-red-600">💰</div>
              },
              {
                title: "Manual Optimization",
                description: "Manual optimization is complex, slow, and resource-intensive.",
                icon: <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">⏱️</div>
              },
              {
                title: "Inefficient Testing",
                description: "Brute-force testing results in excessive compute bills without guarantee of improvement.",
                icon: <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">🧪</div>
              },
              {
                title: "Risky Changes",
                description: "Switching models is risky and often impractical.",
                icon: <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">⚠️</div>
              }
            ].map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex gap-5 p-6 rounded-xl hover:bg-gray-50 transition-colors"
              >
                {item.icon}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 to-slate-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-200/60 [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
            >
              The Smarter Way to Optimize AI Agents
            </motion.h2>
            <p className="text-xl text-gray-600">
              Traigent provides intelligent automation to maximize your AI performance.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {[
              {
                title: "Automated Exploration",
                description: "Thousands of configurations tested intelligently, not manually.",
                icon: <Zap className="w-6 h-6 text-indigo-600" />
              },
              {
                title: "Custom Performance Goals",
                description: "Optimize for cost, accuracy, latency — or all three.",
                icon: <Terminal className="w-6 h-6 text-indigo-600" />
              },
              {
                title: "Safe Experimentation",
                description: "Run tests in a non-production environment without risk.",
                icon: <Check className="w-6 h-6 text-indigo-600" />
              },
              {
                title: "Deployment Ready",
                description: "Get deployment-ready code and actionable insights instantly.",
                icon: <ExternalLink className="w-6 h-6 text-indigo-600" />
              }
            ].map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
            >
              How It Works
            </motion.h2>
            <p className="text-xl text-gray-600">
              Simple 4-Step Process to Transform Your AI Agent Performance
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: "Define Your Agent",
                description: "Describe your AI systems and upload test sets."
              },
              {
                step: "02",
                title: "Set Your Metrics",
                description: "Choose from predefined or custom performance goals."
              },
              {
                step: "03",
                title: "Automated Optimization",
                description: "Our platform explores configurations automatically."
              },
              {
                step: "04",
                title: "Deploy with Confidence",
                description: "Integrate better-performing agents with clear, ready-to-use code."
              }
            ].map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative p-6 rounded-xl bg-white border border-gray-100 hover:border-indigo-100 hover:shadow-sm transition-all"
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
                
                {index < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <ChevronRight className="w-6 h-6 text-indigo-400" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Validated by Research</h2>
              <p className="text-slate-300 text-lg mb-6">
                Our platform is built on peer-reviewed research and validated by industry pioneers.
              </p>
              
              <div className="space-y-6">
                <div className="p-6 rounded-xl bg-slate-900/60 backdrop-blur-sm">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                      A
                    </div>
                    <div className="ml-4">
                      <h4 className="font-medium">Academic Recognition</h4>
                      <p className="text-slate-400 text-sm">IEEE ICSE 2025</p>
                    </div>
                  </div>
                  <p className="text-slate-300">
                    Peer-reviewed research presented at IEEE ICSE 2025, demonstrating 40x cost and performance gaps due to poor agent optimization.
                  </p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative h-[400px] rounded-2xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=3270&auto=format&fit=crop')] bg-cover bg-center"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="text-2xl font-bold mb-2">40x</div>
                <p className="text-slate-300">Performance improvement potential identified in our research</p>
              </div>
              
              <div className="absolute top-8 right-8 flex space-x-2">
                <div className="h-3 w-3 rounded-full bg-emerald-400"></div>
                <div className="h-3 w-3 rounded-full bg-purple-400"></div>
                <div className="h-3 w-3 rounded-full bg-blue-400"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold mb-6"
            >
              Ready to Transform Your AI Agent Performance?
            </motion.h2>
            <p className="text-xl opacity-90 mb-10">
              Join forward-thinking organizations using Traigent to achieve superior AI performance with less cost.
            </p>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Button 
                size="lg" 
                className="bg-white text-indigo-700 hover:bg-gray-100 px-8 py-6 text-lg rounded-lg"
                onClick={() => window.open('https://cal.com/gil-rosenblum', '_blank')}
              >
                Start Optimizing Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-slate-950 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-8">
            <div>
              <div className="text-xl font-bold mb-4">Traigent</div>
              <p className="text-slate-400 mb-6">
                The first true AI agent optimization platform.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/privacy" className="text-slate-400 hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="/terms" className="text-slate-400 hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="/refund" className="text-slate-400 hover:text-white transition-colors">
                    Refund Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-500">
            <p>© {new Date().getFullYear()} Traigent Ltd. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 