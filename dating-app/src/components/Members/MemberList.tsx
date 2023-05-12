import { useCallback, useEffect, useState } from "react";
import { GET_MEMBERS_QUERY } from "./gql/MemberQueries";
import { Member } from "../../models/Member";
import { useQuery } from "@apollo/client";

export default function MemberList() {
  const query = useQuery<{members: Member[]}>(GET_MEMBERS_QUERY);

  const [members, setMembers] = useState<Member[]>();
  const [showLoading, setShowLoading] = useState(true);

  const getMembers = useCallback(() => {
    const { data, loading, error } = query;

    setShowLoading(loading);
    if (data) {
      setMembers(data?.members);
    }
    console.log("data: ", data);
    console.log("loading: ", loading);
    console.log("error: ", error);
  }, [query]);

  useEffect(() => {
    getMembers();
  }, [getMembers]);

  const loopUsers = () => {
    return members?.map((member => {
      return (
        <p key={member.id}>{member.userName}</p>
      )
    }))
  };

  if (showLoading) return (<p>Loading...</p>);

  return (
    <div className="row">
      <div className="col-2">
        {loopUsers()}
      </div>
    </div>
  );
}
