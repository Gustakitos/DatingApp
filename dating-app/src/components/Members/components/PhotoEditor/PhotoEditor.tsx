import { Photo } from "../../../../models/Photo";

interface Props {
  photos: Photo[];
}

export default function PhotoEditor({ photos }: Props) {
  return (
    <div className="col-2">
      {photos.map((photo) => {
        return (
          <>
            <img src={photo.url} alt="user" className="img-thumbnail mb-1" />
            <div className="text-center">
              <button className="btn btn-sm">Main</button>
              <button className="btn btn-sm btn-danger">
                <i className="fa fa-trash"></i>
              </button>
            </div>
          </>
        );
      })}
    </div>
  );
}
