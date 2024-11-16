"use client"
import React, { useEffect, useState } from 'react'
import { Table } from 'react-bootstrap'
import styles from "./page.module.css"
import { LuHistory } from 'react-icons/lu'

const TransactionHistory = () => {

  const [allHistory, setAllHistory] = useState([])
  const [loader, setLoader] = useState(true);

  const fetchTransactionHistory = async () => {
    const userID = localStorage.getItem('user_id');

    // Check if userID is valid
    if (!userID) {
      console.error('User ID is not found in local storage');
      setLoader(false);
      return; // Exit the function if userID is not available
    }

    try {
      const response = await fetch(`/api/save-subscription?user_id=${userID}`);

      // Log the response status for debugging
      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorMessage = await response.text(); // Get the error message from the response
        throw new Error(`Network response was not ok: ${errorMessage}`);
      }

      const data = await response.json(); // Parse the JSON response
      setAllHistory(data.reverse()); // Set the fetched data to state

    } catch (error) {
      console.log('Error fetching transaction history:', error);
    } finally {
      setLoader(false); // Ensure loader is set to false
    }
  };

  useEffect(() => {
    fetchTransactionHistory();
  }, [])

  function formatData(inputDate) {
    const date = new Date(inputDate);
    const day = String(date.getDate()).padStart(2, '0');       // Ensure day is two digits
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }


  const fetchPlan = () => {
    const plan_id = localStorage.getItem("plan_id");
    switch (plan_id) {
      case -1:
        return `Plan Expired`;

      case 1:
        return `Starter (Monthly)`;

      case 2:
        return `Enterprise (Monthly)`;

      case 3:
        return `Starter (Yearly)`;

      case 4:
        return `Enterprise (Yearly)`;

      default:
        return `Free Plan`
    }
  }


  return (
    <div className={styles.paymentHistory}>
      <div className={`${styles.turnitGenPaste} ${styles.turnitGenPastepadi}`}>
        <div>
          <LuHistory size={20} />
          <h2 className={styles.heading}>
            Transactions
          </h2>
        </div>
        <div className={styles.activePlan}>
          Active Plan : <span>{fetchPlan()}</span>
        </div>
      </div>
      {loader ? (
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
        <>
          {allHistory.length > 0 && <> <Table className={styles.historyTable}>
            <thead>
              <tr>
                <th className={styles.firstHead}>Id</th>
                <th>Transaction ID</th>
                <th>Amount</th>
                <th>Plan Type</th>
                <th>Created Date</th>
                <th className={styles.lastHead}>Plan Expired Date</th>
              </tr>
            </thead>
            <tbody>
              {
                allHistory.length > 0 && allHistory.map((data, idx) => {
                  return (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>{data?.paymentId}</td>
                      <td>${data?.price}</td>
                      <td className={styles.planType}>{data?.planType}</td>
                      <td>{formatData(data?.startDate)}</td>
                      <td>{formatData(data?.plan_expired) || "-"}</td>
                    </tr>
                  );
                })
              }
            </tbody>
          </Table> <div className={styles.entyInfo}>{allHistory.length} Entries found</div> </>} </>}
    </div>
  )
}

export default TransactionHistory
