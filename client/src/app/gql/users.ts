import { gql } from 'apollo-angular';

export const GET_USERS = gql`
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
