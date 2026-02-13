import React from 'react';
import { CheckCircle, AlertCircle, Award } from 'lucide-react';

const RecruiterSignals = ({ analysis }) => {
  // GUARD: If analysis or metrics are missing, show a placeholder or nothing
  if (!analysis || !analysis.metrics) {
    return <div className="signals-container card">Analyzing signals...</div>;
  }

  return (
    <div className="signals-container card">
      <h3><Award size={20} /> Recruitment Signals</h3>
      
      <div className="metrics-grid">
        <div className="metric-card">
          <label>Readability</label>
          <div className="progress-bg">
            <div 
              className="progress-fill" 
              style={{ width: `${analysis.metrics.readability || 0}%` }}
            ></div>
          </div>
        </div>
        <div className="metric-card">
          <label>Collaboration</label>
          <div className="progress-bg">
            <div 
              className="progress-fill green" 
              style={{ width: `${analysis.metrics.collaboration || 0}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="signal-pills">
        {/* Use optional chaining and empty array fallback */}
        {(analysis.strengths || []).map((s, i) => (
          <span key={i} className="pill strength"><CheckCircle size={14}/> {s}</span>
        ))}
        {(analysis.redFlags || []).map((r, i) => (
          <span key={i} className="pill danger"><AlertCircle size={14}/> {r}</span>
        ))}
      </div>
    </div>
  );
};

export default RecruiterSignals;