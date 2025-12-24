'use client';

import type React from 'react';

import { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would submit to an API
    console.log('Form submitted:', formData);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitted(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.h1
            className="text-4xl font-bold mb-12 text-center text-[#1e3a3a]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Contact Us
          </motion.h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold mb-6 text-[#6b3e7c]">Get in Touch</h2>
              <p className="text-gray-600 mb-8">
                Have questions about ProjectHub or need assistance? We're here to help! Fill out the
                form and our team will get back to you as soon as possible.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-[#f0e5ff] p-3 rounded-full">
                    <Mail className="h-6 w-6 text-[#6b3e7c]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-[#1e3a3a]">Email Us</h3>
                    <p className="text-gray-600">info@projecthub.edu</p>
                    <p className="text-gray-600">support@projecthub.edu</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-[#f0e5ff] p-3 rounded-full">
                    <Phone className="h-6 w-6 text-[#6b3e7c]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-[#1e3a3a]">Call Us</h3>
                    <p className="text-gray-600">+91 123456789</p>
                    <p className="text-gray-600">Mon-Fri, 9:00 AM - 5:00 PM</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-[#f0e5ff] p-3 rounded-full">
                    <MapPin className="h-6 w-6 text-[#6b3e7c]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-[#1e3a3a]">Visit Us</h3>
                    <p className="text-gray-600">Mahindra University</p>
                    <p className="text-gray-600">Phase-2 Hostel</p>
                    <p className="text-gray-600">Hyderabad, India 110001</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {isSubmitted ? (
                <div className="bg-white p-8 rounded-xl shadow-sm text-center">
                  <div className="flex justify-center mb-6">
                    <div className="bg-green-100 p-4 rounded-full">
                      <CheckCircle className="h-12 w-12 text-green-600" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold mb-4 text-[#1e3a3a]">Message Sent!</h2>
                  <p className="text-gray-600 mb-6">
                    Thank you for reaching out. We've received your message and will get back to you
                    shortly.
                  </p>
                  <Button
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({ name: '', email: '', subject: '', message: '' });
                    }}
                    className="bg-[#6b3e7c] hover:bg-[#5a2e6b]"
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm">
                  <h2 className="text-2xl font-bold mb-6 text-[#1e3a3a]">Send a Message</h2>

                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Your Name
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Email Address
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Message
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-[#6b3e7c] hover:bg-[#5a2e6b] flex items-center justify-center gap-2"
                    >
                      <Send className="h-4 w-4" />
                      Send Message
                    </Button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>

          <motion.div
            className="mt-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <h2 className="text-2xl font-bold mb-6 text-center text-[#1e3a3a]">Find Us</h2>
            <div className="rounded-xl overflow-hidden shadow-sm h-[400px] bg-gray-200">
              {/* In a real app, this would be a Google Maps embed */}
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <MapPin className="h-12 w-12 text-gray-400 mr-2" />
                <span className="text-gray-500 text-lg">Map Placeholder</span>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <footer className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} ProjectHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
