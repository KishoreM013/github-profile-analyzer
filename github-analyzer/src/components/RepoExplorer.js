import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Star, 
  GitFork, 
  Calendar, 
  ChevronRight, 
  Terminal 
} from 'lucide-react';

const RepoExplorer = ({ repos, onSelectRepo, activeRepo }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('updated'); // 'stars', 'updated', 'size'

  // Filter and Sort Logic
  const filteredRepos = useMemo(() => {
    return repos
      .filter(repo => 
        repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (repo.language && repo.language.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      .sort((a, b) => {
        if (sortBy === 'stars') return b.stargazers_count - a.stargazers_count;
        if (sortBy === 'size') return b.size - a.size;
        return new Date(b.updated_at) - new Date(a.updated_at);
      });
  }, [repos, searchTerm, sortBy]);

  return (
    <div className="repo-explorer-container card">
      <div className="explorer-header">
        <h3><Terminal size={18} /> Repository Vault</h3>
        <span className="count-badge">{filteredRepos.length} Projects</span>
      </div>

      {/* Search & Sort Controls */}
      <div className="explorer-controls">
        <div className="search-input-wrapper">
          <Search size={14} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search tech or project..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
          <option value="updated">Latest</option>
          <option value="stars">Most Stars</option>
          <option value="size">Largest</option>
        </select>
      </div>

      {/* Scrollable Repo List */}
      <div className="repo-scroll-area">
        {filteredRepos.length > 0 ? (
          filteredRepos.map((repo) => (
            <div 
              key={repo.id} 
              className={`repo-card-mini ${activeRepo === repo.name ? 'active' : ''}`}
              onClick={() => onSelectRepo(repo.name)}
            >
              <div className="repo-main-info">
                <div className="repo-title-row">
                  <span className="repo-name">{repo.name}</span>
                  {repo.stargazers_count > 0 && (
                    <span className="star-tag"><Star size={10} fill="#f59e0b" /> {repo.stargazers_count}</span>
                  )}
                </div>
                
                <div className="repo-meta-row">
                  <span className="lang-indicator">
                    <span className="dot" style={{ backgroundColor: getLangColor(repo.language) }}></span>
                    {repo.language || 'Plain Text'}
                  </span>
                  <span className="update-date">
                    <Calendar size={10} /> {new Date(repo.updated_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <ChevronRight size={16} className="arrow-icon" />
            </div>
          ))
        ) : (
          <div className="no-results">No projects match your query.</div>
        )}
      </div>
    </div>
  );
};

// Helper for UI colors
const getLangColor = (lang) => {
  const colors = {
    JavaScript: '#f7df1e',
    TypeScript: '#3178c6',
    Python: '#3776ab',
    Java: '#b07219',
    Kotlin: '#a97bff',
    Dart: '#00d2b8',
    HTML: '#e34c26'
  };
  return colors[lang] || '#94a3b8';
};

export default RepoExplorer;