import { useCallback, useEffect, useState } from "react";
import { GET_MEMBERS_QUERY } from "./gql/MemberQueries";
import { Member } from "../../models/Member";
import { useQuery } from "@apollo/client";
import MemberCard from "./MemberCard";

export default function MemberList() {
  const query = useQuery<{ members: Member[] }>(GET_MEMBERS_QUERY);

  const [members, setMembers] = useState<Member[]>();
  const [showLoading, setShowLoading] = useState(true);

  const getMembers = useCallback(() => {
    const { data, loading } = query;

    setShowLoading(loading);
    if (data) {
      setMembers(data.members);
    }
  }, [query]);

  useEffect(() => {
    getMembers();
  }, [getMembers]);

  const renderUserCard = () => {
    return members?.map((member, i) => {
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
