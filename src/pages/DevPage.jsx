import { useDevelopers } from './../hooks/useQueries';
import DevCard from '../components/DevCard';
import NavbarGame from '../components/Navbar';
import { useInView } from 'react-intersection-observer';
import React from 'react';
import { Spinner } from '@nextui-org/react';

const DevPage = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useDevelopers();
  const { ref, inView } = useInView();

  React.useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (!data) return <Spinner className="w-full h-screen" label="Loading..." color="danger" size="3xl" />;

  return (
    <>
    <NavbarGame />
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4 mx-10'>
      {data.pages.map((page, pageIndex) => (
        <React.Fragment key={pageIndex}>
          {page.results.map((developer) => (
            <DevCard
            key={developer.id}
            id={developer.id}
            image_background={developer.image_background}
            name={developer.name}
            count={developer.games_count}
            description={developer.description}
            />
          ))}
        </React.Fragment>
      ))}
      <div ref={ref}>
        {isFetchingNextPage ? <Spinner className="w-screen" label="Loading..." color="danger" size="3xl" /> : hasNextPage ? 'Load More' : 'No more developers'}
      </div>
    </div>
    </>
  );
};

export default DevPage;