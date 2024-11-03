import { Tooltip} from "@nextui-org/react";
import { TbBrandAppleArcade } from "react-icons/tb";
import { GiHeadshot, GiPistolGun, GiZeusSword } from "react-icons/gi";
import { PiStrategyDuotone } from "react-icons/pi";
import { Link, useNavigate } from "react-router-dom";

function Category() {

  const navigate = useNavigate();
  const handleNavigation = (path) => {
    navigate(path); 
};

  const ListboxWrapper = ({children}) => (
    <div className="w-[200px] dark border-small rounded-small">
      {children}
    </div>
  );

  return (
    <Tooltip 
        closeDelay={100}
        className="flex flex-col gap-2 dark"
        content={
        <ListboxWrapper>
            <section 
            className="p-2 flex flex-col gap-2 text-medium"
            aria-label="Game Category"
            variant="flat"
            >
            <Link 
                className="text-white flex justify-between hover:bg-default-200 items-center rounded-small p-2" 
                to={"/category/action"} >Action<GiHeadshot className="text-3xl"/></Link>
            <Link 
                className="text-white flex justify-between hover:bg-default-200 items-center rounded-small p-2" 
                to={"/category/arcade"} >Arcade<TbBrandAppleArcade className="text-3xl"/></Link>
            <Link 
                className="text-white flex justify-between hover:bg-default-200 items-center rounded-small p-2" 
                to={"/category/role-playing-games-rpg"} >RPG<GiZeusSword className="text-3xl"/></Link>
            <Link 
                className="text-white flex justify-between hover:bg-default-200 items-center rounded-small p-2" 
                to={"/category/shooter"} >Shooter<GiPistolGun className="text-3xl"/></Link>
            <Link 
                className="text-white flex justify-between hover:bg-default-200 items-center rounded-small p-2" 
                to={"/category/strategy"} >Strategy<PiStrategyDuotone className="text-3xl"/></Link>
            </section>
        </ListboxWrapper>
    }>
        <div
        className="text-white hover:text-red-500 cursor-pointer"
        onClick={() => handleNavigation("/category")}
      >
        Category
      </div>
    </Tooltip>
  );
}

export default Category;