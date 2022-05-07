import React, {useState} from 'react'
import axios from 'axios';
import Input from "../components/Input";
import {useTranslation} from "react-i18next";



const SignUpPage = () => {
  
    const [username, setUsername] =useState("");
    const [email,setEmail] =useState("");
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [apiProgress, setApiProgress] = useState(false)
    const [signup, setSignup] = useState(false);
    const [errors, setErrors] = useState({});

    const {t}= useTranslation()

    const submitHandler =  async (e) => {
      e.preventDefault();
      const body ={
        username: username,
    email:email,
password: password,

      }
      setApiProgress(true);
      try{
       await axios.post(" /api/1.0/users", body)
       setSignup(true);
      }
      catch(err){
        if(err.response.status === 400){
          setErrors( err.response.data.validationErrors);
        } 
        setApiProgress(false);
      }
      
      
      
      }

    const onChangeInput = (e, setState) => {
      const {id, value} = e.target
      const errorsCopy = {...errors};
      delete errorsCopy[id];
      setErrors(errorsCopy);
        
        setState(value)


    }
  
const handleDisabled = () => {
  if(password === confirmPassword && password.length > 0 )return false;

  return true;
}

const passwordMismatch = () => {
  return password !== confirmPassword ? "Password mismatch" : ""
}



  return (
      <div className="col-lg-6 offset-lg-3 col-md-8 offset-md-2">
{!signup &&  <form data-testid="form-signUp" className="card mt-5" onSubmit={(e) => submitHandler(e)}>
  <div className="card-header">
  <h1 className="text-center">{t('signUp')}</h1>

  </div>
<div className="card-body">

 <Input label="Username" id="username" error={errors.username} setValue={setUsername} onChange={onChangeInput}/>
 <Input label="Email" id="email" error={errors.email} setValue={setEmail} onChange={onChangeInput}/>
 <Input type="password" label="Password" id="password" error={errors.password} setValue={setPassword} onChange={onChangeInput}/>
 <Input type="password" label="Confirm password" id="passwordconfirm" error={passwordMismatch()} setValue={setConfirmPassword} onChange={onChangeInput}/>
  
  <div className="text-center">
  <button className="btn btn-primary"type="submit"  disabled={handleDisabled() || apiProgress} >{apiProgress ? <div className="d-flex p-2"><span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>Loading...</div>
 : "Sign Up"}</button>
</div>

  </div>
  </form>}
   {signup && <div className="alert alert-sucess mt-3">Please check your email to activate your account</div>}
      </div>
  
  )
}


export default SignUpPage