export interface Field {
  id: string;
  farm_id: string;
  user_id: string;
  name: string;
  size_acres: number;
  current_crop: string;
  variety?: string;
  planting_date: string;
  target_harvest_date?: string;
  growth_stage: 'Germination' | 'Vegetative' | 'Flowering' | 'Fruiting' | 'Maturation' | 'Harvested';
  soil_ph?: number;
}

export interface Farm {
  id: string;
  user_id: string;
  name: string;
  location: string;
  latitude?: number;
  longitude?: number;
  total_acreage: number;
  primary_soil_type: string;
  irrigation_system: string;
  water_source?: string;
  status: 'ACTIVE' | 'FALLOW' | 'TRANSITIONING';
  created_at: string;
  fields?: Field[];
}

export interface OrganicRemedy {
  method: string;
  application_rate: string;
  frequency: string;
}

export interface ChemicalControl {
  compound: string;
  active_ingredient: string;
  dosage_per_acre: string;
  safety_interval_days: number;
}

export interface AdvisoryReport {
  id?: string;
  user_id?: string;
  farm_id?: string | null;
  field_id?: string | null;
  crop_name: string;
  crop_variety?: string;
  growth_stage: string;
  symptoms_description: string;
  affected_parts?: string[];
  severity: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  diagnosis_title: string;
  pathogen_or_cause: string;
  category: 'Fungal' | 'Bacterial' | 'Viral' | 'Nutrient' | 'Pest' | 'Environmental' | 'Other';
  confidence_score: number;
  condition_analysis: string;
  immediate_actions: string[];
  organic_remediations: OrganicRemedy[];
  chemical_controls: ChemicalControl[];
  irrigation_and_soil_advice: string;
  long_term_prevention: string[];
  weather_context?: Record<string, any>;
  regulatory_disclaimer: string;
  status?: string;
  created_at: string;
}

export interface DashboardMetrics {
  totalFarms: number;
  totalAcreage: number;
  totalFields: number;
  activeAlerts: number;
  totalAdvisories: number;
  healthIndex: number;
  cropDistribution: Record<string, number>;
}
