import Slider from "react-slick";
import { useGames } from "../hooks/useQueries";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Spinner, Chip, Button } from "@nextui-org/react";
import { Link } from "react-router-dom";
import { FaPlay, FaFire } from "react-icons/fa";
import React from "react";

function ShowCard() {
    const settings = {
        infinite: true,
        speed: 600,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        pauseOnHover: true,
        arrows: true,
        dots: true,
    };

    const { data, isLoading } = useGames("popularity");

    const games = data?.pages?.[0] ?? [];

    if (isLoading) {
        return (
            <div className="w-full h-[300px] md:h-[420px] lg:h-[520px] flex items-center justify-center bg-[#141417]">
                <Spinner color="danger" size="lg" label="Loading featured games..." />
            </div>
        );
    }

    const featured = games.slice(0, 8);

    return (
        <div className="relative w-full bg-[#141417]">
            <Slider {...settings} className="hero-slider">
                {featured.map((item) => (
                    <div key={item.id} className="outline-none">
                        <div className="relative w-full h-[300px] md:h-[420px] lg:h-[520px] overflow-hidden">
                            <img
                                src={item.thumbnail || "https://via.placeholder.com/1600x900?text=No+Image"}
                                alt={item.title}
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                            {/* Gradient overlays for readability */}
                            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#141417] via-transparent to-transparent" />

                            <div className="absolute inset-0 flex items-end">
                                <div className="w-full max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-20 pb-10 md:pb-14">
                                    <div className="max-w-2xl flex flex-col gap-3">
                                        <Chip
                                            size="sm"
                                            className="w-fit bg-red-600 text-white font-bold uppercase tracking-wide"
                                            startContent={<FaFire />}
                                        >
                                            Featured
                                        </Chip>
                                        <h1 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold text-white leading-tight drop-shadow-lg line-clamp-2">
                                            {item.title}
                                        </h1>
                                        <p className="text-gray-300 text-sm sm:text-base line-clamp-2 max-w-xl">
                                            {item.short_description}
                                        </p>
                                        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-300">
                                            {item.genre && <Chip size="sm" variant="flat" className="bg-white/10 text-white">{item.genre}</Chip>}
                                            {item.platform && <Chip size="sm" variant="flat" className="bg-white/10 text-white">{item.platform}</Chip>}
                                            {item.release_date && <span className="text-gray-400">{item.release_date}</span>}
                                        </div>
                                        <div className="flex items-center gap-3 mt-2">
                                            <Button
                                                as={Link}
                                                to={`/games/${item.id}`}
                                                color="danger"
                                                size="lg"
                                                startContent={<FaPlay />}
                                                className="font-bold"
                                            >
                                                View Game
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
}

export default ShowCard;
