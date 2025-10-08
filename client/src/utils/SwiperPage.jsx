import React, { useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Rating, ThinStar } from "@smastrom/react-rating";
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';



// import required modules
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
const SwiperPage = () => {
    const reviews = [
        {
            "id": 1,
            "user": "Rafi Ahmed",
            "review": "The aroma hits you the moment you open the cup! Rich, smooth, and perfectly roasted. Easily one of the best cappuccinos I’ve ever had.",
            "rating": 5,
            "img": "https://0.academia-photos.com/305199029/150005436/139580727/s200_rafi.ahmed.jpeg"
        },
        {
            "id": 2,
            "user": "Sadia Rahman",
            "review": "Absolutely love the balance of flavor and texture. The coffee tastes freshly brewed every single time. Great for early mornings or late nights!",
            "rating": 4.8,
            "img": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTw7Lehj3S7tSepH0P_5qKQktqrHA_AACxKg&s"
        },
        {
            "id": 3,
            "user": "Naimul Hasan",
            "review": "This coffee has such a deep and comforting flavor. It’s not too bitter, just the right amount of kick. Totally worth the price!",
            "rating": 4.9,
            "img": "https://0.academia-photos.com/224233073/81572026/70166421/s200_naimul.hasan.jpeg"
        },
        {
            "id": 4,
            "user": "Mehjabin Akter",
            "review": "Creamy, aromatic, and refreshing — exactly what I need to start my day. I could drink this every morning and never get tired of it!",
            "rating": 5,
            "img": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSW8t1JlzhBGcBg6AxlO6aExMvg6XcemSL7Dg&s"
        },
        {
            "id": 5,
            "user": "Atik Al Sabbir",
            "review": "The beans are clearly high quality, and you can taste the freshness. Smooth aftertaste with a little sweetness — highly recommend!",
            "rating": 4.7,
            "img": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5dpuoic_CmsM2eoO8GC9eD2wAk7vFSJQUqA&s"
        }
    ]
    const myStyles = {
        itemShapes: ThinStar,
        activeFillColor: "#dbad6a",
        inactiveFillColor: "#fbf1a9",
    };


    return (
        <>
            <Swiper
                spaceBetween={30}
                centeredSlides={true}
                autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                }}
                // style={{
                //     '--swiper-navigation-color': '#fff',
                //     '--swiper-pagination-color': '#fff',
                // }}
                // navigation={true}
                modules={[Autoplay, Pagination, Navigation]}
                className="mySwiper"
            >
                {
                    reviews.map((review) => <SwiperSlide key={review.id}>
                        <div className='p-5 space-y-9'>
                            <Rating
                                style={{ maxWidth: 120 }}
                                readOnly
                                itemStyles={myStyles}
                                value={5}
                            />
                            <h1 className='text-xl md:text-3xl '>{review.review}</h1>
                            <div className='flex  items-center gap-3'>
                                <div className="avatar p-1">
                                    <div className="ring-lightCoffee ring-offset-base-100 w-14 rounded-full ring-2 ring-offset-2">
                                        <img src={review.img} />
                                    </div>
                                </div>
                                <div>
                                    <h1 className='text-lg md:text-2xl'>{review.user}</h1>
                                    <h1 className='text-lightCoffee md:text-xl'>Customer</h1>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>)
                }

            </Swiper>
        </>
    );
}

export default SwiperPage;