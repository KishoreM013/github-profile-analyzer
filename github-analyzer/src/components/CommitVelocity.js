import React from 'react';
import { Activity } from 'lucide-react'; // Fixes 'Activity' is not defined
import { 
  XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';

/**
 * Helper function to transform raw GitHub weekly data for the chart
 * @param {Array} weeklyData - Array from GitHub's /stats/commit_activity
 */
const formatCommitVelocity = (weeklyData) => {
  if (!weeklyData || !Array.isArray(weeklyData)) return [];
  
  return weeklyData.map((week) => ({
    // Convert Unix timestamp to a readable date
    name: new Date(week.week * 1000).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    }),
    commits: week.total,
  }));
};

const CommitVelocity = ({ data }) => {
  // Fixes 'formatCommitVelocity' is not defined
  const chartData = formatCommitVelocity(data);

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h4><Activity size={18} /> Yearly Commit Velocity</h4>
        <p>Activity frequency over the last 52 weeks</p>
      </div>

      <div style={{ width: '100%', height: 250 }}>
        <ResponsiveContainer>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorCommits" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
            <XAxis 
              dataKey="name" 
              hide={true} // Keeps the UI clean; labels show on hover (Tooltip)
            />
            <YAxis 
              stroke="#94a3b8" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1e293b', 
                border: '1px solid #334155', 
                borderRadius: '8px' 
              }}
              itemStyle={{ color: '#6366f1' }}
            />
            <Area 
              type="monotone" 
              dataKey="commits" 
              stroke="#6366f1" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorCommits)" 
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Fixes 'default export not found'
export default CommitVelocity;