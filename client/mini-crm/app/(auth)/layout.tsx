"use client"

import AuthTabs from '../components/auth/AuthTabs'
import {Typography} from "@/src/components/atoms/Typography";
import {FiCheckCircle} from "react-icons/fi";
interface advantage {
    id:number,
    name: string,
}
const AuthLayout = ({children}) => {
    const advantagesList = [
        {id:1,title:'Unified contacts, notes & pipeline'},
        {id:2,title:'Tasks that sync with every deal'},
        {id:3,title:'Built for teams that move fast'},
    ]
    return(
    <div className='h-full mx-0 my-auto'>
        <div className='grid grid-rows-1 md:grid-cols-2 place-items-center gap-y-4 '>
            <div className='h-full  place-self-center flex flex-col justify-around  max-w-100'>
                <Typography
                    as='h1'>
                    The CRM that feels like it was made for you.
                </Typography>
                <Typography
                    as='p'
                >Manage relationships, capture every conversation, and keep work moving — all from one beautifully fast workspace.
                </Typography>
                <ul>
                    {advantagesList.map(advantage => (
                        <li className='flex items-center gap-x-3'
                            key={advantage.id}>
                            <FiCheckCircle/>
                            <p>{advantage.title}</p>
                        </li>
                    ))}
                </ul>

            </div>
            <div className="w-full max-w-full  md:max-w-125  px-10  ">
                <AuthTabs
                />
                {children}
            </div>
        </div>
    </div>

    )
}

export default AuthLayout;