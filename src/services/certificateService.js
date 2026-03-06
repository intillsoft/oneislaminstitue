/**
 * Certificate Service
 * Handles certificate retrieval, verification, and AI summaries
 */

import { supabase } from '../lib/supabase';

export const certificateService = {
  // Get all certificates for current user
  async getAll() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('certificates')
      .select(`
        *,
        course:jobs(id, title, company, description, location)
      `)
      .eq('user_id', user.id)
      .order('issued_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get a single certificate by ID
  async getById(id) {
    const { data, error } = await supabase
      .from('certificates')
      .select(`
        *,
        course:jobs(id, title, company, description),
        user:users(id, name, email)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Verify a certificate by number
  async verify(certificateNumber) {
    const { data, error } = await supabase
      .from('certificates')
      .select(`
        *,
        course:jobs(id, title, company),
        user:users(id, name)
      `)
      .eq('certificate_number', certificateNumber)
      .eq('status', 'active')
      .single();

    if (error && error.code === 'PGRST116') return null;
    if (error) throw error;
    return data;
  },

  // Get certificate stats
  async getStats() {
    const certs = await this.getAll();

    const totalCertificates = certs.length;
    const activeCertificates = certs.filter(c => c.status === 'active').length;
    const uniqueSkills = [...new Set(certs.flatMap(c => c.skills_earned || []))];
    const avgScore = certs.length > 0
      ? certs.reduce((sum, c) => sum + (c.score || 0), 0) / certs.length
      : 0;
    const latestCert = certs[0] || null;

    return {
      totalCertificates,
      activeCertificates,
      uniqueSkills,
      avgScore: Math.round(avgScore * 10) / 10,
      latestCert,
      certificates: certs
    };
  },

  // Generate AI achievement summary
  generateAISummary(certificates) {
    if (!certificates || certificates.length === 0) {
      return {
        summary: "Begin your learning journey! Complete courses to earn verified certificates that showcase your knowledge.",
        recommendations: [
          "Explore our course catalog to find your perfect starting point",
          "Focus on foundational courses to build a strong knowledge base",
          "Set a goal to earn your first certificate this month"
        ],
        skillProfile: null
      };
    }

    const allSkills = certificates.flatMap(c => c.skills_earned || []);
    const skillCounts = {};
    allSkills.forEach(s => { skillCounts[s] = (skillCounts[s] || 0) + 1; });
    const topSkills = Object.entries(skillCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([skill]) => skill);

    const avgScore = certificates.reduce((sum, c) => sum + (c.score || 85), 0) / certificates.length;

    const summary = `You've earned ${certificates.length} certificate${certificates.length > 1 ? 's' : ''} with an average score of ${Math.round(avgScore)}%. ` +
      (topSkills.length > 0
        ? `Your strongest areas include ${topSkills.slice(0, 3).join(', ')}. `
        : '') +
      (avgScore >= 90
        ? 'Your consistently high scores demonstrate exceptional mastery.'
        : avgScore >= 75
          ? 'You show solid understanding across your studies.'
          : 'Keep pushing — every certificate strengthens your expertise.');

    const recommendations = [];
    if (certificates.length < 3) {
      recommendations.push('Complete 3+ courses to unlock advanced learning pathways');
    }
    if (certificates.length >= 3 && certificates.length < 10) {
      recommendations.push('Consider specializing in your top-performing areas');
    }
    if (avgScore < 85) {
      recommendations.push('Review course materials to boost your average score above 85%');
    }
    recommendations.push('Share your certificates on LinkedIn to boost your professional profile');
    recommendations.push('Explore courses that build on skills you\'ve already mastered');

    return {
      summary,
      recommendations: recommendations.slice(0, 3),
      skillProfile: {
        topSkills,
        avgScore: Math.round(avgScore),
        totalSkills: [...new Set(allSkills)].length,
        level: certificates.length >= 10 ? 'Expert Scholar' :
               certificates.length >= 5 ? 'Advanced Learner' :
               certificates.length >= 3 ? 'Dedicated Student' : 'Rising Star'
      }
    };
  },

  // Generate certificate number
  generateCertNumber() {
    const prefix = 'OII';
    const year = new Date().getFullYear();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}-${year}-${random}`;
  },

  // Get template for a course or lesson
  async getTemplate(courseId, lessonId = null) {
    let query = supabase
      .from('certificate_templates')
      .select('*')
      .eq('course_id', courseId);
    
    if (lessonId) {
      query = query.eq('lesson_id', lessonId);
    } else {
      query = query.is('lesson_id', null);
    }

    const { data, error } = await query.maybeSingle();

    if (error) throw error;
    return data || {
        course_id: courseId,
        lesson_id: lessonId,
        design_data: {
            primaryColor: "#059669",
            secondaryColor: "#10b981",
            fontFamily: "Inter",
            showLogo: true,
            layout: "classic", // classic, modern, minimal, centered
            signatureName: "One Islam Institute",
            signatureTitle: "Academic Director",
            customText: lessonId ? "This is to certify that you have successfully achieved this learning milestone." : "This is to certify that you have successfully completed the course requirements."
        }
    };
  },

  // Update or create certificate template
  async updateTemplate(courseId, designData, lessonId = null) {
    const upsertData = {
        course_id: courseId,
        design_data: designData,
        updated_at: new Date().toISOString()
    };

    if (lessonId) {
        upsertData.lesson_id = lessonId;
    }

    const { data, error } = await supabase
      .from('certificate_templates')
      .upsert(upsertData, { onConflict: 'course_id, lesson_id' })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Generate a certificate for a course or lesson
  async generate(courseId, score = 100, grade = 'Pass', lessonId = null) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    try {
      // 1. Check if already exists
      let existingQuery = supabase
        .from('certificates')
        .select('id')
        .eq('user_id', user.id)
        .eq('course_id', courseId);
      
      if (lessonId) {
        existingQuery = existingQuery.eq('lesson_id', lessonId);
      } else {
        existingQuery = existingQuery.is('lesson_id', null);
      }

      const { data: existing } = await existingQuery.maybeSingle();

      if (existing) return existing;

      // 2. Fetch course, enrollment, and template data
      const queries = [
        supabase.from('jobs').select('title, learning_outcomes').eq('id', courseId).single(),
        supabase.from('applications').select('id').eq('user_id', user.id).or(`course_id.eq.${courseId},job_id.eq.${courseId}`).single(),
        this.getTemplate(courseId, lessonId)
      ];

      if (lessonId) {
        queries.push(supabase.from('lessons').select('title').eq('id', lessonId).single());
      }

      const results = await Promise.all(queries);
      
      const course = results[0].data;
      const enrollment = results[1].data;
      const template = results[2];
      const lesson = lessonId ? results[3].data : null;

      // 3. Create certificate
      const certNumber = this.generateCertNumber();
      const newCert = {
        user_id: user.id,
        course_id: courseId,
        lesson_id: lessonId,
        enrollment_id: enrollment?.id || null,
        certificate_number: certNumber,
        title: lessonId ? lesson?.title : (course?.title || 'Academic Achievement'),
        grade: grade,
        score: score,
        skills_earned: lessonId ? [] : (course?.learning_outcomes || []),
        issued_at: new Date().toISOString(),
        status: 'active',
        metadata: {
            template: template?.design_data || null,
            instructor_id: user.id,
            verification_hash: btoa(`${user.id}:${courseId}:${certNumber}`).substring(0, 16)
        }
      };

      const { data, error } = await supabase
        .from('certificates')
        .insert(newCert)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Failed to generate certificate:', err);
      throw err;
    }
  }
};

export default certificateService;
