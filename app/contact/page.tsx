"use client";

import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";
import ChatDialog from "../../components/chat-dialog";
import { useAuthStore } from "../../lib/store/auth.store";
import { useToast } from "../../hooks/use-toast";

export default function ContactPage() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    fullName: "",
    company: "",
    email: "",
    phone: "",
    message: "",
  });
  const [chatOpen, setChatOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Generate session_id if not available
      const sessionId = `contact_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      
      // Prepare request body - ensure all required fields are included
      const requestBody = {
        company_name: formData.company.trim() || "",
        email: formData.email.trim(),
        full_name: formData.fullName.trim(),
        message: formData.message.trim(),
        phone: formData.phone.trim() || "",
        session_id: sessionId,
        type: "contact",
        user_id: user?.user_id || "anonymous",
        user_type: user?.role || "client",
      };

      // Validate required fields
      if (!requestBody.email || !requestBody.full_name || !requestBody.message) {
        toast({
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(requestBody.email)) {
        toast({
          description: "Please enter a valid email address.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Log request for debugging
      console.log("Submitting contact form:", requestBody);

      const response = await fetch("https://agents-store.onrender.com/api/contact", {
        method: "POST",
        headers: {
          "accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      // Try to parse JSON response, but handle cases where response might not be valid JSON
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        // If response is not valid JSON, create a generic error response
        console.error("Failed to parse response:", parseError);
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }

      if (response.ok && data.success) {
        toast({
          description: data.message || "Thank you for your enquiry! We'll get back to you soon.",
        });
        // Reset form
        setFormData({
          fullName: "",
          company: "",
          email: "",
          phone: "",
          message: "",
        });
      } else {
        // Handle error responses - FastAPI often uses 'detail' field for errors
        const errorMessage = data?.detail || data?.message || data?.error || `Server error: ${response.status} ${response.statusText}`;
        toast({
          description: errorMessage,
          variant: "destructive",
        });
        console.error("Contact form submission error:", {
          status: response.status,
          statusText: response.statusText,
          data: data,
          requestBody: requestBody,
        });
      }
    } catch (error: any) {
      console.error("Error submitting contact form:", error);
      toast({
        description: error.message || "An error occurred. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100">
        {/* Background gradient image - full width */}
        <div aria-hidden="true" className="absolute inset-0 -z-10 w-full">
          <img src="/gradiant%20image%20left.png" alt="" className="h-full w-full object-cover" />
        </div>
        <div className="w-full px-8 md:px-12 lg:px-16 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start bt-10">
             {/* Left Side - Header */}
             <div className="relative min-h-[500px]">
               {/* Background image for left section */}
                <img src="/gradiant_left.png" alt="" className="h-full w-full object-cover mt-[50px]" />
               
               {/* Text overlay positioned at left top */}
               <div className="absolute top-0 left-8 z-10">
                 <h1 className="text-5xl font-bold mb-6 leading-tight">
                   <span
                     style={{
                       background:
                         "radial-gradient(80.73% 80.73% at 3.12% 25.58%, #7935F4 0%, #9A4681 49.5%, #614BDB 96.87%)",
                       WebkitBackgroundClip: "text",
                       backgroundClip: "text",
                       color: "transparent",
                       WebkitTextFillColor: "transparent",
                     }}
                   >
                     Let's Talk About the Next Big Thing
                   </span>
                 </h1>
               </div>
             </div>
            
            {/* Right Side - Subheader and Details */}
            <div className="flex flex-col justify-start">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4 mt-4">
                We'd love to hear from you. Leave us a message!
              </h2>
              
              {/* Contact Form */}
              <div className="bg-gray-50 rounded-xl p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                      Full Name *
                    </Label>
                     <Input
                       id="fullName"
                       name="fullName"
                       type="text"
                       required
                       value={formData.fullName}
                       onChange={handleChange}
                       className="mt-1 bg-white border-gray-300 focus:border-gray-400 focus:ring-gray-400"
                       placeholder="Enter your full name"
                     />
                  </div>

                  {/* Company */}
                  <div>
                    <Label htmlFor="company" className="text-sm font-medium text-gray-700">
                      Company *
                    </Label>
                     <Input
                       id="company"
                       name="company"
                       type="text"
                       required
                       value={formData.company}
                       onChange={handleChange}
                       className="mt-1 bg-white border-gray-300 focus:border-gray-400 focus:ring-gray-400"
                       placeholder="Enter your company name"
                     />
                  </div>

                  {/* Email */}
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email *
                    </Label>
                     <Input
                       id="email"
                       name="email"
                       type="email"
                       required
                       value={formData.email}
                       onChange={handleChange}
                       className="mt-1 bg-white border-gray-300 focus:border-gray-400 focus:ring-gray-400"
                       placeholder="Enter your email address"
                     />
                  </div>

                  {/* Phone */}
                  <div>
                    <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                      Phone
                    </Label>
                     <Input
                       id="phone"
                       name="phone"
                       type="tel"
                       value={formData.phone}
                       onChange={handleChange}
                       className="mt-1 bg-white border-gray-300 focus:border-gray-400 focus:ring-gray-400"
                       placeholder="Enter your phone number"
                     />
                  </div>

                  {/* What brings you here */}
                  <div>
                    <Label htmlFor="message" className="text-sm font-medium text-gray-700">
                      What brings you here? *
                    </Label>
                     <Textarea
                       id="message"
                       name="message"
                       required
                       value={formData.message}
                       onChange={handleChange}
                       className="mt-1 min-h-[100px] bg-white border-gray-300 focus:border-gray-400 focus:ring-gray-400"
                       placeholder="Tell us about your project, requirements, or how we can help you..."
                     />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2 flex justify-start">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-black hover:bg-black/90 text-white px-6 py-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "Submitting..." : "Submit"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ask Question Section */}
      <section className="py-16 bg-white">
        <div className="w-full px-8 md:px-12 lg:px-16 text-center">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">
            Have Questions?
          </h3>
          <p className="text-gray-600 mb-8">
            Not sure where to start? Our AI assistant can help answer your questions 
            and guide you through our services.
          </p>
          <Button
            onClick={() => setChatOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg"
          >
            Ask a Question
          </Button>
        </div>
      </section>

      <ChatDialog open={chatOpen} onOpenChange={setChatOpen} initialMode="create" />
    </div>
  );
}
