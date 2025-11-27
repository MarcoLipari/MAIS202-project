/**
 * Configuration file for GitHub repository links
 * Update these values with your actual GitHub repository URL
 */

export const GITHUB_CONFIG = {
  // Your main GitHub repository URL (without trailing slash)
  repository: "https://github.com/MarcoLipari/MAIS202-project",
  
  // Branch name (usually 'main' or 'master')
  branch: "main",
  
  // File paths in your repository
  files: {
    predict: "src/predict.py",
    dataset: "src/dataset.py",
    trainClassifier: "src/train_classifier.py",
    trainRegressor: "src/train_regressor.py",
    preprocessing: "redditmain.py", // Preprocessing code
    classifier: "2binclassifier.py", // Final 2-bin classifier model
    regression: "redditregression.py", // Linear regression (experimental)
    dataPreprocessing: "data/", // or "src/dataset.py"
  }
}

/**
 * Helper function to generate GitHub file URLs
 */
export function getGitHubFileUrl(fileKey: keyof typeof GITHUB_CONFIG.files): string {
  const filePath = GITHUB_CONFIG.files[fileKey]
  return `${GITHUB_CONFIG.repository}/blob/${GITHUB_CONFIG.branch}/${filePath}`
}

/**
 * Get the main repository URL
 */
export function getGitHubRepoUrl(): string {
  return GITHUB_CONFIG.repository
}

