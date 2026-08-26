import fs from 'fs';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

async function main() {
  try {
    console.log('Fetching official LeetCode dataset from LeetCode API...');
    const res = await fetch('https://leetcode.com/api/problems/all/', {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const data = await res.json();
    const pairs = data.stat_status_pairs || [];

    const easy = [];
    const hard = [];
    const med = [];
    const titleMap = {};

    pairs.forEach(p => {
      const id = p.stat.frontend_question_id;
      const slug = p.stat.question__title_slug;
      const level = p.difficulty.level; // 1 = Easy, 2 = Medium, 3 = Hard

      if (level === 1) easy.push(id);
      else if (level === 3) hard.push(id);
      else med.push(id);

      if (slug) {
        titleMap[slug] = level === 1 ? 'Easy' : (level === 3 ? 'Hard' : 'Medium');
      }
    });

    easy.sort((a, b) => a - b);
    hard.sort((a, b) => a - b);
    med.sort((a, b) => a - b);

    const fileContent = `/**
 * Official LeetCode Problem Difficulty Database (${pairs.length} Problems)
 * 100% exact official mapping from LeetCode Question API.
 * Level 1 = Easy (${easy.length}), Level 2 = Medium (${med.length}), Level 3 = Hard (${hard.length})
 */

const EASY_SET = new Set(${JSON.stringify(easy)});
const HARD_SET = new Set(${JSON.stringify(hard)});
const SLUG_MAP = ${JSON.stringify(titleMap)};

/**
 * Get exact official LeetCode difficulty for any problem number or title slug
 * @param {number|string} problemNumber
 * @param {string} titleOrSlug
 * @returns {'Easy'|'Medium'|'Hard'}
 */
export function getLeetCodeDifficulty(problemNumber, titleOrSlug = '') {
  if (problemNumber) {
    const num = parseInt(problemNumber, 10);
    if (!isNaN(num)) {
      if (EASY_SET.has(num)) return 'Easy';
      if (HARD_SET.has(num)) return 'Hard';
      return 'Medium';
    }
  }

  if (titleOrSlug) {
    const cleanSlug = titleOrSlug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    if (SLUG_MAP[cleanSlug]) return SLUG_MAP[cleanSlug];

    if (/\\b(easy)\\b/i.test(titleOrSlug)) return 'Easy';
    if (/\\b(hard)\\b/i.test(titleOrSlug)) return 'Hard';
    if (/\\b(medium)\\b/i.test(titleOrSlug)) return 'Medium';
  }

  return 'Medium';
}

export const TOTAL_LEETCODE_PROBLEMS = ${pairs.length};
`;

    fs.writeFileSync('src/services/leetcodeDatabase.js', fileContent);
    console.log(`✅ Successfully generated official database: ${easy.length} Easy, ${med.length} Medium, ${hard.length} Hard. Total: ${pairs.length}`);
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

main();
