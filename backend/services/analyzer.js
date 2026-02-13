/**
 * Processes raw data into Recruitment Signals
 */
exports.analyzeDeveloper = (user, repos, events) => {
  let stars = 0, forks = 0, docScore = 0;
  const languages = {};

  repos.forEach(repo => {
    stars += repo.stargazers_count;
    forks += repo.forks_count;
    if (repo.language) languages[repo.language] = (languages[repo.language] || 0) + 1;
    
    // Signal: Readability (Descriptions and Readmes)
    if (repo.description) docScore += 10;
    if (repo.has_wiki) docScore += 5;
  });

  // Signal: Collaboration (Forks and Recent Push Activity)
  const recentPushes = events.filter(e => e.type === 'PushEvent').length;
  const collaborationScore = Math.min((forks * 5) + (recentPushes * 2), 100);

  // Normalize Documentation/Readability score
  const readabilityScore = Math.min((docScore / (repos.length || 1)) * 5, 100);

  // Final Recruiter Score
  const totalScore = Math.min(
    (stars * 0.4) + (collaborationScore * 0.3) + (readabilityScore * 0.3), 
    100
  );

  return {
    score: Math.round(totalScore),
    metrics: {
      readability: Math.round(readabilityScore),
      collaboration: Math.round(collaborationScore),
      impact: stars
    },
    topLanguages: Object.entries(languages)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(lang => lang[0])
  };
};

exports.calculateExtremeMetrics = (data) => {
  const { profile, repositories, activityStream } = data;
  
  // 1. Commit Consistency (Days since last activity)
  const lastEvent = activityStream[0] ? new Date(activityStream[0].created_at) : null;
  const daysSinceActive = lastEvent ? Math.floor((new Date() - lastEvent) / (1000 * 60 * 60 * 24)) : '∞';

  // 2. Technical Stack Diversification
  const langMap = {};
  repositories.forEach(r => {
    if (r.language) langMap[r.language] = (langMap[r.language] || 0) + 1;
  });

  // 3. Documentation Ratio
  const docsCount = repositories.filter(r => r.has_wiki || r.description).length;
  const docRatio = ((docsCount / repositories.length) * 100).toFixed(2);

  return {
    recruiterScore: calculateFinalScore(profile, repositories, activityStream),
    rawStats: {
      totalStars: repositories.reduce((acc, r) => acc + r.stargazers_count, 0),
      totalForks: repositories.reduce((acc, r) => acc + r.forks_count, 0),
      avgRepoSize: (repositories.reduce((acc, r) => acc + r.size, 0) / repositories.length).toFixed(2),
      activeDaysRatio: (activityStream.length / 30).toFixed(2), // activity over last 30 events
      documentationCompleteness: `${docRatio}%`
    }
  };
};

function calculateFinalScore(user, repos, events) {
  // Balanced logic for recruitment
  let s = 0;
  if (user.hireable) s += 10;
  if (user.bio) s += 5;
  if (repos.length > 10) s += 20;
  if (events.length > 10) s += 20;
  return Math.min(s + (repos.reduce((a, r) => a + r.stargazers_count, 0) * 2), 100);
}