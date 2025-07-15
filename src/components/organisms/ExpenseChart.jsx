import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Chart from "react-apexcharts";
import ApperIcon from "@/components/ApperIcon";
import Select from "@/components/atoms/Select";
import Card from "@/components/atoms/Card";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import categoryService from "@/services/api/categoryService";
import transactionService from "@/services/api/transactionService";

const ExpenseChart = () => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [chartType, setChartType] = useState("pie");
  const [timeRange, setTimeRange] = useState("thisMonth");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [transactionsData, categoriesData] = await Promise.all([
        transactionService.getAll(),
        categoryService.getAll()
      ]);
      setTransactions(transactionsData);
      setCategories(categoriesData);
    } catch (err) {
      setError("Failed to load chart data");
    } finally {
      setLoading(false);
    }
  };

  const getFilteredTransactions = () => {
    const now = new Date();
    let startDate;

    switch (timeRange) {
      case "thisWeek":
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
        break;
      case "thisMonth":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "last3Months":
        startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
        break;
      case "thisYear":
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= startDate && transaction.type === "expense";
    });
  };

  const getCategoryData = () => {
    const filteredTransactions = getFilteredTransactions();
    const categoryTotals = {};

    filteredTransactions.forEach(transaction => {
      const category = transaction.category;
      categoryTotals[category] = (categoryTotals[category] || 0) + transaction.amount;
    });

return Object.entries(categoryTotals)
      .map(([category, amount]) => {
        const categoryInfo = categories.find(cat => cat.Name === category) || {
          Name: category,
          name: category,
          color: "#6B7280"
        };
        return {
          category,
          amount,
          color: categoryInfo.color
        };
      })
      .sort((a, b) => b.amount - a.amount);
  };

  const getLineChartData = () => {
    const filteredTransactions = getFilteredTransactions();
    const dailyTotals = {};

    filteredTransactions.forEach(transaction => {
      const date = transaction.date;
      dailyTotals[date] = (dailyTotals[date] || 0) + transaction.amount;
    });

    const sortedDates = Object.keys(dailyTotals).sort();
    
    return {
      dates: sortedDates,
      amounts: sortedDates.map(date => dailyTotals[date])
    };
  };

  const renderPieChart = () => {
    const data = getCategoryData();
    
    if (data.length === 0) {
      return (
        <div className="flex items-center justify-center h-64 text-gray-500">
          <div className="text-center">
            <ApperIcon name="PieChart" className="w-12 h-12 mx-auto mb-2 text-gray-400" />
            <p>No expense data for selected period</p>
          </div>
        </div>
      );
    }

    const chartOptions = {
      chart: {
        type: "pie",
        height: 350,
        animations: {
          enabled: true,
          easing: "easeinout",
          speed: 800
        }
      },
      labels: data.map(item => item.category),
      colors: data.map(item => item.color),
      legend: {
        position: "bottom",
        fontSize: "14px"
      },
      tooltip: {
        y: {
          formatter: (value) => `$${value.toFixed(2)}`
        }
      },
      plotOptions: {
        pie: {
          donut: {
            size: "45%",
            labels: {
              show: true,
              total: {
                show: true,
                label: "Total",
                formatter: () => `$${data.reduce((sum, item) => sum + item.amount, 0).toFixed(2)}`
              }
            }
          }
        }
      }
    };

    return (
      <Chart
        options={chartOptions}
        series={data.map(item => item.amount)}
        type="donut"
        height={350}
      />
    );
  };

  const renderLineChart = () => {
    const { dates, amounts } = getLineChartData();
    
    if (dates.length === 0) {
      return (
        <div className="flex items-center justify-center h-64 text-gray-500">
          <div className="text-center">
            <ApperIcon name="TrendingUp" className="w-12 h-12 mx-auto mb-2 text-gray-400" />
            <p>No expense data for selected period</p>
          </div>
        </div>
      );
    }

    const chartOptions = {
      chart: {
        type: "area",
        height: 350,
        zoom: {
          enabled: false
        },
        animations: {
          enabled: true,
          easing: "easeinout",
          speed: 800
        }
      },
      colors: ["#3B82F6"],
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.1,
          stops: [0, 90, 100]
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "smooth",
        width: 3
      },
      xaxis: {
        categories: dates.map(date => new Date(date).toLocaleDateString()),
        labels: {
          style: {
            fontSize: "12px"
          }
        }
      },
      yaxis: {
        labels: {
          formatter: (value) => `$${value.toFixed(0)}`
        }
      },
      tooltip: {
        y: {
          formatter: (value) => `$${value.toFixed(2)}`
        }
      },
      grid: {
        borderColor: "#E5E7EB",
        strokeDashArray: 5
      }
    };

    return (
      <Chart
        options={chartOptions}
        series={[{
          name: "Daily Expenses",
          data: amounts
        }]}
        type="area"
        height={350}
      />
    );
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <h1 className="text-2xl font-bold text-gray-900">Expense Analytics</h1>
        
        <div className="flex space-x-4">
          <Select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="w-48"
          >
            <option value="thisWeek">This Week</option>
            <option value="thisMonth">This Month</option>
            <option value="last3Months">Last 3 Months</option>
            <option value="thisYear">This Year</option>
          </Select>
          
          <Select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            className="w-48"
          >
            <option value="pie">Category Breakdown</option>
            <option value="line">Spending Trend</option>
          </Select>
        </div>
      </div>

      <motion.div
        key={chartType + timeRange}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {chartType === "pie" ? "Expenses by Category" : "Daily Spending Trend"}
            </h2>
            <p className="text-sm text-gray-600">
              {timeRange === "thisWeek" && "Last 7 days"}
              {timeRange === "thisMonth" && "Current month"}
              {timeRange === "last3Months" && "Last 3 months"}
              {timeRange === "thisYear" && "Current year"}
            </p>
          </div>
          
          {chartType === "pie" ? renderPieChart() : renderLineChart()}
        </Card>
      </motion.div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {getCategoryData().slice(0, 3).map((item, index) => (
          <motion.div
            key={item.category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card hover className="p-6">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{item.category}</h3>
                  <p className="text-2xl font-bold text-gray-900">${item.amount.toFixed(2)}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ExpenseChart;