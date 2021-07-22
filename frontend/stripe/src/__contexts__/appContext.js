import {createContext} from "react"
//? Les contextes se créent de la manière comme suit
//? Pour détérminer ce qu'il va contenir, ça se fera  au moment de l'appel du composant: https://fr.reactjs.org/docs/context.html#contextprovider
//? on renseignera sa prop / son attribut value avec ce qu'il devrait contenir (exemple le state globale de l'application)
//? https://fr.reactjs.org/docs/context.html#reactcreatecontext
export const appContext = createContext(null);