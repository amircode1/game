import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = import.meta.env.VITE_API_URL;

const createApiUrl = (endpoint, params = {}) => {
  const searchParams = new URLSearchParams({ key: API_KEY, ...params });
  return `${BASE_URL}${endpoint}?${searchParams}`;
};

const fetchApi = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const useGames = (ordering = '-released', pageSize = 12) => {
  return useInfiniteQuery({
    queryKey: ['games', ordering],
    queryFn: ({ pageParam = 1 }) => 
      fetchApi(createApiUrl('/games', { ordering, page: pageParam, page_size: pageSize })),
    getNextPageParam: (lastPage) => {
      if (!lastPage.next) return undefined;
      const nextUrl = new URL(lastPage.next);
      return Number(nextUrl.searchParams.get('page'));
    },
  });
};

// Genres query
export const useGenres = () => {
  return useQuery({
    queryKey: ['genres'],
    queryFn: () => fetchApi(createApiUrl('/genres')),
    select: (data) => data.results
  });
};

export const useGamesByCategory = (genreSlug, pageSize = 12) => {
  return useInfiniteQuery({
    queryKey: ['category', genreSlug],
    queryFn: ({ pageParam = 1 }) => 
      fetchApi(createApiUrl('/games', {
        genres: genreSlug,
        page: pageParam,
        page_size: pageSize
      })),
    getNextPageParam: (lastPage) => {
      if (!lastPage.next) return undefined;
      const totalPages = Math.ceil(lastPage.count / pageSize);
      const nextPage = lastPage.page + 1;
      return nextPage <= totalPages ? nextPage : undefined;
    },
    select: (data) => ({
      pages: data.pages.map(page => page.results),
      pageParams: data.pageParams,
      totalPages: Math.ceil(data.pages[0].count / pageSize)
    })
  });
};

export const useGamesBySingelCategory = (genreSlug, pageSize = 12) => {
  return useInfiniteQuery({
    queryKey: ['category', genreSlug],
    queryFn: ({ pageParam = 1 }) => 
      fetchApi(createApiUrl('/games', {
        genres: genreSlug,
        page: pageParam,
        page_size: pageSize
      })),
      getNextPageParam: (lastPage) => {
        if (!lastPage.next) return undefined;
        const nextUrl = new URL(lastPage.next);
        return Number(nextUrl.searchParams.get('page'));
      },
  });
};


// Search games query
export const useSearchGames = (searchQuery) => {
  return useQuery({
    queryKey: ['games', 'search', searchQuery],
    queryFn: () => 
      fetchApi(createApiUrl('/games', {
        search: searchQuery,
        page: 1,
        page_size: 10
      })),
    select: (data) => data.results,
    enabled: !!searchQuery
  });
};

// Game details query
export const useGameDetails = (gameSlug) => {
  return useQuery({
    queryKey: ['game', gameSlug],
    queryFn: () => fetchApi(createApiUrl(`/games/${gameSlug}`)),
    enabled: !!gameSlug
  });
};

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    key: API_KEY,
  },
});

const fetchDevelopers = async (page = 1, pageSize = 12) => {
  try {
    const { data } = await api.get('/developers', {
      params: {
        page,
        page_size: pageSize,
      },
    });
    return data;
  } catch (error) {
    console.error('Error fetching developers:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch developers');
  }
};

export const useDevelopers = (pageSize = 12) => {
  return useInfiniteQuery({
    queryKey: ['developers'],
    queryFn: ({ pageParam = 1 }) => fetchDevelopers(pageParam, pageSize),
    getNextPageParam: (lastPage) => {
      if (!lastPage || !lastPage.next) return undefined;
      const nextUrl = new URL(lastPage.next);
      return Number(nextUrl.searchParams.get('page'));
    },
  });
};
