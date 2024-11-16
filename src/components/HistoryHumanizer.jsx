"use client";
import React, { useState, useEffect } from "react";
import styles from "./dashboard.module.css";
import { Image } from "react-bootstrap";
import { useRouter } from "next/navigation";




const HistoryHumanizer = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [humanHistory, setHumanHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  



  const itemsPerPage = 5;

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch("/api/history/humanizer/672daf0549f3b3dcda8d069b");
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const result = await response.json();
        setHumanHistory(result.reverse());
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

const router = useRouter();
  const saveKeyAndNavigate = (subItem) => {
   
    // Save the keyword to local storage
    console.log("my key subitem : ", subItem)
   

    localStorage.setItem('keyword', JSON.stringify({
      title: subItem.text,
      createdId: subItem.createdAt
    }));

   
      router.push('/dashboard/humanizer');
      updateinfo()


  };










  

  const calculateTimeAgo = (timestamp) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - new Date(timestamp)) / 1000);
    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  const filteredHistory = humanHistory.filter((item) => {
    const text = typeof item?.text === "string" ? item.text : "";
    const humanizedContent = typeof item?.humanizedContent === "string" ? item.humanizedContent : "";
    return (
      text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      humanizedContent.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredHistory.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className={styles.turnitApiDetectorheadingbg}>
      <div className={styles.turnitApiDetectorheadingsrch}>
        <div className={styles.turnitApiDetectorheading}>
          <Image src="/images/thumb.svg" alt="Open Menu" fluid />
          <p>History Humanizer</p>
        </div>

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
        {loading && <div className={styles.turnitHumanizerHistoryloader}>   <div className="ml-loader">
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
                                    </div></div>}
        {error && <p>Error: {error}</p>}
        {!loading &&
          currentItems.map((item, index) => {
            const text = typeof item?.text === "string" ? item.text : "";
            const humanizedContent = typeof item?.humanizedContent === "string" ? item.humanizedContent : "";

            return (
              <div onClick={() => saveKeyAndNavigate(item)} key={index} className={styles.turnitHumanizerHistoryRedirect}>
                <div className={styles.turnitHumanizerHistoryRedirectTxt}>
                  <h4  >  {text || "No Title"}</h4>
                  <div className={styles.turnitHumanizerHistoryRedirectTime}>
                    <p>{calculateTimeAgo(item.createdAt)}</p>
                  </div>
                </div>
                <div className={styles.turnitHumanizerHistoryRedirectPara}>
                  <p>{humanizedContent || "No Content"}</p>
                </div>
              </div>
            );
          })}
      </div>

      <div className={styles.pagination}>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={styles.paginationButton}
        >
          Previous
        </button>
        <span className={styles.paginationInfo}>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={styles.paginationButton}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default HistoryHumanizer;
