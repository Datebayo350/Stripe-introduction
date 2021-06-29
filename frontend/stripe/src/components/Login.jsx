import {Field, FieldSet} from "./CustomComponents"
import {useHistory} from "react-router-dom"
import {useState} from "react"
import "./../App.css"

const Login = () => {
    
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const history = useHistory();

    const handleSubmit = (event) => {
        event.preventDefault();

        const USERNAME = "admin";
        const EMAIL = "admin@admin.com";

        userName === USERNAME && email === EMAIL ? history.push("/") : console.log("Incorect credentials");

    };
    return (
        //? Dans un premier temps ça sera un formulaire de connexion
        <form onSubmit={handleSubmit} className=" overflow-auto  container mx-auto my-60 w-5/12 p-20 flex-direction-column">
            
            <FieldSet>
                <Field type="text" nameId="username" placeholder="Jean" valueFromState={userName} onChange={ (e) => setUserName(e.target.value) }>
                    Nom d'utilisateur :
                </Field>
                <Field type="email" nameId="email" placeholder="jean@gmail.com" valueFromState={email} onChange={ (e) => setEmail(e.target.value) }>
                    Email : 
                </Field>
            </FieldSet>

            <button type="submit" className="p-3 w-full mt-10 justify-self-center button shadow-2xl rounded-md font-bold text-white"> Connexion </button>
            
        
        </form>
    );
}

export default Login;