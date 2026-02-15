import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  ScriptableContext
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

interface PortfolioChartProps {
  data: number[][]; 
}

export const PortfolioChart = ({ data }: PortfolioChartProps) => {
  // 1. ЛОГИРОВАНИЕ (Чтобы мы видели в консоли, что приходит)
  // console.log("Chart Data Received:", data);

  // 2. ЗАЩИТА: Проверяем, что data - это реальный массив
  const isValidData = data && Array.isArray(data) && data.length > 0;

  if (!isValidData) {
    return (
      <div className="mt-4 p-4 bg-slate-800 rounded-lg shadow-lg border border-slate-700 h-[300px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-slate-400 text-sm">Synchronizing Data...</span>
        </div>
      </div>
    );
  }

  // 3. БЕЗОПАСНАЯ ОБРАБОТКА (Try-Catch внутри map)
  // Мы отфильтруем "битые" данные, чтобы график не падал
  const validPoints = data.filter(item => {
    if (!Array.isArray(item) || typeof item[0] !== 'number') return false;
    // Проверка на валидность даты
    const date = new Date(item[0]);
    return !isNaN(date.getTime());
  });

  const chartLabels = validPoints.map((item) => {
    try {
      const date = new Date(item[0]);
      return new Intl.DateTimeFormat('en-US', { weekday: 'short', hour: 'numeric' }).format(date);
    } catch (e) {
      return "";
    }
  });

  const chartPrices = validPoints.map((item) => item[1]);

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        fill: true,
        label: 'Price',
        data: chartPrices,
        borderColor: '#10b981',
        borderWidth: 2,
        backgroundColor: (context: ScriptableContext<"line">) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, 'rgba(16, 185, 129, 0.5)');
          gradient.addColorStop(1, 'rgba(16, 185, 129, 0.0)');
          return gradient;
        },
        pointRadius: 0,
        pointHoverRadius: 6,
        pointBackgroundColor: '#10b981',
        pointBorderColor: '#fff',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#334155',
        borderWidth: 1,
        padding: 10,
        displayColors: false,
        callbacks: {
          label: function(context: any) {
            return '$' + context.parsed.y.toLocaleString();
          }
        }
      },
    },
    scales: {
      x: { display: false },
      y: { 
        display: true, 
        grid: { color: '#334155', drawBorder: false },
        ticks: { color: '#64748b', callback: (val: any) => '$' + val }
      }
    },
    interaction: { mode: 'index' as const, intersect: false },
    elements: { line: { tension: 0.4 } }
  };

  return (
    <div className="mt-4 p-4 bg-slate-800 rounded-lg shadow-lg border border-slate-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">Bitcoin (7 Days)</h3>
        <div className="flex items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
           <span className="text-xs text-emerald-400">Live API</span>
        </div>
      </div>
      <div className="w-full h-[300px]">
        <Line options={options} data={chartData} />
      </div>
    </div>
  );
};