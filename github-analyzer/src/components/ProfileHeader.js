import React from 'react';
import { 
  MapPin, Link as LinkIcon, Twitter, Users, 
  Briefcase, ShieldCheck, Zap, Star 
} from 'lucide-react';

const ProfileHeader = ({ profile, aiAudit, score }) => {
  // Determine color based on AI Verdict
  const getVerdictColor = (verdict) => {
    const colors = {
      'Elite': '#8b5cf6',   // Purple
      'Strong': '#10b981',  // Green
      'Emerging': '#f59e0b', // Orange
      'Junior': '#ef4444'    // Red
    };
    return colors[verdict] || '#6366f1';
  };

  const verdictColor = getVerdictColor(aiAudit?.verdict);

  return (
    <div className="profile-header-card card animate-slide-down">
      <div className="header-main">
        {/* Avatar with Glow Effect */}
        <div className="avatar-wrapper">
          <img src={profile.avatar_url} alt={profile.login} className="avatar-img" style={{ borderColor: verdictColor }} />
          {profile.hireable && (
            <div className="hireable-badge">
              <ShieldCheck size={14} /> Hireable
            </div>
          )}
        </div>

        <div className="profile-info">
          <div className="name-row">
            <h1>{profile.name || profile.login}</h1>
            <div className="ai-verdict-tag" style={{ backgroundColor: `${verdictColor}22`, color: verdictColor, borderColor: verdictColor }}>
              <Zap size={14} fill={verdictColor} /> {aiAudit?.verdict || 'Analyzing...'}
            </div>
          </div>
          <p className="username">@{profile.login}</p>
          <p className="bio">{profile.bio || "This developer hasn't added a bio yet, but their code speaks volumes."}</p>
          
          <div className="social-meta">
            {profile.location && <span><MapPin size={14} /> {profile.location}</span>}
            {profile.blog && (
              <a href={profile.blog.startsWith('http') ? profile.blog : `https://${profile.blog}`} target="_blank" rel="noreferrer">
                <LinkIcon size={14} /> Portfolio
              </a>
            )}
            {profile.twitter_username && (
              <a href={`https://twitter.com/${profile.twitter_username}`} target="_blank" rel="noreferrer">
                <Twitter size={14} /> Twitter
              </a>
            )}
          </div>
        </div>

        {/* The Big Score Display */}
        <div className="score-display">
          <div className="score-circle">
            <svg viewBox="0 0 36 36" className="circular-chart">
              <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path className="circle" 
                strokeDasharray={`${score}, 100`} 
                stroke={verdictColor}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
              />
              <text x="18" y="20.35" className="percentage">{score}</text>
            </svg>
          </div>
          <p className="score-label">Engineer Grade</p>
        </div>
      </div>

      <div className="header-footer-stats">
        <div className="footer-stat">
          <Users size={18} />
          <div>
            <strong>{profile.followers}</strong>
            <span>Followers</span>
          </div>
        </div>
        <div className="footer-stat">
          <Star size={18} />
          <div>
            <strong>{profile.public_gists}</strong>
            <span>Gists</span>
          </div>
        </div>
        <div className="footer-stat">
          <Briefcase size={18} />
          <div>
            <strong>{profile.public_repos}</strong>
            <span>Projects</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;