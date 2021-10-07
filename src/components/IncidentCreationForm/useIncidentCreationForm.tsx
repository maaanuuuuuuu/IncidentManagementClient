import { useState, useEffect } from 'react';
import { IPickupLocation } from '../../context/PickupLocationsContext';


export const useIncidentCreationForm = (pickupLocations: IPickupLocation[], incidentTypes: string[], species: string[]) => {
  const possibleCausesMapping = new Map([
    ["Conditionnement", ["Fuite", "Ouvert"]],
    ["Livraison", ["Retard", "Retard au lendemain", "Casier manquant", "Température", "Livraison partielle", "Livraison à la mauvaise adresse", "Non livré", "Équipement"]],
    ["Point Relais", ["Fermeture", "Casier manquant"]],
    ["Produit", ["Inversion", "Poids", "Manque", "Fraicheur", "Mortalité", "Découpe", "Diversité", "Non vidé", "Vers", "Sable"]],
    ["Client", ["Oubli", "Paiement", "Insatisfaction"]],
    ["E-commerce", ["Navigateur", "Paiement", " Email non reçu", "Commande impossible", "Frais de livraison", "Autre"]],
  ]);
  const [possibleCauses, setPossibleCauses] = useState<string[]>(["Fuite", "Ouvert"]);

  const [emailClient, setEmailClient] = useState<string>("");
  const [pickupLocation, setPickupLocation] = useState<IPickupLocation | null | string>(pickupLocations[0]);
  const [date, setDate] = useState<Date | null>(new Date());
  const [incidentType, setIncidentType] = useState<string | null>(incidentTypes[0]);
  const [cause, setCause] = useState<string | null>(possibleCauses[0]);
  const [specie, setSpecie] = useState<string | null>(null);
  const [resolution, setResolution] = useState<string[]>([]);
  const [reimbursedAmount, setReimbursedAmount] = useState<string | null>(null);
  const [comment, setComment] = useState<string>("");

  const [errors, setErrors] = useState<Map<string, string>>(new Map());

  const validate: () => boolean = () => {
    const newErrors = new Map<string, string>();
    if (emailClient === null || emailClient.trim() === "") {
      newErrors.set("emailClient", "Ce champs ne peut pas être vide");
    } else {
      const emails = emailClient.replace(/\s/g, '').split(";");
      const nonValidEmails: string[] = [];
      let regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      emails.forEach((email) => {
        if (email === "" || !regex.test(email)) {
          nonValidEmails.push(email);
        }
      });
      if (nonValidEmails.length > 0) {
        newErrors.set("emailClient", "Cette email n'est pas valide: " + nonValidEmails.join(";"));
      }
    }
    if (pickupLocation === null || (typeof pickupLocation === "string" && pickupLocation.trim() === "") || (typeof pickupLocation !== "string" && pickupLocation.name.trim() === "")) {
      newErrors.set("pickupLocation", "Ce champs ne peut pas être vide");
    }
    if (date === null) {
      newErrors.set("date", "Ce champs ne peut pas être vide");
    }
    if (date instanceof Date && isNaN(date.getTime())) {
      newErrors.set("date", "Cette date n'est pas valide");
    }
    if (incidentType === null || incidentType.trim() === "") {
      newErrors.set("incidentType", "Ce champs ne peut pas être vide");
    }
    if (cause === null || cause.trim() === "") {
      newErrors.set("cause", "Ce champs ne peut pas être vide");
    }
    if (resolution === null || resolution.length === 0) {
      newErrors.set("resolution", "Ce champs ne peut pas être vide");
    }
    if (resolution.some((r: string) => ["Remboursement partiel", "Remboursement total"].includes(r)) && (reimbursedAmount === null || reimbursedAmount.trim() === "")) {
      newErrors.set("reimbursedAmount", "Ce champs ne peut pas être vide");
    }
    setErrors(newErrors);
    if (newErrors.size === 0) {

      return true;
    }

    return false;
  }

  useEffect(() => {
    if (incidentType !== null && possibleCausesMapping.get(incidentType) !== undefined) {
      const newPossibleCauses = possibleCausesMapping.get(incidentType) as string[];
      setPossibleCauses(newPossibleCauses);
      setCause(newPossibleCauses[0]);
    }
  }, [incidentType]);

  useEffect(() => {
    if (cause === "Produit") {
      setSpecie(species[0])
    } else {
      setSpecie(null);
    }
  }, [cause]);


  return {
    date, setDate, incidentType, setIncidentType, possibleCauses, resolution, setResolution, emailClient, setEmailClient, pickupLocation, setPickupLocation, cause, setCause, reimbursedAmount, setReimbursedAmount, errors, validate, specie, setSpecie, comment, setComment
  }
}