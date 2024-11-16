"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Router from "next/navigation"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useSession, signIn } from "next-auth/react"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"

export function SignUpForm() {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { data: session } = useSession();
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const isEmailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isPasswordValid = (password) => /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{5,}$/.test(password);

    if (!isEmailValid(email)) {
      toast.error('Please enter a valid email address.');
      setIsLoading(false);
      return;
    }

    if (!isPasswordValid(password)) {
      toast.error('Password must be at least 5 characters long and include at least one uppercase letter, one number, and one special character.');
      setIsLoading(false);
      return;
    }

    const postData = { firstname, lastname, email, password, temporary: true, auth: false, subscription: false, social: false, plan_id: 0 };

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error || 'Failed to create user';
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }

      const result = await response.json();
      localStorage.setItem("name", firstname + " " + lastname);
      localStorage.getItem("plan_id", 0)
      toast.success(result.message || 'Welcome!');
      setFirstname('');
      setLastname('');
      setEmail('');
      setPassword('');
      setSuccess(!success);

      setTimeout(() => {
        router.push("/");
      }, 1000);


    } catch (error) {
      console.error("Error:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const socialPostFunc = async () => {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ /* Include required data */ }),
    });
  }

  useEffect(() => {
    if (session?.user?.name) {
      socialPostFunc();
      localStorage.setItem('userSession', JSON.stringify(session));
    } else {
      localStorage.removeItem('userSession');
    }
  }, [session]);

  const handleSocial = async (event) => {
    event.preventDefault();
    console.log("we are in handel social function")


    // Trigger Google sign-in
    await signIn('google', { redirect: false }); // Use redirect: false to handle response manually


};














  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Sign Up</CardTitle>
        <CardDescription>Enter your email below to signup to your account</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="text">First Name</Label>
            <Input id="text" type="text" value={firstname} onChange={(e) => setFirstname(e.target.value)} placeholder="Enter First Name" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="text">Last Name</Label>
            <Input id="text" type="text" value={lastname} onChange={(e) => setLastname(e.target.value)} placeholder="Enter Last Name" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="m@example.com" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading} onClick={handleSubmit}>
            {isLoading ? 'Signing Up...' : 'Sign Up'}
          </Button>
          <Button variant="outline" className="w-full" onClick={handleSocial}>
            Sign Up with Google
          </Button>
        </div>
        <div className="mt-4 text-center text-sm">
          Do you have an account? <Link href="/" className="underline">Log in</Link>
        </div>
      </CardContent>
    </Card>
  );
}
