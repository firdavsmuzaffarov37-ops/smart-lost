/**
 * Local AI & Heuristic Matching Engine for FindIt AI
 * Compares lost-item reports against found-item reports (or vice versa)
 * using category, semantic tokens, geographical proximity, and date alignment.
 */

// Common stopwords to filter out from text analysis
const STOPWORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'in', 'on', 'at', 'to', 'for', 'with', 'by', 'from',
  'of', 'is', 'it', 'this', 'that', 'near', 'inside', 'outside', 'front', 'back',
  'va', 'da', 'dan', 'bilan', 'uchun', 'bu', 'shu', 'ichida', 'yonida',
  'и', 'в', 'на', 'с', 'по', 'для', 'у', 'около', 'возле', 'внутри', 'это',
]);

/**
 * Calculate distance between two lat/lng coordinates in kilometers (Haversine formula)
 */
export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Tokenize text into normalized lowercase words
 */
function tokenize(text) {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w));
}

/**
 * Compute similarity score between two reports
 */
export function evaluateMatch(itemA, itemB) {
  // If comparing two lost or two found items, skip or lower
  if (itemA.id === itemB.id) return null;

  let totalScore = 0;
  const reasons = [];

  // 1. Category comparison (Max 30 pts)
  let categoryScore = 0;
  if (itemA.category === itemB.category) {
    categoryScore = 30;
    reasons.push({
      factor: 'Category Match',
      desc: `Exact category match in "${itemA.category.replace('-', ' & ')}"`,
      score: 30,
    });
  } else {
    // Check related categories
    categoryScore = 5;
  }
  totalScore += categoryScore;

  // 2. Keyword & semantic similarity (Max 35 pts)
  const tokensA = new Set([...tokenize(itemA.title), ...tokenize(itemA.description)]);
  const tokensB = new Set([...tokenize(itemB.title), ...tokenize(itemB.description)]);

  const sharedTokens = [];
  tokensA.forEach((token) => {
    if (tokensB.has(token)) {
      sharedTokens.push(token);
    }
  });

  const unionSize = new Set([...tokensA, ...tokensB]).size;
  const jaccard = unionSize > 0 ? sharedTokens.length / unionSize : 0;
  const keywordScore = Math.min(35, Math.round(jaccard * 75 + sharedTokens.length * 5));
  totalScore += keywordScore;

  if (sharedTokens.length > 0) {
    const sampleKeywords = sharedTokens.slice(0, 4).map((k) => `"${k}"`).join(', ');
    reasons.push({
      factor: 'Keyword Overlap',
      desc: `Matched ${sharedTokens.length} key attributes: ${sampleKeywords}`,
      score: keywordScore,
    });
  }

  // 3. Geographic proximity (Max 20 pts)
  let geoScore = 0;
  if (itemA.coordinates && itemB.coordinates) {
    const dist = calculateDistanceKm(
      itemA.coordinates.lat,
      itemA.coordinates.lng,
      itemB.coordinates.lat,
      itemB.coordinates.lng
    );

    if (dist !== null) {
      if (dist <= 0.6) {
        geoScore = 20;
        reasons.push({
          factor: 'Ultra-Close Proximity',
          desc: `Coordinates within ~${Math.round(dist * 1000)} meters in ${itemA.city}`,
          score: 20,
        });
      } else if (dist <= 3) {
        geoScore = 16;
        reasons.push({
          factor: 'Local Area Proximity',
          desc: `Locations within ~${dist.toFixed(1)} km in ${itemA.city}`,
          score: 16,
        });
      } else if (dist <= 15) {
        geoScore = 12;
        reasons.push({
          factor: 'Same City Zone',
          desc: `Same city district (${dist.toFixed(1)} km apart)`,
          score: 12,
        });
      } else if (itemA.city === itemB.city) {
        geoScore = 8;
        reasons.push({
          factor: 'Same City',
          desc: `Both reported in ${itemA.city}`,
          score: 8,
        });
      }
    }
  } else if (itemA.city === itemB.city) {
    geoScore = 10;
    reasons.push({
      factor: 'City Match',
      desc: `Both reports are located in ${itemA.city}`,
      score: 10,
    });
  }
  totalScore += geoScore;

  // 4. Date proximity (Max 15 pts)
  let dateScore = 0;
  if (itemA.date && itemB.date) {
    const dateA = new Date(itemA.date);
    const dateB = new Date(itemB.date);
    const diffDays = Math.abs(Math.round((dateA - dateB) / (1000 * 60 * 60 * 24)));

    if (diffDays <= 1) {
      dateScore = 15;
      reasons.push({
        factor: 'High Date Alignment',
        desc: diffDays === 0 ? 'Reported on the exact same date' : 'Reported within 24 hours of each other',
        score: 15,
      });
    } else if (diffDays <= 4) {
      dateScore = 11;
      reasons.push({
        factor: 'Close Date Proximity',
        desc: `Dates are ${diffDays} days apart`,
        score: 11,
      });
    } else if (diffDays <= 14) {
      dateScore = 6;
      reasons.push({
        factor: 'Reasonable Date Window',
        desc: `Dates are within 2 weeks (${diffDays} days)`,
        score: 6,
      });
    }
  }
  totalScore += dateScore;

  // Normalize final score
  const finalScore = Math.min(99, Math.max(10, totalScore));

  return {
    score: finalScore,
    targetItem: itemB,
    reasons,
    confidenceLevel: finalScore >= 80 ? 'High' : finalScore >= 55 ? 'Moderate' : 'Possible',
  };
}

/**
 * Find all matching candidates for a given item among a list of reports
 */
export function findMatchesForItem(sourceItem, allReports) {
  // If source is lost, look for found items; if source is found, look for lost items
  const oppositeType = sourceItem.type === 'lost' ? 'found' : 'lost';
  const candidates = allReports.filter((r) => r.type === oppositeType && r.id !== sourceItem.id);

  const scoredMatches = candidates
    .map((candidate) => evaluateMatch(sourceItem, candidate))
    .filter((match) => match !== null && match.score >= 35)
    .sort((a, b) => b.score - a.score);

  return scoredMatches;
}

/**
 * Scan all reports to discover overall system-wide high probability pairs
 */
export function discoverAllSystemMatches(allReports) {
  const lostItems = allReports.filter((r) => r.type === 'lost');
  const foundItems = allReports.filter((r) => r.type === 'found');

  const pairs = [];
  lostItems.forEach((lost) => {
    foundItems.forEach((found) => {
      const match = evaluateMatch(lost, found);
      if (match && match.score >= 50) {
        pairs.push({
          id: `pair-${lost.id}-${found.id}`,
          lostItem: lost,
          foundItem: found,
          score: match.score,
          reasons: match.reasons,
          confidenceLevel: match.confidenceLevel,
        });
      }
    });
  });

  return pairs.sort((a, b) => b.score - a.score);
}
