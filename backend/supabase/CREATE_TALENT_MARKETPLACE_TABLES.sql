-- ============================================================================
-- TALENT MARKETPLACE DATABASE MIGRATION
-- ============================================================================
-- This migration creates all tables needed for the Talent Marketplace feature
-- Run this in your Supabase SQL editor

-- ============================================================================
-- 1. TALENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS talents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  bio TEXT,
  hourly_rate DECIMAL(10, 2),
  profile_picture_url TEXT,
  cover_image_url TEXT,
  skills JSONB DEFAULT '[]'::jsonb,
  experience_level VARCHAR(50) CHECK (experience_level IN ('beginner', 'intermediate', 'expert')),
  total_hours_worked INTEGER DEFAULT 0,
  total_earnings DECIMAL(12, 2) DEFAULT 0,
  rating DECIMAL(3, 2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  total_reviews INTEGER DEFAULT 0,
  portfolio_items JSONB DEFAULT '[]'::jsonb,
  certifications JSONB DEFAULT '[]'::jsonb,
  languages JSONB DEFAULT '[]'::jsonb,
  availability VARCHAR(50) DEFAULT 'available' CHECK (availability IN ('available', 'unavailable', 'part-time', 'full-time')),
  response_time INTEGER DEFAULT 24, -- in hours
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ============================================================================
-- 2. GIGS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS gigs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  talent_id UUID NOT NULL REFERENCES talents(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  subcategory VARCHAR(100),
  price DECIMAL(10, 2) NOT NULL,
  delivery_time INTEGER NOT NULL, -- in days
  revisions INTEGER DEFAULT 1,
  images JSONB DEFAULT '[]'::jsonb,
  tags JSONB DEFAULT '[]'::jsonb,
  rating DECIMAL(3, 2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  total_orders INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 3. GIG_ORDERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS gig_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gig_id UUID NOT NULL REFERENCES gigs(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  talent_id UUID NOT NULL REFERENCES talents(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled', 'disputed')),
  delivery_date TIMESTAMP WITH TIME ZONE,
  completed_date TIMESTAMP WITH TIME ZONE,
  buyer_rating DECIMAL(3, 2) CHECK (buyer_rating >= 0 AND buyer_rating <= 5),
  buyer_review TEXT,
  talent_rating DECIMAL(3, 2) CHECK (talent_rating >= 0 AND talent_rating <= 5),
  talent_review TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 4. TALENT_REVIEWS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS talent_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  talent_id UUID NOT NULL REFERENCES talents(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating DECIMAL(3, 2) NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  order_id UUID REFERENCES gig_orders(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(talent_id, reviewer_id, order_id)
);

-- ============================================================================
-- 5. TALENT_MESSAGES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS talent_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CHECK (sender_id != receiver_id)
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_talents_user_id ON talents(user_id);
CREATE INDEX IF NOT EXISTS idx_talents_skills ON talents USING GIN(skills);
CREATE INDEX IF NOT EXISTS idx_talents_availability ON talents(availability);
CREATE INDEX IF NOT EXISTS idx_talents_rating ON talents(rating DESC);

CREATE INDEX IF NOT EXISTS idx_gigs_talent_id ON gigs(talent_id);
CREATE INDEX IF NOT EXISTS idx_gigs_category ON gigs(category);
CREATE INDEX IF NOT EXISTS idx_gigs_is_active ON gigs(is_active);
CREATE INDEX IF NOT EXISTS idx_gigs_rating ON gigs(rating DESC);

CREATE INDEX IF NOT EXISTS idx_gig_orders_buyer_id ON gig_orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_gig_orders_talent_id ON gig_orders(talent_id);
CREATE INDEX IF NOT EXISTS idx_gig_orders_status ON gig_orders(status);
CREATE INDEX IF NOT EXISTS idx_gig_orders_created_at ON gig_orders(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_talent_reviews_talent_id ON talent_reviews(talent_id);
CREATE INDEX IF NOT EXISTS idx_talent_reviews_reviewer_id ON talent_reviews(reviewer_id);

CREATE INDEX IF NOT EXISTS idx_talent_messages_sender_id ON talent_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_talent_messages_receiver_id ON talent_messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_talent_messages_created_at ON talent_messages(created_at DESC);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE talents ENABLE ROW LEVEL SECURITY;
ALTER TABLE gigs ENABLE ROW LEVEL SECURITY;
ALTER TABLE gig_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE talent_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE talent_messages ENABLE ROW LEVEL SECURITY;

-- Talents policies
CREATE POLICY "Users can view all talents" ON talents FOR SELECT USING (true);
CREATE POLICY "Users can create their own talent profile" ON talents FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own talent profile" ON talents FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own talent profile" ON talents FOR DELETE USING (auth.uid() = user_id);

-- Gigs policies
CREATE POLICY "Users can view all active gigs" ON gigs FOR SELECT USING (is_active = true OR auth.uid() IN (SELECT user_id FROM talents WHERE id = gigs.talent_id));
CREATE POLICY "Talents can create their own gigs" ON gigs FOR INSERT WITH CHECK (auth.uid() IN (SELECT user_id FROM talents WHERE id = gigs.talent_id));
CREATE POLICY "Talents can update their own gigs" ON gigs FOR UPDATE USING (auth.uid() IN (SELECT user_id FROM talents WHERE id = gigs.talent_id));
CREATE POLICY "Talents can delete their own gigs" ON gigs FOR DELETE USING (auth.uid() IN (SELECT user_id FROM talents WHERE id = gigs.talent_id));

-- Gig orders policies
CREATE POLICY "Users can view their own orders" ON gig_orders FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() IN (SELECT user_id FROM talents WHERE id = gig_orders.talent_id));
CREATE POLICY "Users can create orders" ON gig_orders FOR INSERT WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "Buyers and talents can update orders" ON gig_orders FOR UPDATE USING (auth.uid() = buyer_id OR auth.uid() IN (SELECT user_id FROM talents WHERE id = gig_orders.talent_id));

-- Talent reviews policies
CREATE POLICY "Users can view all reviews" ON talent_reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews for their orders" ON talent_reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);
CREATE POLICY "Users can update their own reviews" ON talent_reviews FOR UPDATE USING (auth.uid() = reviewer_id);
CREATE POLICY "Users can delete their own reviews" ON talent_reviews FOR DELETE USING (auth.uid() = reviewer_id);

-- Talent messages policies
CREATE POLICY "Users can view their own messages" ON talent_messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Users can send messages" ON talent_messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Users can update their own messages" ON talent_messages FOR UPDATE USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_talents_updated_at BEFORE UPDATE ON talents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_gigs_updated_at BEFORE UPDATE ON gigs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_gig_orders_updated_at BEFORE UPDATE ON gig_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update talent rating when review is added
CREATE OR REPLACE FUNCTION update_talent_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE talents
  SET 
    rating = (
      SELECT COALESCE(AVG(rating), 0)
      FROM talent_reviews
      WHERE talent_id = NEW.talent_id
    ),
    total_reviews = (
      SELECT COUNT(*)
      FROM talent_reviews
      WHERE talent_id = NEW.talent_id
    )
  WHERE id = NEW.talent_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_talent_rating_trigger
AFTER INSERT OR UPDATE OR DELETE ON talent_reviews
FOR EACH ROW EXECUTE FUNCTION update_talent_rating();

-- Function to update gig rating when order is completed with rating
CREATE OR REPLACE FUNCTION update_gig_rating()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND NEW.buyer_rating IS NOT NULL THEN
    UPDATE gigs
    SET 
      rating = (
        SELECT COALESCE(AVG(buyer_rating), 0)
        FROM gig_orders
        WHERE gig_id = NEW.gig_id AND buyer_rating IS NOT NULL
      ),
      total_orders = (
        SELECT COUNT(*)
        FROM gig_orders
        WHERE gig_id = NEW.gig_id AND status = 'completed'
      )
    WHERE id = NEW.gig_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_gig_rating_trigger
AFTER INSERT OR UPDATE ON gig_orders
FOR EACH ROW EXECUTE FUNCTION update_gig_rating();

-- ============================================================================
-- COMMENTS
-- ============================================================================
COMMENT ON TABLE talents IS 'Talent (freelancer) profiles';
COMMENT ON TABLE gigs IS 'Freelance services/gigs offered by talents';
COMMENT ON TABLE gig_orders IS 'Orders placed by buyers for gigs';
COMMENT ON TABLE talent_reviews IS 'Reviews and ratings for talents';
COMMENT ON TABLE talent_messages IS 'Messages between users and talents';

