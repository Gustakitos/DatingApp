import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Member } from "../../models/Member";
import { GET_MEMBER } from "./gql/MemberQueries";
import { useQuery } from "@apollo/client";
import { Tab, Tabs } from "react-bootstrap";
import PhotoGallery from "./components/PhotoGallery/PhotoGallery";

interface GetMemberData {
  member: Member;
}

interface GetMemberVariables {
  username: string | undefined;
}

export default function MemberDetail() {
  const { username } = useParams();

  const [member, setMember] = useState<Member>();
  const query = useQuery<GetMemberData, GetMemberVariables>(GET_MEMBER, {
    variables: { username },
  });
  const [showLoading, setShowLoading] = useState(true);

  const getMember = useCallback(() => {
    const { data, loading } = query;

    setShowLoading(loading);
    if (data) {
      console.log("data: ", data);
      setMember(data.member);
    }
  }, [query]);

  useEffect(() => {
    getMember();
  }, [getMember]);

  if (!username) {
    return <div>Member not found....</div>;
  }

  if (showLoading) return <div>Loading....</div>;

  const renderTabs = (member: Member) => {


    return (
      <Tabs defaultActiveKey="about" className="mb-3">
        <Tab eventKey="about" title={`About ${member.knownAs}`}>
          <h4>Description</h4>
          <p>{member.introduction}</p>
          <h4>Looking for</h4>
        <p>{member.interests}</p>
        </Tab>
        <Tab eventKey="profile" title="Interests">
          <h4>Interests</h4>
          <p>{member.interests}</p>
        </Tab>
        <Tab eventKey="photo" title="Photos">
          <PhotoGallery photos={member.photos} />
        </Tab>
        <Tab eventKey="messages" title="Messages">
          Tab content for Messages
        </Tab>
      </Tabs>
    );
  };

  return (
    <div className="row" style={{ paddingLeft: 30, paddingTop: 25 }}>
      {member ? (
        <>
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
                <div className="btn-group d-flex">
                  <button className="btn btn-primary">Like</button>
                  <button className="btn btn-success">Messages</button>
                </div>
              </div>
            </div>
          </div>
          <div className="col-8">{renderTabs(member)}</div>
        </>
      ) : null}
    </div>
  );
}
