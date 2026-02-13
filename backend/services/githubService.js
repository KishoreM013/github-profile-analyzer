const axios = require('axios');

const github = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    Authorization: `token ${process.env.GITHUB_TOKEN}`,
    Accept: 'application/vnd.github.v3+json'
  }
});

exports.getEverything = async (username) => {
  // Parallel fetch to avoid timeouts
  const [user, repos, events, gists, orgs, followers, following] = await Promise.all([
    github.get(`/users/${username}`),
    github.get(`/users/${username}/repos?per_page=100&sort=updated`),
    github.get(`/users/${username}/events/public`),
    github.get(`/users/${username}/gists`),
    github.get(`/users/${username}/orgs`),
    github.get(`/users/${username}/followers`),
    github.get(`/users/${username}/following`)
  ]);

  return {
    profile: user.data,
    repositories: repos.data,
    activityStream: events.data,
    snippets: gists.data,
    organizations: orgs.data,
    social: {
      followersCount: followers.data.length,
      followingCount: following.data.length,
      followersList: followers.data.map(f => f.login)
    }
  };
};

exports.getRepoDeepDive = async (owner, repo) => {
  const [commits, languages, contributors, deployments, releases] = await Promise.all([
    github.get(`/repos/${owner}/${repo}/stats/commit_activity`),
    github.get(`/repos/${owner}/${repo}/languages`),
    github.get(`/repos/${owner}/${repo}/contributors`),
    github.get(`/repos/${owner}/${repo}/deployments`),
    github.get(`/repos/${owner}/${repo}/releases`)
  ]);

  return { 
    commits: commits.data, 
    languages: languages.data, 
    contributors: contributors.data, 
    deployments: deployments.data,
    releases: releases.data
  };
};