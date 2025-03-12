import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import styles from "../../style/ShelterImageSwiper.module.scss";
import dangimg from "../../assets/dangimg.png";

interface ShelterImageSwiperProps {
  shelterId: string | undefined;
}

const ShelterImageSwiper: React.FC<ShelterImageSwiperProps> = ({ shelterId }) => {
  const images = [
    dangimg,
    dangimg,
    dangimg,
    dangimg,
  ];

  return (
    <div className={styles["shelter-image-container"]}>
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className={styles["shelter-swiper"]}
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <img
              src={image}
              alt={`${shelterId}번 보호소 이미지 ${index + 1}`}
              className={styles["shelter-image"]}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ShelterImageSwiper;