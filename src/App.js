import React, { useState, useEffect } from "react";
import Papa from "papaparse"; // For parsing CSV files
import CalendarHeatmap from './components/CalendarHeatmap'; // Heatmap component

const App = () => {
  const [data, setData] = useState([]); // State to hold parsed CSV data

  // Load default CSV on page load
  useEffect(() => {
    fetch("/transactions.csv")
      .then((response) => response.text())
      .then((csvText) => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            const processedData = processData(result.data);
            setData(processedData);
          },
        });
      })
      .catch((error) => console.error("Error loading default CSV:", error));
  }, []);

  // Handle file upload and parse CSV
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          const processedData = processData(result.data);
          setData(processedData);
        },
      });
    }
  };

  // Process the parsed CSV data
  const processData = (transactions) => {
    return transactions
      .filter((transaction) => parseFloat(transaction.Amount) < 0) // Only include spending
      .map((transaction) => ({
        date: transaction["Posting Date"], // Use Posting Date as the date
        amount: Math.abs(parseFloat(transaction.Amount)), // Convert to positive value
        category: transaction.Description || "Uncategorized", // Use Description as the category
      }));
  };

  return (
    <div className="app-container">
      <h1>Monthly Spending Heatmap</h1>
      <p>View default spending data or upload your CSV file to see your own spending heatmap.</p>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        className="file-input"
      />
      {data.length > 0 ? (
        <CalendarHeatmap data={data} />
      ) : (
        <p>Loading default data...</p>
      )}
    </div>
  );
};

export default App;
