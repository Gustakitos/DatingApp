import { ApolloQueryResult } from "@apollo/client";
import { GET_MEMBER } from "../gql/MemberQueries";
import { Member } from "../../../models/Member";
import { useCallback } from "react";
import useBffApolloClient from "../../../apollo/useApolloClient";
import { SET_MAIN_PHOTO } from "../gql/MemberMutations";

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

export const useUpdateMainPhoto = () => {
  const client = useBffApolloClient();

  const updateMainPhoto = useCallback(async (photoId: number) => {
    console.log("id: ", photoId);

    const { data } = await client.mutate({
      mutation: SET_MAIN_PHOTO,
      variables: {
        input: {
          photoId
        }
      }
    });

    return data;
  }, [client]);

  return { updateMainPhoto }
}
