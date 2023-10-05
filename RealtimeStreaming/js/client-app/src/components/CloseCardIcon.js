import { BsXSquareFill } from "react-icons/bs";

export const CloseCardIcon = (props) => {
    const { onClick } = props;

    return (
        <BsXSquareFill
            className='h5 ml-2 mt-2'
            onClick={onClick}
        />
    )
};
