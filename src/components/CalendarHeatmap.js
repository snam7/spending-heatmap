import React from "react";
import { Tooltip } from "react-tooltip";
import "./CalendarHeatmap.css";

const CalendarHeatmap = ({ data }) => {
  const aggregateDataByMonth = (transactions) => {
    const monthlyData = {};
    transactions.forEach((item) => {
      const date = new Date(item.date);
      const year = date.getFullYear();
      const month = date.getMonth() + 1; // 0 = January, 11 = December
      const monthKey = `${year}-${String(month).padStart(2, "0")}`; // Format: YYYY-MM

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { amount: 0, category: {} };
      }

      monthlyData[monthKey].amount += item.amount;

      const category = item.category || "Uncategorized";
      monthlyData[monthKey].category[category] =
        (monthlyData[monthKey].category[category] || 0) + item.amount;
    });

    return Object.entries(monthlyData).map(([month, data]) => ({
      month,
      amount: data.amount,
      category: data.category,
    }));
  };

  const monthlyData = aggregateDataByMonth(data);

  const getTooltipData = (monthData) => {
    if (!monthData) return "No data";
    const totalAmount = monthData.amount || 0;
    const categoryBreakdown = Object.entries(monthData.category)
      .map(([key, val]) => `<div>${key}: <strong>$${val.toFixed(2)}</strong></div>`)
      .join("");
    return `<div>
      <div><strong>Month:</strong> ${monthData.month}</div>
      <div><strong>Total:</strong> $${totalAmount.toFixed(2)}</div>
      <div><strong>Categories:</strong></div>
      ${categoryBreakdown}
    </div>`;
  };

  return (
    <div className="calendar-container">
      {monthlyData.map((monthData) => (
        <div
          key={monthData.month}
          className={`month-box color-scale-${Math.min(
            Math.floor(monthData.amount / 500),
            4
          )}`}
          data-tooltip-id="heatmap-tooltip"
          data-tooltip-html={getTooltipData(monthData)} // Use HTML for styled tooltips
        >
          {monthData.month}
        </div>
      ))}
      <Tooltip id="heatmap-tooltip" className="custom-tooltip" place="top" />
    </div>
  );
};

export default CalendarHeatmap;
