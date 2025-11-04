import { useTranslations } from "next-intl";


interface IProps{
    label: string;
    isActive: boolean;
    onClick: () => void;
    count: number;
}
const TabButton = ({ label, isActive, onClick, count }: IProps) => {
    const t = useTranslations();
    const baseStyle = "py-3 px-4 font-medium text-sm md:text-base rounded-t-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50";
    const activeStyle = "border-b-2 border-primary text-primary bg-white";
    const inactiveStyle = "text-gray-500 hover:text-gray-700 hover:bg-gray-50";

    return (
        <button
            className={`${baseStyle} ${isActive ? activeStyle : inactiveStyle}`}
            onClick={onClick}
        >
            {t(label)}
            <span className={`ml-2 text-xs font-semibold px-2 py-0.5 rounded-full ${isActive ? 'bg-primary/10 text-primary' : 'bg-gray-200 text-gray-600'}`}>
                {count}
            </span>
        </button>
    );
};

export default TabButton