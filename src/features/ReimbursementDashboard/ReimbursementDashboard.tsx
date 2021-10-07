import DateRangePicker, { DateRange } from '@mui/lab/DateRangePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import * as React from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { useState, useEffect } from 'react';
import { addWeeks, format } from 'date-fns';
import { IncidentTable } from '../../components';
import { IIncident, IIncidentFromDB, IResponse } from '../IncidentListPage/useIncidentListPage';
import config from '../../config';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';


export const ReimbursementDashboard = () => {
  const [dateRange, setDateRange] = useState<DateRange<Date>>([addWeeks(new Date(), -1), new Date()]);
  const [incidents, setIncidents] = useState<IIncident[]>([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [moneyBySpecie, setMoneyBySpecie] = useState(new Map<string, number>([]));
  const [moneyByDay, setMoneyByDay] = useState(new Map<string, number>([]));
  const [moneyBySpecieOptions, setMoneyBySpecieOptions] = useState<Highcharts.Options>(
    {
      title: {
        text: 'Remboursements par espèce'
      },
      legend: {
        enabled: false
      },
      yAxis: {
        title: {
          text: "euros"
        }
      },
      xAxis: {
        categories: []
      },
      credits: {
        enabled: false
      },
      series: []
    }
  );
  const [moneyByDayOptions, setMoneyByDayOptions] = useState<Highcharts.Options>(
    {
      title: {
        text: 'Remboursements par jours'
      },
      legend: {
        enabled: false
      },
      yAxis: {
        title: {
          text: "euros"
        }
      },
      xAxis: {
        categories: []
      },
      credits: {
        enabled: false
      },
      series: []
    }
  );

  useEffect(() => {
    const newOptions = { ...moneyBySpecieOptions };
    (newOptions.xAxis as Highcharts.XAxisOptions).categories = Array.from(moneyBySpecie.keys());
    newOptions.series = [{
      type: 'column',
      data: Array.from(moneyBySpecie.values())
    }];
    setMoneyBySpecieOptions(newOptions);
  }, [moneyBySpecie]);

  useEffect(() => {
    const newOptions = { ...moneyByDayOptions };
    (newOptions.xAxis as Highcharts.XAxisOptions).categories = Array.from(moneyByDay.keys());
    newOptions.series = [{
      type: 'column',
      data: Array.from(moneyByDay.values())
    }];
    setMoneyByDayOptions(newOptions);
  }, [moneyByDay]);


  useEffect(() => {
    const newMoneyBySpecie = new Map<string, number>([]);
    const newMoneyByDay = new Map<string, number>([]);
    incidents.forEach(incident => {
      const day = format(incident.incidentDate, "dd/MM/yyyy");
      // !newMoneyByDay.has(day) && newMoneyByDay.set(day, 0);
      const currentAmount: number = newMoneyByDay.get(day) !== undefined ? newMoneyByDay.get(day) as number : 0;
      newMoneyByDay.set(day, currentAmount + parseFloat(incident.reimbursedAmount));
      const specie = incident.specie as string;
      newMoneyBySpecie.set(specie, currentAmount + parseFloat(incident.reimbursedAmount));
    });
    setMoneyBySpecie(newMoneyBySpecie);
    setMoneyByDay(newMoneyByDay);
  }, [incidents]);

  useEffect(() => {
    if (dateRange[0] !== null && dateRange[1] !== null) {
      fetchReimbursements();
    }
  }, [dateRange]);

  const fetchReimbursements = async (page = 0, limit = 5) => {
    const headers: {
      Accept: string;
      "Content-Type": string;
    } = {
      "Accept": "application/ld+json",
      "Content-Type": "application/json"
    };

    const response = await fetch(config.REACT_APP_BACKEND_URL + '/reimbursements?page=' + page + '&limit=' + limit + '&dateRange=' + (dateRange[0] as Date).toISOString() + ',' + (dateRange[1] as Date).toISOString(), {
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
        incidentDate: new Date(incident.incidentDate)
      }
    }));
  }

  return (
    <div>
      <div className="dashboard-date-picker">
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateRangePicker
            startText="Début"
            endText="Fin"
            inputFormat="dd/MM/yyyy"
            value={dateRange}
            onChange={(newValue) => {
              setDateRange(newValue);
            }}
            renderInput={(startProps, endProps) => (
              <React.Fragment>
                <TextField {...startProps} />
                <Box sx={{ mx: 2 }}> to </Box>
                <TextField {...endProps} />
              </React.Fragment>
            )}
          />
        </LocalizationProvider>
      </div>
      <div>
        <IncidentTable incidentsOnPage={incidents} pageNumber={pageNumber} totalCount={totalCount} onChangePage={fetchReimbursements} />
        {
          moneyBySpecie.size > 0 && (
            <div className='chart-container'>
              <HighchartsReact
                highcharts={Highcharts}
                options={moneyBySpecieOptions}
              />
            </div>
          )
        }
        {
          moneyByDay.size > 0 && (
            <div className='chart-container'>
              <HighchartsReact
                highcharts={Highcharts}
                options={moneyByDayOptions}
              />
            </div>
          )
        }
      </div>
    </div>
  );
}
