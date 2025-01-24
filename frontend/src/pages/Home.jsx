import React, { useContext } from 'react'
import { Heading } from '../components/heading'
import { Divider } from '../components/divider'
import AuthContext from '../contexts/AuthProvider';



export const Home = () => {
    const { user } = useContext(AuthContext);

    return (
        <>
            <Heading>Home</Heading>
            <Divider className="mt-4" />
            <h1 
            className='text-white mt-8'
            >
            Good morning, {user?.name}! Welcome back. Let's make today productive. Here are your tasks and notifications.
            </h1>
        </>
    )
}
