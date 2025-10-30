"use client";

import PublicLayout from "@/components/layouts/PublicLayout";
import SliderImage1 from "@/public/home/slider/sliderPC_1.png";
import SliderImage2 from "@/public/home/slider/sliderPC_2.png";
import SliderImage3 from "@/public/home/slider/sliderPC_3.png";
import SliderImage1Sp from "@/public/home/slider/sliderSP_1.png";
import SliderImage2Sp from "@/public/home/slider/sliderSP_2.png";
import SliderImage3Sp from "@/public/home/slider/sliderSP_3.png";
import NewsSectionComponent from "@/components/home/NewsSectionComponent";
import FAQSectionComponent from "@/components/home/FAQSectionComponent";
import SuspenseWrapper from "@/components/wrapper/SuspenseWrapper";
import PercentageLoadingComponent from "@/components/app/PercentageLoadingComponent";
import CouponComponent from "@/components/home/CouponComponent";
import RankingSectionComponent from "@/components/home/RankingSectionComponent";
import NewArrivalSectionComponent from "@/components/home/NewArrivalSectionComponent";
import PhilosophySectionComponent from "@/components/home/PhilosophySectionComponent";
import TwoCellsSectionComponent from "@/components/home/TwoCellsSectionComponent";
import PickUpSectionComponent from "@/components/home/PickUpSectionComponent";
import ProductsSectionComponent from "@/components/home/ProductsSectionComponent";
import FullImageSlider from "@/components/home/FullImageSlider";
import "@/styles/custom.css";

export default function Home() {
  const images = [
    {
      src: SliderImage1,
      alt: "SliderImage1",
    },
    {
      src: SliderImage2,
      alt: "SliderImage2",
    },
    {
      src: SliderImage3,
      alt: "SliderImage3",
    },
  ];

  const imagesSp = [
    {
      src: SliderImage1Sp,
      alt: "SliderImage1Sp",
    },
    {
      src: SliderImage2Sp,
      alt: "SliderImage2Sp",
    },
    {
      src: SliderImage3Sp,
      alt: "SliderImage3Sp",
    },
  ];

  return (
    <SuspenseWrapper>
      {/* Desktop */}
      <div className="hidden md:block">
        <PercentageLoadingComponent
          images={images.map((image) => image.src.toString())}
        />
      </div>
      {/* Mobile */}
      <div className="md:hidden">
        <PercentageLoadingComponent
          images={imagesSp.map((image) => image.src.toString())}
        />
      </div>
      <PublicLayout>
        {/* Desktop */}
        <div className="hidden md:block">
          <FullImageSlider images={images} />
        </div>
        {/* Mobile */}
        <div className="md:hidden">
          <FullImageSlider images={imagesSp} />
        </div>
        <PickUpSectionComponent />
        <ProductsSectionComponent />
        <PhilosophySectionComponent />
        <TwoCellsSectionComponent />
        <div className="w-full h-auto bg-[url('/home/Bg.png')] bg-[size:1920px 1281px] bg-no-repeat bg-[position:bottom]">
          <NewsSectionComponent />
          <RankingSectionComponent />
          <NewArrivalSectionComponent />
          <CouponComponent />
          <FAQSectionComponent />
        </div>
      </PublicLayout>
    </SuspenseWrapper>
  );
}
