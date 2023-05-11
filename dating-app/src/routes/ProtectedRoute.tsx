import { Navigate } from "react-router-dom";

type Props = {
  children: JSX.Element;
};

const parseJwt = (token: string) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
};

export default function ProtectedRoute({ children }: Props) {
  const auth = localStorage.getItem("AUTH_TOKEN");

  if (!auth) {
    return <Navigate to="/" replace />;
  }

  const token = JSON.parse(auth).token;
  const decodedJwt = parseJwt(token);
  const isExpired = decodedJwt.exp * 1000 < Date.now();

  if (!token || isExpired) {
    localStorage.removeItem("AUTH_TOKEN");
    return <Navigate to="/" replace />;
  }

  return children;
}
