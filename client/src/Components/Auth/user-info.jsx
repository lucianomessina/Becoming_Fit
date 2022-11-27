// ESTE ESTABA EN UNA CARPETA AUTH EN COMPONENTS

import React from 'react'
import { useAuth0, User } from '@auth0/auth0-react'
import JSONPretty from 'react-json-pretty'
import 'react-json-pretty/themes/monikai.css'
import { useState } from 'react'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { updateUserProfile, getUserProfileByEmail } from '../../Redux/Actions/UsersActions'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom';
import LoginButton from './LoginButton'
import LogoutButton from './LogoutButton'
import Loading from "../../Utils/Loading.gif";

const Profile = () => {
  const usuarios = useSelector((state) => state.userProfile);
 

  useEffect(() => {
    const data = async () => {
      try {
        if(user){
          await dispatch(getUserProfileByEmail(usuarios.email))
        }
      } catch (error) {
        console.log(error);
      }
    }
    data()
    setTimeout(() => {
    }, 3000)
  }, [])



  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [token, setToken] = useState([]);
  const dispatch = useDispatch();
  const history = useHistory();
  useEffect(() => {
    const generarToken = async () => {
      try {
        if (isAuthenticated === true) {
          user.roles = user ? 'admin' : null
          await dispatch(getUserProfileByEmail(user.email))
        } else {
          console.log("no");
        }
        const tokenApi = await getAccessTokenSilently();
        setToken(tokenApi);
      } catch (error) {
        console.log(error);
      }
      
    }
    generarToken()
  }, [user])
  
  const [isLoading, setIsLoading] = useState(true);

  const [input, setInput] = useState({
    name: "",
    zipCode: "",
    country: "",
    city: "",
    phone: "",
    adress: "",
  });

  function handleChange(e) {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  }

  

  const Cargando = async ()=>{
    setTimeout(() => {
        setIsLoading(false)
        alert('Informacion cargada con exito!')
        setInput({
            name: "",
            zipCode: "",
            adress: "",
            city: "",
            country: "",
            phone: "",
        })
        
    }, 3500)
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !input.name ||
      !input.adress ||
      !input.country ||
      !input.city ||
      !input.zipCode ||
      !input.phone
    ) {
      return alert("Incompletes fields.");
    }
    await dispatch(getUserProfileByEmail(user.email))
     await dispatch(updateUserProfile(usuarios.email, input))
      await Cargando()
    setInput({
      name: "",
      zipCode: "",
      adress: "",
      city: "",
      country: "",
      phone: "",
    });

    
    // alert('Informacion actualizada con exito!')
    // history.push('/profile')
    window.location.reload()
}

useEffect(() => {
  const data = async () => {
    try {
      if(user){
        await dispatch(getUserProfileByEmail(usuarios.email))
      }
    } catch (error) {
      console.log(error)
    }
  }
  data()
  setTimeout(() => {
  }, 3000)
}, [])

  const back = () => {
    history.push('/complete')
  }

  
  setTimeout(() => {
    setIsLoading(false)
  }, 3000)


  return (
    isLoading === true ? <div>
                            <div>
                              <img src={Loading} alt="not found" />
                            </div>
                          </div> 
    :
    isAuthenticated ? <div>
      <form onSubmit={e => handleSubmit(e)}>
        {isAuthenticated ? <LogoutButton /> : <LoginButton />}
        <div>
          <img src={user.picture} alt={user.name} />
        </div>
        <br />
        <div>
          <label>Email:</label>
          <label>{usuarios && Object.values(usuarios)?.length && usuarios.email}:</label>
          <br/>
        </div>
        <div>
          <label>Name:</label>
          <label>
            {usuarios && Object.values(usuarios)?.length && usuarios.name}
          </label>
          <br />
          <input
            value={input.name}
            type="text"
            name="name"
            placeholder="Change your name..."
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Country:</label>
          <label>{usuarios.country}</label>
          <br/>
          <input value={input.country}
            type="text"
            name="country"
            placeholder="Change your country..."
            onChange={handleChange}
          />
        </div>
        <div>
          <label>City:</label>
          <label>{usuarios.city}</label>
          <br/>
          <input value={input.city}
            type="text"
            name="city"
            placeholder="Change your city..."
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Zip Code:</label>
          <label>{usuarios.zipCode}</label>
          <br/>
          <input value={input.zipCode}
            type="number"
            name="zipCode"
            placeholder="Change your zip code..."
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Phone:</label>
          <label>{usuarios.phone}</label>
          <br/>
          <input value={input.phone}
            type="number"
            name="phone"
            placeholder="Change your phone..."
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Adress:</label>
          <label>{usuarios.adress}</label>
          <br/>
          <input
            value={input.adress}
            type="text"
            name="adress"
            placeholder="Change your adress..."
            onChange={handleChange}
          />
        </div>
        <br />
        <br />

        <button onClick={back}>Volver</button>
        <button className="submit1" type="submit">
          Save
        </button>
        <br />
        <label>Info</label>
        <JSONPretty data={user} />
        <label>Token</label>
        <JSONPretty data={token} />
      </form>
    </div>
    :  <h1>Necesitas estar autenticado para ingresar aqui</h1>
  )
};

export default Profile;
