import { Col, Image } from "react-bootstrap";

enum SizeProp {
  Nav = "nav",
  Profile = "profile",
}

interface Props {
  size: SizeProp;
  knownAs: string;
  photoUrl?: string;
}

export default function UserImage({ photoUrl, knownAs, size }: Props) {
  if (size === SizeProp.Profile) {
    return (
      <img
        src={photoUrl || "../../../../assets/user.png"}
        alt={knownAs}
        className="card-img-top img-thumbnail"
        style={{ margin: 25, width: "85%", height: "85%" }}
      />
    );
  }

  if (size === SizeProp.Nav) {
    return (
      <Col xs={6} md={4}>
        <Image
          src={photoUrl}
          thumbnail
          style={{ width: 50, height: 50, display: "inline" }}
        />
      </Col>
    );
  }

  return <div></div>;
}
