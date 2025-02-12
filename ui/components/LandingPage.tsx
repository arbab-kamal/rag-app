"use client";
import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { Rocket, Lock } from "lucide-react";
import { AuthTabs } from "./Auth";
import Loading from "./Loading";

const LandingPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/chat");
    }
  }, [status, router]);

  if (status === "loading") {
    return <Loading />;
  }

  return (
    <div className="flex h-screen w-full">
      {/* Left Side - Hero Section */}
      <div className="w-2/3 bg-gradient-to-br from-gray-900 to-gray-200 flex flex-col justify-center items-start p-16 text-gray-100 relative">
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

          {!session && (
            <button
              onClick={() => signIn("google")}
              className="flex items-center gap-3 px-6 py-3 bg-gray-700 text-white rounded-full font-semibold hover:bg-gray-600 transition-colors"
            >
              <FcGoogle className="text-xl" />
              Sign in with Google
            </button>
          )}
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
