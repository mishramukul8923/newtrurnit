"use client";
import DecodeTokenEmail from '@/utils/DecodeTokenEmail';
import FetchUserDetails from '@/utils/FetchUserDetails';
import { useEffect, useState } from 'react';
import styles from "./page.module.css"
import { Image } from 'react-bootstrap';
import { useRouter } from 'next/navigation';

const PaymentSuccess = () => {
  const [sessionData, setSessionData] = useState(null);
  const [hasSaved, setHasSaved] = useState(false);
  const [userId, setUserId] = useState(null);
  const router = useRouter();
  const [loading, setLoading] = useState(true);


  const updateUser = async (newPlan) => {
    const token = localStorage.getItem("token");

    let body = {
      email: DecodeTokenEmail(token)
    }
    body.plan_id = newPlan;

    try {
        // Validate input
        if (!email || typeof email !== 'string') {
            throw new Error("Email is required and must be a string.");
        }
        if (!updateFields || typeof updateFields !== 'object') {
            throw new Error("Update fields must be an object.");
        }

        // Prepare the API request
        const response = await fetch('/api/user', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        // Parse the response
        const data = await response.json();

        if (!response.ok) {
            // Handle error responses
            console.error("Failed to update user:", data.error);
            alert(`Error: ${data.error}`);
        } else {
            // Handle success
            console.log("User updated successfully:", data.user);
            alert("User updated successfully.");
        }
    } catch (error) {
        // Catch and handle unexpected errors
        console.error("An unexpected error occurred:", error.message);
        alert(`Error: ${error.message}`);
    }
};


  useEffect(() => {
    // Check if running in a browser environment
    if (typeof window !== undefined) {
      const token = localStorage.getItem('token'); // replace 'your_token_key' with the actual key name
      if (token) {
        const email = DecodeTokenEmail(token);

        // Fetch user details based on decoded email
        FetchUserDetails(email).then((userData) => {
          if (userData) {
            console.log("this  is user data to find id", userData[0])
            setUserId(userData[0]._id);
          }
        }).catch((error) => {
          console.error("Failed to fetch user details:", error);
        });
      }
    }
  }, []);

  useEffect(() => {

    const fetchSessionData = async () => {
      try {
        const sessionId = new URLSearchParams(window.location.search).get('session_id');
        // Log or use the fetched parameters as needed
        if (!sessionId) {
          console.error("Session ID not found in URL");
          return;
        }

        const response = await fetch(`/api/payment-success?session_id=${sessionId}`);

        if (!response.ok) {
          console.error('Failed to fetch session data');
          return;
        }

        const data = await response.json();
        console.log("Fetched session data:", data);

        if (data) {
          setSessionData(data);
        } else {
          console.error("Incomplete session data received:", data);
        }
      } catch (error) {
        console.error('Error fetching session data:', error);
      }
      finally{
        setLoading(false);
        setTimer(5)
      }
    };

    fetchSessionData();
  }, []);

  // Create and save subscription data only once after sessionData is set
  useEffect(() => {
    if (sessionData && !hasSaved) {
      const price = new URLSearchParams(window.location.search).get('price'); // Fetch price from URL
      const planType = new URLSearchParams(window.location.search).get('planType'); // Fetch planType from URL
      const expired_at = new URLSearchParams(window.location.search).get('expired_at');
      const id = new URLSearchParams(window.location.search).get('id');

      const subscriptionData = {
        userId: userId,
        email: sessionData?.customer_email,
        paymentIntentId: sessionData?.payment_intent,
        paymentStatus: sessionData?.payment_status,
        sessionId: sessionData?.id,
        customerEmail: sessionData?.customer_details?.email || sessionData?.customer_email,
        totalAmount: sessionData?.amount_total,
        currency: sessionData?.currency,
        createdTimestamp: sessionData?.created,
        price: price,
        planType: planType,
        plan_expired: expired_at,
        plan_id: id
      };

      console.log("Constructed subscription data:", subscriptionData);

      const saveSubscriptionData = async () => {
        try {
          const saveResponse = await fetch('/api/save-subscription', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(subscriptionData),
          });

          const saveResult = await saveResponse.json();
          if (saveResponse.ok) {
            updateUser(subscriptionData?.plan_id)
            setHasSaved(true); // Set flag to prevent duplicate saves
          } else {
            console.error("Failed to save subscription:", saveResult.error);
          }
        } catch (error) {
          console.error("Error saving subscription:", error);
        }
      };

      saveSubscriptionData();
    }
  }, [sessionData, hasSaved]);



  const [timer, setTimer] = useState(null);

  useEffect(() => {
    if(timer == null){
      return;
    }
    const clockTime = setInterval(() => {
      setTimer(prevTimer => {
        if (prevTimer <= 1) {
          clearInterval(clockTime);
          router.push('/dashboard/transactions');
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(clockTime); // Cleanup on unmount
  }, [timer]);

  return (
    <>
      
        <div className={styles.paymentPageMsg}>
        {loading ? (
        <div className="ml-loader ml-loader-humanizer">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>) :
          <div className={styles.payemntDiv}>
            <div className={styles.turnitLogo}>
              <Image src='/images/turnit-logo.svg'/>
            </div>
            <svg width="86" height="86" viewBox="0 0 86 86" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="86" height="86" rx="41.9512" fill="#0AB27D" />
              <path d="M59.7797 30.4152L36.7066 53.4883L26.2188 43.0005" stroke="white" stroke-width="5.2439" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <h1 className={styles.paymentHead}>Payment Success</h1>
            {sessionData && (
              <div className={styles.paymentInfo}>
                <h2>Thank you for your payment!</h2>
                <p>Payment Status: {sessionData?.payment_status}</p>
                <p>Total Amount: {(sessionData?.amount_total / 100).toFixed(2)} {sessionData?.currency?.toUpperCase()}</p>
                <p>Tranasaction ID: {sessionData?.payment_intent}</p>
                <br />
                <br />
                <p>Redirecting to Transactions History...</p>
                <p>Please wait...{timer}</p>
              </div>
            )}
          </div>}
        </div>
    </>)
};

export default PaymentSuccess;
