import React from "react";
import {Swiper} from "swiper/react";

import SwiperCore, {Navigation, Pagination} from "swiper";

import "swiper/css";
import "swiper/css/pagination"
import "swiper/css/navigation"
// install Swiper modules
SwiperCore.use([Pagination, Navigation]);

const SwiperWrapper = (props) => {
    return (
        <Swiper pagination={{
            "dynamicBullets": true
        }} navigation={true}  className="mySwiper" noSwipingClass={ "no-swipe" } touchStartPreventDefault={false}>
            { props.children }
        </Swiper>
    );
}

export default SwiperWrapper;