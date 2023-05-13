import { useState } from "react";
import { Photo } from "../../../../models/Photo";

type Props = {
  photos: Photo[];
};

export default function PhotoGallery({ photos }: Props) {
  /**
   * Photos
   * {  }
   */
  console.log("phots: ", photos);

  const images = [photos[0].url, photos[0].url, photos[0].url];

  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNextSlide = (): void => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const goToPreviousSlide = (): void => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  return (
    <>
      <div>Photo Gallery</div>
      <style>
        {`
          .image-carousel {
            position: relative;
            max-width: 600px;
            margin: 0 auto;
          }

          .carousel-button {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            padding: 8px 16px;
            font-size: 16px;
            background-color: #f5f5f5;
            border: none;
            cursor: pointer;
          }

          .prev {
            left: -100px;
          }

          .next {
            right: -100px;
          }

          .carousel-image {
            display: block;
            width: 100%;
            height: auto;
            border: 2px solid #ff3366;
          }

          .carousel-preview {
            display: flex;
            justify-content: center;
            margin-top: 20px;
          }

          .preview-image {
            width: 80px;
            height: 60px;
            object-fit: cover;
            margin: 0 5px;
            cursor: pointer;
            border: 2px solid transparent;
          }

          .preview-image.active {
            border-color: #ff3366;
          }
        `}
      </style>
      <div
        className="image-carousel"
        style={{ display: "inline-block", marginLeft: 100 }}
      >
        <button className="carousel-button prev" onClick={goToPreviousSlide}>
          Previous
        </button>
        <img
          className="carousel-image"
          src={images[currentIndex]}
          alt="Carousel Slide"
        />
        <button className="carousel-button next" onClick={goToNextSlide}>
          Next
        </button>
        <div className="carousel-preview">
          {images.map((url, index) => (
            <img
              key={index}
              className={`preview-image${
                index === currentIndex ? " active" : ""
              }`}
              src={url}
              alt="Preview"
            />
          ))}
        </div>
      </div>
    </>
  );
}
