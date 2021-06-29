import "./../App.css"
import CustomLink from "./CustomLink";
const CustomNavbar = () => {
    
    return (
        <nav className="mt-3 mx-auto flex justify-evenly font-bold container text-white">
            <CustomLink path='/'> Home </CustomLink>
            <CustomLink path='/payment-success'> Success </CustomLink>
            <CustomLink path='/payment-cancel'> Cancel </CustomLink>
            <CustomLink path='/checkout-form'> Checkout Form </CustomLink>
            <CustomLink path='/login'> Login </CustomLink>
        </nav>
    )
}
export default CustomNavbar;