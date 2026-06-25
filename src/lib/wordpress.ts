export function getWordPressAdminUrl(): string {
  const apiUrl = process.env.WORDPRESS_API_URL;
  if (apiUrl) {
    return `${apiUrl.replace(/\/wp-json\/?$/, "")}/wp-admin`;
  }
  return "http://localhost:8888/wp-admin";
}
