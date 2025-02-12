"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Rocket, Lock } from "lucide-react";
import { AuthTabs } from "./Auth";

const LandingPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Check if user has an authentication token (Modify based on your backend)
    const token = localStorage.getItem("authToken"); // Or use cookies

    if (token) {
      router.push("/chat"); // Redirect if logged in
    }
  }, [router]);

  return (
    <div className="flex h-screen w-full">
      {/* Left Side - Hero Section */}
      <div className="w-2/3 bg-gradient-to-br from-gray-900 to-gray-200 flex flex-col justify-center items-start p-16 text-gray-100">
        <div className="max-w-xl">
          <h1 className="text-5xl font-bold mb-6 tracking-tight">
            Welcome to <span className="text-gray-200">SuperNova</span>
          </h1>
          <p className="text-xl mb-8 text-gray-100/90">
            Unleash the power of intelligent conversation and seamless
            collaboration.
          </p>

          <div className="flex space-x-6 mb-8">
            <div className="flex items-center space-x-3">
              <Rocket className="text-gray-300" />
              <span className="text-gray-100">Advanced AI Interactions</span>
            </div>
            <div className="flex items-center space-x-3">
              <Lock className="text-gray-300" />
              <span className="text-gray-100">Secure Authentication</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Authentication */}
      <div className="w-1/3 bg-gray-50 flex flex-col justify-center items-center p-12">
        <div className="w-full max-w-md">
          <AuthTabs />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
