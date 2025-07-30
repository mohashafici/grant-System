"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, CheckCircle, XCircle, Mail, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { authStorage } from "@/lib/auth";
import Link from "next/link";

function VerifyEmailContent() {
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (!tokenFromUrl) {
      setVerificationStatus('error');
      setMessage('No verification token found. Please check your email for the correct verification link.');
      return;
    }
    setToken(tokenFromUrl);
    verifyEmail(tokenFromUrl);
  }, [searchParams]);

  const verifyEmail = async (verificationToken: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-email/${verificationToken}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setVerificationStatus('success');
        setMessage(data.message);
        setUser(data.user);
        
        // Save token and user info for automatic login
        if (data.token) {
          authStorage.setAuth(data.token, data.user);
        }

        toast({
          title: "Email Verified!",
          description: "Your email has been verified successfully. You can now log in to your account.",
          duration: 5000,
        });

        // Redirect after 3 seconds
        setTimeout(() => {
          if (data.user.role === "admin") router.push("/admin");
          else if (data.user.role === "reviewer") router.push("/reviewer");
          else router.push("/researcher");
        }, 3000);

      } else {
        setVerificationStatus('error');
        setMessage(data.message || 'Verification failed. Please try again.');
        
        toast({
          title: "Verification Failed",
          description: data.message || 'Verification failed. Please try again.',
          variant: "destructive",
          duration: 5000,
        });
      }
    } catch (error) {
      setVerificationStatus('error');
      setMessage('Network error. Please check your connection and try again.');
      
      toast({
        title: "Network Error",
        description: "Please check your connection and try again.",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  const resendVerification = async () => {
    if (!user?.email) {
      toast({
        title: "Error",
        description: "Email address not found. Please try registering again.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: user.email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Email Sent!",
          description: "A new verification email has been sent to your inbox.",
          duration: 5000,
        });
      } else {
        toast({
          title: "Failed to Send Email",
          description: data.message || "Please try again later.",
          variant: "destructive",
          duration: 5000,
        });
      }
    } catch (error) {
      toast({
        title: "Network Error",
        description: "Please check your connection and try again.",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  if (verificationStatus === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <Award className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Grant Portal</h1>
              </div>
            </div>
            <p className="text-gray-600">Email Verification</p>
          </div>

          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
              <CardTitle className="text-xl">Verifying Your Email</CardTitle>
              <CardDescription>Please wait while we verify your email address...</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <Award className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Grant Portal</h1>
            </div>
          </div>
          <p className="text-gray-600">Email Verification</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="text-center">
            {verificationStatus === 'success' && (
              <>
                <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-xl text-green-600">Email Verified!</CardTitle>
                <CardDescription>Your email has been successfully verified.</CardDescription>
              </>
            )}

            {verificationStatus === 'error' && (
              <>
                <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <XCircle className="w-8 h-8 text-red-600" />
                </div>
                <CardTitle className="text-xl text-red-600">Verification Failed</CardTitle>
                <CardDescription>We couldn't verify your email address.</CardDescription>
              </>
            )}
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="text-center">
              <p className="text-gray-600 leading-relaxed">{message}</p>
            </div>

            {verificationStatus === 'success' && (
              <div className="space-y-3">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-800">Account Activated</span>
                  </div>
                  <p className="text-green-700 text-sm mt-1">
                    You will be redirected to your dashboard shortly...
                  </p>
                </div>
                
                <Button 
                  onClick={() => {
                    if (user?.role === "admin") router.push("/admin");
                    else if (user?.role === "reviewer") router.push("/reviewer");
                    else router.push("/researcher");
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Go to Dashboard
                </Button>
              </div>
            )}

            {verificationStatus === 'error' && (
              <div className="space-y-3">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <span className="text-red-800 font-medium">Verification Failed</span>
                  </div>
                  <p className="text-red-700 text-sm mt-1">
                    The verification link may be expired or invalid.
                  </p>
                </div>

                <div className="space-y-2">
                  <Button 
                    onClick={resendVerification}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={!user?.email}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Resend Verification Email
                  </Button>
                  
                  <Link href="/login">
                    <Button variant="outline" className="w-full">
                      Back to Login
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <Award className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Grant Portal</h1>
              </div>
            </div>
            <p className="text-gray-600">Email Verification</p>
          </div>

          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
              <CardTitle className="text-xl">Loading...</CardTitle>
              <CardDescription>Please wait while we load the verification page...</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
} 