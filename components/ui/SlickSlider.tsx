import React from 'react';
import Image from 'next/image';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { StaticImageData } from 'next/image';

interface SlickSliderProps {
  images: {
    src: string | StaticImageData;
    alt?: string;
    caption?: string;
  }[];
}

export default function SlickSlider({ images }: SlickSliderProps) {
  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 5000,
  };

  return (
    <div className='relative h-full w-full'>
      <Slider {...settings}>
        {images.map((image, index) => (
          <div key={index}>
            <div className="relative w-full h-screen">
              <Image
                src={image.src}
                alt={image.alt ?? `Slide ${index + 1}`}
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>
        ))}
      </Slider>
      <style jsx global>{`
        .slick-slider {
          position: relative;
        }

        .slick-dots {
          position: absolute;
          bottom: 30px;
          width: 100%;
          display: flex !important;
          justify-content: center;
          z-index: 10;
        }

        .slick-dots li button:before {
          color: white;
          font-size: 12px;
        }
      `}</style>
    </div>
  );
}