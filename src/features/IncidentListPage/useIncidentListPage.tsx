import { format } from "date-fns";
import { useEffect, useState } from "react";
import config from '../../config';
import { usePickupLocationsContext, useFishTypesContext } from '../../context';

export interface IIncident {
  id?: string;
  emailClient: string;
  pickupLocation: string;
  incidentDate: Date;
  incidentType: string;
  cause: string;
  resolution: string;
  reimbursedAmount: string;
  specie?: string;
  comment: string;
};

export interface IIncidentFromDB extends IIncident {
  _id: string;
}
type ModType = "list" | "add";

export interface IResponse<T> {
  data: T[];
  totalPages: number;
  currentPage: number;
  totalCount: number;
}
export const useIncidentListPage = () => {

  const [incidents, setIncidents] = useState<IIncident[]>([]);
  const [mod, setMod] = useState<ModType>("list");
  const [totalCount, setTotalCount] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(0);
  const pickupLocations = usePickupLocationsContext();
  const species = useFishTypesContext();


  const postIncident = (newIncident: IIncident) => {
    (async () => {
      const headers: {
        Accept: string;
        "Content-Type": string;
      } = {
        "Accept": "application/ld+json",
        "Content-Type": "application/json"
      };
      const response = await fetch(config.REACT_APP_BACKEND_URL + '/incidents', {
        method: "POST",
        headers,
        body: JSON.stringify(newIncident)
      } as RequestInit);

      if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        console.error(message);
        return;
      }
      fetchIncidents();
    })();
  };

  const fetchIncidents = async (page = 0, limit = 5) => {
    const headers: {
      Accept: string;
      "Content-Type": string;
    } = {
      "Accept": "application/ld+json",
      "Content-Type": "application/json"
    };

    const response = await fetch(config.REACT_APP_BACKEND_URL + '/incidents?page=' + page + '&limit=' + limit, {
      method: "GET",
      headers,
    } as RequestInit);

    if (!response.ok) {
      const message = `An error has occured: ${response.status}`;
      console.error(message);
      return;
    }
    const jsonResponse: IResponse<IIncidentFromDB> = await response.json();
    setTotalCount(jsonResponse.totalCount);
    setPageNumber(jsonResponse.currentPage);
    setIncidents((jsonResponse.data).map((incident: IIncidentFromDB) => {
      return {
        ...incident,
        id: incident._id,
        // incidentDate: format(new Date(incident.incidentDate), "dd/MM/yyyy")
      }
    }));
  }

  useEffect(() => {
    (async () => {
      await fetchIncidents();
    })();
  }, []);

  return { incidents, mod, setMod, pickupLocations, species, postIncident, fetchIncidents, pageNumber, totalCount };
}