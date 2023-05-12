interface HttpOptions {
  token: string;
}

export function getHttpOptions(): HttpOptions | undefined {
  const userFromStorage = localStorage.getItem("AUTH_TOKEN");

  if (!userFromStorage) return;
  const userObj = JSON.parse(userFromStorage);

  return userObj.token;
}
