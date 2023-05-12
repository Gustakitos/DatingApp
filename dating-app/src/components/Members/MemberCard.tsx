import { Member } from "../../models/Member";

import UserImage from "../../assets/user.png";

interface Props {
  member: Member;
}

export default function MemberCard({ member }: Props) {
  console.log("member: ", member);

  return (
    <div className="card mb-4">
      <div className="card-img wrapper">
        <img src={member.photoUrl || UserImage} alt={member.knownAs} />
      </div>
      <div className="card-body p-1">
        <h6 className="card-title text-center mb-1">
          <i className="fa fa-user me-2"></i>
          {member.knownAs}
        </h6>
        <p className="card-text text-muted text-center">{member.city}</p>
      </div>
    </div>
  );
}
