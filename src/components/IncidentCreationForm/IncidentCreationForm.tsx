import TextField from '@mui/material/TextField';
import { Autocomplete, Button } from "@mui/material";
import { IPickupLocation } from '../../context';
import DatePicker from '@mui/lab/DatePicker';
import { useIncidentCreationForm } from './useIncidentCreationForm';
import { LocalizationProvider } from "@mui/lab";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { ChangeEvent, SyntheticEvent } from 'react';
import { IIncident } from '../../features/IncidentListPage/useIncidentListPage';
import { format } from 'date-fns';

interface IIncidentCreateFormProps {
  onCancel: () => void;
  onCreate: (incidentToCreate: IIncident) => void;
  pickupLocations: IPickupLocation[];
  species: string[];
}

export const IncidentCreationForm = ({ onCancel, onCreate, pickupLocations, species }: IIncidentCreateFormProps) => {
  const incidentTypes = ["Conditionnement", "Livraison", "Point Relais", "Produit", "Client", "E-commerce"];
  const {
    possibleCauses,
    date, setDate,
    incidentType, setIncidentType,
    resolution, setResolution,
    emailClient, setEmailClient,
    pickupLocation, setPickupLocation,
    reimbursedAmount, setReimbursedAmount,
    cause, setCause,
    specie, setSpecie,
    comment, setComment,
    validate, errors
  } = useIncidentCreationForm(pickupLocations, incidentTypes, species);

  const parsePickupLocation = (pickupLocation: IPickupLocation | string) => {
    if (typeof pickupLocation === "string") {
      return pickupLocation;
    }
    return pickupLocation.name + " (" + pickupLocation.day + ")";
  }
  const saveIncident = (returnToList = true) => {
    if (validate()) {
      const incidentToCreate: IIncident = {
        "emailClient": emailClient as string,
        "pickupLocation": parsePickupLocation(pickupLocation as string),
        // "incidentDate": format(date as Date, "dd/MM/yyyy"),
        "incidentDate": date as Date,
        "incidentType": incidentType as string,
        "cause": cause as string,
        "specie": specie as string,
        "resolution": resolution.join("; "),
        "reimbursedAmount": reimbursedAmount as string,
        "comment": comment
      }
      onCreate(incidentToCreate);
      if (returnToList) {
        onCancel();
      } else {
        setEmailClient("");
        setPickupLocation(pickupLocations[0]);
        setDate(new Date());
        setIncidentType(incidentTypes[0]);
        setCause(possibleCauses[0]);
        setSpecie(species[0]);
        setResolution([]);
        setReimbursedAmount(null);
      }
    }
  }

  return (
    <div className="inspection-creation__form">
      <TextField error={errors.has("emailClient")} helperText={errors.has("emailClient") ? errors.get("emailClient") : null} id="emailClient" label="Emails clients séparés par un ;" variant="outlined" value={emailClient} onChange={(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setEmailClient(e.currentTarget.value)
      }} />
      <Autocomplete
        options={[...pickupLocations.map((pickupLocation: IPickupLocation) => ({ value: pickupLocation, label: pickupLocation.name + " (" + pickupLocation.day + ")" }))]}
        renderInput={(params) => <TextField  {...params}
          error={errors.has("pickupLocations")} helperText={errors.has("pickupLocations") ? errors.get("pickupLocations") : null}
          label="Point Relais"
        />}
        id="pickupLocation"
        value={pickupLocation !== null ? {
          value: pickupLocation,
          label: typeof pickupLocation === "string" ? pickupLocation : pickupLocation.name + " (" + pickupLocation.day + ")"
        } : null}
        onChange={(event: SyntheticEvent, newValue) => {
          if (newValue !== null) {
            if (typeof newValue === "string") {
              setPickupLocation(newValue);
            } else {
              setPickupLocation(newValue.value);
            }
          } else {
            setPickupLocation(null);
          }
        }}
      />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          label="Date de l'incident"
          value={date}
          inputFormat="dd/MM/yyyy"
          onChange={(newDate) => {
            setDate(newDate);
          }}
          renderInput={(params) => <TextField
            error={errors.has("date")} helperText={errors.has("date") ? errors.get("date") : null}
            {...params} />}
        />
      </LocalizationProvider>
      <Autocomplete
        id="incidentType"
        value={incidentType}
        onChange={(event: SyntheticEvent, newValue) => {
          setIncidentType(newValue);
        }}
        renderInput={(params) => <TextField {...params}
          error={errors.has("incidentType")} helperText={errors.has("incidentType") ? errors.get("incidentType") : null}
          label="Type d'incident" />}
        options={incidentTypes}
      />
      <Autocomplete
        id="cause"
        value={cause}
        onChange={(event: SyntheticEvent, newValue) => {
          setCause(newValue);
        }}
        renderInput={(params) => <TextField {...params}
          error={errors.has("cause")} helperText={errors.has("cause") ? errors.get("cause") : null}
          label="Cause de l'incident" />}
        options={possibleCauses}
      />
      {incidentType === "Produit" &&
        <Autocomplete
          id="specie"
          value={specie}
          onChange={(event: SyntheticEvent, newValue) => {
            setSpecie(newValue);
          }}
          renderInput={(params) => <TextField {...params}
            error={errors.has("specie")} helperText={errors.has("specie") ? errors.get("specie") : null}
            label="Espèce de poisson" />}
          options={species}
        />
      }
      <Autocomplete
        id="resolution"
        value={resolution}
        onChange={(event: SyntheticEvent, newValue: string[]) => {
          setResolution(newValue);
        }}
        multiple
        renderInput={(params) => <TextField {...params}
          error={errors.has("resolution")} helperText={errors.has("resolution") ? errors.get("resolution") : null}
          label="Resolution de l'incident" />}
        options={["Email", "Appel téléphonique", "Remboursement partiel", "Remboursement total"]}
      />
      {resolution.some((r: string) => ["Remboursement partiel", "Remboursement total"].includes(r)) &&
        <TextField
          error={errors.has("reimbursedAmount")} helperText={errors.has("reimbursedAmount") ? errors.get("reimbursedAmount") : null}
          inputProps={{ type: "number" }} id="reimbursedAmount" label="Montant remboursé (€)" variant="outlined" value={reimbursedAmount} onChange={(e) => setReimbursedAmount(e.target.value)} />
      }
      <TextField id="comment" label="Commentaire" variant="outlined" value={comment} onChange={(e) => setComment(e.target.value)} />
      <Button className="creation-form__button__cancel" onClick={onCancel} variant="contained" color="info"> Retourner à la liste </Button>
      <Button className="creation-form__button__create" onClick={() => { saveIncident(true) }} variant="contained" color="primary"> Enregister l'incident puis retourner à la liste</Button>
      <Button className="creation-form__button__create" onClick={() => { saveIncident(false) }} variant="contained" color="primary"> Enregister l'incident puis ajouter un autre</Button>
    </div>
  );
}

