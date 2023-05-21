import { useCallback, useContext, useEffect, useState } from "react";
import { GET_MEMBERS_QUERY } from "./gql/MemberQueries";
import { Member } from "../../models/Member";
import { useQuery } from "@apollo/client";
import MemberCard from "./MemberCard";
import { UserContext } from "../../UserContext";

export default function MemberList() {
  const query = useQuery<{ members: Member[] }>(GET_MEMBERS_QUERY);

  const [showLoading, setShowLoading] = useState(true);

  const { memberList, setMemberList } = useContext(UserContext);

  const getMembers = useCallback(() => {
    const { data, loading } = query;

    setShowLoading(loading);
    if (data) {
      setMemberList(data.members);
    }
  }, [query, setMemberList]);

  useEffect(() => {
    getMembers();
  }, [getMembers]);

  const renderUserCard = () => {
    return memberList?.map((member, i) => {
      return (
        <div key={i} className="col-2">
          <MemberCard member={member} />
        </div>
      );
    });
  };
  if (showLoading) return <p>Loading...</p>;

  return (
    <div className="row" style={{ padding: 25 }}>
      {renderUserCard()}
    </div>
  );
}
