/**
 * Job Data Formatter
 * Utility functions to safely format job data from database
 */

/**
 * Safely parse requirements field
 * Handles: JSON string, plain text, array, null, undefined
 */
export function formatRequirements(requirements) {
  if (!requirements) return [];
  
  // If already an array, return as-is
  if (Array.isArray(requirements)) {
    return requirements.filter(r => r && r.trim());
  }
  
  // If string, try to parse as JSON first
  if (typeof requirements === 'string') {
    // Remove markdown formatting if present
    const cleaned = requirements.replace(/\*\*/g, '').trim();
    
    // Try JSON parse
    try {
      const parsed = JSON.parse(cleaned);
      if (Array.isArray(parsed)) {
        return parsed.filter(r => r && r.trim());
      }
      // If parsed to a single value, wrap in array
      return [parsed].filter(r => r && r.trim());
    } catch {
      // Not valid JSON, treat as plain text
      // Split by newlines, commas, or bullets
      return cleaned
        .split(/\n|,|•|[-*]/)
        .map(r => r.trim())
        .filter(r => r && r.length > 0);
    }
  }
  
  // Fallback: return empty array
  return [];
}

/**
 * Safely parse benefits field
 * Handles: JSON string, plain text, array, null, undefined
 */
export function formatBenefits(benefits) {
  if (!benefits) return [];
  
  // If already an array, return as-is
  if (Array.isArray(benefits)) {
    return benefits.filter(b => b && b.trim());
  }
  
  // If string, try to parse as JSON first
  if (typeof benefits === 'string') {
    // Remove markdown formatting if present
    const cleaned = benefits.replace(/\*\*/g, '').trim();
    
    // Try JSON parse
    try {
      const parsed = JSON.parse(cleaned);
      if (Array.isArray(parsed)) {
        return parsed.filter(b => b && b.trim());
      }
      // If parsed to a single value, wrap in array
      return [parsed].filter(b => b && b.trim());
    } catch {
      // Not valid JSON, treat as plain text
      // Split by newlines, commas, or bullets
      return cleaned
        .split(/\n|,|•|[-*]/)
        .map(b => b.trim())
        .filter(b => b && b.length > 0);
    }
  }
  
  // Fallback: return empty array
  return [];
}

/**
 * Format job data for display
 * Ensures all fields are properly formatted
 */
export function formatJobData(job) {
  if (!job) return null;
  
  return {
    ...job,
    requirements: formatRequirements(job.requirements),
    benefits: formatBenefits(job.benefits),
    description: job.description || '',
    location: job.location || 'Location not specified',
    company: job.company || 'Company not specified',
    salaryRange: job.salary || 
      (job.salary_min && job.salary_max 
        ? `$${job.salary_min.toLocaleString()} - $${job.salary_max.toLocaleString()}` 
        : 'Salary not specified'),
  };
}

export default {
  formatRequirements,
  formatBenefits,
  formatJobData,
};










