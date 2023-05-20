import { useRef, useState } from "react";
import { UploadProps } from "../../MemberEdit";

interface ProgressInfo {
  fileName: string;
  percentage: number;
}

interface Props {
  uploadHandler: ({
    idx,
    file,
    progressInfosRef,
    setMessage,
    setProgressInfos,
  }: UploadProps) => Promise<void>;
}

export default function PhotoUploader({ uploadHandler }: Props) {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [imagePreviews, setImagePreviews] = useState<Array<string>>([]);
  const [progressInfos, setProgressInfos] = useState<Array<ProgressInfo>>([]);
  const [message, setMessage] = useState<Array<string>>([]);
  const progressInfosRef = useRef<any>(null);

  const selectImages = (event: React.ChangeEvent<HTMLInputElement>) => {
    let images: Array<string> = [];
    let files = event.target.files;

    if (files) {
      for (let i = 0; i < files.length; i++) {
        images.push(URL.createObjectURL(files[i]));
      }

      setSelectedFiles(files);
      setImagePreviews(images);
      setProgressInfos([]);
      setMessage([]);
    }
  };

  const uploadImages = () => {
    if (selectedFiles != null) {
      const files = Array.from(selectedFiles);

      let file: File | undefined;
      let idx = 0;

      let _progressInfos = files.map((_file, index) => {
        file = _file;
        idx = index;

        return {
          percentage: 0,
          fileName: _file.name,
        };
      });

      progressInfosRef.current = _progressInfos;

      try {
        const uploadPromises = files.map((file, i) =>
          uploadHandler({
            idx: i,
            file,
            progressInfosRef,
            setMessage,
            setProgressInfos,
          })
        );

        Promise.all(uploadPromises);
      } catch (err: any) {
        _progressInfos[idx].percentage = 0;
        setProgressInfos(_progressInfos);

        let msg = file?.name + ": Failed!";
        if (err.response && err.response.data && err.response.data.message) {
          msg += " " + err.response.data.message;
        }

        setMessage((prevMessage_1) => [...prevMessage_1, msg]);
      }

      setMessage([]);
    }
  };

  return (
    <div>
      <div className="row my-3 mt-5">
        <h1>Add photos</h1>
        <div className="col-8 mt-2">
          <label className="btn btn-default p-0">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={selectImages}
              style={{ color: "transparent" }}
            />
          </label>
        </div>

        <div className="col-4 mt-2">
          <button
            className="btn btn-success btn-sm"
            disabled={!selectedFiles}
            onClick={uploadImages}
          >
            Upload
          </button>
        </div>
      </div>

      {progressInfos &&
        progressInfos.length > 0 &&
        progressInfos.map((progressInfo: ProgressInfo, index: number) => (
          <div className="mb-2" key={index}>
            <span>{progressInfo.fileName}</span>
            <div className="progress">
              <div
                className="progress-bar progress-bar-info"
                role="progressbar"
                aria-valuenow={progressInfo.percentage}
                aria-valuemin={0}
                aria-valuemax={100}
                style={{ width: progressInfo.percentage + "%" }}
              >
                {progressInfo.percentage}%
              </div>
            </div>
          </div>
        ))}

      {imagePreviews && (
        <div>
          {imagePreviews.map((img, i) => {
            return (
              <img
                style={{ maxWidth: 190, maxHeight: 190 }}
                src={img}
                alt={"image-" + i}
                key={i}
              />
            );
          })}
        </div>
      )}

      {message.length > 0 && (
        <div className="alert alert-secondary mt-2" role="alert">
          <ul>
            {message.map((item, i) => {
              return <li key={i}>{item}</li>;
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
