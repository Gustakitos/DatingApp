import { gql } from "@apollo/client";

export const GET_MEMBERS_QUERY = gql`
  query members {
    members {
      id
      userName
      city
      country
      photoUrl
      age
      knownAs
      created
      lastActive
      gender
      introduction
      interests
    }
  }
`;

export const GET_MEMBER = gql`
  query member($username: String!) {
    member(username: $username) {
      id
      userName
      city
      country
      photoUrl
      age
      knownAs
      created
      lastActive
      gender
      introduction
      interests
    }
  }
`;
