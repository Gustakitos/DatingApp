import { Tab, Tabs } from "react-bootstrap";
import { Member } from "../../models/Member";
import { useLocation } from "react-router-dom";
import { useCallback, useContext, useEffect, useState } from "react";
import { useDeletePhoto, useGetMember, useUpdateMainPhoto } from "./hooks";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { UPDATE_USER_MUTATION } from "./gql/MemberMutations";
import PhotoEditor from "./components/PhotoEditor/PhotoEditor";
import { uploadImageToCloud } from "./components/utils/UploadPhotoHandler";
import { AxiosProgressEvent } from "axios";
import { getAuthUser, updateUser as updateLocalUser } from "../utils/utils";
import { Photo } from "../../models/Photo";
import { UserContext } from "../../UserContext";

interface UpdateUserResult {
  updateUser: {
    boolean: boolean;
    __typename: string;
  };
}

interface UpdateUserVariables {
  input: {
    dto: {
      city: string;
      country: string;
      interests: string;
      introduction: string;
      lookingFor: string;
    };
  };
}

interface FormValues {
  city: string;
  country: string;
  interests: string;
  lookingFor: string;
  introduction: string;
}

interface ProgressInfo {
  fileName: string;
  percentage: number;
}

export interface UploadProps {
  idx: number;
  file: File;
  progressInfosRef: React.MutableRefObject<any>;
  setProgressInfos: (value: React.SetStateAction<ProgressInfo[]>) => void;
  setMessage: React.Dispatch<React.SetStateAction<string[]>>;
}

type LocState = {
  username: string;
  setNavPhoto: React.Dispatch<React.SetStateAction<string>>;
};

export default function MemberEdit() {
  const location = useLocation();

  const { username } = location.state as LocState;

  const { setPhotoUrl, memberList, setMemberList } = useContext(UserContext);

  const {
    register,
    handleSubmit,
    formState: { isDirty },
    reset,
  } = useForm<FormValues>();

  const [member, setMember] = useState<Member>();

  const { getMember } = useGetMember(username);

  const { updateMainPhoto } = useUpdateMainPhoto();
  const { deletePhoto } = useDeletePhoto();

  const [updateUser] = useMutation<UpdateUserResult, UpdateUserVariables>(
    UPDATE_USER_MUTATION
  );

  const memberHookFetch = useCallback(async () => {
    const memberHook = await getMember();
    setMember(memberHook);
  }, [getMember]);

  const uploadHandler = useCallback(
    async ({
      idx,
      file,
      progressInfosRef,
      setMessage,
      setProgressInfos,
    }: UploadProps) => {
      let _progressInfos = [...progressInfosRef.current];

      try {
        const response = await uploadImageToCloud(
          file,
          (event: AxiosProgressEvent) => {
            if (event.total) {
              _progressInfos[idx].percentage = Math.round(
                (100 * event.loaded) / event.total
              );
              setProgressInfos(_progressInfos);
            }
          }
        );
        setMessage((prevMessage) => [
          ...prevMessage,
          file.name + ": Successful!",
        ]);
        console.log("response ,", response);

        setMember((member) => {
          if (member) {
            return {
              ...member,
              photos: [...member.photos, response?.data],
            };
          }
        });
      } catch (err: any) {
        _progressInfos[idx].percentage = 0;
        setProgressInfos(_progressInfos);

        let msg = file.name + ": Failed!";
        if (err.response && err.response.data && err.response.data.message) {
          msg += " " + err.response.data.message;
        }

        setMessage((prevMessage_1) => [...prevMessage_1, msg]);
      }
    },
    []
  );

  const setMainPhoto = useCallback(
    async (photo: Photo) => {
      const result = await updateMainPhoto(photo.id);

      console.log("result: ", result);

      const successProp = result as {
        setMainPhoto: {
          userUpdateResult: {
            success?: string;
            message?: string;
          };
        };
      };

      if (successProp) {
        const user = getAuthUser()!;

        user.userDto.photoUrl = photo.url;

        updateLocalUser(user);

        const { photos } = member!;

        const newPhotos = photos.map((p) => {
          if (p.isMain) return { ...p, isMain: false };
          if (p.id === photo.id) return { ...p, isMain: true };

          return p;
        });

        const memberChange = memberList.map((m) => {
          if (m.id === member?.id) {
            return { ...m, photoUrl: photo.url };
          }

          return m;
        });

        setMemberList([...memberChange]);

        setMember((member) => {
          if (member) {
            return {
              ...member,
              photoUrl: photo.url,
              photos: [...newPhotos],
            };
          }
        });

        setPhotoUrl(photo.url);
      }
    },
    [member, memberList, setMemberList, setPhotoUrl, updateMainPhoto]
  );

  const deletePhotoHandler = useCallback(
    async (photo: Photo) => {
      const result = await deletePhoto(photo.id);

      const successProp = result as {
        setMainPhoto: {
          userUpdateResult: {
            success?: string;
            message?: string;
          };
        };
      };

      if (successProp) {
        const { photos } = member!;

        const newPhotos = photos.filter((p) => p.id !== photo.id);

        setMember((member) => {
          if (member) {
            return {
              ...member,
              photos: [...newPhotos],
            };
          }
        });
      }
    },
    [deletePhoto, member]
  );

  useEffect(() => {
    memberHookFetch();
  }, [memberHookFetch]);

  const onSubmit = useCallback(
    async (formValues: FormValues) => {
      console.log("values: ", formValues);

      const { city, country, interests, lookingFor, introduction } = formValues;

      try {
        const { data } = await updateUser({
          variables: {
            input: {
              dto: {
                city,
                country,
                interests,
                lookingFor,
                introduction,
              },
            },
          },
        });

        console.log("data: ", data);
        reset(formValues);
      } catch (err) {
        console.log("error update: ", err);
      }
    },
    [reset, updateUser]
  );

  if (!username) return <div></div>;

  const renderTabs = (member: Member) => {
    return (
      <Tabs defaultActiveKey="about" className="mb-3">
        <Tab eventKey="about" title={`About ${member.knownAs}`}>
          <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
            <h4 className="mt-2">Description</h4>
            <textarea
              className="form-control"
              rows={6}
              defaultValue={member.introduction}
              {...register("introduction", {})}
            ></textarea>
            <h4 className="mt-2">Looking For</h4>
            <textarea
              className="form-control"
              rows={6}
              defaultValue={member.lookingFor}
              {...register("lookingFor", {})}
            ></textarea>
            <h4 className="mt-2">Interests</h4>
            <textarea
              className="form-control"
              rows={6}
              defaultValue={member.interests}
              {...register("interests", {})}
            ></textarea>
            <div className="d-flex flew-row align-items-center mt-4">
              <label>City: </label>
              <input
                type="text"
                defaultValue={member.city}
                className="form-control mx-2"
                {...register("city", {})}
              />
              <label>Country: </label>
              <input
                type="text"
                defaultValue={member.country}
                className="form-control mx-2"
                {...register("country", {})}
              />
            </div>
          </form>
        </Tab>
        <Tab eventKey="photos" title="Edit Photos">
          <div className="row">
            <PhotoEditor
              photos={member.photos}
              uploadHandler={uploadHandler}
              setMainPhoto={setMainPhoto}
              deletePhotoHandler={deletePhotoHandler}
            />
          </div>
        </Tab>
      </Tabs>
    );
  };

  return (
    <div className="row" style={{ padding: 30 }}>
      {member ? (
        <>
          <style>
            {`
            .img-thumbnail {
              margin: 25px;
              width: 85%;
              height: 85%;
            }
            .card-body {
              padding: 0 25px;
            }

            .card-footer {
              padding: 10px 15px;
              background-color: #FFF;
              border-top: none;
            }
          `}
          </style>
          <div className="col-4">
            <h1>Your profile</h1>
          </div>
          {isDirty ? (
            <div className="col-8">
              <div className="alert alert-info">
                <p>
                  <strong>Information:</strong>
                  You have made changes. Any unsaved changes will be lost.
                </p>
              </div>
            </div>
          ) : (
            <div className="col-8"></div>
          )}
          <div className="col-4">
            <div className="card">
              <img
                src={member.photoUrl || "../../assets/user.png"}
                alt={member.knownAs}
                className="card-img-top img-thumbnail"
                style={{ margin: 25, width: "85%", height: "85%" }}
              />
              <div
                style={{
                  paddingTop: 0,
                  paddingBottom: 0,
                  paddingLeft: 25,
                  paddingRight: 25,
                }}
              >
                <div>
                  <strong>Location: </strong>
                  <p>{member.country}</p>
                </div>
                <div>
                  <strong>Age: </strong>
                  <p>{member.age}</p>
                </div>
                {member.lastActive ? (
                  <div>
                    <strong>Last Active: </strong>
                    <p>{new Date(member.lastActive).toDateString()}</p>
                  </div>
                ) : null}
                {member.created ? (
                  <div>
                    <strong>Member since: </strong>
                    <p>{new Date(member.created).toDateString()}</p>
                  </div>
                ) : null}
              </div>
              <div
                style={{
                  paddingTop: 10,
                  paddingBottom: 10,
                  paddingLeft: 15,
                  paddingRight: 15,
                  borderTop: "none",
                  backgroundColor: "#FFF",
                }}
              >
                <button
                  type="submit"
                  onClick={handleSubmit(onSubmit)}
                  className="btn btn-success col-12"
                  disabled={!isDirty}
                >
                  Save changes
                </button>
              </div>
            </div>
          </div>
          <div className="col-8">{renderTabs(member)}</div>
        </>
      ) : null}
    </div>
  );
}
