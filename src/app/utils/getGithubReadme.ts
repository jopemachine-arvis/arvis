import got from 'got';
import parseJson from 'parse-json';

/**
 * Get Readme.md content
 * @param creator
 * @param name
 */
export const getGithubReadmeContent = (creator: string, name: string) =>
  got
    .get(`https://api.github.com/repos/${creator}/${name}/readme`)
    .then((response) => parseJson(response.body))
    .then((json) => Buffer.from(json.content, 'base64').toString());
