import { generateAdvisoryDiagnosis } from '../services/aiAdvisorService.js';
import { supabaseAdmin, isSupabaseConfigured, localStore } from '../config/supabase.js';
import crypto from 'crypto';

export async function createDiagnosis(req, res) {
  try {
    const inputData = req.body;
    const userId = req.headers['x-user-id'] || 'usr-demo-farmer';

    // Generate AI Agronomic Diagnostic via Gemini or fallback engine
    const diagnosis = await generateAdvisoryDiagnosis(inputData);

    const record = {
      id: isSupabaseConfigured ? undefined : `adv-${Date.now()}`,
      user_id: userId,
      farm_id: inputData.farmId || null,
      field_id: inputData.fieldId || null,
      crop_name: inputData.cropName,
      crop_variety: inputData.cropVariety || 'Standard',
      growth_stage: inputData.growthStage,
      symptoms_description: inputData.symptomsDescription,
      affected_parts: inputData.affectedParts || ['leaves'],
      severity: diagnosis.severity,
      diagnosis_title: diagnosis.diagnosis_title,
      pathogen_or_cause: diagnosis.pathogen_or_cause,
      category: diagnosis.category,
      confidence_score: diagnosis.confidence_score,
      condition_analysis: diagnosis.condition_analysis,
      immediate_actions: diagnosis.immediate_actions,
      organic_remediations: diagnosis.organic_remediations,
      chemical_controls: diagnosis.chemical_controls,
      irrigation_and_soil_advice: diagnosis.irrigation_and_soil_advice,
      long_term_prevention: diagnosis.long_term_prevention,
      weather_context: inputData.weatherConditions || {},
      regulatory_disclaimer: diagnosis.regulatory_disclaimer,
      status: 'RESOLVED',
      created_at: new Date().toISOString()
    };

    let savedRecord = record;

    if (isSupabaseConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('advisory_logs')
        .insert(record)
        .select()
        .single();

      if (error) {
        console.warn('⚠️ Supabase insert failed, caching locally:', error.message);
        localStore.advisories.unshift({ ...record, id: `adv-${Date.now()}` });
      } else {
        savedRecord = data;
      }
    } else {
      localStore.advisories.unshift(record);
    }

    return res.status(201).json({
      success: true,
      data: savedRecord,
      message: 'Agronomic diagnostic generated and archived successfully.'
    });
  } catch (error) {
    console.error('Error in createDiagnosis:', error);
    return res.status(400).json({
      success: false,
      error: error.message || 'Failed to process crop advisory request'
    });
  }
}

export async function getAdvisoryHistory(req, res) {
  try {
    const userId = req.headers['x-user-id'] || 'usr-demo-farmer';
    const { severity, crop, limit = 50 } = req.query;

    if (isSupabaseConfigured && supabaseAdmin) {
      let query = supabaseAdmin
        .from('advisory_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(Number(limit));

      if (severity) query = query.eq('severity', severity);
      if (crop) query = query.ilike('crop_name', `%${crop}%`);

      const { data, error } = await query;
      if (!error && data) {
        return res.json({ success: true, data });
      }
    }

    // Local in-memory filter
    let results = [...localStore.advisories];
    if (severity) {
      results = results.filter(item => item.severity.toLowerCase() === severity.toLowerCase());
    }
    if (crop) {
      results = results.filter(item => item.crop_name.toLowerCase().includes(crop.toLowerCase()));
    }

    return res.json({
      success: true,
      data: results.slice(0, Number(limit))
    });
  } catch (error) {
    console.error('Error in getAdvisoryHistory:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function getAdvisoryById(req, res) {
  try {
    const { id } = req.params;

    if (isSupabaseConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('advisory_logs')
        .select('*')
        .eq('id', id)
        .single();

      if (!error && data) {
        return res.json({ success: true, data });
      }
    }

    const advisory = localStore.advisories.find(item => item.id === id);
    if (!advisory) {
      return res.status(404).json({ success: false, message: 'Advisory report not found' });
    }

    return res.json({ success: true, data: advisory });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function deleteAdvisory(req, res) {
  try {
    const { id } = req.params;

    if (isSupabaseConfigured && supabaseAdmin) {
      await supabaseAdmin.from('advisory_logs').delete().eq('id', id);
    }

    localStore.advisories = localStore.advisories.filter(item => item.id !== id);
    return res.json({ success: true, message: 'Advisory record removed' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
