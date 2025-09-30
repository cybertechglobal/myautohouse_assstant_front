export function getToken() {
  return localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
}

export function setToken(token, rememberMe) {
  if (rememberMe) {
    localStorage.setItem('accessToken', token);
  } else {
    sessionStorage.setItem('accessToken', token);
  }
}

export function clearToken() {
  localStorage.removeItem('accessToken');
  sessionStorage.removeItem('accessToken');
}
