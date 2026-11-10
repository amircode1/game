import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

// FreeToGame is a public, keyless API. Hardcoded so deploys don't depend on
// environment variables (the old RAWG VITE_API_URL may still be set on Netlify).
const BASE_URL = 'https://www.freetogame.com/api';
const PAGE_SIZE = 12;

const fetchApi = async (endpoint) => {
  const response = await fetch(`${BASE_URL}${endpoint}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Invalid JSON response: ${text.slice(0, 100)}...`);
  }
};

const slicePages = (all, pageCount, pageSize) => {
  const pages = [];
  const limit = Math.min(all.length, pageCount * pageSize);
  for (let i = 0; i < limit; i += pageSize) {
    pages.push(all.slice(i, i + pageSize));
  }
  return pages;
};

// FreeToGame returns the full list in a single response (no server-side
// pagination), so infinite scroll is implemented by slicing client-side.
const usePagedGames = (queryKey, endpoint, pageSize = PAGE_SIZE) => {
  return useInfiniteQuery({
    queryKey,
    queryFn: () => fetchApi(endpoint),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.length * pageSize;
      return loaded < lastPage.length ? allPages.length + 1 : undefined;
    },
    select: (data) => {
      const all = data.pages[0] ?? [];
      return {
        pages: slicePages(all, data.pageParams.length, pageSize),
        pageParams: data.pageParams,
        total: all.length,
        totalPages: Math.ceil(all.length / pageSize),
      };
    },
  });
};

export const useGames = (sortBy = 'relevance') => {
  return usePagedGames(['games', sortBy], `/games?sort-by=${encodeURIComponent(sortBy)}`);
};

// FreeToGame has no genres endpoint; these are the valid `category` values.
export const CATEGORIES = [
  { slug: 'action', name: 'Action' },
  { slug: 'shooter', name: 'Shooter' },
  { slug: 'mmorpg', name: 'MMORPG' },
  { slug: 'mmo', name: 'MMO' },
  { slug: 'action-rpg', name: 'Action RPG' },
  { slug: 'battle-royale', name: 'Battle Royale' },
  { slug: 'strategy', name: 'Strategy' },
  { slug: 'moba', name: 'MOBA' },
  { slug: 'fantasy', name: 'Fantasy' },
  { slug: 'sci-fi', name: 'Sci-Fi' },
  { slug: 'open-world', name: 'Open World' },
  { slug: 'survival', name: 'Survival' },
  { slug: 'sandbox', name: 'Sandbox' },
  { slug: 'anime', name: 'Anime' },
  { slug: 'pvp', name: 'PvP' },
  { slug: 'pve', name: 'PvE' },
  { slug: 'mmofps', name: 'MMOFPS' },
  { slug: 'fighting', name: 'Fighting' },
  { slug: 'racing', name: 'Racing' },
  { slug: 'sports', name: 'Sports' },
  { slug: 'card', name: 'Card' },
  { slug: 'social', name: 'Social' },
  { slug: 'military', name: 'Military' },
  { slug: 'tank', name: 'Tank' },
  { slug: 'space', name: 'Space' },
  { slug: 'superhero', name: 'Superhero' },
  { slug: 'martial-arts', name: 'Martial Arts' },
  { slug: 'flight', name: 'Flight' },
  { slug: 'tower-defense', name: 'Tower Defense' },
  { slug: '3d', name: '3D' },
  { slug: '2d', name: '2D' },
  { slug: 'pixel', name: 'Pixel' },
  { slug: 'voxel', name: 'Voxel' },
  { slug: 'zombie', name: 'Zombie' },
];

export const useGenres = () => {
  return useQuery({
    queryKey: ['genres'],
    queryFn: async () => CATEGORIES,
    staleTime: Infinity,
  });
};

export const useGamesByCategory = (category, pageSize = PAGE_SIZE) => {
  return usePagedGames(
    ['category', category],
    `/games?category=${encodeURIComponent(category)}`,
    pageSize
  );
};

export const useGamesBySingelCategory = useGamesByCategory;

// Map FreeToGame genre strings to valid `category` slugs.
// Some genres (e.g. "ARPG", "RPG", "Action Game") have no matching category.
const GENRE_TO_CATEGORY = {
  'action': 'action',
  'action game': 'action',
  'action rpg': 'action-rpg',
  'arpg': 'action-rpg',
  'mmoarpg': 'action-rpg',
  'rpg': 'action-rpg',
  'dungeon crawler': 'action-rpg',
  'battle royale': 'battle-royale',
  'card': 'card',
  'card game': 'card',
  'fantasy': 'fantasy',
  'fighting': 'fighting',
  'mmo': 'mmo',
  'mmorpg': 'mmorpg',
  'mmofps': 'mmofps',
  'moba': 'moba',
  'racing': 'racing',
  'shooter': 'shooter',
  'social': 'social',
  'sports': 'sports',
  'strategy': 'strategy',
  'sci-fi': 'sci-fi',
  'open world': 'open-world',
  'survival': 'survival',
  'sandbox': 'sandbox',
  'anime': 'anime',
  'pvp': 'pvp',
  'pve': 'pve',
  'military': 'military',
  'tank': 'tank',
  'space': 'space',
  'superhero': 'superhero',
  'martial arts': 'martial-arts',
  'flight': 'flight',
  'tower defense': 'tower-defense',
  '3d': '3d',
  '2d': '2d',
  'pixel': 'pixel',
  'voxel': 'voxel',
  'zombie': 'zombie',
};

export const genreToCategory = (genre) => {
  if (!genre) return null;
  return GENRE_TO_CATEGORY[genre.trim().toLowerCase()] ?? null;
};

// Lightweight list of games in a category (no pagination) for "More like this".
export const useRelatedGames = (category, excludeId, limit = 6) => {
  return useQuery({
    queryKey: ['related', category, excludeId],
    queryFn: async () => {
      const all = await fetchApi(`/games?category=${encodeURIComponent(category)}`);
      if (!Array.isArray(all)) return [];
      return all.filter((game) => String(game.id) !== String(excludeId)).slice(0, limit);
    },
    enabled: !!category,
    staleTime: 5 * 60 * 1000,
  });
};

export const useSearchGames = (searchQuery) => {
  const query = (searchQuery ?? '').trim().toLowerCase();
  return useQuery({
    queryKey: ['games', 'search', query],
    queryFn: async () => {
      const all = await fetchApi('/games');
      return all.filter((game) =>
        [game.title, game.genre, game.platform, game.publisher, game.developer]
          .filter(Boolean)
          .some((field) => field.toLowerCase().includes(query))
      );
    },
    enabled: query.length > 0,
    staleTime: 5 * 60 * 1000,
  });
};

export const useGameDetails = (gameId) => {
  return useQuery({
    queryKey: ['game', String(gameId)],
    queryFn: () => fetchApi(`/game?id=${encodeURIComponent(gameId)}`),
    enabled: !!gameId,
  });
};

// FreeToGame has no developers endpoint; derive the list from the games list.
export const useDevelopers = () => {
  return useQuery({
    queryKey: ['developers'],
    queryFn: async () => {
      const all = await fetchApi('/games');
      const map = new Map();
      for (const game of all) {
        const name = (game.developer ?? '').trim();
        if (!name) continue;
        const entry = map.get(name) ?? {
          id: name,
          name,
          games_count: 0,
          image_background: game.thumbnail,
          description: `Publisher: ${game.publisher ?? 'Unknown'}`,
        };
        entry.games_count += 1;
        map.set(name, entry);
      }
      return [...map.values()].sort((a, b) => b.games_count - a.games_count);
    },
    staleTime: Infinity,
  });
};
