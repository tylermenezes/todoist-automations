import debug from 'debug';
import { scheduleCalendarUpdate } from "./calendar";
import { scheduleTripItUpdate } from "./tripit";
import { scheduleRfcUpdate } from "./rfc";
import { scheduleContactsUpdate } from "./contacts";
import { scheduleLastFmUpdate } from './lastfm';

const DEBUG = debug('services:datasources');

async function pokemonDatasource(fn: () => Promise<any>) {
  try { await fn(); }
  catch (ex) { DEBUG(ex); }
}

export async function scheduleDatasourceUpdates() {
  await pokemonDatasource(scheduleTripItUpdate);
  await pokemonDatasource(scheduleLastFmUpdate);
  await pokemonDatasource(scheduleContactsUpdate);
  await pokemonDatasource(scheduleCalendarUpdate);
  await pokemonDatasource(scheduleRfcUpdate);
}

export * from './tripit';
export * from './calendar';
export * from './cv';
export * from './rfc';
export * from './contacts';
export * from './lastfm';