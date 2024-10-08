import { lastFm } from '@/clients';
import schedule from 'node-schedule';
import debug from 'debug';
import config from '@/config';
import { Artist, Album } from 'lastfm-nodejs-client/dist/@types/lastfm.types';

const DEBUG = debug('services:datasources:lastfm');

let top: { weeklyAlbum: Album[], weeklyArtist: Artist[], overallAlbum: Album[], overallArtist: Artist[] } = {
  weeklyAlbum: [],
  weeklyArtist: [],
  overallAlbum: [],
  overallArtist: [],
};

export function getTopMusic() {
  return top;
}

export async function lastFmUpdate() {
  DEBUG('Updating Lastfm.');
  const [topAlbums, topArtists, weeklyTopAblums, weeklyTopArtists] = await Promise.all([
    lastFm.getTopAlbums(
      lastFm.method.user.getTopAlbums,
      config.lastFm.username,
      'overall',
      '18',
    ),
    lastFm.getTopArtists(
      lastFm.method.user.getTopArtists,
      config.lastFm.username,
      'overall',
      '18',
    ),
    lastFm.getTopAlbums(
      lastFm.method.user.getTopAlbums,
      config.lastFm.username,
      '7day',
      '12',
    ),
    lastFm.getTopArtists(
      lastFm.method.user.getTopArtists,
      config.lastFm.username,
      '7day',
      '12',
    ),
  ]);
  if (topAlbums.topalbums.album.length > 0)
    top.overallAlbum = topAlbums.topalbums.album;

  if (topArtists.topartists.artist.length > 0)
    top.overallArtist = topArtists.topartists.artist;

  if (weeklyTopAblums.topalbums.album.length > 0)
    top.weeklyAlbum = weeklyTopAblums.topalbums.album;

  if (weeklyTopArtists.topartists.artist.length > 0)
    top.weeklyArtist = weeklyTopArtists.topartists.artist;

  DEBUG('Updated Lastfm.');
}

export async function scheduleLastFmUpdate() {
  await lastFmUpdate();
  schedule.scheduleJob('8 * * * *', lastFmUpdate);
}