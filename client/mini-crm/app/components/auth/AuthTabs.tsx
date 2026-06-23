'use client'
import {useState} from "react";
import {Tabs} from '@/src/components/molecules/Tabs'
import {usePathname} from "next/navigation";
import {useRouter} from "next/navigation";

const AuthTabs = () => {
    const activeTab = usePathname();
    const router = useRouter();


    return (
        <Tabs
            tabs={[
                {id:'/register',label:'Register',},
                {id:'/login',label:'Login',},
            ]}
            activeTab={activeTab}
            onChange={router.push}
        />
    )
}
export default AuthTabs;