import { app } from 'electron';
import pkg from './pkg';

// Ref: https://www.electronjs.org/docs/api/app#appgetpathname
export const externalEnvs = {
  arvis_version: pkg.version,
  arvis_platform_home: app.getPath('home'), // User's home directory.
  arvis_platform_cache: app.getPath('cache'), //
  arvis_platform_crashDumps: app.getPath('crashDumps'), // Directory where crash dumps are stored.
  arvis_platform_desktop: app.getPath('desktop'), // The current user's Desktop directory.
  arvis_platform_documents: app.getPath('documents'), // Directory for a user's "My Documents".
  arvis_platform_downloads: app.getPath('downloads'), // Directory for a user's downloads.
  arvis_platform_exe: app.getPath('exe'), // The current executable file.
  arvis_platform_logs: app.getPath('logs'), // Directory for your app's log folder.
  arvis_platform_module: app.getPath('module'), // The libchromiumcontent library.
  arvis_platform_music: app.getPath('music'), // Directory for a user's music.
  arvis_platform_pictures: app.getPath('pictures'), // Directory for a user's pictures.
  arvis_platform_temp: app.getPath('temp'), // Temporary directory.
  arvis_platform_userData: app.getPath('userData'), // The directory for storing your app's configuration files, which by default it is the appData directory appended with your app's name.
  arvis_platform_appData: app.getPath('appData'), // Per-user application data directory, which by default points to
  arvis_platform_videos: app.getPath('videos'), // Directory for a user's videos.
  arvis_platform_recent:
    process.platform === 'win32' ? app.getPath('recent') : undefined,
};
