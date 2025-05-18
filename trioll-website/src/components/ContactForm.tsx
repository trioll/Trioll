"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";

interface FormData {
  name: string;
  email: string;
  message: string;
}

const ContactForm: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isHovered, setIsHovered] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>();
  
  // Add global styles for gradient animations
  const formStyles = (
    <style jsx global>{`
      @keyframes gradientShift {
        0% { background-position: 0% 50% }
        50% { background-position: 100% 50% }
        100% { background-position: 0% 50% }
      }
    `}</style>
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      setErrorMessage("");
      
      // Send form data to API route that handles email sending
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Something went wrong');
      }
      
      // Show success message
      setIsSubmitted(true);
      reset();
      
      // Reset form after a delay
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to send message');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      className="w-full max-w-md mx-auto bg-black/10 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-black/10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
      whileHover={{ boxShadow: "0 15px 30px -8px rgba(0, 0, 0, 0.2)" }}
    >
      <h2 className="text-2xl font-bold mb-8 text-black tracking-wider">Get in Touch</h2>
      
      {isSubmitted ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-black/85 py-4 text-center font-light tracking-wide"
        >
          Thank you! Your message has been sent to our team at info@trioll.com.
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <motion.div
            whileHover={{ scale: 1.02 }}
            onHoverStart={() => setIsHovered("name")}
            onHoverEnd={() => setIsHovered(null)}
          >
            <input
              type="text"
              placeholder="Your Name"
              className={`w-full p-3 bg-white/80 border ${errors.name ? "border-red-400" : isHovered === "name" ? "border-black/30" : "border-black/20"} rounded-md text-black placeholder-black/50 focus:outline-none focus:ring-1 focus:ring-black/30 focus:border-black/30 transition-all duration-300 font-light tracking-wide`}
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-xs text-black/80 font-light tracking-wide">
                {errors.name.message}
              </motion.p>
            )}
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            onHoverStart={() => setIsHovered("email")}
            onHoverEnd={() => setIsHovered(null)}
          >
            <input
              type="email"
              placeholder="Your Email"
              className={`w-full p-3 bg-white/80 border ${errors.email ? "border-red-400" : isHovered === "email" ? "border-black/30" : "border-black/20"} rounded-md text-black placeholder-black/50 focus:outline-none focus:ring-1 focus:ring-black/30 focus:border-black/30 transition-all duration-300 font-light tracking-wide`}
              {...register("email", { 
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address"
                }
              })}
            />
            {errors.email && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-xs text-black/80 font-light tracking-wide">
                {errors.email.message}
              </motion.p>
            )}
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            onHoverStart={() => setIsHovered("message")}
            onHoverEnd={() => setIsHovered(null)}
          >
            <textarea
              rows={4}
              placeholder="Your Message"
              className={`w-full p-3 bg-white/80 border ${errors.message ? "border-red-400" : isHovered === "message" ? "border-black/30" : "border-black/20"} rounded-md text-black placeholder-black/50 focus:outline-none focus:ring-1 focus:ring-black/30 focus:border-black/30 transition-all duration-300 font-light tracking-wide`}
              {...register("message", { required: "Message is required" })}
            />
            {errors.message && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-xs text-black/80 font-light tracking-wide">
                {errors.message.message}
              </motion.p>
            )}
          </motion.div>
          
          {errorMessage && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 text-sm text-red-600 font-light tracking-wide text-center"
            >
              {errorMessage}
            </motion.p>
          )}
          
          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={!isSubmitting ? { scale: 1.02, y: -1 } : {}}
            whileTap={!isSubmitting ? { scale: 0.98 } : {}}
            className={`w-full py-3 px-6 mt-6 bg-black text-white font-light tracking-wider rounded-md shadow-md transition-all duration-300 focus:outline-none ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </motion.button>
        </form>
      )}
      {formStyles}
    </motion.div>
  );
};

export default ContactForm;
