import React, { useMemo } from 'react';
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899'];

const LanguageChart = ({ repositories }) => {
  const chartData = useMemo(() => {
    if (!repositories || !Array.isArray(repositories)) return [];

    // 1. Map through all repos and count occurrences of each language
    const counts = repositories.reduce((acc, repo) => {
      const lang = repo.language || 'Other';
      acc[lang] = (acc[lang] || 0) + 1;
      return acc;
    }, {});

    const totalRepos = repositories.length;

    // 2. Format for Recharts
    return Object.entries(counts)
      .map(([name, count]) => ({
        name,
        value: count, // This represents number of projects
        percentage: ((count / totalRepos) * 100).toFixed(1)
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 7);
  }, [repositories]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip" style={{ background: '#1e293b', padding: '10px', borderRadius: '8px', border: '1px solid #334155' }}>
          <p className="label" style={{ margin: 0, fontWeight: 'bold', color: '#fff' }}>{data.name}</p>
          <p className="sub" style={{ margin: 0, color: '#94a3b8' }}>{data.value} Projects ({data.percentage}%)</p>
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0) return null;

  return (
    <div className="language-analysis card animate-fade-in">
      <div className="card-header">
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>🚀 Tech Stack Fingerprint</h3>
        <p style={{ color: '#94a3b8', fontSize: '14px' }}>Distribution of technologies across your portfolio</p>
      </div>

      <div style={{ width: '100%', height: 320 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={95}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
              animationDuration={1000}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom" 
              formatter={(value, entry, index) => (
                <span style={{ color: '#94a3b8', fontSize: '12px' }}>
                  {value} ({chartData[index]?.value} Repos)
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="tech-summary" style={{ textAlign: 'center', marginTop: '10px' }}>
        {chartData[0] && (
          <div className="primary-focus" style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#818cf8', padding: '6px 16px', borderRadius: '20px', display: 'inline-block', fontSize: '14px' }}>
            <strong>Expertise:</strong> Mostly worked with {chartData[0].name}
          </div>
        )}
      </div>
    </div>
  );
};

export default LanguageChart;