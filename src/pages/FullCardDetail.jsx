import { useParams } from "react-router-dom";
import { useGameDetails } from "./../hooks/useQueries";
import { Spinner, Card, CardHeader, CardBody, Button } from "@nextui-org/react";
import { FaPlus } from "react-icons/fa";
import NavbarGame from "../components/Navbar";
import ShoppingCard from "../components/ShoppingCard";
import { addToCart } from "../store/shoppingCardSlice";

function FullCardDetail() {
    const { slug } = useParams();
    const { data: game, isLoading, isError } = useGameDetails(slug);

    if (isLoading) {
        return <Spinner className="h-screen w-screen" label="Loading game details..." color="danger" size="3xl" />;
    }

    if (isError || !game) {
        return <p className="text-red-500">Error loading game details!</p>;
    }

    const {
        id,
        name,
        description = "No description available.",
        released = "Unknown release date",
        background_image,
        rating = "No rating available",
        platforms = [],
        price = "Free",
        esrb_rating,
        metacritic,
        metacritic_platforms = [],
        playtime,
        suggestions_count,
        reviews_text_count,
        website,
        reddit_url,
        reddit_name,
        reddit_description,
        reddit_logo,
        metacritic_url,
        alternative_names = [],
    } = game;

    const gameToCart = {
        id, 
        name,
        price, 
        quantity: 1,
        background_image
    };

    return (
        <>
            <NavbarGame />
            <ShoppingCard />
            <div className="container mx-auto p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="image-section">
                        <Card className="shadow-lg p-4">
                            <CardHeader>
                                <img
                                    className="object-cover rounded-xl w-full h-[600px] md:h-[800px]"
                                    src={background_image || "https://via.placeholder.com/600"}
                                    alt={name}
                                />
                            </CardHeader>
                        </Card>
                    </div>

                    <div className="info-section">
                        <Card className="shadow-lg p-4">
                            <CardBody key={id}>
                                <h2 className="text-4xl font-bold mb-4">{name}</h2>
                                <p className="text-gray-500 mb-4">{description}</p>
                                <p className="text-gray-500 mb-2">Released: {released}</p>
                                <p className="text-gray-500 mb-2">Rating: {rating}</p>
                                <p className="text-gray-500 mb-2">ESRB Rating: {esrb_rating?.name || "Not rated"}</p>
                                <p className="text-gray-500 mb-2">Metacritic Score: {metacritic || "Not available"}</p>
                                <p className="text-gray-500 mb-2">Price: {price}</p>

                                <Button
                                    className="mt-6"
                                    icon={<FaPlus />}
                                    color="danger"
                                    variant="ghost"
                                    style={{ color: 'red' }}
                                    onClick={() => dispatch(addToCart(gameToCart))}
                                >
                                    Add to Wishlist
                                </Button>
                            </CardBody>
                        </Card>
                    </div>
                </div>

                <div className="mt-10">
                    <Card className="shadow-lg p-6">
                        <CardBody>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-2xl font-bold mb-4">General Information</h3>
                                    <p className="text-gray-500 mb-2">Playtime: {playtime} hours</p>
                                    <p className="text-gray-500 mb-2">Suggestions: {suggestions_count}</p>
                                    <p className="text-gray-500 mb-2">Reviews: {reviews_text_count}</p>

                                    <h3 className="text-2xl font-bold mb-4">Alternative Names</h3>
                                    {alternative_names.length > 0 ? (
                                        <ul className="list-disc list-inside">
                                            {alternative_names.map((altName, index) => (
                                                <li key={index} className="text-gray-500">{altName}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-gray-500">No alternative names available.</p>
                                    )}
                                </div>

                                <div>
                                    <h3 className="text-2xl font-bold mb-4">Platforms & Metacritic Scores</h3>
                                    <ul className="list-disc list-inside">
                                        {platforms.map((platformObj, index) => (
                                            <li key={index} className="text-gray-500">
                                                {platformObj.platform.name}
                                            </li>
                                        ))}
                                    </ul>
                                    {metacritic_platforms.length > 0 && (
                                        <ul className="list-disc list-inside mt-4">
                                            {metacritic_platforms.map((metaObj, index) => (
                                                <li key={index} className="text-gray-500">
                                                    Metascore: {metaObj.metascore} - <a href={metaObj.url} className="text-blue-500 underline">Link</a>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>

                            <div className="mt-6">
                                <h3 className="text-2xl font-bold mb-4">External Links</h3>
                                <p>
                                    Official Website:{" "}
                                    <a href={website} className="text-blue-500 underline">{website}</a>
                                </p>
                                {reddit_url && (
                                    <>
                                        <h4 className="text-xl font-bold mt-4">Reddit:</h4>
                                        <a href={reddit_url} className="text-blue-500 underline">
                                            {reddit_name || "Visit Reddit"}
                                        </a>
                                        <p>{reddit_description}</p>
                                        {reddit_logo && <img src={reddit_logo} alt="Reddit Logo" className="mt-4 w-16 h-16" />}
                                    </>
                                )}
                                {metacritic_url && (
                                    <p className="mt-4">
                                        Metacritic:{" "}
                                        <a href={metacritic_url} className="text-blue-500 underline">
                                            {metacritic_url}
                                        </a>
                                    </p>
                                )}
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </>
    );
}

export default FullCardDetail;
