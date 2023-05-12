import { gql } from "@apollo/client";

export const REGISTER_MUTATION = gql`
  mutation RegisterUser($dto: RegisterDtoInput!) {
    register(dto: $dto) {
      username
      token
    }
  }
`;

export const LOGIN = gql`
  mutation login($loginDto: LoginDtoInput!) {
    login(loginDto: $loginDto) {
      username
      token
    }
  }
`;
