import React, { useState, useEffect } from 'react';
import GithubAPI from './services/api';
import ProfileHeader from './components/ProfileHeader';
import RecruiterSignals from './components/RecruiterSignals';
import RepoExplorer from './components/RepoExplorer';
import LanguageChart from './components/LanguageChart';
import CommitVelocity from './components/CommitVelocity';
import FileTree from './components/FileTree';
import { buildFileTree } from './utils/treeHelpers';
import { Search, Brain, Loader2, ArrowLeft, Terminal } from 'lucide-react';
import './App.css';

function App() {
  const [username, setUsername] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Deep Dive States
  const [viewMode, setViewMode] = useState('dashboard'); // 'dashboard' | 'deep-dive'
  const [activeRepo, setActiveRepo] = useState(null);
  const [repoDetails, setRepoDetails] = useState({ tree: null, stats: null, loading: false });

  // Main Search Logic
  const handleAudit = async () => {
    if (!username.trim()) return;
    setLoading(true);
    setError(null);
    setData(null);
    setViewMode('dashboard');

    try {
      const result = await GithubAPI.getBeastAnalysis(username);
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Repository Deep Dive Logic
  const handleSelectRepo = async (repoName) => {
  setActiveRepo(repoName);
  // Reset states and show loader
  setRepoDetails({ tree: null, stats: null, loading: true });
  setViewMode('deep-dive');

  try {
    const owner = data.profile.login;
    
    // 1. Fetch data from your backend
    const [structure, stats] = await Promise.all([
      GithubAPI.getRepoDeepDive(owner, repoName),
      GithubAPI.getRepoStats(owner, repoName)
    ]);

    // 2. CRITICAL: Transform the flat list into a nested tree
    // If you skip this, <FileTree /> receives nothing it can render.
    const nestedTree = buildFileTree(structure.tree);

    setRepoDetails({
      tree: nestedTree,
      stats: stats, // Ensure this matches the format expected by CommitVelocity
      loading: false
    });
  } catch (err) {
    console.error("Deep dive fetch failed:", err);
    setRepoDetails({ tree: null, stats: null, loading: false });
  }
};

  return (
    <div className="app-shell">
      {/* Navigation Bar */}
      <nav className="glass-nav">
        <div className="nav-container">
          <div className="brand" onClick={() => window.location.reload()}>
            <Terminal className="brand-icon" />
            <span>EngineerGrade<span className="accent">.ai</span></span>
          </div>

          <div className="search-engine">
            <Search className="search-icon" size={18} />
            <input 
              type="text" 
              placeholder="Enter GitHub Username..." 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAudit()}
            />
            <button onClick={handleAudit} disabled={loading}>
              {loading ? <Loader2 className="spin" size={18} /> : 'Audit Profile'}
            </button>
          </div>
        </div>
      </nav>

      <main className="main-content">
        {/* Error Messaging */}
        {error && <div className="error-banner animate-shake">{error}</div>}

        {/* Initial Empty State */}
        {!data && !loading && (
          <div className="hero-section animate-fade-up">
            <Brain size={64} className="hero-brain" />
            <h1>Unleash the <span className="gradient-text">Beast Mode</span> Audit</h1>
            <p>AI-Powered GitHub analysis for serious engineering recruitment.</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="loading-container">
            <div className="scanner-line"></div>
            <p>Scanning Repositories & Consultng Gemini AI...</p>
          </div>
        )}

        {/* Dashboard View */}
        {data && viewMode === 'dashboard' && (
          <div className="dashboard-grid animate-fade-in">
            <div className="left-panel">
              <ProfileHeader 
                profile={data.profile} 
                aiAudit={data.aiAudit} 
                score={data.analysis.recruiterScore} 
              />
              <RecruiterSignals analysis={data.analysis} />
              {/* Inside App.js */}
              <LanguageChart repositories={data.repositories} />
            </div>

            <div className="right-panel">
              <div className="ai-summary-card card">
                <h3><Brain size={20} color="#8b5cf6" /> Gemini AI Expert Verdict</h3>
                <p className="pitch">"{data.aiAudit.recruiterPitch}"</p>
                <div className="ai-tags">
                  <span className="ai-tag"><strong>Fit:</strong> {data.aiAudit.technicalFit}</span>
                  <span className="ai-tag"><strong>Advice:</strong> {data.aiAudit.careerAdvice}</span>
                </div>
              </div>
              <RepoExplorer 
                repos={data.repositories} 
                onSelectRepo={handleSelectRepo} 
              />
            </div>
          </div>
        )}

        {/* Deep Dive View */}
        {data && viewMode === 'deep-dive' && (
          <div className="deep-dive-container animate-slide-right">
            <button className="back-btn" onClick={() => setViewMode('dashboard')}>
              <ArrowLeft size={18} /> Back to Dashboard
            </button>

            <div className="detail-layout">
              {/* Inside the deep-dive-container */}
<section className="card file-explorer-section">
  <h3>Folder Hierarchy: {activeRepo}</h3>
  {repoDetails.loading ? (
    <div className="loader">Scanning repository...</div>
  ) : (
    <div className="tree-viewport">
      {repoDetails.tree && Object.keys(repoDetails.tree).length > 0 ? (
        Object.values(repoDetails.tree).map((node, i) => (
          <FileTree key={i} node={node} />
        ))
      ) : (
        <p className="error-text">Unable to load file structure. Try another repo.</p>
      )}
    </div>
  )}
</section>

              <section className="card analytics-section">
                <h3>Commit Velocity & Performance</h3>
                {repoDetails.stats ? (
                  <CommitVelocity data={repoDetails.stats} />
                ) : (
                  <p className="hint">No commit history available for this branch.</p>
                )}
              </section>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;