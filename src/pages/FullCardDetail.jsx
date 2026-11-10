import { useParams, Link } from "react-router-dom";
import { useGameDetails } from "./../hooks/useQueries";
import { Spinner, Card, CardBody, Button, Chip, Divider, Skeleton } from "@nextui-org/react";
import {
  FaPlus, FaCheck, FaHeart, FaGamepad, FaCalendarAlt, FaTags, FaExternalLinkAlt,
  FaDesktop, FaMemory, FaHdd, FaMicrochip, FaWindows, FaArrowLeft, FaPlay,
  FaBuilding, FaUserTie, FaExclamationTriangle, FaRedo, FaImage, FaTimes, FaChevronLeft, FaChevronRight,
} from "react-icons/fa";
import { useDispatch } from "react-redux";
import NavbarGame from "../components/Navbar";
import ShoppingCard from "../components/ShoppingCard";
import { addToCart } from "../store/shoppingCardSlice";
import React, { useState, useEffect, useCallback } from "react";

const InfoRow = React.memo(({ label, value, icon }) => (
  <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5">
    {icon && <span className="text-red-500 mt-0.5 text-lg">{icon}</span>}
    <div className="min-w-0">
      <p className="text-[11px] uppercase tracking-wider text-gray-500">{label}</p>
      <p className="text-sm text-gray-200 font-medium break-words">{value}</p>
    </div>
  </div>
));

const GameInfo = React.memo(({ game }) => {
  const {
    title,
    description = "No description available.",
    short_description,
    release_date = "Unknown release date",
    genre,
    platform,
    publisher,
    developer,
    status,
  } = game;

  return (
    <Card className="bg-[#1b1b1f] border border-white/5 text-white shadow-lg">
      <CardBody className="gap-4 p-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight">{title}</h2>

        <div className="flex flex-wrap gap-2">
          {genre && <Chip size="sm" variant="flat" className="bg-red-500/10 text-red-400 border border-red-500/20">{genre}</Chip>}
          {platform && <Chip size="sm" variant="flat" className="bg-white/5 text-gray-300 border border-white/10">{platform}</Chip>}
          {status && <Chip size="sm" variant="flat" color="success">{status}</Chip>}
        </div>

        {short_description && (
          <p className="text-gray-400 italic border-l-2 border-red-500/50 pl-3">{short_description}</p>
        )}

        <div className="text-gray-300 leading-relaxed whitespace-pre-line">
          {description}
        </div>

        <Divider className="bg-white/5" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <InfoRow icon={<FaCalendarAlt />} label="Released" value={release_date} />
          <InfoRow icon={<FaTags />} label="Genre" value={genre || "Unknown"} />
          <InfoRow icon={<FaGamepad />} label="Platform" value={platform || "Unknown"} />
          <InfoRow icon={<FaUserTie />} label="Developer" value={developer || "Unknown"} />
          <InfoRow icon={<FaBuilding />} label="Publisher" value={publisher || "Unknown"} />
        </div>
      </CardBody>
    </Card>
  );
});

const SystemRequirements = React.memo(({ requirements }) => {
  if (!requirements) {
    return (
      <Card className="bg-[#1b1b1f] border border-white/5 text-white">
        <CardBody className="p-6 text-center text-gray-400">
          No system requirements available for this game.
        </CardBody>
      </Card>
    );
  }

  const rows = [
    { label: "OS", value: requirements.os, icon: <FaWindows /> },
    { label: "Processor", value: requirements.processor, icon: <FaMicrochip /> },
    { label: "Memory", value: requirements.memory, icon: <FaMemory /> },
    { label: "Graphics", value: requirements.graphics, icon: <FaDesktop /> },
    { label: "Storage", value: requirements.storage, icon: <FaHdd /> },
  ].filter((row) => row.value);

  if (rows.length === 0) {
    return (
      <Card className="bg-[#1b1b1f] border border-white/5 text-white">
        <CardBody className="p-6 text-center text-gray-400">
          No system requirements available for this game.
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="bg-[#1b1b1f] border border-white/5 text-white shadow-lg">
      <CardBody className="gap-4 p-6">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <FaDesktop className="text-red-500" />
          Minimum System Requirements
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {rows.map((row) => (
            <InfoRow key={row.label} icon={row.icon} label={row.label} value={row.value} />
          ))}
        </div>
      </CardBody>
    </Card>
  );
});

const ExternalLinks = React.memo(({ game }) => (
  <Card className="bg-[#1b1b1f] border border-white/5 text-white shadow-lg">
    <CardBody className="gap-4 p-6">
      <h3 className="text-xl font-bold flex items-center gap-2">
        <FaExternalLinkAlt className="text-red-500" />
        External Links
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {game.game_url && (
          <Button
            as="a"
            href={game.game_url}
            target="_blank"
            rel="noopener noreferrer"
            color="danger"
            size="lg"
            startContent={<FaPlay />}
            fullWidth
            className="font-bold"
          >
            Play Now
          </Button>
        )}
        {game.freetogame_profile_url && (
          <Button
            as="a"
            href={game.freetogame_profile_url}
            target="_blank"
            rel="noopener noreferrer"
            variant="bordered"
            size="lg"
            startContent={<FaExternalLinkAlt />}
            fullWidth
            className="border-white/10 text-white"
          >
            FreeToGame Profile
          </Button>
        )}
      </div>
      <p className="text-xs text-gray-500">
        Game data provided by{" "}
        <a
          href="https://www.freetogame.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-red-400 hover:underline"
        >
          FreeToGame.com
        </a>
      </p>
    </CardBody>
  </Card>
));

const ScreenshotLightbox = React.memo(({ screenshots, index, onClose, onPrev, onNext }) => {
  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") onPrev();
      if (event.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, onPrev, onNext]);

  if (index === null) return null;
  const current = screenshots[index];
  if (!current) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Screenshot viewer"
    >
      <button
        className="absolute top-4 right-4 text-white/70 hover:text-white p-2"
        onClick={onClose}
        aria-label="Close"
      >
        <FaTimes size={24} />
      </button>
      {screenshots.length > 1 && (
        <>
          <button
            className="absolute left-2 sm:left-6 text-white/70 hover:text-white p-3 bg-white/5 rounded-full"
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
            aria-label="Previous screenshot"
          >
            <FaChevronLeft size={20} />
          </button>
          <button
            className="absolute right-2 sm:right-6 text-white/70 hover:text-white p-3 bg-white/5 rounded-full"
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            aria-label="Next screenshot"
          >
            <FaChevronRight size={20} />
          </button>
        </>
      )}
      <img
        src={current.image}
        alt={`Screenshot ${index + 1}`}
        className="max-w-full max-h-[85vh] rounded-xl shadow-2xl object-contain"
        onClick={(e) => e.stopPropagation()}
      />
      <span className="absolute bottom-4 text-white/60 text-sm">
        {index + 1} / {screenshots.length}
      </span>
    </div>
  );
});

const TABS = [
  { key: "info", label: "Overview" },
  { key: "requirements", label: "System Requirements" },
  { key: "links", label: "Links" },
];

function DetailSkeleton() {
  return (
    <div className="min-h-screen bg-[#141417]">
      <NavbarGame />
      <Skeleton className="w-full h-[45vh] rounded-none" />
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <Skeleton className="h-10 w-2/3 rounded-lg" />
          <Skeleton className="h-6 w-1/3 rounded-lg" />
          <Skeleton className="h-40 w-full rounded-2xl" />
          <Skeleton className="h-40 w-full rounded-2xl" />
        </div>
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    </div>
  );
}

function FullCardDetail() {
  const { id } = useParams();
  const { data: game, isLoading, isError, error, refetch } = useGameDetails(id);
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("info");
  const [added, setAdded] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const screenshots = game?.screenshots ?? [];

  const openLightbox = useCallback((index) => setLightboxIndex(index), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const showPrev = useCallback(
    () => setLightboxIndex((i) => (i === null ? i : (i - 1 + screenshots.length) % screenshots.length)),
    [screenshots.length]
  );
  const showNext = useCallback(
    () => setLightboxIndex((i) => (i === null ? i : (i + 1) % screenshots.length)),
    [screenshots.length]
  );

  if (isLoading) {
    return <DetailSkeleton />;
  }

  if (isError || !game) {
    return (
      <div className="min-h-screen bg-[#141417] flex flex-col">
        <NavbarGame />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center">
          <FaExclamationTriangle className="text-5xl text-red-500" />
          <h2 className="text-2xl font-bold text-white">Failed to load game details</h2>
          <p className="text-gray-400 max-w-md">{error?.message || "Something went wrong while fetching this game."}</p>
          <div className="flex gap-3">
            <Button color="danger" variant="flat" startContent={<FaRedo />} onPress={() => refetch()}>
              Try Again
            </Button>
            <Button as={Link} to="/" variant="bordered" className="border-white/10 text-white" startContent={<FaArrowLeft />}>
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const gameToCart = {
    id: game.id,
    name: game.title,
    price: "Free",
    quantity: 1,
    background_image: game.thumbnail,
  };

  const handleAddToCart = () => {
    dispatch(addToCart(gameToCart));
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1500);
  };

  const heroImage = screenshots[0]?.image || game.thumbnail;

  return (
    <div className="min-h-screen bg-[#141417] pb-16">
      <NavbarGame />
      <ShoppingCard />

      {/* Hero */}
      <div className="relative w-full h-[45vh] min-h-[280px] overflow-hidden">
        <img
          src={heroImage || "https://via.placeholder.com/1600x900?text=No+Image"}
          alt={game.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141417] via-[#141417]/30 to-transparent" />

        <div className="absolute inset-0 flex items-end">
          <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 pb-6">
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white mb-3 transition-colors">
              <FaArrowLeft /> Back to games
            </Link>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight drop-shadow-lg max-w-4xl">
              {game.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-gray-300">
              {game.release_date && (
                <span className="flex items-center gap-2">
                  <FaCalendarAlt className="text-red-500" />
                  {game.release_date}
                </span>
              )}
              {game.genre && <Chip size="sm" variant="flat" className="bg-white/10 text-white">{game.genre}</Chip>}
              {game.platform && <Chip size="sm" variant="flat" className="bg-white/10 text-white">{game.platform}</Chip>}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 pt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Tabs */}
          <div className="flex gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/5 w-fit">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 sm:px-5 py-2 rounded-lg text-sm sm:text-base font-semibold transition-all ${
                  activeTab === tab.key
                    ? "bg-red-600 text-white shadow"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "info" && <GameInfo game={game} />}
          {activeTab === "requirements" && <SystemRequirements requirements={game.minimum_system_requirements} />}
          {activeTab === "links" && <ExternalLinks game={game} />}

          {/* Screenshots */}
          {screenshots.length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <FaImage className="text-red-500" />
                Screenshots
                <span className="text-sm font-normal text-gray-500">({screenshots.length})</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {screenshots.map((screen, index) => (
                  <button
                    key={screen.id ?? index}
                    onClick={() => openLightbox(index)}
                    className="group relative rounded-xl overflow-hidden border border-white/5 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <img
                      src={screen.image}
                      alt={`${game.title} screenshot ${index + 1}`}
                      loading="lazy"
                      className="w-full h-40 sm:h-44 object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                      <FaPlay className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={28} />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div>
          <Card className="bg-[#1b1b1f] border border-white/5 text-white shadow-lg lg:sticky lg:top-20">
            <CardBody className="gap-4 p-5">
              <img
                className="object-cover rounded-xl w-full aspect-[16/10]"
                src={game.thumbnail || "https://via.placeholder.com/600x375?text=No+Image"}
                alt={game.title}
              />

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-gray-500">Price</p>
                  <span className="text-3xl font-extrabold text-white">Free</span>
                </div>
                {game.status && (
                  <Chip color="success" variant="flat" className="font-bold">
                    {game.status}
                  </Chip>
                )}
              </div>

              <Button
                className="w-full font-bold"
                color={added ? "success" : "danger"}
                size="lg"
                startContent={added ? <FaCheck /> : <FaPlus />}
                onPress={handleAddToCart}
              >
                {added ? "Added to Wishlist" : "Add to Wishlist"}
              </Button>

              <Button
                className="w-full border-white/10 text-white"
                variant="bordered"
                size="lg"
                startContent={<FaHeart />}
              >
                Add to Favorites
              </Button>

              {game.game_url && (
                <Button
                  as="a"
                  href={game.game_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-white/5 text-white border border-white/10"
                  variant="flat"
                  size="lg"
                  startContent={<FaPlay />}
                >
                  Play Now
                </Button>
              )}

              <Divider className="bg-white/5" />

              <div className="flex flex-col gap-3 text-sm">
                {game.platform && (
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-gray-500 flex items-center gap-2"><FaGamepad /> Platform</span>
                    <span className="text-gray-200 font-medium text-right">{game.platform}</span>
                  </div>
                )}
                {game.developer && (
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-gray-500 flex items-center gap-2"><FaUserTie /> Developer</span>
                    <span className="text-gray-200 font-medium text-right">{game.developer}</span>
                  </div>
                )}
                {game.publisher && (
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-gray-500 flex items-center gap-2"><FaBuilding /> Publisher</span>
                    <span className="text-gray-200 font-medium text-right">{game.publisher}</span>
                  </div>
                )}
                {game.release_date && (
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-gray-500 flex items-center gap-2"><FaCalendarAlt /> Released</span>
                    <span className="text-gray-200 font-medium text-right">{game.release_date}</span>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      <ScreenshotLightbox
        screenshots={screenshots}
        index={lightboxIndex}
        onClose={closeLightbox}
        onPrev={showPrev}
        onNext={showNext}
      />
    </div>
  );
}

export default FullCardDetail;
