'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [token, setToken] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const tokenFromParams = searchParams ? searchParams.get('token') : null;
    console.log("Token from params:", tokenFromParams); // Debugging the token
    if (tokenFromParams) {
      setToken(tokenFromParams);
    } else {
      toast.error('Token is missing or invalid.', { position: 'top-right', autoClose: 5000 });
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the password and confirmPassword fields are filled
    if (!password || !confirmPassword) {
      toast.error('Both fields are required!', {
        position: 'top-right',
        autoClose: 5000,
      });
      return;
    }

    const isPasswordValid = (password) => {
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{5,}$/;
      return passwordRegex.test(password);
    };

    if (!isPasswordValid(password)) {
      toast.error('Password must be at least 5 characters long and include at least one uppercase letter, one number, and one special character.', {
        position: 'top-right',
        autoClose: 5000,
      });
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match!', {
        position: 'top-right',
        autoClose: 5000,
      });
      return;
    }

    if (!token) {
      toast.error('Invalid or missing token.', {
        position: 'top-right',
        autoClose: 5000,
      });
      return;
    }

    try {
      const response = await fetch('/api/authentication/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const responseData = await response.json();
      if (!response.ok) {
        toast.error(responseData.message || 'Failed to reset password', {
          position: 'top-right',
          autoClose: 5000,
        });
        return;
      }

      toast.success('Password has been reset successfully!', {
        position: 'top-right',
        autoClose: 5000,
      });
      setTimeout(() => router.push('/login'), 2000);
    } catch (error) {
      console.error('Error resetting password:', error);
      toast.error('An error occurred. Please try again later.', {
        position: 'top-right',
        autoClose: 5000,
      });
    }
  };

  return (
    <>
      <ToastContainer />
      <Card className="mx-auto max-w-sm turnitfgt">
        <CardHeader>
          <CardTitle className="text-2xl">Forgot Password</CardTitle>
          <CardDescription>Enter your new password</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">New Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} // Controlled input
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                </div>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)} // Controlled input
                />
              </div>
              <Button type="submit" className="w-full">
                Submit
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
