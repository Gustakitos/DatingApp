import { ApolloQueryResult } from "@apollo/client";
import { GET_MEMBER } from "../gql/MemberQueries";
import { Member } from "../../../models/Member";
import { useCallback } from "react";
import useBffApolloClient from "../../../apollo/useApolloClient";

interface GetMemberData {
  member: Member;
}

export const useGetMember = (
  username: string | undefined
): { getMember: () => Promise<Member> } => {
  const client = useBffApolloClient();

  const getMember = useCallback(async () => {
    console.log("member: ", username);

    const { data }: ApolloQueryResult<GetMemberData> = await client.query({
      query: GET_MEMBER,
      variables: { username },
    });

    return data.member;
  }, [client, username]);

  return { getMember };
};
