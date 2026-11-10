import { Card, CardBody, Button, Chip } from "@nextui-org/react";
import { useState } from "react";
import { FaPlus, FaCheck, FaCalendarAlt, FaGamepad } from 'react-icons/fa';
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { addToCart } from "../store/shoppingCardSlice";

function CardGame(props) {
    const [added, setAdded] = useState(false);
    const dispatch = useDispatch();

    const id = props.id;
    const name = props.name ?? props.title;
    const image = props.background_image ?? props.thumbnail;
    const released = props.released ?? props.release_date;
    const genre = props.genre;
    const platform = props.platform;
    const price = props.price ?? "Free";

    const backgroundImage = image || "https://via.placeholder.com/400x225?text=No+Image";

    const cartItem = {
        id,
        name,
        price,
        background_image: backgroundImage,
    };

    const handleAddToCart = () => {
        dispatch(addToCart(cartItem));
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1500);
    };

    return (
        <Card
            className="group w-full max-w-[320px] border border-white/5 bg-[#1b1b1f] hover:border-red-500/60 transition-all duration-300 ease-out shadow-lg hover:shadow-red-500/10 hover:-translate-y-1 overflow-hidden"
        >
            {/* Image with hover overlay */}
            <Link to={`/games/${id}`} className="relative block overflow-hidden aspect-[16/10]">
                <img
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                    src={backgroundImage}
                    alt={name}
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1b1b1f] via-[#1b1b1f]/20 to-transparent" />
                <div className="absolute top-2 left-2 flex gap-1">
                    {genre && (
                        <Chip size="sm" className="bg-black/70 backdrop-blur-sm text-white border border-white/10">
                            {genre}
                        </Chip>
                    )}
                </div>
                <div className="absolute top-2 right-2">
                    <Chip size="sm" color="success" variant="flat" className="bg-black/70 backdrop-blur-sm font-bold">
                        {price}
                    </Chip>
                </div>
            </Link>

            <CardBody className="gap-2 p-4">
                <Link to={`/games/${id}`} className="block">
                    <h4 className="font-bold text-lg text-white leading-snug line-clamp-1 group-hover:text-red-400 transition-colors">
                        {name}
                    </h4>
                </Link>

                <div className="flex items-center gap-3 text-xs text-gray-400">
                    {released && (
                        <span className="flex items-center gap-1">
                            <FaCalendarAlt className="text-[10px]" />
                            {released}
                        </span>
                    )}
                    {platform && (
                        <span className="flex items-center gap-1 truncate">
                            <FaGamepad className="text-[10px]" />
                            {platform}
                        </span>
                    )}
                </div>

                <div className="flex items-center justify-between mt-1 pt-3 border-t border-white/5">
                    <Link
                        to={`/games/${id}`}
                        className="text-sm font-semibold text-red-500 hover:text-red-400 transition-colors"
                    >
                        View details →
                    </Link>
                    <Button
                        isIconOnly
                        size="sm"
                        color={added ? "success" : "danger"}
                        variant={added ? "solid" : "flat"}
                        aria-label={added ? "Added to cart" : "Add to cart"}
                        onPress={handleAddToCart}
                        className="transition-all"
                    >
                        {added ? <FaCheck /> : <FaPlus />}
                    </Button>
                </div>
            </CardBody>
        </Card>
    );
}

export default CardGame;
