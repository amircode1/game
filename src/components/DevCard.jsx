import React from "react";
import { Card, CardHeader, CardBody } from "@nextui-org/react";

const DevCard = React.forwardRef(({ id, image_background, name, count, description }, ref) => {
    return (
        <article ref={ref}>
            <Card className="shadow-lg max-w-md mx-auto my-4">
                <CardHeader>
                    <img
                        className="object-cover rounded-t-lg w-full h-72"
                        src={image_background || "https://via.placeholder.com/400"}
                        alt={name}
                    />
                </CardHeader>
                <CardBody>
                    <h3 className="text-2xl font-bold mb-2">{name}</h3>
                    <p className="text-sm text-gray-500 mb-2">Games Count: {count}</p>
                    <p className="text-gray-700 mb-4">{description || "No description available"}</p>
                </CardBody>
            </Card>
        </article>
    );
});

export default DevCard;
