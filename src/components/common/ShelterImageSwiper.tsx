import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import styles from "../../style/ShelterImageSwiper.module.scss";
import dangimg from "../../assets/dangimg.png";

interface ShelterImageSwiperProps {
  shelterId: string | undefined;
  images?: Array<{id: number, image_url: string}>;
}

const ShelterImageSwiper: React.FC<ShelterImageSwiperProps> = ({ shelterId, images }) => {
  const [imageUrls, setImageUrls] = useState<string[]>([dangimg]);

  useEffect(() => {
    if (images && images.length > 0) {
      const urls = images
        .filter(img => img && img.image_url)
        .map(img => img.image_url);
      
      if (urls.length > 0) {
        setImageUrls(urls);
      }
    }
  }, [images]);

  return (
    <div className={styles["shelter-image-container"]}>
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className={styles["shelter-swiper"]}
      >
        {imageUrls.map((image, index) => (
          <SwiperSlide key={index}>
            <img
              src={image}
              alt={`${shelterId}번 보호소 이미지 ${index + 1}`}
              className={styles["shelter-image"]}
              onError={(e) => {
                e.currentTarget.src = dangimg;
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ShelterImageSwiper;