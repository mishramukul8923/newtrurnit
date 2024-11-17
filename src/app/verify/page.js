'use client';


import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Image } from 'react-bootstrap';

function Verify() {
  const [message, setMessage] = useState('Verifying...');
  const [verified, setVerified]= useState('')
  const router = useRouter();
  const searchParams = useSearchParams();

  // Extract the token from the URL query parameters
  const token = searchParams ? searchParams.get('token') : null;
  console.log("extract token from url", token)

  useEffect(() => {
    const verifyEmail = async () => {
      if (token) {
        try {
          // Call the API to verify the email
          const response = await fetch(`/api/authentication/verify?token=${token}`);
          console.log("respose is", response)

          // Check the response status
          if (response.ok) {
            const data = await response.json();
            console.log("response in verifyEmail", data);
            setVerified('Email verified! Redirecting to login...')

            setMessage('Email verified! Redirecting to login...');

            // Redirect to the login page after a delay
            setTimeout(() => {
              router.push('/login');  // Redirect to login
            }, 2000); // 2 seconds delay before redirecting
          } else {
            const data = await response.json();
            setMessage(data.message || 'Verification failed.');
          }
        } catch (error) {
          console.error('Error verifying email:', error);
          setMessage('An error occurred during verification.');
        }
      }
    };

    // Call the verification function only when the token is available
    if (token) {
      verifyEmail();
    } else {
      setMessage('Invalid token or token missing.');
    }
  }, [token, router]);

  return (
    <>
    <div className="container">
        <div className="turnitLoginbg">
            {/* Left Side - Image and Text */}
            <div className="left-side">
                <h1>
                    Unlock the Power of{' '}
                    <span className="highlight">TurnitHuman</span> Copywriting Tool
                </h1>
                <div className="imageContainerLogo">
                    <Image
                        src="/images/login-bg.svg" // Use absolute path
                        alt="Login img"
                        fluid // Makes the image responsive
                    />
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="right-side">
                <div className="logo-section">
                    <Image
                        src="/images/logo-login.svg" // Use absolute path
                        alt="Login img"
                        fluid // Makes the image responsive
                    />
                </div>
                <div>

             <div>{verified}</div>  
                </div>
              
               
            </div>
        </div>
    </div>
    
</>
  );
}
























export default function page() {
  return (
    <Suspense >
      <Verify />
    </Suspense>
  )
}