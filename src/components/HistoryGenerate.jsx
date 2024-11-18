"use client";

import styles from './dashboard.module.css';
import { Image } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const HistoryGenerate = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [genHistory, setGeneratorHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] =  useState('');

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // Number of items per page


   

  
    const router = useRouter();

     const saveKeyAndNavigate = (item) => {
    console.log("my key in history item: ", item);

    localStorage.setItem('keyword', JSON.stringify({
        title: item.text,
        createdId: item.createdAt
    }));

    if (typeof updategneinfo === "function") {
        updategneinfo();
    }

    router.push('/dashboard/generate');
};







    // Function to get userId from localStorage
const getUserId = () => {
    if (typeof window !== undefined) {
      // Access localStorage only on the client side
      const userId = localStorage.getItem('userId');
      setUserId(userId)
      return userId;
    }
    return null;
  };
  

  console.log(userId); // Log the userId or use it in your logic





  

    useEffect(() => {
        getUserId();
        const geneHistory = async () => {
          
            try {
                const response = await fetch(`/api/history/generator/672daf0549f3b3dcda8d069b`);
                if (!response.ok) {
                    throw new Error(`Error: ${response.statusText}`);
                }
                const result = await response.json();
                setGeneratorHistory(result);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }
     

        geneHistory();
    }, []);

    const calculateTimeAgo = (timestamp) => {
        const date = new Date(timestamp); // Ensure timestamp is a Date object
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours} hours ago`;
        const diffInDays = Math.floor(diffInHours / 24);
        return `${diffInDays} days ago`;
    };

    const filteredHistory = genHistory.filter((item) =>
        item.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.generatedContent.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calculate the paginated data
    const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filteredHistory.slice(startIndex, startIndex + itemsPerPage);

    // Handle pagination navigation
    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <div className={styles.turnitApiDetectorheadingbg}>
            <div className={styles.turnitApiDetectorheadingsrch}>
                <div className={styles.turnitApiDetectorheading}>
                    <Image src="/images/genr.svg" alt="Open Menu" fluid />
                    <p>History Generate</p>
                </div>

                {/* Search Bar */}
                <div className={styles.turnitHumanizerHistorySearch}>
                    <input
                        type="text"
                        placeholder="Search history"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>
            </div>

            <div className={styles.turnitHumanizerHistory}>
                {loading ? (
                    <div>  
                         <div className="ml-loader">
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
                </div></div>
                ) : error ? (
                    <p>{error}</p>
                ) : paginatedData.length > 0 ? (
                    paginatedData.map((item, index) => (
                        <div  onClick={() => saveKeyAndNavigate(item)} key={index} className={styles.turnitHumanizerHistoryRedirect}>
                            <div className={styles.turnitHumanizerHistoryRedirectTxt}>
                                <h4> 
        {item.text}
      </h4>
                                <div className={styles.turnitHumanizerHistoryRedirectTime}>
                                    <p>{calculateTimeAgo(item.createdAt)}</p>
                                </div>
                            </div>
                            <div className={styles.turnitHumanizerHistoryRedirectPara}>
                                <p>{item.generatedContent}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No results found.</p>
                )}
            </div>

            {/* Pagination Controls */}
            {filteredHistory.length > itemsPerPage && (
                <div className={styles.paginationControls}>
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <span>
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default HistoryGenerate;
