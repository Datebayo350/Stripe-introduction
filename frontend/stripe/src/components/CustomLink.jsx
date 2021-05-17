import "./../App.css" 
import {NavLink} from "react-router-dom";

const CustomLink = (props) => {
    const {path, children} = props;
    return (
        <NavLink className="p-2 rounded-xl border-double shadow-md" exact to={path}> {children} </NavLink>
    )
}

export default CustomLink;