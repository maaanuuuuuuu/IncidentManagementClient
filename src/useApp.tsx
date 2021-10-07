import pickupLocations from './pickupLocations.json';
import fishTypes from './fishTypes.json';
import { ChangeEvent, useState } from 'react';

export const useApp = () => {
  const [displayedTab, setDisplayedTab] = useState<string>("IncidentListPage");
  const tabChange = (event: ChangeEvent<{}>, value: any) => {
    setDisplayedTab(value);
  }

  return { pickupLocations, fishTypes, displayedTab, tabChange };
}