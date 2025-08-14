import { motion, useInView } from "framer-motion";
import {
  Sparkles,
  Trophy,
  Settings,
  Users,
  Sun,
  CheckCircle,
} from "lucide-react";
import { useRef } from "react";
import type { Variants } from "framer-motion";

export default function Home() {
  const featureVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
  } as const;

  const heroImageVariants = {
    hidden: { opacity: 0, scale: 0.8, rotate: -5 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  } as const;

  const cardVariants = {
    offscreen: { y: 150, opacity: 0 },
    onscreen: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        bounce: 0.4,
        duration: 0.9,
      },
    },
  } as const;

  const cardRef = useRef(null);
  const isCardInView = useInView(cardRef, { once: true, amount: 0.5 });

  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen font-sans">
      {/* Tailwind CSS for Inter font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800;900&display=swap');
        body {
          font-family: 'Inter', sans-serif;
        }
      `}</style>
      
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative bg-gradient-to-br from-indigo-600 to-purple-700 text-white p-6 md:p-16 rounded-b-3xl shadow-2xl overflow-hidden"
      >
        {/* Abstract background elements */}
        <div className="absolute inset-0 w-full h-full opacity-10">
          <svg className="w-full h-full" viewBox="0 0 1440 320" preserveAspectRatio="none" fill="currentColor">
            <path d="M0,160L48,165.3C96,171,192,181,288,170.7C384,160,480,128,576,133.3C672,139,768,181,864,181.3C960,181,1056,139,1152,122.7C1248,107,1344,117,1392,122.7L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
          </svg>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left">
          <div className="md:w-1/2">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-4 leading-tight">
              Quizzy
            </h1>
            <p className="text-lg md:text-2xl font-light mb-8 max-w-3xl mx-auto md:mx-0 opacity-90">
              The ultimate platform to create, share, and conquer quizzes. Test
              your knowledge on any topic, anytime.
            </p>
            <div className="flex justify-center md:justify-start flex-wrap gap-4">
              <motion.a
                whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(0,0,0,0.2)" }}
                href="/create"
                className="inline-block px-10 py-4 bg-white text-indigo-700 font-bold rounded-full shadow-lg transition-transform duration-300"
              >
                Create a Quiz
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.05, backgroundColor: "#ffffff", color: "#4c51bf" }}
                href="/list"
                className="inline-block px-10 py-4 border-2 border-white text-white font-bold rounded-full transition-all duration-300"
              >
                Explore Quizzes
              </motion.a>
            </div>
          </div>

          <motion.div
            className="md:w-1/2 mt-12 md:mt-0 flex justify-center"
            variants={heroImageVariants as Variants}
            initial="hidden"
            animate="visible"
          >
            <img
              src="\images\Home.png"
              alt="A fun illustration of people interacting with quizzes"
              className="rounded-3xl shadow-xl h-auto max-h-96 w-auto object-contain border-4 border-indigo-500"
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 py-8 md:py-16">
        {/* Feature Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Key Features
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Quizzy offers a seamless experience for creators and players alike.
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.2,
              },
            },
          }}
        >
          <motion.div
            className="bg-white p-8 rounded-2xl shadow-lg text-center border border-gray-200"
            variants={featureVariants as Variants}
            whileHover={{ scale: 1.05, y: -10, boxShadow: "0 15px 30px rgba(0,0,0,0.1)" }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex justify-center mb-4">
              <Sparkles size={64} className="text-yellow-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">
              Easy Creation
            </h3>
            <p className="text-gray-500">
              Quickly build engaging quizzes with a simple, intuitive interface.
              No coding required.
            </p>
          </motion.div>

          <motion.div
            className="bg-white p-8 rounded-2xl shadow-lg text-center border border-gray-200"
            variants={featureVariants as Variants}
            whileHover={{ scale: 1.05, y: -10, boxShadow: "0 15px 30px rgba(0,0,0,0.1)" }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex justify-center mb-4">
              <Trophy size={64} className="text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">
              Challenge & Share
            </h3>
            <p className="text-gray-500">
              Share your quizzes with friends and see who can get the highest
              score.
            </p>
          </motion.div>

          <motion.div
            className="bg-white p-8 rounded-2xl shadow-lg text-center border border-gray-200"
            variants={featureVariants as Variants}
            whileHover={{ scale: 1.05, y: -10, boxShadow: "0 15px 30px rgba(0,0,0,0.1)" }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex justify-center mb-4">
              <Settings size={64} className="text-blue-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">
              Instant Feedback
            </h3>
            <p className="text-gray-500">
              Receive immediate results and review your answers to learn on the
              spot.
            </p>
          </motion.div>
        </motion.div>

        {/* Two-Section "Why Choose Quizzy?" Layout */}
        <motion.div
          ref={cardRef}
          className="bg-white p-8 md:p-16 rounded-3xl shadow-xl flex flex-col md:flex-row items-center gap-10 mt-20 border border-gray-200"
          initial="offscreen"
          animate={isCardInView ? "onscreen" : "offscreen"}
          variants={cardVariants as Variants}
        >
          <div className="w-full md:w-1/2 text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Why Choose Quizzy?
            </h2>
            <p className="text-lg text-gray-500 max-w-lg md:max-w-none">
              We're more than just a quiz maker—we're a community. Our modern
              design and robust features make learning and creating fun.
            </p>
          </div>
          <div className="w-full md:w-1/2 grid grid-cols-1 gap-8">
            <motion.div whileHover={{ scale: 1.03 }} className="flex items-center space-x-4">
              <div className="bg-indigo-100 p-3 rounded-full flex-shrink-0">
                <Users size={32} className="text-indigo-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-700 mb-1">
                  Community Driven
                </h3>
                <p className="text-gray-500">
                  Join a network of learners and creators who share your passion
                  for knowledge and fun.
                </p>
              </div>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03 }} className="flex items-center space-x-4">
              <div className="bg-green-100 p-3 rounded-full flex-shrink-0">
                <Sun size={32} className="text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-700 mb-1">
                  Modern & Clean Design
                </h3>
                <p className="text-gray-500">
                  Enjoy a beautiful and distraction-free interface that makes
                  creating and taking quizzes a pleasure.
                </p>
              </div>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03 }} className="flex items-center space-x-4">
              <div className="bg-yellow-100 p-3 rounded-full flex-shrink-0">
                <CheckCircle size={32} className="text-yellow-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-700 mb-1">
                  Reliable & Free
                </h3>
                <p className="text-gray-500">
                  Our platform is robust, fast, and completely free to use, with
                  no hidden costs.
                </p>
              </div>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03 }} className="flex items-center space-x-4">
              <div className="bg-red-100 p-3 rounded-full flex-shrink-0">
                <Trophy size={32} className="text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-700 mb-1">
                  Compete & Learn
                </h3>
                <p className="text-gray-500">
                  Challenge your friends and track your progress to see who is
                  the ultimate quiz master.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Final Call to Action */}
        <motion.div
          className="bg-indigo-600 text-white p-12 rounded-3xl text-center shadow-xl mt-20 border border-indigo-400"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl md:text-4xl font-extrabold mb-4">
            Ready to get started?
          </h3>
          <p className="text-lg md:text-xl font-light mb-8 max-w-2xl mx-auto">
            It only takes a few minutes to create your first quiz.
          </p>
          <motion.a
            href="/create"
            whileHover={{ scale: 1.05 }}
            className="inline-block px-12 py-5 bg-white text-indigo-700 font-bold rounded-full shadow-lg transition-transform duration-300"
          >
            Create Your Quiz
          </motion.a>
        </motion.div>
      </main>
    </div>
  );
}
