//? Exemple d'import / export : https://github.com/mdn/js-examples/tree/master/modules/module-objects

export const Field = (props) => {
    const {type, name, placeholder, value, onChange, id, children} = props;
    
    return (
        <div className=" p-2 pt-0 pl-0 border-b border-red-800 border-opacity-25 flex mt-0"> 
            <label htmlFor={name} className="m-2 text-red-50 font-bold flex-none"> {children} </label>
            <input type={type} name={name} id={id} placeholder={placeholder} value={value} onChange={onChange} className="border-none focus:outline-none text-white font-bold bg-transparent placeholder-red-100 flex-grow"/>
        </div>
    )
}

export const FieldSet = (props) => {
    const {children, plus} = props;
    
    return (
        <fieldset className={`${plus} container p-2 h-22 rounded-md d-flex shadow-2xl custom-bg`}> {children} </fieldset>
    )
}
