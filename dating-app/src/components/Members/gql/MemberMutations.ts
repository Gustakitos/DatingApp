import { gql } from "@apollo/client";

export const UPDATE_USER_MUTATION = gql`
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      boolean
      __typename
    }
  }
`;

export const SET_MAIN_PHOTO = gql`
  mutation setMainPhoto($input: SetMainPhotoInput!) {
    setMainPhoto(input: $input) {
      userUpdateResult {
        success
        message
      }
      __typename
    }
  }
`;

export const DELETE_PHOTO = gql`
  mutation deletePhoto($input: DeletePhotoInput!) {
    deletePhoto(input: $input) {
      userUpdateResult {
        success
        message
        __typename
      }
    }
  }
`;
