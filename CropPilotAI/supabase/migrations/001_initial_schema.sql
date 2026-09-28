-- CropPilotAI: 001_initial_schema.sql
-- Production Supabase PostgreSQL Schema with RLS, Indexes, and Seed Data

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Profiles Table (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT,
    organization TEXT,
    phone TEXT,
    preferred_region TEXT DEFAULT 'Global',
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Farms Table
CREATE TABLE IF NOT EXISTS public.farms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    total_acreage NUMERIC(10, 2) NOT NULL DEFAULT 1.0,
    primary_soil_type TEXT NOT NULL DEFAULT 'Loam',
    irrigation_system TEXT NOT NULL DEFAULT 'Drip Irrigation',
    water_source TEXT DEFAULT 'Borewell & Canal',
    status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'FALLOW', 'TRANSITIONING')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Fields Table (Sub-divisions of a Farm)
CREATE TABLE IF NOT EXISTS public.fields (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    size_acres NUMERIC(8, 2) NOT NULL DEFAULT 1.0,
    current_crop TEXT NOT NULL,
    variety TEXT,
    planting_date DATE NOT NULL,
    target_harvest_date DATE,
    growth_stage TEXT NOT NULL DEFAULT 'Vegetative' CHECK (growth_stage IN ('Germination', 'Vegetative', 'Flowering', 'Fruiting', 'Maturation', 'Harvested')),
    soil_ph NUMERIC(3, 1) DEFAULT 6.5,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Advisory Logs Table (Persistent AI Diagnoses & Treatment Plans)
CREATE TABLE IF NOT EXISTS public.advisory_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    farm_id UUID REFERENCES public.farms(id) ON DELETE SET NULL,
    field_id UUID REFERENCES public.fields(id) ON DELETE SET NULL,
    crop_name TEXT NOT NULL,
    crop_variety TEXT,
    growth_stage TEXT NOT NULL,
    symptoms_description TEXT NOT NULL,
    affected_parts TEXT[] DEFAULT ARRAY['leaves']::TEXT[],
    severity TEXT NOT NULL CHECK (severity IN ('LOW', 'MODERATE', 'HIGH', 'CRITICAL')),
    diagnosis_title TEXT NOT NULL,
    pathogen_or_cause TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Fungal' CHECK (category IN ('Fungal', 'Bacterial', 'Viral', 'Nutrient', 'Pest', 'Environmental', 'Other')),
    confidence_score NUMERIC(5, 2) NOT NULL DEFAULT 92.50,
    condition_analysis TEXT NOT NULL,
    immediate_actions JSONB NOT NULL DEFAULT '[]'::jsonb,
    organic_remediations JSONB NOT NULL DEFAULT '[]'::jsonb,
    chemical_controls JSONB NOT NULL DEFAULT '[]'::jsonb,
    irrigation_and_soil_advice TEXT,
    long_term_prevention JSONB NOT NULL DEFAULT '[]'::jsonb,
    weather_context JSONB DEFAULT '{}'::jsonb,
    regulatory_disclaimer TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'RESOLVED' CHECK (status IN ('OPEN', 'IN_TREATMENT', 'RESOLVED', 'MONITORING')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_farms_user_id ON public.farms(user_id);
CREATE INDEX IF NOT EXISTS idx_fields_farm_id ON public.fields(farm_id);
CREATE INDEX IF NOT EXISTS idx_fields_user_id ON public.fields(user_id);
CREATE INDEX IF NOT EXISTS idx_advisories_user_id ON public.advisory_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_advisories_severity ON public.advisory_logs(severity);
CREATE INDEX IF NOT EXISTS idx_advisories_created_at ON public.advisory_logs(created_at DESC);

-- 7. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advisory_logs ENABLE ROW LEVEL SECURITY;

-- 8. RLS Policies
-- Profiles: Users can view and update their own profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Farms: Complete tenancy isolation
DROP POLICY IF EXISTS "Users can manage own farms" ON public.farms;
CREATE POLICY "Users can manage own farms" ON public.farms
    FOR ALL USING (auth.uid() = user_id);

-- Fields: Complete tenancy isolation
DROP POLICY IF EXISTS "Users can manage own fields" ON public.fields;
CREATE POLICY "Users can manage own fields" ON public.fields
    FOR ALL USING (auth.uid() = user_id);

-- Advisory Logs: Complete tenancy isolation
DROP POLICY IF EXISTS "Users can manage own advisories" ON public.advisory_logs;
CREATE POLICY "Users can manage own advisories" ON public.advisory_logs
    FOR ALL USING (auth.uid() = user_id);

-- 9. Automatic Profile Creation Trigger on Supabase Auth Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, email)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'Agri Specialist'),
        NEW.email
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 10. Sample Agronomic Seed Data (Can be run directly or when auth is established)
-- Note: Replace sample UUIDs with real Supabase Auth user IDs when testing live.
DO $$
DECLARE
    sample_user_id UUID;
    sample_farm_id UUID;
    sample_field_id UUID;
BEGIN
    -- Check if any user exists in auth.users, otherwise skip seed inserts
    SELECT id INTO sample_user_id FROM auth.users LIMIT 1;
    
    IF sample_user_id IS NOT NULL THEN
        -- Insert a demo farm if none exists
        IF NOT EXISTS (SELECT 1 FROM public.farms WHERE user_id = sample_user_id) THEN
            INSERT INTO public.farms (id, user_id, name, location, total_acreage, primary_soil_type, irrigation_system)
            VALUES (
                uuid_generate_v4(),
                sample_user_id,
                'GreenValley Organic Agro Estate',
                'Central Agri Corridor, Block 4',
                45.5,
                'Rich Alluvial Loam',
                'Solar Precision Drip'
            ) RETURNING id INTO sample_farm_id;

            -- Insert sample fields
            INSERT INTO public.fields (id, farm_id, user_id, name, size_acres, current_crop, variety, planting_date, growth_stage, soil_ph)
            VALUES (
                uuid_generate_v4(),
                sample_farm_id,
                sample_user_id,
                'North Parcel - Tomato Block',
                12.0,
                'Tomato',
                'Roma VF High Yield',
                CURRENT_DATE - INTERVAL '45 days',
                'Flowering',
                6.4
            ) RETURNING id INTO sample_field_id;

            -- Insert a sample historical advisory log
            INSERT INTO public.advisory_logs (
                user_id, farm_id, field_id, crop_name, crop_variety, growth_stage,
                symptoms_description, affected_parts, severity, diagnosis_title,
                pathogen_or_cause, category, confidence_score, condition_analysis,
                immediate_actions, organic_remediations, chemical_controls,
                irrigation_and_soil_advice, long_term_prevention, regulatory_disclaimer
            ) VALUES (
                sample_user_id,
                sample_farm_id,
                sample_field_id,
                'Tomato',
                'Roma VF',
                'Flowering',
                'Yellow concentric ring lesions with dark margins on lower foliage. Slight wilting during peak midday heat.',
                ARRAY['leaves', 'stems'],
                'MODERATE',
                'Early Blight (Alternaria solani) with Secondary Heat Stress',
                'Alternaria solani fungal spores proliferated by nocturnal humidity and foliage wetness',
                'Fungal',
                94.8,
                'The observed concentric target-board lesions on bottom canopy leaves are characteristic of Early Blight (Alternaria solani). Favorable spore germination occurs when foliage remains damp for more than 4 hours in temperatures between 24-29°C.',
                '["Prune and safely discard all infected lower leaves showing necrosis", "Avoid overhead sprinkler irrigation; irrigate strictly at the root line", "Sanitize all pruning tools in 70% isopropyl alcohol between rows"]'::jsonb,
                '[{"method": "Copper Octanoate (Copper Soap) spray", "application_rate": "2.5 oz per gallon water", "frequency": "Every 7 to 10 days until spread halts"}, {"method": "Bacillus subtilis bio-fungicide bio-drench", "application_rate": "15 ml per liter", "frequency": "At 14-day intervals"}]'::jsonb,
                '[{"compound": "Azoxystrobin 23% SC", "active_ingredient": "Azoxystrobin", "dosage_per_acre": "200 ml diluted in 200L water", "safety_interval_days": 7}]'::jsonb,
                'Ensure soil moisture is maintained between 60-70% field capacity. Avoid waterlogging around root crown.',
                '["Implement minimum 2-year crop rotation away from Solanaceae (potato, pepper, eggplant)", "Apply 3-inch straw or reflective plastic mulch to prevent soil-splash spore transmission"]'::jsonb,
                'Recommendations adhere to Good Agricultural Practices (GAP). Ensure personal protective equipment (PPE) is worn during chemical applications. Always consult local agricultural extension regulations.'
            );
        END IF;
    END IF;
END $$;
