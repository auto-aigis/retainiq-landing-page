"use client";
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { authApi } from '@/app/_lib/api';
import { useAuth } from '@/app/_components/AuthProvider';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email') || '';
  const { refresh } = useAuth();

  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'idle'>(
    token ? 'loading' : 'idle'
  );
  const [errorMsg, setErrorMsg] = useState('');
  const [resent, setResent] = useState(false);

  const handleVerify = async () => {
    if (!token) return;
    try {
      await authApi.verifyEmail(token);
      setStatus('success');
      await refresh();
      setTimeout(() => router.push('/dashboard'), 1500);
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Verification failed');
    }
  };

  const handleResend = async () => {
    if (!email) return;
    try {
      await authApi.resendVerification(email);
      setResent(true);
      setTimeout(() => setResent(false), 3000);
    } catch {
      setErrorMsg('Failed to resend email');
    }
  };

  if (token && status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <Loader2 className="h-10 w-10 animate-spin text-gray-900 mx-auto mb-4" />
            <p className="text-gray-600">Verifying your email...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (token && status === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <CheckCircle className="h-10 w-10 text-green-600 mx-auto mb-4" />
            <p className="text-gray-900 font-medium">Email verified successfully!</p>
            <p className="text-gray-600 text-sm mt-2">Redirecting to dashboard...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (token && status === 'error') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-gray-900">Verification Failed</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              {errorMsg}
            </div>
            <Button onClick={handleVerify} className="w-full">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-semibold text-gray-900">Check your email</CardTitle>
          <CardDescription>
            We sent a verification link to <span className="font-medium text-gray-900">{email}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-md text-sm">
            Click the link in the email to verify your account.
          </div>
          <Button onClick={handleResend} className="w-full" disabled={resent}>
            {resent ? 'Email sent!' : 'Resend verification email'}
          </Button>
          <div className="text-center text-sm">
            <Link href="/login" className="text-gray-900 font-medium hover:underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-900" />
      </div>
}>
      <VerifyEmailContent />
      <VerifyEmailContent />
    </Suspense>
  );
}