import { useDevelopers } from './../hooks/useQueries';
import DevCard from '../components/DevCard';
import NavbarGame from '../components/Navbar';
import React, { useState } from 'react';
import { Spinner, Button } from '@nextui-org/react';

const PAGE_SIZE = 20;

const DevPage = () => {
  const { data: developers, isLoading, isError, error } = useDevelopers();
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  if (isLoading) {
    return <Spinner className="w-full h-screen" label="Loading..." color="danger" size="3xl" />;
  }

  if (isError) {
    return <p className="text-red-500 p-8">Error: {error?.message || "Something went wrong!"}</p>;
  }

  const visible = (developers ?? []).slice(0, visibleCount);
  const hasMore = visibleCount < (developers?.length ?? 0);

  return (
    <>
    <NavbarGame />
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4 mx-10'>
      {visible.map((developer) => (
        <DevCard
          key={developer.id}
          id={developer.id}
          image_background={developer.image_background}
          name={developer.name}
          count={developer.games_count}
          description={developer.description}
        />
      ))}
    </div>
    <div className="flex justify-center my-6">
      {hasMore ? (
        <Button color="danger" variant="flat" onPress={() => setVisibleCount((c) => c + PAGE_SIZE)}>
          Load More
        </Button>
      ) : (
        <p className="text-gray-500">No more developers</p>
      )}
    </div>
    </>
  );
};

export default DevPage;
