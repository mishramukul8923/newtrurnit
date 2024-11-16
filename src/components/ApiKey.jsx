'use client';
import React, { useState, useEffect } from 'react';
import styles from './dashboard.module.css';
import { Image } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ApiKey = () => {
    const [GPTzero, setGPTzero] = useState('');
    const [ZeroGPT, setZeroGPT] = useState('');
    const [Originality, setOriginality] = useState('');
    const [CopyLeaks, setCopyLeaks] = useState('');

    useEffect(() => {
        const fetchApiKeys = async () => {
            try {
                const response = await fetch('/api/users', { method: 'GET' });
                if (response.ok) {
                    const data = await response.json();
                    setGPTzero(data.gptZeroApiKey || '');
                    setZeroGPT(data.zeroGptApiKey || '');
                    setOriginality(data.originalityApiKey || '');
                    setCopyLeaks(data.copyLeaksApiKey || '');
                } else {
                    toast.error("Failed to load API keys");
                }
            } catch (error) {
                console.error('Error fetching API keys:', error);
            }
        };

        fetchApiKeys();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = {
            gptZeroApiKey: GPTzero || null,
            zeroGptApiKey: ZeroGPT || null,
            originalityApiKey: Originality || null,
            copyLeaksApiKey: CopyLeaks || null,
        };

        const filledData = Object.fromEntries(
            Object.entries(data).filter(([_, value]) => value)
        );

        if (Object.keys(filledData).length === 0) {
            toast.error("Please fill at least one API key field.");
            return;
        }

        try {
            const response = await fetch('/api/users', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(filledData),
            });

            if (response.ok) {
                toast.success("API keys updated successfully");
            } else {
                toast.error("Failed to update API keys");
            }
        } catch (error) {
            console.error("Error updating API keys:", error);
            toast.error("Error: Unable to save API keys");
        }
    };

    return (
        <div className={styles.turnitApiDetectorheadingbg}>
            <div className={styles.turnitApiDetectorheading}>
                <Image src="/images/apkey.svg" alt="API Keys" fluid />
                <p>API Keys</p>
            </div>
            <div className={styles.turnitApiDetectorBg}>
            <div className={styles.turnitApiDetectorContent}>
                    <h4>AI Detector API Keys</h4>
                    <p>Enter your API keys for various AI detectors</p>
                    <p>We do not store API keys; they are saved in your browser’s local storage</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className={styles.turnitApiDetectorKey}>
                        <div className={styles.tApiDetectorKey}>
                            <h5>GPTzero API key</h5>
                            <input
                                type="text"
                                placeholder="Enter GPTzero API key"
                                value={GPTzero}
                                onChange={(e) => setGPTzero(e.target.value)}
                            />
                        </div>
                        <div className={styles.tApiDetectorKey}>
                            <h5>ZeroGPT API key</h5>
                            <input
                                type="text"
                                placeholder="Enter ZeroGPT API key"
                                value={ZeroGPT}
                                onChange={(e) => setZeroGPT(e.target.value)}
                            />
                        </div>
                        <div className={styles.tApiDetectorKey}>
                            <h5>Originality AI API key</h5>
                            <input
                                type="text"
                                placeholder="Enter Originality AI API key"
                                value={Originality}
                                onChange={(e) => setOriginality(e.target.value)}
                            />
                        </div>
                        <div className={styles.tApiDetectorKey}>
                            <h5>CopyLeaks API key</h5>
                            <input
                                type="text"
                                placeholder="Enter CopyLeaks API key"
                                value={CopyLeaks}
                                onChange={(e) => setCopyLeaks(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className={styles.turnitApiDetectorBgbtn}>
                        <button type="submit">Save API Keys</button>
                    </div>
                </form>
            </div>
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default ApiKey;
