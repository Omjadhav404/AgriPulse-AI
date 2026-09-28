import React, { useState } from 'react';
import { SimulationProvider, useSimulation } from './context/SimulationContext';
import { GlobalHeader } from './components/common/GlobalHeader';
import { LandingPage } from './components/landing/LandingPage';
import { BusinessOS } from './components/business/BusinessOS';
import { DriverOS } from './components/driver/DriverOS';
import { FleetOS } from './components/fleet/FleetOS';
import { ControlTower } from './components/controlTower/ControlTower';
import { DriverOnboardingModal } from './components/onboarding/DriverOnboardingModal';

const AppContent: React.FC = () => {
  const { role, setRole } = useSimulation();
  const [showOnboarding, setShowOnboarding] = useState(false);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      {/* Global Brand Header with Live Telemetry and Role Switcher */}
      <GlobalHeader onOpenOnboarding={() => setShowOnboarding(true)} />

      {/* Role-based Active Application View */}
      <div style={{ flex: 1 }}>
        {role === 'marketing' && (
          <LandingPage onOpenOnboarding={() => setShowOnboarding(true)} />
        )}
        {role === 'business' && <BusinessOS />}
        {role === 'driver' && <DriverOS />}
        {role === 'fleet' && <FleetOS />}
        {role === 'control-tower' && <ControlTower />}
      </div>

      {/* Driver & Fleet Onboarding Modal */}
      <DriverOnboardingModal
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onSuccessRoleSwitch={() => {
          setShowOnboarding(false);
          setRole('driver');
        }}
      />
    </div>
  );
};

export function App() {
  return (
    <SimulationProvider>
      <AppContent />
    </SimulationProvider>
  );
}

export default App;
