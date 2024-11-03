import Slider from "react-slick";
import { useGames } from "../hooks/useQueries";
import { useInView } from "react-intersection-observer";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { Spinner } from "@nextui-org/react";
import React from "react";

function ShowCard() {
    const settings = {
        infinite: true,
        speed: 500,
        slidesToShow: 1,  // هر بار فقط یک اسلاید نمایش داده شود
        slidesToScroll: 1,
        responsive: [
            { breakpoint: 1024, settings: { slidesToShow: 1, slidesToScroll: 1, infinite: true } },
            { breakpoint: 600, settings: { slidesToShow: 1, slidesToScroll: 1 } },
            { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } }
        ]
    };

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useGames("relevance");
    const { ref, inView } = useInView();

    // Fetch next page when inView
    React.useEffect(() => {
        if (inView && hasNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, fetchNextPage]);

    if (!data) return <Spinner className="w-full h-screen" label="Loading..." color="danger" size="3xl" />;

    return (
        <div className="slider-container w-full max-w-screen-2xl mx-auto px-4 lg:px-20 cursor-grab">
        <Slider {...settings}>
          {data.pages.map((page) => 
              page.results.map(item => (
                  <div key={item.id} className="flex justify-center">
                      <img
                          src={item.background_image || "https://via.placeholder.com/80"}
                          alt={item.name}
                          className="w-full h-[400px] md:h-[500px] lg:h-[600px] xl:h-[700px] object-cover rounded-lg shadow-lg transition-transform transform hover:scale-110 duration-300"
                      />
                  </div>
              ))
          )}
        </Slider>
        <div ref={ref}>
          {isFetchingNextPage && <Spinner className="w-screen" label="Loading..." color="danger" size="3xl" />}
        </div>
      </div>
    );
}

export default ShowCard;
