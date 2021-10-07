import React from 'react';
import './App.css';
import { PickupLocationsContext, FishTypesContext } from './context';
import { IncidentListPage } from './features';
import { useApp } from './useApp';
import { Tabs, Tab } from '@material-ui/core';
import { ReimbursementDashboard } from './features/ReimbursementDashboard/ReimbursementDashboard';

function App() {
  const { pickupLocations, fishTypes, displayedTab, tabChange } = useApp();

  return (
    <div className="App">
      <PickupLocationsContext.Provider value={pickupLocations}>
        <FishTypesContext.Provider value={fishTypes}>
          <Tabs
            value={displayedTab}
            onChange={tabChange}
          >
            <Tab value="IncidentListPage" label="Incidents" />
            <Tab value="ReimbursmentDashboardPage" label="Remboursements" />
          </Tabs>
          <div className="page-content">
            {displayedTab === "IncidentListPage" &&
              <IncidentListPage />
            }
            {displayedTab === "ReimbursmentDashboardPage" &&
              <ReimbursementDashboard />
            }
          </div>
        </FishTypesContext.Provider>
      </PickupLocationsContext.Provider >
    </div >
  );
}

export default App;
