import { Button } from '@material-ui/core';
import React from 'react';
import { IncidentTable, IncidentCreationForm } from '../../components';
import { useIncidentListPage } from './useIncidentListPage';

export const IncidentListPage = () => {

    const { incidents, mod, setMod, pickupLocations, species, postIncident, fetchIncidents, pageNumber, totalCount } = useIncidentListPage();

    return (
        <div>
            {
                mod === "list" && (
                    <>
                        <IncidentTable incidentsOnPage={incidents} pageNumber={pageNumber} totalCount={totalCount} onChangePage={fetchIncidents} />
                        <Button onClick={() => setMod("add")} variant="contained" id="add-incident__button"> + </Button>
                    </>
                )
            }
            {
                mod === "add" && (
                    <>
                        <IncidentCreationForm onCancel={() => setMod("list")} onCreate={postIncident} pickupLocations={pickupLocations} species={species} />
                    </>
                )
            }

        </div>
    );
}
