"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface FormData {
  name: string;
  email: string;
  message: string;
}

// Register ScrollTrigger plugin outside the component
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const ContactForm = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isHovered, setIsHovered] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  // Refs for GSAP animations
  const containerRef = useRef<HTMLDivElement>(null);
  const formSectionRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const fieldRefs = useRef<(HTMLDivElement | null)[]>([]);

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

  // Set up GSAP ScrollTrigger animations
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    // Clean up any existing ScrollTriggers to prevent duplication
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    
    const ctx = gsap.context(() => {
      // Main panel slide-up animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".contact-trigger",
          start: "top bottom", // Animation starts when the top of the trigger hits the bottom of the viewport
          end: "top top", // Animation ends when the top of the trigger hits the top of the viewport
          scrub: 0.8, // Smooth scrubbing effect
          toggleActions: "play none none reverse",
          markers: false, // Set to true for debugging
        }
      });
      
      // Panel sliding up from bottom
      tl.to(".form-reveal-panel", {
        y: 0,
        ease: "power3.inOut",
        duration: 1
      });
      
      // Content reveal animation once the panel is in place
      const contentTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".form-reveal-panel",
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      });
      
      contentTl
        .to(".reveal-content", {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          stagger: 0.1
        })
        .to(".form-field", {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
          stagger: 0.1
        }, "-=0.3");
    });
    
    return () => ctx.revert(); // Clean up animations on component unmount
  }, []);
  
  // Add refs to form fields
  const addToRefs = (el: HTMLDivElement | null) => {
    if (el && !fieldRefs.current.includes(el)) {
      fieldRefs.current.push(el);
    }
  };

  return (
    <>
      <style jsx global>{`
        body {
          overflow-x: hidden;
        }
        
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
          max-height: 50vh;
          background-color: white;
          transform: translateY(100%);
          z-index: 15;
          display: flex;
          align-items: center;
          justify-content: center;
          border-top-left-radius: 20px;
          border-top-right-radius: 20px;
          box-shadow: 0 -5px 30px rgba(0, 0, 0, 0.15);
          overflow-y: auto;
        }

        .contact-trigger {
          height: 100px;
          width: 100%;
          position: relative;
        }

        .reveal-content {
          opacity: 0;
          transform: translateY(50px);
        }
        
        .form-field {
          opacity: 0;
          transform: translateY(20px);
        }
      `}</style>
      
      <div ref={containerRef} className="contact-container">
        {/* Trigger element for scroll animation */}
        <div className="contact-trigger"></div>
        
        {/* The panel that slides up */}
        <div className="form-reveal-panel">
          <div ref={formSectionRef} className="max-w-4xl w-full mx-auto px-4 py-6 overflow-hidden">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div ref={logoRef} className="md:w-1/4 reveal-content flex flex-col items-start">
                <Image 
                  src="/Trioll_Logo_Black.png" 
                  alt="TRIOLL" 
                  width={90} 
                  height={45} 
                  className="mx-0 mb-3"
                />
                <a href="mailto:info@trioll.com" className="text-sm text-gray-500 hover:text-black transition-colors">info@trioll.com</a>
              </div>
              
              {/* Form Column */}
              <div className="reveal-content md:w-3/4">
              {isSubmitted ? (
                <div className="text-black/85 py-4 text-center font-light tracking-wide">
                  Thank you for your message.
                </div>
              ) : (
                <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                  <div 
                    ref={addToRefs} 
                    className="form-field"
                    onMouseEnter={() => setIsHovered("name")}
                    onMouseLeave={() => setIsHovered(null)}
                  >
                    <input
                      type="text"
                      placeholder="Your name"
                      className={`w-full p-2.5 bg-white border-b ${errors.name ? "border-red-400" : isHovered === "name" ? "border-black/30" : "border-gray-300"} rounded-none text-black placeholder-gray-400 focus:outline-none focus:border-black/50 transition-all duration-300 font-light tracking-wide`}
                      {...register("name", { required: "Name is required" })}
                    />
                    {errors.name && (
                      <p className="mt-1 text-xs text-red-600 font-light">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
          
                  <div 
                    ref={addToRefs}
                    className="form-field"
                    onMouseEnter={() => setIsHovered("email")}
                    onMouseLeave={() => setIsHovered(null)}
                  >
                    <input
                      type="email"
                      placeholder="Your email"
                      className={`w-full p-2.5 bg-white border-b ${errors.email ? "border-red-400" : isHovered === "email" ? "border-black/30" : "border-gray-300"} rounded-none text-black placeholder-gray-400 focus:outline-none focus:border-black/50 transition-all duration-300 font-light tracking-wide`}
                      {...register("email", { 
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address"
                        }
                      })}
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-600 font-light">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
          
                  <div 
                    ref={addToRefs}
                    className="form-field"
                    onMouseEnter={() => setIsHovered("message")}
                    onMouseLeave={() => setIsHovered(null)}
                  >
                    <textarea
                      rows={2}
                      placeholder="Your message"
                      className={`w-full p-2.5 bg-white border-b ${errors.message ? "border-red-400" : isHovered === "message" ? "border-black/30" : "border-gray-300"} rounded-none text-black placeholder-gray-400 focus:outline-none focus:border-black/50 transition-all duration-300 font-light tracking-wide`}
                      {...register("message", { required: "Message is required" })}
                    />
                    {errors.message && (
                      <p className="mt-1 text-xs text-red-600 font-light">
                        {errors.message.message}
                      </p>
                    )}
                  </div>
                  
                  {errorMessage && (
                    <p className="mt-4 text-sm text-red-600 font-light tracking-wide text-center">
                      {errorMessage}
                    </p>
                  )}
          
                  <div ref={addToRefs} className="form-field mt-6">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`py-2 px-5 bg-transparent text-black font-light tracking-wide border border-black rounded-none hover:bg-black hover:text-white transition-colors focus:outline-none ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {isSubmitting ? 'Sending...' : 'Send'}
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
