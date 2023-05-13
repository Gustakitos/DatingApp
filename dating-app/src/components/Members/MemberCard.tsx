import { Member } from "../../models/Member";
import UserImage from "../../assets/user.png";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import  "../Members/style/member.css";


interface Props {
  member: Member;
}

export default function MemberCard({ member }: Props) {
  const navigate = useNavigate();

  const goToMemberDetail = useCallback(
    (username: string) => {
      return navigate(`/members/${username}`);
    },
    [navigate]
  );

  return (
    <div className="card mb-4">
      <div className="card-img-wrapper">
        <img
          id="cardImg"
          src={member.photoUrl || UserImage}
          alt={member.knownAs}
        />
        <ul className="list-inline member-icons animate text-center">
          <li className="list-inline-item">
            <button
              className="btn btn-primary"
              onClick={() => goToMemberDetail(member.userName)}
            >
              <i className="fa fa-user"></i>
            </button>
          </li>
          <li className="list-inline-item">
            <button className="btn btn-primary">
              <i className="fa fa-heart"></i>
            </button>
          </li>
          <li className="list-inline-item">
            <button className="btn btn-primary">
              <i className="fa fa-envelope"></i>
            </button>
          </li>
        </ul>
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
