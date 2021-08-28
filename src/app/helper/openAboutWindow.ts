import openWindow from 'about-window';
import { app } from 'electron';
import pkg from '../config/pkg';

export const openAboutWindow = () => {
  openWindow({
    about_page_dir: `${app.getAppPath()}/external/about-window`,
    icon_path: `${app.getAppPath()}/external/about-window/icon.png`,
    copyright: 'Copyright (c) 2021 jopemachine',
    package_json_dir: app.getAppPath(),
    homepage: pkg.homepage,
    description: pkg.description,
    bug_report_url: pkg.bugs.url,
    license: 'https://github.com/jopemachine/arvis/blob/master/LICENSE',
    adjust_window_size: true,
    use_version_info: true,
    open_devtools: process.env.NODE_ENV !== 'production',
    bug_link_text: 'Found bug?',
  });
};
