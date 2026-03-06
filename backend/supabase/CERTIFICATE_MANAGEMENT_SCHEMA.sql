-- ============================================================================
-- CERTIFICATE MANAGEMENT SYSTEM
-- Tables for designing and managing course certificates
-- ============================================================================

-- 1. Certificate Templates Table
CREATE TABLE IF NOT EXISTS certificate_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    design_data JSONB NOT NULL DEFAULT '{
        "primaryColor": "#059669",
        "secondaryColor": "#10b981",
        "fontFamily": "Inter",
        "backgroundImage": null,
        "showLogo": true,
        "signatureUrl": null,
        "signatureName": "One Islam Institute",
        "signatureTitle": "Academic Director",
        "customText": "This is to certify that you have successfully completed the course requirements."
    }',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(course_id)
);

-- 2. Add certificate_template_id to jobs for easy access if needed
-- (Opitonal since templates are linked via course_id)

-- 3. Enable RLS
ALTER TABLE certificate_templates ENABLE ROW LEVEL SECURITY;

-- 4. Policies
CREATE POLICY "Public can view templates" ON certificate_templates FOR SELECT USING (true);
CREATE POLICY "Admins and Instructors can manage templates" ON certificate_templates FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'recruiter'))
);

-- 5. Helper function to get certificate template for a course
CREATE OR REPLACE FUNCTION get_course_certificate_template(p_course_id UUID)
RETURNS JSONB AS $$
DECLARE
    v_template JSONB;
BEGIN
    SELECT design_data INTO v_template FROM certificate_templates WHERE course_id = p_course_id;
    RETURN COALESCE(v_template, '{
        "primaryColor": "#059669",
        "secondaryColor": "#10b981",
        "fontFamily": "Inter",
        "showLogo": true,
        "signatureName": "One Islam Institute",
        "signatureTitle": "Academic Director"
    }'::JSONB);
END;
$$ LANGUAGE plpgsql;
