import { Photo } from "../../../../models/Photo";
import { UploadProps } from "../../MemberEdit";
import PhotoUploader from "../PhotoUploader/PhotoUploader";

interface Props {
  photos: Photo[];
  uploadHandler: ({
    idx,
    file,
    progressInfosRef,
    setMessage,
    setProgressInfos,
  }: UploadProps) => Promise<void>;
}

export default function PhotoEditor({ photos, uploadHandler }: Props) {
  return (
    <>
      {photos.map((photo) => {
        return (
          <>
            <div className="col-2 mb-4">
              <img src={photo.url} alt="user" className="img-thumbnail mb-1" style={{
                height: 100,
                width: 100,
                borderRadius: 12
              }} />
              <div className="text-center">
                <button className="btn btn-sm">Main</button>
                <button className="btn btn-sm btn-danger">
                  <i className="fa fa-trash"></i>
                </button>
              </div>
            </div>
          </>
        );
      })}
      <PhotoUploader uploadHandler={uploadHandler} />
    </>
  );
}
