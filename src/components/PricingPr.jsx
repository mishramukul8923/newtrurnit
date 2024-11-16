"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '../components/dashboard.module.css';
import { loadStripe } from '@stripe/stripe-js';
import DecodeTokenEmail from '@/utils/DecodeTokenEmail';


const PricingPr = () => {
    const [text, setText] = useState('');
    const [wordCount, setWordCount] = useState(0);
    const [charCount, setCharCount] = useState(0);
    const [isActive, setIsActive] = useState(false);

    const [selectedPlan, setSelectedPlan] = useState('monthly');
    const [subscriptionPlans, setSubscriptionPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userEmail, setUserEmail] = useState("");
    const [userID, setUserID] = useState("")

    const options = [
        { name: 'Monthly', value: 'monthly' },
        { name: 'Yearly', value: 'yearly' },
      ];

      const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);
    
      const handleSubmit = async (planData) => {
        if (planData.price === 0) {
          window.location.href = '/welcome';
          return;
        }
        try {
          const response = await fetch('/api/payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(planData),
          });
    
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error('Payment initiation failed: ' + response.statusText);
          }
    
          const data = await response.json();
          const stripe = await stripePromise;
    
          if (data.sessionId) {
            await stripe.redirectToCheckout({ sessionId: data.sessionId });
          } else {
            console.error('Session ID is missing in the response');
          }
        } catch (error) {
          console.error('Error during payment:', error);
        }
      };
    
    //   const fetchSubscriptionPlans = async () => {
    //     try {
    //       const response = await fetch('/api/subscriptionPlan');
    //       if (!response.ok) {
    //         throw new Error('Failed to fetch subscription plans');
    //       }
    //       const data = await response.json();
    //       setSubscriptionPlans(data);
    //     } catch (err) {
    //       setError(err.message);
    //     } finally {
    //       setLoading(false);
    //     }
    //   };
    
      useEffect(() => {
        // fetchSubscriptionPlans();
    
        if (typeof window !== undefined) {
          const token = localStorage.getItem('token');
          if (token) {
            const email = DecodeTokenEmail(token);
            setUserEmail(email);
            const user_id =  localStorage.getItem('user_id');
            setUserID(user_id)
          }
        }
      }, []);
    
      const starterPlanData = {
        price: 2900,
        email: userEmail,
        planType: "monthly",
        name: subscriptionPlans[0]?.name,
        stripe_price_id: subscriptionPlans[0]?.stripe_price_id,
        trial_days: subscriptionPlans[0]?.trial_days,
        planId: subscriptionPlans[0]?.userId,
      };
    
      const freePlanData = {
        price: 0,
        email: userEmail,
      };


      const AllPlans = {
        month_starter : {
            id: 1,
            price: 29,
            email: userEmail,
            user_id: userID,
            planType: "monthly",
            expired_at: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString()
        },
        month_enterprise : {
            id: 2,
            price: 119,
            email: userEmail,
            user_id: userID,
            planType: "monthly",
            expired_at: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString()
        },
        year_starter : {
            id: 3,
            price: 348,
            email: userEmail,
            user_id: userID,
            planType: "yearly",
            expired_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
        },
        year_enterprise : {
            id: 14,
            price: 1428,
            email: userEmail,
            user_id: userID,
            planType: "yearly",
            expired_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
        }
        

      }

    // Toggle between monthly and yearly plans
    const togglePlan = () => {
        setIsActive(!isActive);
    };

    return (
        <div className={styles.turnitDashOvervBg}>
            <div className={styles.turnitDashOvervCont}>
             

                <div className={styles.starttextAreaContainer}>
                    <div className={styles.textAreaContainer}>
                        <h2 className={styles.stacHeading}>Pricing Plans</h2>
                        <div className={styles.planStatusContainer}>
                            <span className={styles.limitedText}>{isActive ? 'Monthly' : 'Monthly'}</span>
                            <div className={styles.planToggle} onClick={togglePlan}>
                                <div className={`${styles.circle} ${isActive ? styles.active : ''}`}></div>
                            </div>
                            <span className={styles.planText}>
                                {isActive ? 'Yearly (Unlimited prompts)' : (
                                    <>
                                        Yearly <span className={styles.highlightGreen}>(Get 2 Months Free)</span>
                                    </>
                                )}
                            </span>

                        </div>  

                        {/* ========== plans new ======== */}

                        <div className={`${styles.pricingPlanSection} ${styles.dashPricingPlanSection}`}>

                            <div className="container">
                                {isActive ? (
                                    // Yearly Plan Content
                                    <div className={styles.yearlyPlanContent}>


                                        {/* {selectedPlan == "monthly" && ( */}
                                        <div className={styles.planCardParent}>
                                            <div className={styles.planCard}>
                                                <div>
                                                    <span className={styles.planTag}>Free</span>
                                                    <div className={styles.planPrice}>$00</div>
                                                    <p className={styles.planPara}>
                                                        A 10X faster way to writing your professional copy
                                                    </p>

                                                    <div className={styles.planType} onClick={(e) => { e.preventDefault(); handleSubmit(freePlanData); }}>
                                                            Start for Free
                                                    </div>
                                                    <ul className={styles.planFeature}>
                                                        <li>Single seats</li>
                                                        <li>10,000 words per month</li>
                                                        <li>30+ AI writing tools</li>
                                                        <li>60+ Copywriting tools</li>
                                                        <li>10+ languages</li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <div className={styles.planCard}>
                                                <div>
                                                    <span className={styles.planTag}>Starter</span>
                                                    <div className={styles.planPrice}>$348</div>
                                                    <p className={styles.planPara}>
                                                        A 10X faster way to writing your professional copy
                                                    </p>
                                                    <div className={styles.planType} onClick={(e) => { e.preventDefault(); handleSubmit(AllPlans.year_starter); }}>
                                                            Choose Starter Plan
                                                    </div>
                                                    <ul className={styles.planFeature}>
                                                        <li>5 User seats</li>
                                                        <li>50,000 words per month</li>
                                                        <li>70+ AI writing tools</li>
                                                        <li>100+ Copywriting tools</li>
                                                        <li>Blog post wizard tool</li>
                                                        <li>25+ languages</li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <div className={styles.planCard}>
                                                <div>
                                                    <span className={styles.planTag}>Enterprise</span>
                                                    <div className={styles.planPrice}>$1428</div>
                                                    <p className={styles.planPara}>
                                                        A 10X faster way to writing your professional copy
                                                    </p>
                                                    <div className={styles.planType} onClick={(e) => { e.preventDefault(); handleSubmit(AllPlans.year_enterprise); }}>
                                                            Choose Enterprise Plan
                                                    </div>
                                                    <ul className={styles.planFeature}>
                                                        <li>Unlimited seats</li>
                                                        <li>10,000 words per month</li>
                                                        <li>100+ AI writing tools</li>
                                                        <li>200+ Copywriting tools</li>
                                                        <li>Blog post wizard tool</li>
                                                        <li>25+ languages</li>
                                                    </ul>
                                                </div>
                                                <span className={styles.planCardPopular}>Most Popular</span>
                                            </div>
                                        </div>
                                        {/* )} */}
                                    </div>
                                ) : (
                                    // Monthly Plan Content
                                    <div className={styles.monthlyPlanContent}>

                                        {/* {selectedPlan == "yearly" && ( */}
                                        <div className={styles.planCardParent}>

                                        <div className={styles.planCard}>
                                                <div>
                                                    <span className={styles.planTag}>Free</span>
                                                    <div className={styles.planPrice}>$00</div>
                                                    <p className={styles.planPara}>
                                                        A 10X faster way to writing your professional copy
                                                    </p>
                                                    <div className={styles.planType} onClick={(e) => { e.preventDefault(); handleSubmit(freePlanData); }}>
                                                            Start for Free
                                                    </div>
                                                    <ul className={styles.planFeature}>
                                                        <li>Single seats</li>
                                                        <li>10,000 words per month</li>
                                                        <li>30+ AI writing tools</li>
                                                        <li>60+ Copywriting tools</li>
                                                        <li>10+ languages</li>
                                                    </ul>
                                                </div>
                                            </div>

                                            <div className={styles.planCard}>
                                                <div>
                                                    <span className={styles.planTag}>Starter</span>
                                                    <div className={styles.planPrice}>$29</div>
                                                    <p className={styles.planPara}>
                                                        A 10X faster way to writing your professional copy
                                                    </p>
                                                    {/* <h5 className={styles.planType}></h5> */}
                                                    <div className={styles.planType} onClick={(e) => { e.preventDefault(); handleSubmit(AllPlans.month_starter); }}>
                                                            Choose Starter Plan
                                                    </div>
                                                    <ul className={styles.planFeature}>
                                                        <li>5 User seats</li>
                                                        <li>50,000 words per month</li>
                                                        <li>70+ AI writing tools</li>
                                                        <li>100+ Copywriting tools</li>
                                                        <li>Blog post wizard tool</li>
                                                        <li>25+ languages</li>
                                                    </ul>
                                                </div>
                                            </div>

                                            <div className={styles.planCard}>
                                                <div>
                                                    <span className={styles.planTag}>Enterprise</span>
                                                    <div className={styles.planPrice}>$119</div>
                                                    <p className={styles.planPara}>
                                                        A 10X faster way to writing your professional copy
                                                    </p>
                                                    <div className={styles.planType} onClick={(e) => { e.preventDefault(); handleSubmit(AllPlans.month_enterprise); }}>
                                                            Choose Enterprise Plan
                                                    </div>
                                                    <ul className={styles.planFeature}>
                                                        <li>Unlimited seats</li>
                                                        <li>10,000 words per month</li>
                                                        <li>100+ AI writing tools</li>
                                                        <li>200+ Copywriting tools</li>
                                                        <li>Blog post wizard tool</li>
                                                        <li>25+ languages</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                        {/* )} */}



                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PricingPr;