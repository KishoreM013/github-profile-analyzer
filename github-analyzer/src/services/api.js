import axios from 'axios';

/**
 * Configure the global Axios instance for the Backend API
 */
const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api', // Change this to your production URL later
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds - Deep analysis can take time
});

/**
 * API Service Object
 */
export const GithubAPI = {
  /**
   * Performs the "Beast Mode" AI analysis on a user
   * @param {string} username 
   */
  getBeastAnalysis: async (username) => {
    try {
      const response = await apiClient.get(`/analyze-beast/${username}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  /**
   * Fetches deep repository details including structure and stats
   * @param {string} owner 
   * @param {string} repo 
   */
  getRepoDeepDive: async (owner, repo) => {
    try {
      const response = await apiClient.get(`/repo-details/${owner}/${repo}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  /**
   * Fetches specific commit stats (used for charts)
   * @param {string} owner 
   * @param {string} repo 
   */
  getRepoStats: async (owner, repo) => {
    try {
      const response = await apiClient.get(`/repo-stats/${owner}/${repo}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }
};

/**
 * Global Error Handler for API Calls
 */
const handleApiError = (error) => {
  if (error.response) {
    // The server responded with a status code outside the 2xx range
    const status = error.response.status;
    const message = error.response.data?.message || "Internal Server Error";
    
    if (status === 404) throw new Error("GitHub user not found.");
    if (status === 429) throw new Error("GitHub rate limit exceeded. Try again later.");
    
    throw new Error(`Error ${status}: ${message}`);
  } else if (error.request) {
    // The request was made but no response was received
    throw new Error("Backend server is offline. Please start the Node.js server.");
  } else {
    // Something happened in setting up the request
    throw new Error(error.message);
  }
};

export default GithubAPI;