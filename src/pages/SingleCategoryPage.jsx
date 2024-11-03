import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { Spinner } from "@nextui-org/react";
import CardGame from '../components/Card';
import NavbarGame from '../components/Navbar';
import ShoppingCard from '../components/ShoppingCard';
import { useGamesBySingelCategory } from '../hooks/useQueries';
import { useParams } from 'react-router-dom';

function SingleCategoryPage() {
    const { categorySlug } = useParams();

    const {
        data,
        isLoading,
        isError,
        error,
        fetchNextPage,
        isFetchingNextPage,
        hasNextPage,
    } = useGamesBySingelCategory(categorySlug);

    // Intersection observer for infinite scroll
    const { ref, inView } = useInView();
    useEffect(() => {
        if (inView && hasNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, fetchNextPage]);

    let content;

    if (isLoading) {
        content = (
            <div className="flex justify-center items-center w-screen h-screen">
                <Spinner label="Loading..." color="danger" size="3xl" />
            </div>
        );
    } else if (isError) {
        content = <p className='text-red-500'>Error: {error?.message || "Something went wrong!"}</p>;
    } else if (data && data.pages && Array.isArray(data.pages)) {
        // Ensure data.pages exists and is an array before mapping
        content = data.pages.map((page, pageIndex) => (
            <React.Fragment key={pageIndex}>
                {page.results.map((card) => (
                    <div key={card.id} className='flex justify-center items-center'>
                        <CardGame 
                            id={card.id}
                            name={card.name}
                            background_image={card.background_image}
                            released={card.released}
                            price={card.price}
                            rating={card.rating}
                            slug={card.slug}
                        />
                    </div>
                ))}
            </React.Fragment>
        ));
    } else {
        content = <p className='text-gray-500'>No games available for this category.</p>;
    }

    return (
        <>
            <NavbarGame />
            <ShoppingCard />
            <div className="dark grid 2xl:grid-cols-5 gap-8 px-10 sm:px-20 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {content}
                <div ref={ref}>
                    {isFetchingNextPage && <Spinner className="w-screen" label="Loading..." color="danger" size="3xl" />}
                </div>
            </div>
        </>
    );
}

export default SingleCategoryPage;
