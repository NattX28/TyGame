"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { CommunityCardProps } from "@/types/community";
import CommunityCard from "./CommunityCard";

const CommunityCardContainer = ({
  communities,
}: {
  communities: CommunityCardProps[];
}) => {
  // สร้างชุดข้อมูลที่ยาวขึ้นเพื่อให้การเลื่อนต่อเนื่อง
  const duplicatedCommunities = [
    ...communities,
    ...communities,
    ...communities,
    ...communities,
  ];

  return (
    <div className="w-full overflow-hidden relative">
      <Swiper
        className="!overflow-visible"
        modules={[Autoplay]}
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
          pauseOnMouseEnter: true, // หยุดเมื่อเมาส์ชี้
          reverseDirection: false,
        }}
        loop={true}
        speed={15000} // ความเร็วในการเลื่อนทั้งหมด (มิลลิวินาที)
        slidesPerView="auto"
        spaceBetween={16}
        allowTouchMove={true}
        watchSlidesProgress={true}
        centeredSlides={false}
        observer={true}
        observeParents={true}
        breakpoints={{
          320: {
            slidesPerView: 1.5,
            spaceBetween: 8,
          },
          640: {
            slidesPerView: 2.5,
            spaceBetween: 12,
          },
          768: {
            slidesPerView: 3.5,
            spaceBetween: 16,
          },
          1024: {
            slidesPerView: 4.5,
            spaceBetween: 16,
          },
        }}
        cssMode={false}>
        {duplicatedCommunities.map((community, index) => (
          <SwiperSlide
            key={`${community.name}-${index}`}
            className="!w-72 !flex-shrink-0 transition-all duration-500 ease-linear">
            <div className="p-1">
              {" "}
              {/* เพิ่ม padding เพื่อให้ hover effect ไม่ถูกตัด */}
              <CommunityCard community={community} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CommunityCardContainer;
