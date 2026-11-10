import { Link } from "react-router-dom";
import NavbarGame from "../components/Navbar";
import { useGenres, useGamesByCategory } from ".././hooks/useQueries"; 
import Slider from "react-slick";
import CardGame from "../components/Card";
import { Spinner } from "@nextui-org/react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React from "react";

const FEATURED_CATEGORIES = ['action', 'shooter', 'mmorpg', 'strategy', 'moba', 'battle-royale', 'action-rpg', 'fantasy'];

function CategoryPage() {
    const sliderSettings = {
        infinite: true,
        speed: 500,
        slidesToShow: 6,
        slidesToScroll: 4,
        responsive: [
            {
                breakpoint: 1600,
                settings: {
                    slidesToShow: 5,
                    slidesToScroll: 4,
                },
            },
            {
                breakpoint: 1400,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 3,
                },
            },
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };

    // FreeToGame has no genres endpoint; use a curated subset of the static
    // category list to avoid firing dozens of requests at once.
    const { data: genres = [], isLoading: isLoadingGenres } = useGenres();
    const featured = genres.filter((genre) => FEATURED_CATEGORIES.includes(genre.slug));

    if (isLoadingGenres) {
        return <Spinner className="flex items-center justify-center h-screen" label="Loading categories..." color="danger" size="3xl" />;
    }

    return (
        <>
            <NavbarGame />
            <div className="flex justify-start items-center p-4 flex-col">
                {featured.map((genre) => (
                    <CategorySection key={genre.slug} genre={genre} sliderSettings={sliderSettings} />
                ))}
            </div>
        </>
    );
}

function CategorySection({ genre, sliderSettings }) {
    const { data, isLoading, isError} = useGamesByCategory(genre.slug, 12);

    const games = data?.pages?.flat() ?? [];

    let content;
    if (isLoading) {
        content = <Spinner label={`Loading ${genre.name} games...`} color="danger" size="3xl" />;
    } else if (isError) {
        content = <p className="text-red-500">Error loading games for {genre.name}!</p>;
    } else {
        content = games.map((game) => (
            <div className="p-2" key={game.id}>
                <CardGame
                    id={game.id}
                    name={game.title}
                    background_image={game.thumbnail}
                    released={game.release_date}
                    price="Free"
                    genre={game.genre}
                    platform={game.platform}
                />
            </div>
        ));
    }

    return (
        <div className="flex text-start flex-col w-full mb-8">
            <Link to={`/category/${genre.slug}`} className="text-3xl font-bold text-white mb-3">
                {genre.name} more...
            </Link>
            <Slider {...sliderSettings} className="cursor-grab select-none">
                {content}
            </Slider>
        </div>
    );
}


export default CategoryPage;
