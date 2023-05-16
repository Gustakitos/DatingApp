import { Tab, Tabs } from "react-bootstrap";
import { Member } from "../../models/Member";
import { useLocation } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { useGetMember } from "./hooks";
import { useForm } from "react-hook-form";

interface EditFormData {
  city: string;
  country: string;
  description: string;
  lookingFor: string;
}

export default function MemberEdit() {
  const { state } = useLocation();
  const { username } = state;

  const {
    register,
    handleSubmit,
    formState: { isDirty },
  } = useForm<EditFormData>();

  const [member, setMember] = useState<Member>();

  const { getMember } = useGetMember(username);

  const memberHookFetch = useCallback(async () => {
    const memberHook = await getMember();
    setMember(memberHook);
    console.log("hook: ", memberHook);
    setMember(memberHook);
  }, [getMember]);

  useEffect(() => {
    memberHookFetch();
  }, [memberHookFetch]);

  const onSubmit = useCallback((formValues: any) => {
    console.log("values: ", formValues);
  }, []);

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
              {...register("description", {})}
            ></textarea>
            <h4 className="mt-2">Interests</h4>
            <textarea
              className="form-control"
              rows={6}
              defaultValue={member.interests}
              {...register("lookingFor", {})}
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
          <p>Edit photos here</p>
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
