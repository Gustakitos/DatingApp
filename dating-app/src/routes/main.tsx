import { Route, Routes } from "react-router-dom";
import RegisterForm from "../components/RegisterForm/RegisterForm";
import Home from "../components/home/home";
import MemberList from "../components/Members/MemberList";
import MemberDetail from "../components/Members/MemberDetail";
import Lists from "../components/Lists/Lists";
import Messages from "../components/Messages/Messages";
import { NESTED_ROUTES, ROUTES } from "./constants";
import ProtectedRoute from "./ProtectedRoute";
import NotFound from "../components/Errors/NotFound";

interface RouteDetails {
  path: string;
  component: JSX.Element;
}

export default function Main() {
  const protectedRoutes: RouteDetails[] = [
    { path: ROUTES.MEMBERLIST, component: <MemberList /> },
    {
      path: `${ROUTES.MEMBERDETAIL}${NESTED_ROUTES.USERNAME}`,
      component: <MemberDetail />,
    },
    { path: ROUTES.LISTS, component: <Lists /> },
    { path: ROUTES.MESSAGES, component: <Messages /> },
  ];

  const regularRoutes: RouteDetails[] = [
    { path: ROUTES.HOME, component: <Home /> },
    { path: ROUTES.REGISTER, component: <RegisterForm /> },
  ];

  return (
    <Routes>
      {protectedRoutes.map((route, i) => (
        <Route
          key={i}
          path={route.path}
          element={<ProtectedRoute>{route.component}</ProtectedRoute>}
        />
      ))}
      {regularRoutes.map((route, i) => (
        <Route key={i} path={route.path} element={route.component} />
      ))}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
