export function CookieManager() {
  const cookie = document.cookie;
  function setCookie(key: string, value: any) {
    const cookies = getCookies();
    cookies[key] = value;
    document.cookie = Object.entries(cookies)
      .map((item) => item.join("="))
      .join("; ");
  }
  function getCookie(key: string) {
    return getCookies()[key];
  }
  function getCookies() {
    return Object.fromEntries(
      cookie.split(";").map((item) => item.trim().split("="))
    );
  }
  return {
    setCookie,
    getCookie,
    getCookies,
  };
}
