import { useState, useEffect } from 'react';
import React from 'react';
import CardGame from '../components/Card';
import NavbarGame from '../components/Navbar';
import { useGames } from '../hooks/useQueries';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, Spinner } from "@nextui-org/react";
import ShoppingCard from '../components/ShoppingCard';
import ShowCard from '../components/ShowCard';
import { useInView } from 'react-intersection-observer';

function HomePage() {
    const [ordering, setOrdering] = useState('relevance');
    const [selectedKeys, setSelectedKeys] = useState(new Set([ordering]));

    const selectedValue = React.useMemo(
        () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
        [selectedKeys]
    );

    useEffect(() => {
        if (selectedValue === 'released') {
            setOrdering('-released');
        } else if (selectedValue === 'rating') {
            setOrdering('-rating');
        } else if (selectedValue === 'metacritic') {
            setOrdering('-metacritic');
        } else if (selectedValue === 'relevance') {
            setOrdering('-relevance');
        }
    }, [selectedKeys]);

    const {
        data,
        isLoading,
        isError,
        error,
        fetchNextPage,
        isFetchingNextPage,
        hasNextPage
    } = useGames(ordering);

    const { ref, inView } = useInView();

    React.useEffect(() => {
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
    } else {
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
    }

    return (
        <>
            <NavbarGame />
            <ShowCard />
            <ShoppingCard />
            <Dropdown>
                <DropdownTrigger className="mx-20">
                    <Button variant="bordered" className="capitalize">
                        {selectedValue}
                    </Button>
                </DropdownTrigger>
                <DropdownMenu
                    aria-label="Sort by options"
                    variant="flat"
                    disallowEmptySelection
                    selectionMode="single"
                    selectedKeys={selectedKeys}
                    onSelectionChange={setSelectedKeys}
                >
                    <DropdownItem key="rating">Rating</DropdownItem>
                    <DropdownItem key="released">Released</DropdownItem>
                    <DropdownItem key="relevance">Relevance</DropdownItem>
                    <DropdownItem key="metacritic">Metacritic</DropdownItem>
                </DropdownMenu>
            </Dropdown>

            <div className="dark grid 2xl:grid-cols-5 gap-8 px-10 sm:px-20 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {content}
                <div ref={ref}>
                    {isFetchingNextPage ? <Spinner className="w-screen" label="Loading..." color="danger" size="3xl" /> : hasNextPage}
                </div>
            </div>
        </>
    );
}

export default HomePage;
