import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseServiceKey &&
  !supabaseUrl.includes('your-supabase-project') &&
  !supabaseServiceKey.includes('your_supabase_service_role_key')
);

let supabaseAdmin = null;

if (isSupabaseConfigured) {
  try {
    supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    console.log('🌱 Connected to Supabase Cloud PostgreSQL successfully.');
  } catch (err) {
    console.warn('⚠️ Error initializing Supabase client:', err.message);
  }
} else {
  console.log('ℹ️ Running in Local Mock Persistence Mode for Supabase (Insert credentials in server/.env when ready).');
}

export { supabaseAdmin };

// In-Memory Data Store Fallback for local testing when Supabase keys are not set
export const localStore = {
  farms: [
    {
      id: 'farm-001',
      user_id: 'usr-demo-farmer',
      name: 'SunRidge Organic Farmstead',
      location: 'Valley Agro District, Plot 14',
      latitude: 19.0760,
      longitude: 72.8777,
      total_acreage: 28.5,
      primary_soil_type: 'Clay Loam (Rich Organic Matter)',
      irrigation_system: 'Drip Micro-Irrigation',
      water_source: 'Canal & Rainwater Harvesting Pond',
      status: 'ACTIVE',
      created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
      fields: [
        {
          id: 'field-101',
          farm_id: 'farm-001',
          user_id: 'usr-demo-farmer',
          name: 'Block A - Roma Tomatoes',
          size_acres: 8.5,
          current_crop: 'Tomato',
          variety: 'Roma VF Disease Resistant',
          planting_date: '2026-08-10',
          target_harvest_date: '2026-11-20',
          growth_stage: 'Flowering',
          soil_ph: 6.4,
          created_at: new Date(Date.now() - 30 * 86400000).toISOString()
        },
        {
          id: 'field-102',
          farm_id: 'farm-001',
          user_id: 'usr-demo-farmer',
          name: 'Block B - Winter Wheat',
          size_acres: 12.0,
          current_crop: 'Wheat',
          variety: 'Sharbati Gold',
          planting_date: '2026-08-25',
          target_harvest_date: '2026-12-15',
          growth_stage: 'Vegetative',
          soil_ph: 6.8,
          created_at: new Date(Date.now() - 25 * 86400000).toISOString()
        }
      ]
    },
    {
      id: 'farm-002',
      user_id: 'usr-demo-farmer',
      name: 'Highland Orchard & Pulse Estate',
      location: 'Western Slopes, Sector 7',
      latitude: 20.2961,
      longitude: 85.8245,
      total_acreage: 18.0,
      primary_soil_type: 'Sandy Loam',
      irrigation_system: 'Precision Sprinkler',
      water_source: 'Deep Borewell (Solar Powered)',
      status: 'ACTIVE',
      created_at: new Date(Date.now() - 60 * 86400000).toISOString(),
      fields: [
        {
          id: 'field-201',
          farm_id: 'farm-002',
          user_id: 'usr-demo-farmer',
          name: 'Highland Chickpea Block',
          size_acres: 10.0,
          current_crop: 'Chickpea',
          variety: 'Desi JG-11',
          planting_date: '2026-09-01',
          target_harvest_date: '2026-12-28',
          growth_stage: 'Vegetative',
          soil_ph: 7.2,
          created_at: new Date(Date.now() - 20 * 86400000).toISOString()
        }
      ]
    }
  ],
  advisories: [
    {
      id: 'adv-001',
      user_id: 'usr-demo-farmer',
      farm_id: 'farm-001',
      field_id: 'field-101',
      crop_name: 'Tomato',
      crop_variety: 'Roma VF Disease Resistant',
      growth_stage: 'Flowering',
      symptoms_description: 'Yellow concentric ring lesions with dark margins on lower foliage. Slight wilting during peak midday heat.',
      affected_parts: ['leaves', 'stems'],
      severity: 'MODERATE',
      diagnosis_title: 'Early Blight (Alternaria solani) with Heat Induced Stress',
      pathogen_or_cause: 'Alternaria solani fungal spores proliferated by nocturnal humidity and foliage wetness',
      category: 'Fungal',
      confidence_score: 94.8,
      condition_analysis: 'The observed concentric target-board lesions on bottom canopy leaves are characteristic of Early Blight (Alternaria solani). Favorable spore germination occurs when foliage remains damp for more than 4 hours in temperatures between 24-29°C.',
      immediate_actions: [
        'Prune and safely discard all infected lower leaves showing necrosis',
        'Avoid overhead sprinkler irrigation; irrigate strictly at the root line',
        'Sanitize all pruning tools in 70% isopropyl alcohol between rows'
      ],
      organic_remediations: [
        {
          method: 'Copper Octanoate (Copper Soap) spray',
          application_rate: '2.5 oz per gallon water',
          frequency: 'Every 7 to 10 days until spread halts'
        },
        {
          method: 'Bacillus subtilis bio-fungicide bio-drench',
          application_rate: '15 ml per liter',
          frequency: 'At 14-day intervals'
        }
      ],
      chemical_controls: [
        {
          compound: 'Azoxystrobin 23% SC',
          active_ingredient: 'Azoxystrobin',
          dosage_per_acre: '200 ml diluted in 200L water',
          safety_interval_days: 7
        }
      ],
      irrigation_and_soil_advice: 'Ensure soil moisture is maintained between 60-70% field capacity. Avoid waterlogging around root crown.',
      long_term_prevention: [
        'Implement minimum 2-year crop rotation away from Solanaceae (potato, pepper, eggplant)',
        'Apply 3-inch straw or reflective plastic mulch to prevent soil-splash spore transmission'
      ],
      regulatory_disclaimer: 'Recommendations adhere to Good Agricultural Practices (GAP). Ensure personal protective equipment (PPE) is worn during chemical applications. Always consult local agricultural extension regulations.',
      status: 'RESOLVED',
      created_at: new Date(Date.now() - 2 * 86400000).toISOString()
    }
  ]
};
