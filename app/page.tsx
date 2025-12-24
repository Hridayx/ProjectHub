'use client';

import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, BookOpen, Users, Code, Brain, Database, Shield, Cloud } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ProjectCard } from '@/components/project-card';

export default function Home() {
  const [imgSrc, setImgSrc] = useState('/images/healthcare-bot.jpg');
  const [imgLoaded, setImgLoaded] = useState(false);

  const handleImageError = () => {
    console.error('Failed to load healthcare bot image');
    setImgSrc('/placeholder.jpg');
  };

  const handleImageLoad = () => {
    setImgLoaded(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-[#1e3a3a] py-20 text-white mt-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <motion.h1
              className="text-5xl md:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              Project<span className="text-[#6b3e7c]">Hub</span>
            </motion.h1>
            <motion.div
              className="text-3xl md:text-4xl font-light mb-8 border-l-4 border-yellow-400 pl-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              
            >
              <p>
                "A student-powered ecosystem to connect, collaborate, and launch real projects in
                technology and innovation — bridging education with global opportunity."
              </p>
            </motion.div>
            <motion.p
              className="text-xl mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              Empowering students through transformative education and research in cutting-edge
              technology fields
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Button
                asChild
                className="bg-[#6b3e7c] hover:bg-[#5a2e6b] text-white px-8 py-6 text-lg rounded-lg"
              >
                <Link href="/discover-projects">Discover Project Ideas</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Project Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <motion.h2
              className="text-3xl font-bold mb-4 text-[#1e3a3a]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              Explore Projects
            </motion.h2>
            <motion.p
              className="text-xl text-gray-600"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              Choose from a variety of projects that match your interests and goals
            </motion.p>
          </div>

          {/* Community Projects Section */}
          <div className="mb-16">
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <h3 className="text-2xl font-bold mb-4 text-[#1e3a3a]">Community-Based Projects</h3>
              <p className="text-gray-600">
                Join exciting student-led initiatives and collaborate with peers on innovative
                solutions
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <ProjectCard
                id="c1"
                title="Open Source Web Framework"
                category="Web Development"
                mentor="Community Project"
                skillLevel="Intermediate"
                description="Collaborative project to build a modern web framework for developers."
              />
              <ProjectCard
                id="c2"
                title="Mobile Learning App"
                category="Mobile Development"
                mentor="Community Project"
                skillLevel="Beginner"
                description="Student-led initiative to create an educational mobile application."
              />
              <ProjectCard
                id="c3"
                title="Smart Campus IoT"
                category="Internet of Things"
                mentor="Community Project"
                skillLevel="Intermediate"
                description="Collaborative IoT project to enhance campus facilities and services."
              />
              <ProjectCard
                id="c4"
                title="Campus Navigation App"
                category="Campus Navigation"
                mentor="Community Project"
                skillLevel="Intermediate"
                description="Build an indoor navigation system for campus buildings."
              />
              <ProjectCard
                id="c5"
                title="AI Chatbot for University Services"
                category="AI Chatbot"
                mentor="Community Project"
                skillLevel="Beginner"
                description="Student-built chatbot to answer campus FAQs and connect services."
              />
              <ProjectCard
                id="c6"
                title="Open Data Dashboard"
                category="Data Dashboard"
                mentor="Community Project"
                skillLevel="Intermediate"
                description="Build a dashboard to display public and student-generated data."
              />
            </motion.div>

            <motion.div
              className="text-center mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <Button asChild variant="outline">
                <Link href="/community-projects">View All Community Projects</Link>
              </Button>
            </motion.div>
          </div>

          {/* Mentor Projects Section */}
          <div>
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              <h3 className="text-2xl font-bold mb-4 text-[#1e3a3a]">
                Mentor-Based Research Projects
              </h3>
              <p className="text-gray-600">
                Engage in cutting-edge research projects under the guidance of experienced mentors
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.6 }}
            >
              <ProjectCard
                id="m1"
                title="Quantum Computing Research"
                category="Computer Science"
                mentor="Dr. Sarah Johnson"
                skillLevel="Advanced"
                description="Research on quantum algorithms and their applications in cryptography."
              />
              <ProjectCard
                id="m2"
                title="Sustainable Energy Systems"
                category="Environmental Engineering"
                mentor="Prof. Michael Chen"
                skillLevel="Intermediate"
                description="Research project on innovative renewable energy storage solutions."
              />
              <ProjectCard
                id="m3"
                title="Healthcare AI Diagnostics"
                category="Medical Technology"
                mentor="Dr. Emily Rodriguez"
                skillLevel="Advanced"
                description="Research on AI-powered diagnostic tools for early disease detection."
              />
              <ProjectCard
                id="m4"
                title="Brain-Computer Interfaces"
                category="Neural Engineering"
                mentor="Dr. A. Mehta"
                skillLevel="Advanced"
                description="Research on neural signal processing and hands-free tech interfaces."
              />
              <ProjectCard
                id="m5"
                title="Climate Modeling with AI"
                category="Climate Science + ML"
                mentor="Prof. Rina Das"
                skillLevel="Intermediate"
                description="Use ML to simulate and analyze climate change patterns."
              />
              <ProjectCard
                id="m6"
                title="Smart Prosthetics Research"
                category="Smart Prosthetics"
                mentor="Dr. Mohan Iyer"
                skillLevel="Advanced"
                description="Research project on intelligent prosthetic limb movement prediction."
              />
            </motion.div>

            <motion.div
              className="text-center mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.7 }}
            >
              <Button asChild variant="outline">
                <Link href="/mentor-projects">View All Research Projects</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Project Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-3xl font-bold mb-10 text-[#1e3a3a]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Featured Project
          </motion.h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center max-w-7xl mx-auto">
            <motion.div
              className="rounded-2xl overflow-hidden shadow-xl bg-white"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="relative aspect-video">
                <Image
                  src={imgSrc}
                  alt="AI Healthcare Assistant Project - An intelligent system for patient care management"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority
                  quality={90}
                  onError={handleImageError}
                  onLoad={handleImageLoad}
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <span className="inline-block bg-[#6b3e7c] text-white px-4 py-1.5 rounded-full text-sm font-medium">
                Artificial Intelligence
              </span>
              <h3 className="text-3xl font-bold text-[#1e3a3a]">
                AI-Powered Healthcare Assistant
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                This innovative project combines natural language processing and machine learning to
                create an AI assistant that helps patients manage medications, schedule
                appointments, and access health information. Students will work with healthcare
                professionals to ensure the solution meets real-world needs.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-gray-100 px-4 py-1.5 rounded-full text-sm font-medium text-gray-700">Machine Learning</span>
                <span className="bg-gray-100 px-4 py-1.5 rounded-full text-sm font-medium text-gray-700">NLP</span>
                <span className="bg-gray-100 px-4 py-1.5 rounded-full text-sm font-medium text-gray-700">Healthcare</span>
                <span className="bg-gray-100 px-4 py-1.5 rounded-full text-sm font-medium text-gray-700">Python</span>
              </div>
              <div>
                <Button asChild className="bg-[#6b3e7c] hover:bg-[#5a2e6b] px-6 py-3 text-lg shadow-lg hover:shadow-xl transition-all">
                  <Link href="/project/1">View Project Details</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mentors Section */}
      <section className="py-24 bg-[#14322f]" data-testid="mentors-section" aria-labelledby="mentors-heading">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <motion.h2
                id="mentors-heading"
                className="text-4xl font-bold mb-6 text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                Meet Our Mentors
              </motion.h2>
              <motion.p
                className="text-gray-200 text-xl max-w-3xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                Connect with industry experts and experienced professionals who are passionate about
                guiding the next generation of tech innovators.
              </motion.p>
            </div>

            <motion.div
              className="relative w-full h-[600px] rounded-2xl overflow-hidden shadow-2xl mb-12"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Image
                src="/images/mentors.png"
                alt="ProjectHub Mentors collaborating with students"
                fill
                style={{ objectFit: 'cover' }}
                className="w-[1000px]"
                priority
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <Button asChild className="bg-[#6b3e7c] hover:bg-[#5a2e6b] text-white text-lg px-10 py-6 rounded-lg shadow-lg hover:shadow-xl transition-all">
                <Link href="/mentors">Connect with Mentors</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose ProjectHub Section */}
      <section className="py-16 bg-[#6b3e7c] text-white">
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-3xl font-bold mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            Why Choose ProjectHub
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <BookOpen className="h-10 w-10" />,
                title: 'Project-Based Learning',
                description:
                  'Learn by doing with real-world projects that build your portfolio and prepare you for industry challenges.',
              },
              {
                icon: <Users className="h-10 w-10" />,
                title: 'Expert Mentorship',
                description:
                  'Get guidance from industry professionals and academic experts who are leaders in their fields.',
              },
              {
                icon: <Code className="h-10 w-10" />,
                title: 'Cutting-Edge Technology',
                description:
                  'Work with the latest tools and technologies used in the industry to stay ahead of the curve.',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white/10 p-6 rounded-xl text-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
              >
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-white/80">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Button asChild size="lg" className="bg-white text-[#6b3e7c] hover:bg-gray-100 px-8">
              <Link href="/about">Learn More About Us</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <footer className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">ProjectHub</h3>
              <p className="text-gray-600">
                Empowering students through transformational education and research.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-gray-600 hover:text-[#6b3e7c]">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/projects" className="text-gray-600 hover:text-[#6b3e7c]">
                    Projects
                  </Link>
                </li>
                <li>
                  <Link href="/mentors" className="text-gray-600 hover:text-[#6b3e7c]">
                    Mentors
                  </Link>
                </li>
                <li>
                  <Link href="/tasks" className="text-gray-600 hover:text-[#6b3e7c]">
                    Tasks
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/faq" className="text-gray-600 hover:text-[#6b3e7c]">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/support" className="text-gray-600 hover:text-[#6b3e7c]">
                    Support
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-gray-600 hover:text-[#6b3e7c]">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-gray-600 hover:text-[#6b3e7c]">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Connect</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-600 hover:text-[#6b3e7c]">
                    Twitter
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-[#6b3e7c]">
                    LinkedIn
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-[#6b3e7c]">
                    GitHub
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-[#6b3e7c]">
                    Discord
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} ProjectHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
