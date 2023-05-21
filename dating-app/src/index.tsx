import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client";
import { NavBar } from "./components/nav/nav";
import { setContext } from "@apollo/client/link/context";
import { getHttpOptions } from "./components/utils/utils";
import { UserProvider } from "./UserContext";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const authLink = setContext((_, { headers }) => {
  const options = getHttpOptions();

  return {
    headers: {
      ...headers,
      authorization: options ? `Bearer ${options}` : "",
    },
  };
});

const link = createHttpLink({
  uri: "http://localhost:5251/graphql",
});

const client = new ApolloClient({
  link: authLink.concat(link),
  credentials: "include",
  cache: new InMemoryCache(),
  defaultOptions: {
    mutate: {
      fetchPolicy: "no-cache",
      errorPolicy: "ignore",
    },
    query: {
      fetchPolicy: "no-cache",
      errorPolicy: "all",
    },
    watchQuery: {
      fetchPolicy: "no-cache",
      errorPolicy: "ignore",
    },
  },
});

root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <UserProvider>
        <BrowserRouter>
          <>
            <NavBar />
            <App />
          </>
        </BrowserRouter>
      </UserProvider>
    </ApolloProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
