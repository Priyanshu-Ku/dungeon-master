"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Shield, Eye, EyeOff, X } from "lucide-react";
import { Panel, Button, Input, Divider } from "./SystemUI";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-[440px] px-4"
          >
            <Panel 
              variant="rune" 
              padding="modal" 
              className="bg-[#13102A] border-[#2D2850] overflow-visible"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-[#4B456A] hover:text-[#F0A500] transition-colors z-20"
              >
                <X size={20} />
              </button>

              {/* Header */}
              <div className="flex flex-col items-center mb-8">
                <div className="relative mb-3">
                  <div className="absolute inset-0 blur-md bg-[#F0A500]/20" />
                  <Shield size={32} className="text-[#F0A500] relative z-10" strokeWidth={1.5} />
                </div>
                <h2 className="text-[#F0A500] font-['Cinzel'] font-semibold text-[18px] tracking-[0.15em] uppercase text-center">
                  Enter Your Identity
                </h2>
                <div className="w-full h-px bg-gradient-to-r from-transparent via-[#F0A500]/30 to-transparent mt-4" />
              </div>

              {/* Tabs */}
              <div className="flex justify-center gap-8 mb-8">
                {(["login", "register"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      setActiveTab(tab);
                      setShowPassword(false);
                    }}
                    className="relative pb-2"
                  >
                    <span
                      className={`font-['Cinzel'] text-[13px] tracking-[0.1em] uppercase transition-colors duration-300 ${
                        activeTab === tab ? "text-[#F0A500]" : "text-[#4B456A]"
                      }`}
                    >
                      {tab}
                    </span>
                    {activeTab === tab && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#F0A500]"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Form Container */}
              <form 
                className="flex flex-col gap-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  // Auth logic would go here
                  console.log("Submit", { activeTab, email, password, username, confirmPassword });
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col gap-4"
                  >
                    <Input
                      label="Username"
                      placeholder="Chosen Name..."
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />

                    {activeTab === "register" && (
                      <Input
                        label="Email Address"
                        type="email"
                        placeholder="scribe@archive.org"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    )}

                    <div className="relative">
                      <Input
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-[34px] text-[#4B456A] hover:text-[#7C3AED] transition-colors"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>

                    {activeTab === "register" && (
                      <Input
                        label="Confirm Password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    )}
                  </motion.div>
                </AnimatePresence>

                <Button 
                  type="submit" 
                  className="mt-4 w-full h-[48px] bg-gradient-to-r from-[#F0A500] to-[#7A5A10] border-[#F0A500]/50 hover:shadow-[0_0_20px_#F0A50040]"
                >
                  {activeTab === "login" ? "Begin Quest" : "Forge Identity"}
                </Button>
              </form>

              {/* OAuth Section */}
              <div className="mt-8">
                <Divider label="or continue with" />
                <div className="grid grid-cols-1 gap-3 mt-4">
                  <Button variant="ghost" className="w-full h-[44px] normal-case font-['Lato'] tracking-normal flex items-center justify-center gap-3 border-[#2D2850] text-[#C4B5FD] hover:bg-white/5">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.07-3.71 1.07-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.11c-.22-.66-.35-1.36-.35-2.11s.13-1.45.35-2.11V7.05H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.95l3.66-2.84z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.66 2.84c.87-2.6 3.3-4.51 6.16-4.51z" fill="#EA4335"/>
                    </svg>
                    <span>Continue with Google</span>
                  </Button>
                </div>
              </div>

              {/* Footer Links */}
              <div className="mt-8 text-center">
                <button 
                  onClick={() => setActiveTab(activeTab === "login" ? "register" : "login")}
                  className="text-[12px] text-[#4B456A] hover:text-[#7C3AED] transition-colors font-['Lato']"
                >
                  {activeTab === "login" 
                    ? "New to the Archive? Forge your identity" 
                    : "Already a scribe? Recite your credentials"}
                </button>
              </div>
            </Panel>

            {/* Subtle bottom glow */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-[#7C3AED]/20 blur-2xl rounded-full pointer-events-none" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
