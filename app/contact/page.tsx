"use client";

import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";
import ChatDialog from "../../components/chat-dialog";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    company: "",
    email: "",
    phone: "",
    message: "",
  });
  const [chatOpen, setChatOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-white">
        {/* Background gradient image */}
        <div aria-hidden="true" className="absolute inset-0 -z-10">
          <img src="/gradiant%20image%20left.png" alt="" className="h-full w-full object-cover" />
        </div>
        <div className="mx-auto max-w-[1280px] px-6 relative">
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
                      className="bg-black hover:bg-black/90 text-white px-6 py-2 text-sm font-medium"
                    >
                      Submit
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
        <div className="mx-auto max-w-[800px] px-6 text-center">
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
