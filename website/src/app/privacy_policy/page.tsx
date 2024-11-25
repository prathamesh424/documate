'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, Lock, Mail, Info } from 'lucide-react'
import privacyPolicyData from '../../utils/privacy_policy.json'

const iconMap = {
  Shield: Shield,
  Lock: Lock,
  Mail: Mail,
}

export default function PrivacyPolicyPage() {
  const { introduction, sections } = privacyPolicyData.privacy_policy;
  const [activeSection, setActiveSection] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-white text-black p-6 md:p-12 ">
      <div className="max-w-4xl mx-auto">
        <motion.h1 
          className="text-4xl md:text-6xl font-extrabold text-center mb-6 text-black"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Privacy Policy
        </motion.h1>
        <motion.p 
          className="text-lg md:text-xl text-gray-700 text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {introduction}
        </motion.p>


        <div className="space-y-8">
          {Object.entries(sections).map(([key, section]: [string, any], index) => {
            const IconComponent = iconMap[section.icon as keyof typeof iconMap];
            return (
              <motion.section
                key={key}
                className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <button
                  onClick={() => setActiveSection(activeSection === key ? null : key)}
                  className="w-full text-left p-6 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="flex items-center space-x-4">
                    {IconComponent && <IconComponent className="w-6 h-6 text-blue-600" />}
                    <h2 className="text-2xl font-bold text-black">{section.title}</h2>
                  </div>
                  <svg
                    className={`w-6 h-6 text-gray-600 transform transition-transform duration-200 ${activeSection === key ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {activeSection === key && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-6 bg-gray-50"
                  >
                    <ul className="space-y-4">
                      {section.content.map((item: string, idx: number) => (
                        <motion.li
                          key={idx}
                          className="flex items-start space-x-2 text-gray-800"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: idx * 0.1 }}
                        >
                          <Info className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                          <span>{item}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </motion.section>
            );
          })}
        </div>
      </div>
    </div>
  );
}

