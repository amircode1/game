import { Card, CardHeader, CardBody, Button } from "@nextui-org/react";
import { useState } from "react";
import { FaPlus } from 'react-icons/fa';
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { addToCart } from "../store/shoppingCardSlice";


function CardGame(props) {
    const [hover, setHover] = useState(false);
    const dispatch = useDispatch();

    const backgroundImage = props.background_image || "https://via.placeholder.com/270x200";
    return (
        <Card
            key={props.id}
            className="py-4 pb-2 min-w-[230px] max-w-[300px] border-2 border-transparent hover:border-red-500 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg"
            style={{ minWidth: "230px", height: "368px", maxWidth: "300px" }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <CardHeader className="pb-0 pt-2 flex-col items-start">
                <img
                    className="object-cover rounded-xl min-w-[230px] w-[280px] h-[200px]"
                    src={backgroundImage}
                />
            </CardHeader>
            <CardBody className="overflow-visible py-2 pb-2">
                <h4 className="font-bold text-large truncate">{props.name}</h4>
                <small className="text-default-500">{props.released || "Release date unknown"}</small>
                <h4 className="text-default-900 uppercase font-bold">{props.price || "Free"}</h4>
                <Button
                    className="absolute bottom-2 right-2"
                    isIconOnly
                    color="danger"
                    variant="ghost"
                    style={{ color: hover ? 'white' : 'red' }}
                    onClick={() => dispatch(addToCart(props))}
                >
                    <FaPlus />
                </Button>
                <p className="text-default-700 font-sans">{props.rating || "No rating"} ⭐</p>
                <Link to={`/games/${props.slug}`} className="font-sans text-red-500">
                    View more...
                </Link>
            </CardBody>
        </Card>
    );
}

export default CardGame;