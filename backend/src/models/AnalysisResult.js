/**
 * AnalysisResult Model
 * Defines the shape of the data returned by the analyzer service.
 * Used for documentation and validation purposes.
 */

/**
 * @typedef {Object} Profile
 * @property {string} login
 * @property {string|null} name
 * @property {string} avatar
 * @property {string|null} bio
 * @property {string|null} location
 * @property {string|null} company
 * @property {string|null} blog
 * @property {string} githubUrl
 * @property {string} createdAt
 */

/**
 * @typedef {Object} Stats
 * @property {number} totalRepos
 * @property {number} originalRepos
 * @property {number} forkedRepos
 * @property {number} totalStars
 * @property {number} totalForks
 * @property {number} totalWatchers
 * @property {number} commitCountLast90Days
 * @property {number} followers
 * @property {number} following
 * @property {number} accountAge - years since account creation
 * @property {number} languageCount
 */

/**
 * @typedef {Object} ScoreBreakdown
 * @property {number} repoCount - 0-20
 * @property {number} stars - 0-20
 * @property {number} activity - 0-20
 * @property {number} languageDiversity - 0-20
 * @property {number} repoQuality - 0-20
 */

/**
 * @typedef {Object} Score
 * @property {number} total - 0-100
 * @property {ScoreBreakdown} breakdown
 */

/**
 * @typedef {Object} Suggestion
 * @property {string} category
 * @property {string} icon
 * @property {string} text
 */

/**
 * @typedef {Object} Repo
 * @property {string} name
 * @property {string|null} description
 * @property {number} stars
 * @property {number} forks
 * @property {string|null} language
 * @property {string} url
 * @property {string[]} topics
 * @property {string} updatedAt
 * @property {boolean} isFork
 */

/**
 * @typedef {Object} AnalysisResult
 * @property {Profile} profile
 * @property {Stats} stats
 * @property {Object.<string, number>} languages - language → repo count
 * @property {{month: string, commits: number}[]} monthlyActivity
 * @property {Repo[]} topRepos
 * @property {Score} score
 * @property {string[]} strengths
 * @property {string[]} weaknesses
 * @property {Suggestion[]} suggestions
 */

class AnalysisResult {
  constructor(data) {
    this.profile = data.profile;
    this.stats = data.stats;
    this.languages = data.languages;
    this.monthlyActivity = data.monthlyActivity;
    this.topRepos = data.topRepos;
    this.score = data.score;
    this.strengths = data.strengths;
    this.weaknesses = data.weaknesses;
    this.suggestions = data.suggestions;
  }

  toJSON() {
    return {
      profile: this.profile,
      stats: this.stats,
      score: this.score,
      languages: this.languages,
      monthlyActivity: this.monthlyActivity,
      topRepos: this.topRepos,
      strengths: this.strengths,
      weaknesses: this.weaknesses,
      suggestions: this.suggestions,
    };
  }
}

module.exports = AnalysisResult;
