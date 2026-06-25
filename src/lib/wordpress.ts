import { getWordPressApiUrl } from "./wordpress/config";

export function getWordPressAdminUrl(): string {
  const apiUrl = getWordPressApiUrl();
  if (apiUrl) {
    return `${apiUrl.replace(/\/wp-json\/?$/, "")}/wp-admin`;
  }
  return "http://localhost:8888/wp-admin";
}
