"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
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
import { toast } from 'react-toastify';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const router = useRouter(); // Initialize router

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email) {
      toast.error("Please enter your email", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    const postData = {
      email
    };

    try {
      const response = await fetch('/api/forgetPass', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error || 'Failed to submit request';

        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        throw new Error(errorMessage);
      }

      const result = await response.json();

      toast.success(result.message || 'Password reset link sent successfully!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      setEmail('');

    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const handleCancel = () => {
    router.push('/'); // Redirect to the home page
  };

  return (
    <Card className="mx-auto max-w-sm turnitfgt">
      <CardHeader>
        <CardTitle className="text-2xl">Forgot Password</CardTitle>
        <CardDescription>Enter your email</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={handleEmailChange}
            />
          </div>

          <Button type="submit" className="w-full">
            Submit
          </Button>

          <Button
            type="button"
            className="w-full"
            variant="secondary"
            onClick={handleCancel} // Redirects to home page
          >
            Cancel
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
