import { useState, useEffect } from 'react';
import React from 'react';
import CardGame from '../components/Card';
import NavbarGame from '../components/Navbar';
import { useGames } from '../hooks/useQueries';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, Spinner, Skeleton } from "@nextui-org/react";
import ShoppingCard from '../components/ShoppingCard';
import ShowCard from '../components/ShowCard';
import { useInView } from 'react-intersection-observer';
import { FaSortAmountDown, FaFire, FaCalendarAlt, FaSortAlphaDown, FaStar, FaExclamationTriangle, FaRedo } from 'react-icons/fa';

const SORT_OPTIONS = [
    { key: 'relevance', label: 'Relevance', icon: <FaStar /> },
    { key: 'popularity', label: 'Popularity', icon: <FaFire /> },
    { key: 'release-date', label: 'Release Date', icon: <FaCalendarAlt /> },
    { key: 'alphabetical', label: 'Alphabetical', icon: <FaSortAlphaDown /> },
];

function CardSkeleton() {
    return (
        <div className="w-full max-w-[320px] rounded-2xl border border-white/5 bg-[#1b1b1f] overflow-hidden">
            <Skeleton className="w-full aspect-[16/10] rounded-none" />
            <div className="p-4 flex flex-col gap-3">
                <Skeleton className="h-5 w-3/4 rounded-lg" />
                <Skeleton className="h-3 w-1/2 rounded-lg" />
                <div className="flex justify-between items-center pt-2 border-t border-white/5">
                    <Skeleton className="h-4 w-20 rounded-lg" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                </div>
            </div>
        </div>
    );
}

function HomePage() {
    const [ordering, setOrdering] = useState('relevance');

    const selectedOption = SORT_OPTIONS.find((option) => option.key === ordering) ?? SORT_OPTIONS[0];

    const {
        data,
        isLoading,
        isError,
        error,
        refetch,
        fetchNextPage,
        isFetchingNextPage,
        hasNextPage
    } = useGames(ordering);

    const { ref, inView } = useInView();

    useEffect(() => {
        if (inView && hasNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, fetchNextPage]);

    const games = data?.pages?.flat() ?? [];

    let content;

    if (isLoading) {
        content = Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className="flex justify-center">
                <CardSkeleton />
            </div>
        ));
    } else if (isError) {
        content = (
            <div className="col-span-full flex flex-col items-center justify-center gap-4 py-20 text-center">
                <FaExclamationTriangle className="text-5xl text-red-500" />
                <div>
                    <h3 className="text-xl font-bold text-white">Failed to load games</h3>
                    <p className="text-gray-400 mt-1">{error?.message || "Something went wrong!"}</p>
                </div>
                <Button color="danger" variant="flat" startContent={<FaRedo />} onPress={() => refetch()}>
                    Try Again
                </Button>
            </div>
        );
    } else if (games.length === 0) {
        content = (
            <div className="col-span-full flex flex-col items-center justify-center gap-3 py-20 text-center">
                <h3 className="text-xl font-bold text-white">No games found</h3>
                <p className="text-gray-400">Try a different sort option.</p>
            </div>
        );
    } else {
        content = games.map((card) => (
            <div key={card.id} className="flex justify-center">
                <CardGame
                    id={card.id}
                    name={card.title}
                    background_image={card.thumbnail}
                    released={card.release_date}
                    price="Free"
                    genre={card.genre}
                    platform={card.platform}
                />
            </div>
        ));
    }

    return (
        <div className="min-h-screen bg-[#141417]">
            <NavbarGame />
            <ShowCard />
            <ShoppingCard />

            {/* Section header with sort */}
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 pt-8 pb-4 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
                        <FaFire className="text-red-500" />
                        Browse Games
                    </h2>
                    <p className="text-gray-400 text-sm mt-1">
                        {data?.total ? `${data.total} free-to-play games` : 'Free-to-play games'}
                    </p>
                </div>

                <Dropdown>
                    <DropdownTrigger>
                        <Button
                            variant="bordered"
                            className="border-white/10 text-white bg-white/5 capitalize"
                            startContent={<FaSortAmountDown className="text-red-500" />}
                        >
                            {selectedOption.label}
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                        aria-label="Sort by options"
                        variant="flat"
                        disallowEmptySelection
                        selectionMode="single"
                        selectedKeys={new Set([ordering])}
                        onSelectionChange={(keys) => {
                            const key = Array.from(keys)[0];
                            if (key) setOrdering(key);
                        }}
                        className="bg-[#1b1b1f] text-white"
                    >
                        {SORT_OPTIONS.map((option) => (
                            <DropdownItem key={option.key} startContent={option.icon}>
                                {option.label}
                            </DropdownItem>
                        ))}
                    </DropdownMenu>
                </Dropdown>
            </div>

            {/* Games grid */}
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 pb-16 grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
                {content}
                <div ref={ref} className="col-span-full flex justify-center py-6">
                    {isFetchingNextPage && <Spinner color="danger" label="Loading more games..." />}
                </div>
            </div>
        </div>
    );
}

export default HomePage;
