import { Farm, Field, AdvisoryReport, DashboardMetrics } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export async function fetchHealth() {
  try {
    const res = await fetch(`${API_BASE}/api/health`);
    return await res.json();
  } catch (err) {
    return { status: 'offline', error: err.message };
  }
}

export async function fetchFarms(): Promise<Farm[]> {
  try {
    const res = await fetch(`${API_BASE}/api/farms`);
    const data = await res.json();
    return data.data || [];
  } catch (err) {
    console.warn('API error fetching farms:', err);
    return [];
  }
}

export async function createFarmApi(farmData: Partial<Farm>): Promise<Farm> {
  const res = await fetch(`${API_BASE}/api/farms`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(farmData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to create farm');
  return data.data;
}

export async function addFieldApi(farmId: string, fieldData: Partial<Field>): Promise<Field> {
  const res = await fetch(`${API_BASE}/api/farms/${farmId}/fields`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(fieldData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to add field');
  return data.data;
}

export async function fetchDashboardMetrics(): Promise<DashboardMetrics> {
  try {
    const res = await fetch(`${API_BASE}/api/farms/stats/dashboard`);
    const data = await res.json();
    return data.data;
  } catch (err) {
    return {
      totalFarms: 2,
      totalAcreage: 46.5,
      totalFields: 3,
      activeAlerts: 1,
      totalAdvisories: 1,
      healthIndex: 94.2,
      cropDistribution: { 'Tomato': 8.5, 'Wheat': 12.0, 'Chickpea': 10.0 }
    };
  }
}

export async function submitDiagnosticRequest(payload: any): Promise<AdvisoryReport> {
  const res = await fetch(`${API_BASE}/api/advisory/diagnose`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to diagnose symptoms');
  return data.data;
}

export async function fetchAdvisoryHistory(): Promise<AdvisoryReport[]> {
  try {
    const res = await fetch(`${API_BASE}/api/advisory/history`);
    const data = await res.json();
    return data.data || [];
  } catch (err) {
    console.warn('API error fetching advisories:', err);
    return [];
  }
}

export async function fetchAdvisoryById(id: string): Promise<AdvisoryReport | null> {
  try {
    const res = await fetch(`${API_BASE}/api/advisory/${id}`);
    const data = await res.json();
    return data.data || null;
  } catch (err) {
    return null;
  }
}
