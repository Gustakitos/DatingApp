import {
  ApolloQueryResult,
  FetchResult,
  MutationOptions,
  OperationVariables,
  QueryOptions,
  useApolloClient,
} from "@apollo/client";
import { useCallback, useMemo } from "react";

export type BffApolloClient = {
  query: <Query, QueryVariables extends OperationVariables>(
    options: QueryOptions<QueryVariables, Query>,
  ) => Promise<ApolloQueryResult<Query>>;
  mutate: <Mutation, MutationVariables extends OperationVariables>(
    options: MutationOptions<Mutation, MutationVariables>,
  ) => Promise<FetchResult<Mutation>>;
};

export default function useBffApolloClient() {
  const client = useApolloClient();

  const Query = useCallback(
    async <Query, QueryVariables extends OperationVariables>(
      options: QueryOptions<QueryVariables, Query>,
    ): Promise<ApolloQueryResult<Query>> => {
      try {
        return await client.query<Query, QueryVariables>({
          ...options,
          context: {
            ...options?.context,
          },
        });
      } catch (error) {
        throw error;
      }
    },
    [client],
  );

  const Mutate = useCallback(
    async <Mutation, MutationVariables extends OperationVariables>(
      options: MutationOptions<Mutation, MutationVariables>,
    ): Promise<FetchResult<Mutation>> => {

      try {
        return await client.mutate<Mutation, MutationVariables>({
          ...options,
          context: {
            ...options?.context,
          },
        });
      } catch (error) {
        throw error;
      }
    },
    [client],
  );

  return useMemo(
    (): BffApolloClient => ({
      query: Query,
      mutate: Mutate,
    }),
    [Query, Mutate],
  );
}
