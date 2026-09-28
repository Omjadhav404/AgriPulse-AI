import { supabaseAdmin, isSupabaseConfigured, localStore } from '../config/supabase.js';

export async function getFarms(req, res) {
  try {
    const userId = req.headers['x-user-id'] || 'usr-demo-farmer';

    if (isSupabaseConfigured && supabaseAdmin) {
      const { data: farms, error: farmErr } = await supabaseAdmin
        .from('farms')
        .select('*, fields(*)');

      if (!farmErr && farms) {
        return res.json({ success: true, data: farms });
      }
    }

    return res.json({ success: true, data: localStore.farms });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function createFarm(req, res) {
  try {
    const userId = req.headers['x-user-id'] || 'usr-demo-farmer';
    const { name, location, totalAcreage, primarySoilType, irrigationSystem } = req.body;

    if (!name || !location) {
      return res.status(400).json({ success: false, message: 'Farm name and location are required' });
    }

    const newFarm = {
      id: isSupabaseConfigured ? undefined : `farm-${Date.now()}`,
      user_id: userId,
      name,
      location,
      total_acreage: Number(totalAcreage) || 5.0,
      primary_soil_type: primarySoilType || 'Loam',
      irrigation_system: irrigationSystem || 'Drip Micro-Irrigation',
      water_source: 'Borewell / Local Supply',
      status: 'ACTIVE',
      created_at: new Date().toISOString(),
      fields: []
    };

    if (isSupabaseConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('farms')
        .insert({
          user_id: userId,
          name,
          location,
          total_acreage: Number(totalAcreage) || 5.0,
          primary_soil_type: primarySoilType || 'Loam',
          irrigation_system: irrigationSystem || 'Drip Micro-Irrigation'
        })
        .select()
        .single();

      if (!error && data) {
        return res.status(201).json({ success: true, data: { ...data, fields: [] } });
      }
    }

    localStore.farms.push(newFarm);
    return res.status(201).json({ success: true, data: newFarm });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function addFieldToFarm(req, res) {
  try {
    const userId = req.headers['x-user-id'] || 'usr-demo-farmer';
    const { farmId } = req.params;
    const { name, sizeAcres, currentCrop, variety, plantingDate, growthStage, soilPh } = req.body;

    if (!name || !currentCrop) {
      return res.status(400).json({ success: false, message: 'Field name and current crop are required' });
    }

    const newField = {
      id: isSupabaseConfigured ? undefined : `field-${Date.now()}`,
      farm_id: farmId,
      user_id: userId,
      name,
      size_acres: Number(sizeAcres) || 1.0,
      current_crop: currentCrop,
      variety: variety || 'Standard',
      planting_date: plantingDate || new Date().toISOString().split('T')[0],
      growth_stage: growthStage || 'Vegetative',
      soil_ph: Number(soilPh) || 6.5,
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('fields')
        .insert(newField)
        .select()
        .single();

      if (!error && data) {
        return res.status(201).json({ success: true, data });
      }
    }

    const farm = localStore.farms.find(f => f.id === farmId);
    if (farm) {
      if (!farm.fields) farm.fields = [];
      farm.fields.push(newField);
    }

    return res.status(201).json({ success: true, data: newField });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function getDashboardStats(req, res) {
  try {
    let farms = localStore.farms;
    let advisories = localStore.advisories;

    if (isSupabaseConfigured && supabaseAdmin) {
      const { data: dbFarms } = await supabaseAdmin.from('farms').select('*, fields(*)');
      const { data: dbAdv } = await supabaseAdmin.from('advisory_logs').select('*');
      if (dbFarms) farms = dbFarms;
      if (dbAdv) advisories = dbAdv;
    }

    const totalAcreage = farms.reduce((acc, f) => acc + Number(f.total_acreage || 0), 0);
    const totalFields = farms.reduce((acc, f) => acc + (f.fields ? f.fields.length : 0), 0);
    const activeAlerts = advisories.filter(a => a.severity === 'HIGH' || a.severity === 'CRITICAL').length;
    const resolvedAdvisories = advisories.length;

    // Calculate crop distribution
    const cropsMap = {};
    farms.forEach(f => {
      (f.fields || []).forEach(fld => {
        cropsMap[fld.current_crop] = (cropsMap[fld.current_crop] || 0) + Number(fld.size_acres || 1);
      });
    });

    return res.json({
      success: true,
      data: {
        totalFarms: farms.length,
        totalAcreage: Math.round(totalAcreage * 10) / 10,
        totalFields,
        activeAlerts,
        totalAdvisories: resolvedAdvisories,
        healthIndex: 94.2,
        cropDistribution: cropsMap
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
