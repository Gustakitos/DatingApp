import { gql } from "@apollo/client";

export const REGISTER_MUTATION = gql`
mutation register($input: RegisterInput!) {
  register(input: $input) {
    userDto {
      username
      token
      photoUrl
    }
  }
}
`;

export const LOGIN = gql`
  mutation login($input: LoginInput!) {
    login(input: $input) {
      userDto {
        username
        token
        photoUrl
      }
    }
  }
`;
