const Input = ({label,onChange,error, setValue,id,type}) => {
    return(
        <div className="mb-3">
        <label className="form-label" htmlFor={id}>{label}</label>
        <input type={type || 'text'} className={`form-control ${error ?'is-invalid' : ""}`} id={id}  onChange={(e) => onChange(e,setValue)}/>
        <p data-testid="error" className={`${error ? 'invalid-feedback' : ""}`}>{error}</p>
        </div>
    )
}

export default Input;