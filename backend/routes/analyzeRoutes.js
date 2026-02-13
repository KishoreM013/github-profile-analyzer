const express = require('express');
const router = express.Router();
const githubService = require('../services/githubService');
const analyzer = require('../services/analyzer');
const aiService = require('../services/aiService');

router.get('/analyze-beast/:username', async (req, res) => {
  try {
    // 1. Get all the raw data we harvested before
    const rawData = await githubService.getEverything(req.params.username);
    const extremeAnalysis = analyzer.calculateExtremeMetrics(rawData);

    // 2. Feed the results to the beast (Gemini)
    const aiAudit = await aiService.getAIAudit({
      ...rawData,
      analysis: extremeAnalysis
    });

    // 3. Send the ultimate payload
    res.json({
      ...rawData,
      analysis: extremeAnalysis,
      aiAudit: aiAudit // This is the new Beast Mode section
    });
  } catch (err) {
    res.status(500).json({ error: "Beast Mode encountered an error." });
  }
});
// 1. Main Analysis (Score + Profile + Repos)
router.get('/analyze/:username', async (req, res) => {
  try {
    const raw = await githubService.getDevData(req.params.username);
    const analysis = analyzer.analyzeDeveloper(raw.user, raw.repos, raw.events);
    res.json({ profile: raw.user, repos: raw.repos, analysis });
  } catch (err) {
    res.status(500).json({ error: "Analysis failed" });
  }
});

// 2. Commit Details (Per Week/Day)
router.get('/repo-stats/:owner/:repo', async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const stats = await githubService.getCommitStats(owner, repo);
    
    if (stats.status === 202) {
      return res.status(202).json({ message: "GitHub is calculating stats..." });
    }
    res.json(stats.data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch commit stats" });
  }
});


router.get('/analyze-full/:username', async (req, res) => {
  try {
    const rawData = await githubService.getEverything(req.params.username);
    const extremeAnalysis = analyzer.calculateExtremeMetrics(rawData);

    res.json({
      ...rawData,
      analysis: extremeAnalysis
    });
  } catch (err) {
    res.status(500).json({ error: "Deep fetch failed", message: err.message });
  }
});
// 3. Full Repo Details (Languages, Contributors, Content)
router.get('/repo-details/:owner/:repo', async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const tree = await githubService.getRepoTree(owner, repo);
    res.json({ tree });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch repository structure" });
  }
});

module.exports = router;