import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const NoMatch:React.FC = () => {

    // Just redirect
    const navigate = useNavigate();
    useEffect(() => {
        navigate("/accueil");
    })
    
    return (
        <></>
    )
}

export default NoMatch