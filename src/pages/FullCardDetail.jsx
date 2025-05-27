import { useParams } from "react-router-dom";
import { useGameDetails } from "./../hooks/useQueries";
import { Spinner, Card, CardHeader, CardBody, Button, Chip, Divider, Progress, Badge } from "@nextui-org/react";
import { FaPlus, FaHeart, FaStar, FaGamepad, FaCalendarAlt, FaTags, FaExternalLinkAlt, FaRedditAlien } from "react-icons/fa";
import { useDispatch } from "react-redux";
import NavbarGame from "../components/Navbar";
import ShoppingCard from "../components/ShoppingCard";
import { addToCart } from "../store/shoppingCardSlice";
import React, { useState } from "react";

// Helper component for info rows
const InfoRow = React.memo(({ label, value, icon }) => (
  <div className="flex items-center gap-2 mb-3">
    {icon && <span className="text-danger">{icon}</span>}
    <span className="font-semibold text-gray-700">{label}:</span>
    <span className="text-gray-500">{value}</span>
  </div>
));

// Helper component for external links
const ExternalLinks = React.memo(({ website, reddit_url, reddit_name, reddit_description, reddit_logo, metacritic_url }) => (
  <Card className="shadow-lg p-6 bg-gray-900 mt-8">
    <CardBody>
      <h3 className="text-2xl font-bold mb-4 text-white flex items-center gap-2">
        <FaExternalLinkAlt className="text-danger" />
        External Links
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {website && (
          <Button
            as="a"
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-800 text-white border-none hover:bg-gray-700"
            startContent={<FaExternalLinkAlt />}
            fullWidth
          >
            Official Website
          </Button>
        )}
        {reddit_url && (
          <Button
            as="a"
            href={reddit_url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#FF4500] text-white border-none hover:bg-orange-600"
            startContent={<FaRedditAlien />}
            fullWidth
          >
            {reddit_name || "Visit Reddit"}
          </Button>
        )}
        {metacritic_url && (
          <Button
            as="a"
            href={metacritic_url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#001C33] text-white border-none hover:bg-blue-900"
            startContent={<FaStar />}
            fullWidth
          >
            Metacritic
          </Button>
        )}
      </div>
      {reddit_description && (
        <div className="mt-4">
          <p className="text-gray-400">{reddit_description}</p>
          {reddit_logo && <img src={reddit_logo} alt="Reddit Logo" className="mt-4 w-16 h-16" />}
        </div>
      )}
    </CardBody>
  </Card>
));

const GameInfo = React.memo(({ game }) => {
  const {
    id,
    name,
    description = "No description available.",
    released = "Unknown release date",
    rating = "No rating available",
    esrb_rating,
    metacritic,
    price = "Free",
    genres = [],
  } = game;
  
  const renderMetacriticBadge = () => {
    if (!metacritic) return null;
    
    let color = "danger";
    if (metacritic >= 75) color = "success";
    else if (metacritic >= 50) color = "warning";
    
    return (
      <Badge 
        content={metacritic} 
        color={color} 
        placement="top-right"
        className="text-white font-bold"
        size="lg"
      >
        <Chip variant="flat" color={color}>Metacritic</Chip>
      </Badge>
    );
  };

  // Format the description by removing HTML paragraph tags and decoding HTML entities
  const formatDescription = (text) => {
    if (!text) return "No description available.";
    // Remove <p> and </p> tags, then split into paragraphs
    const paragraphs = text
      .replace(/<\/?p>/g, '')
      .split(/\s*<\/p>\s*<p>\s*/i)
      .map(str => str.trim())
      .filter(Boolean);
    // Decode basic HTML entities for safety
    const decode = (str) => str.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
    return paragraphs.map(decode).join('\n\n');
  };

  return (
    <Card className="shadow-lg bg-gray-900 text-white">
      <CardBody>
        <div className="flex justify-between items-start">
          <h2 className="text-4xl font-bold mb-4">{name}</h2>
          {renderMetacriticBadge()}
        </div>
        
        {esrb_rating && (
          <Chip className="mb-4" color={esrb_rating.name === "Mature" ? "danger" : "primary"} variant="flat">
            {esrb_rating.name}
          </Chip>
        )}
        
        <div className="mb-6">
          {genres.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {genres.map((genre, index) => (
                <Chip key={index} variant="flat" color="default" className="bg-gray-800">
                  {genre.name}
                </Chip>
              ))}
            </div>
          )}
        </div>
        
        <div className="mb-6">
          {rating && (
            <div className="mb-2">
              <div className="flex justify-between mb-1">
                <span>User Rating: {parseFloat(rating).toFixed(1)}/5</span>
                <span>{(parseFloat(rating) * 20).toFixed(0)}%</span>
              </div>
              <Progress 
                value={parseFloat(rating) * 20} 
                color="danger"
                className="h-2"
                aria-label="User rating"
              />
            </div>
          )}
        </div>
        
        <div className="text-gray-300 mb-6 leading-relaxed whitespace-pre-line">
          {formatDescription(description)}
        </div>

        <Divider className="my-4" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoRow icon={<FaCalendarAlt />} label="Released" value={released} />
          <InfoRow icon={<FaStar />} label="Rating" value={rating} />
          <InfoRow icon={<FaTags />} label="ESRB Rating" value={esrb_rating?.name || "Not rated"} />
          <InfoRow icon={<FaGamepad />} label="Price" value={price} />
        </div>
      </CardBody>
    </Card>
  );
});

const GameStats = React.memo(({ game }) => {
  const {
    playtime,
    suggestions_count,
    reviews_text_count,
    platforms = [],
    metacritic_platforms = [],
  } = game;

  return (
    <Card className="shadow-lg bg-gray-900 text-white mt-8">
      <CardBody>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <FaGamepad className="text-danger" />
              General Information
            </h3>
            
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-gray-400 mb-1">Playtime</p>
                <div className="text-xl font-bold">{playtime} hours</div>
              </div>
              
              <div>
                <p className="text-gray-400 mb-1">Suggestions</p>
                <div className="text-xl font-bold">{suggestions_count}</div>
              </div>
              
              <div>
                <p className="text-gray-400 mb-1">Reviews</p>
                <div className="text-xl font-bold">{reviews_text_count}</div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <FaGamepad className="text-danger" />
              Platforms & Metacritic Scores
            </h3>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {platforms.map((platformObj, index) => (
                <Chip key={index} variant="flat" className="bg-gray-800">
                  {platformObj.platform.name}
                </Chip>
              ))}
            </div>
            
            {metacritic_platforms.length > 0 && (
              <div className="space-y-3">
                {metacritic_platforms.map((metaObj, index) => {
                  // Determine color based on score
                  let color = "danger";
                  if (metaObj.metascore >= 75) color = "success";
                  else if (metaObj.metascore >= 50) color = "warning";
                  
                  return (
                    <div key={index} className="flex items-center gap-2">
                      <Badge content={metaObj.metascore} color={color}>
                        <Chip className="bg-gray-800">{metaObj.platform?.name || "Platform"}</Chip>
                      </Badge>
                      <Button 
                        as="a"
                        href={metaObj.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        size="sm"
                        className="bg-gray-800 hover:bg-gray-700"
                      >
                        View
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
});

const GameAlternativeNames = React.memo(({ game }) => {
  const { alternative_names = [] } = game;

  if (alternative_names.length === 0) {
    return null;
  }

  return (
    <Card className="shadow-lg bg-gray-900 text-white mt-8">
      <CardBody>
        <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <FaTags className="text-danger" />
          Alternative Names
        </h3>
        <div className="flex flex-wrap gap-2">
          {alternative_names.map((altName, index) => (
            <Chip key={index} className="bg-gray-800" variant="flat">
              {altName}
            </Chip>
          ))}
        </div>
      </CardBody>
    </Card>
  );
});

function FullCardDetail() {
  const { slug } = useParams();
  const { data: game, isLoading, isError } = useGameDetails(slug);
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("info");

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-full bg-gray-900">
        <Spinner color="danger" size="lg" />
        <p className="text-white mt-4 text-xl">Loading game details...</p>
      </div>
    );
  }

  if (isError || !game) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-full bg-gray-900">
        <p className="text-red-500 text-xl">Failed to load game details!</p>
        <Button 
          className="mt-4" 
          color="primary" 
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </div>
    );
  }

  const gameToCart = {
    id: game.id,
    name: game.name,
    price: game.price || "Free",
    quantity: 1,
    background_image: game.background_image,
  };

  // Handle screenshots - if available
  const screenshots = game.screenshots || [];

  return (
    <div className="bg-gray-900 min-h-screen pb-12">
      <NavbarGame />
      <ShoppingCard />
      
      {/* Hero Section with Game Image */}
      <div 
        className="w-full h-[50vh] bg-cover bg-center relative"
        style={{ 
          backgroundImage: `url(${game.background_image || "https://via.placeholder.com/1600x900"})`,
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900 flex items-end">
          <div className="container mx-auto p-8">
            <h1 className="text-5xl font-bold text-white mb-2 drop-shadow-lg">{game.name}</h1>
            {game.released && (
              <p className="text-gray-300 text-xl drop-shadow-lg">
                <FaCalendarAlt className="inline mr-2" />
                {new Date(game.released).getFullYear()}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - 2/3 width on desktop */}
          <div className="col-span-2">
            {/* Navigation Tabs */}
            <div className="flex border-b border-gray-800 mb-6">
              <button 
                onClick={() => setActiveTab("info")}
                className={`px-6 py-3 text-lg ${activeTab === "info" 
                  ? "text-danger border-b-2 border-danger font-bold" 
                  : "text-gray-400 hover:text-white"}`}
              >
                Overview
              </button>
              <button 
                onClick={() => setActiveTab("stats")}
                className={`px-6 py-3 text-lg ${activeTab === "stats" 
                  ? "text-danger border-b-2 border-danger font-bold" 
                  : "text-gray-400 hover:text-white"}`}
              >
                Details & Platforms
              </button>
              <button 
                onClick={() => setActiveTab("links")}
                className={`px-6 py-3 text-lg ${activeTab === "links" 
                  ? "text-danger border-b-2 border-danger font-bold" 
                  : "text-gray-400 hover:text-white"}`}
              >
                Links
              </button>
            </div>
            
            {/* Tab Content */}
            {activeTab === "info" && (
              <GameInfo game={game} />
            )}
            
            {activeTab === "stats" && (
              <>
                <GameStats game={game} />
                <GameAlternativeNames game={game} />
              </>
            )}
            
            {activeTab === "links" && (
              <ExternalLinks
                website={game.website}
                reddit_url={game.reddit_url}
                reddit_name={game.reddit_name}
                reddit_description={game.reddit_description}
                reddit_logo={game.reddit_logo}
                metacritic_url={game.metacritic_url}
              />
            )}
            
            {/* Screenshots - visible on all tabs */}
            {screenshots.length > 0 && (
              <div className="mt-8">
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <FaGamepad className="text-danger" />
                  Screenshots
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {screenshots.slice(0, 4).map((screen, index) => (
                    <img 
                      key={index}
                      src={screen.image} 
                      alt={`${game.name} screenshot ${index+1}`}
                      className="rounded-lg w-full h-auto object-cover hover:opacity-90 transition cursor-pointer"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - 1/3 width on desktop */}
          <div>
            <Card className="shadow-lg bg-gray-800 text-white sticky top-4">
              <CardBody>
                <img
                  className="object-cover rounded-xl w-full h-auto mb-4"
                  src={game.background_image || "https://via.placeholder.com/600"}
                  alt={game.name}
                />

                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold">{gameToCart.price}</span>
                  {game.metacritic && (
                    <Chip 
                      color={game.metacritic >= 75 ? "success" : game.metacritic >= 50 ? "warning" : "danger"}
                      className="font-bold"
                    >
                      {game.metacritic}
                    </Chip>
                  )}
                </div>

                <Button
                  className="w-full mb-3"
                  color="danger"
                  startContent={<FaPlus />}
                  onPress={() => dispatch(addToCart(gameToCart))}
                >
                  Add to Wishlist
                </Button>
                
                <Button
                  className="w-full"
                  color="default"
                  variant="bordered"
                  startContent={<FaHeart />}
                >
                  Add to Favorites
                </Button>
                
                <Divider className="my-6" />
                
                {game.platforms && game.platforms.length > 0 && (
                  <div className="mb-4">
                    <p className="text-gray-400 mb-2">Available on:</p>
                    <div className="flex flex-wrap gap-2">
                      {game.platforms.slice(0, 6).map((platformObj, idx) => (
                        <Chip key={idx} size="sm" variant="flat" className="bg-gray-700">
                          {platformObj.platform.name}
                        </Chip>
                      ))}
                    </div>
                  </div>
                )}
                
                {game.developers && game.developers.length > 0 && (
                  <div className="mb-4">
                    <p className="text-gray-400 mb-1">Developer:</p>
                    <p className="font-medium">{game.developers.map(dev => dev.name).join(', ')}</p>
                  </div>
                )}
                
                {game.publishers && game.publishers.length > 0 && (
                  <div>
                    <p className="text-gray-400 mb-1">Publisher:</p>
                    <p className="font-medium">{game.publishers.map(pub => pub.name).join(', ')}</p>
                  </div>
                )}
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FullCardDetail;
