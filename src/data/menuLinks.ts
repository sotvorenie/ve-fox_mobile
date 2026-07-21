import {Menu} from "@/types/menu";

import HomeIcon from "@icons/HomeIcon";
import HistoryIcon from "@icons/HistoryIcon";
import LikeIcon from "@icons/LikeIcon";
import LaterIcon from "@icons/LaterIcon";

const menuItems: Menu[] = [
    {
        title: 'Главная',
        icon: HomeIcon,
    },
    {
        title: 'История',
        icon: HistoryIcon,
    },
    {
        title: 'Понравившиеся',
        icon: LikeIcon,
    },
    {
        title: 'Смотреть позже',
        icon: LaterIcon,
    },
]

export default menuItems