import { createContext } from 'react';
//? Les contextes se créent comme ça, rien d'autre à rajouter
//? Pour détérminer ce qu'il va contenir, ça sera au moment de l'appel du composant, on renseignera l'attribut value avec ce qu'il devrait contenir
const AppContext = createContext(null); 
export default AppContext;