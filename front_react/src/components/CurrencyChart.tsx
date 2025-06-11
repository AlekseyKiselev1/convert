import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { fetchHistoricalRates } from "../api";
import "./CurrencyChart.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface CurrencyChartProps {
  baseCurrency: string;
  targetCurrency: string;
  onClose: () => void;
  days?: number;
}

export const CurrencyChart: React.FC<CurrencyChartProps> = ({ 
  baseCurrency,
  targetCurrency, 
  onClose,
  days = 180
}) => {
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await fetchHistoricalRates(baseCurrency, days, targetCurrency);

        if (!data?.rates || typeof data.rates !== "object") {
          throw new Error("Invalid data format from API");
        }

        const sortedDates = Object.keys(data.rates)
          .filter(date => data.rates[date] && typeof data.rates[date][targetCurrency] === "number")
          .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
        
        if (sortedDates.length === 0) {
            throw new Error(`Historical data for ${targetCurrency} is not available in the selected period.`);
        }

        setChartData({
          labels: sortedDates.map(date => new Date(date).toLocaleDateString()),
          datasets: [{
            label: `${baseCurrency} to ${targetCurrency}`,
            data: sortedDates.map(date => data.rates[date][targetCurrency]),
            borderColor: '#3a80ba',
            backgroundColor: 'rgba(58, 128, 186, 0.1)',
            tension: 0.4
          }]
        });
      } catch (err) {
        console.error("API Error:", err);
        setError(`Failed to load chart: ${err instanceof Error ? err.message : String(err)}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [baseCurrency, targetCurrency, days]);

  if (loading) return <div className="chart-loading">Loading chart data...</div>;
  if (error) return <div className="chart-error">{error}</div>;

  return (
    <div className="chart-modal">
      <div className="chart-container">
        <button className="close-btn" onClick={onClose}>×</button>
        <h3>{baseCurrency} to {targetCurrency} (Last {days} days)</h3>
        {chartData && (
          <div className="chart-wrapper">
            <Line 
              data={chartData}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'top' },
                  tooltip: {
                    callbacks: {
                      label: (context) => 
                        `1 ${baseCurrency} = ${context.parsed.y.toFixed(4)} ${targetCurrency}`
                    }
                  }
                }
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};