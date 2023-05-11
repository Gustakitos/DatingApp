import { useParams } from "react-router-dom";

export default function MemberDetail() {
  const { id } = useParams();

  console.log("query param id: ", id);
  return <div>Member detail</div>;
}
