interface AuthUser {
  userDto: {
    username: string;
    token: string;
    photoUrl?: string;
  }
}

export function getHttpOptions() {
  return getAuthUser()?.userDto.token;
}

export function getAuthUser(): AuthUser | undefined {
  const userFromStorage = localStorage.getItem("AUTH_TOKEN");

  if (!userFromStorage) return;
  const userObj = JSON.parse(userFromStorage);

  return userObj;
}

export function updateUser(user: AuthUser) {
  return localStorage.setItem("AUTH_TOKEN", JSON.stringify(user));
}
