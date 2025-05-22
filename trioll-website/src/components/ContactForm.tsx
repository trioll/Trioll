"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface FormData {
  name: string;
  email: string;
  message: string;
}

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const ContactForm = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isHovered, setIsHovered] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>();
  
  // Refs for animations
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const onSubmit = useCallback(async (data: FormData) => {
    try {
      setIsSubmitting(true);
      setErrorMessage("");
      
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
      
      setIsSubmitted(true);
      reset();
      
      // Auto-reset after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to send message');
    } finally {
      setIsSubmitting(false);
    }
  }, [reset]);

  // Enhanced GSAP ScrollTrigger animations
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    // Clear existing triggers
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    
    const ctx = gsap.context(() => {
      // Main panel slide-up animation with improved easing
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".contact-trigger",
          start: "top bottom-=100px",
          end: "top center",
          scrub: 1.2,
          toggleActions: "play none none reverse",
          onUpdate: (self) => {
            // Add subtle parallax effect during scroll
            gsap.set(".form-reveal-panel", {
              filter: `blur(${(1 - self.progress) * 2}px)`,
            });
          }
        }
      });
      
      tl.to(".form-reveal-panel", {
        y: 0,
        ease: "power3.out",
        duration: 1
      });
      
      // Staggered content reveal animation
      const contentTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".form-reveal-panel",
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      });
      
      contentTl
        .to(".reveal-content", {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          stagger: 0.15
        })
        .to(".form-field", {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "back.out(1.7)",
          stagger: 0.1
        }, "-=0.4");
    });
    
    return () => ctx.revert();
  }, []);

  const handleFieldFocus = useCallback((fieldName: string) => {
    setIsHovered(fieldName);
  }, []);

  const handleFieldBlur = useCallback(() => {
    setIsHovered(null);
  }, []);

  return (
    <>
      <style jsx global>{`
        .contact-container {
          position: relative;
          z-index: 20;
          min-height: 100vh;
          width: 100%;
        }
        
        .form-reveal-panel {
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          height: auto;
          max-height: 55vh;
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.95) 0%, 
            rgba(248, 248, 248, 0.98) 100%);
          backdrop-filter: blur(10px);
          transform: translateY(100%);
          z-index: 15;
          display: flex;
          align-items: center;
          justify-content: center;
          border-top-left-radius: 24px;
          border-top-right-radius: 24px;
          box-shadow: 
            0 -8px 32px rgba(0, 0, 0, 0.12),
            0 -2px 8px rgba(0, 0, 0, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.5);
          overflow-y: auto;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .contact-trigger {
          height: 120px;
          width: 100%;
          position: relative;
        }

        .reveal-content {
          opacity: 0;
          transform: translateY(30px);
        }
        
        .form-field {
          opacity: 0;
          transform: translateY(15px);
        }

        /* Enhanced input styling */
        .enhanced-input {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }

        .enhanced-input:focus {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        /* Smooth scrollbar for the panel */
        .form-reveal-panel::-webkit-scrollbar {
          width: 6px;
        }

        .form-reveal-panel::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 3px;
        }

        .form-reveal-panel::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 3px;
        }

        .form-reveal-panel::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.3);
        }
      `}</style>
      
      <div ref={containerRef} className="contact-container">
        {/* Scroll trigger element */}
        <div className="contact-trigger"></div>
        
        {/* Enhanced sliding panel */}
        <div ref={panelRef} className="form-reveal-panel">
          <div className="max-w-5xl w-full mx-auto px-6 py-8">
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              
              {/* Logo and contact info section */}
              <div className="lg:w-1/3 reveal-content flex flex-col items-start space-y-4">
                <div className="flex items-center space-x-3">
                  <Image 
                    src="/Trioll_Logo_Black.png" 
                    alt="TRIOLL" 
                    width={100} 
                    height={50} 
                    className="object-contain"
                  />
                </div>
                
                <div className="space-y-2">
                  <a 
                    href="mailto:info@trioll.com" 
                    className="text-black/70 hover:text-black transition-colors duration-300 flex items-center space-x-2 group"
                  >
                    <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                    </svg>
                    <span>info@trioll.com</span>
                  </a>
                  
                  <p className="text-black/60 text-sm leading-relaxed">
                    Ready to level up your game discovery experience? 
                    Let's connect and explore the possibilities.
                  </p>
                </div>
              </div>
              
              {/* Form section */}
              <div className="reveal-content lg:w-2/3">
                {isSubmitted ? (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-black/90 mb-2">Message Sent!</h3>
                    <p className="text-black/70">Thank you for reaching out. We'll get back to you soon.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    
                    {/* Name field */}
                    <div 
                      className="form-field"
                      onFocus={() => handleFieldFocus("name")}
                      onBlur={handleFieldBlur}
                    >
                      <label className="block text-sm font-medium text-black/80 mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        placeholder="Enter your full name"
                        className={`enhanced-input w-full p-4 bg-white/80 border ${
                          errors.name ? "border-red-400" : 
                          isHovered === "name" ? "border-black/40" : "border-black/20"
                        } rounded-lg text-black placeholder-black/50 focus:outline-none focus:border-black/60 font-light tracking-wide`}
                        {...register("name", { required: "Name is required" })}
                      />
                      {errors.name && (
                        <p className="mt-2 text-sm text-red-600 font-light">
                          {errors.name.message}
                        </p>
                      )}
                    </div>
            
                    {/* Email field */}
                    <div 
                      className="form-field"
                      onFocus={() => handleFieldFocus("email")}
                      onBlur={handleFieldBlur}
                    >
                      <label className="block text-sm font-medium text-black/80 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        placeholder="your.email@example.com"
                        className={`enhanced-input w-full p-4 bg-white/80 border ${
                          errors.email ? "border-red-400" : 
                          isHovered === "email" ? "border-black/40" : "border-black/20"
                        } rounded-lg text-black placeholder-black/50 focus:outline-none focus:border-black/60 font-light tracking-wide`}
                        {...register("email", { 
                          required: "Email is required",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Please enter a valid email address"
                          }
                        })}
                      />
                      {errors.email && (
                        <p className="mt-2 text-sm text-red-600 font-light">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
            
                    {/* Message field */}
                    <div 
                      className="form-field"
                      onFocus={() => handleFieldFocus("message")}
                      onBlur={handleFieldBlur}
                    >
                      <label className="block text-sm font-medium text-black/80 mb-2">
                        Your Message *
                      </label>
                      <textarea
                        rows={4}
                        placeholder="Tell us about your project, ideas, or how we can help..."
                        className={`enhanced-input w-full p-4 bg-white/80 border ${
                          errors.message ? "border-red-400" : 
                          isHovered === "message" ? "border-black/40" : "border-black/20"
                        } rounded-lg text-black placeholder-black/50 focus:outline-none focus:border-black/60 font-light tracking-wide resize-none`}
                        {...register("message", { required: "Message is required" })}
                      />
                      {errors.message && (
                        <p className="mt-2 text-sm text-red-600 font-light">
                          {errors.message.message}
                        </p>
                      )}
                    </div>
                    
                    {/* Error message */}
                    {errorMessage && (
                      <div className="form-field p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-700 font-light">
                          {errorMessage}
                        </p>
                      </div>
                    )}
            
                    {/* Submit button */}
                    <div className="form-field">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-4 px-8 bg-black text-white font-medium tracking-wide rounded-lg 
                          hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-black/20 focus:ring-offset-2 
                          transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]
                          ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}
                          disabled:hover:scale-100 disabled:hover:bg-black`}
                      >
                        {isSubmitting ? (
                          <div className="flex items-center justify-center space-x-2">
                            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Sending...</span>
                          </div>
                        ) : (
                          'Send Message'
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactForm;
