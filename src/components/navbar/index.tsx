'use client'
import Image from "next/image";
import MaxWidthContainer from "../maxWidthContainer";
import GlobalMenu from "../globalMenu";
import { MENU_LIST } from "@/lib/constants";
import { useEffect, useState } from "react";
import styles from './styles.module.scss'
export default function Navbar() {
    const [big, setBig] = useState(true)
    useEffect(() => {
        const scrollListener = () => {
            setBig(window.scrollY < 20 )
        }
        window.addEventListener('scroll', scrollListener)
        scrollListener();
        return () => window.removeEventListener('scroll', scrollListener)
    }, [])
    return (
        <nav 
            className={`${styles.navbar} ${big?styles.big:''}`} 
        >
            <MaxWidthContainer className="flex h-full w-full px-2 py-2 gap-10 justify-between items-center">
                <div className="logo relative" 
                    style={{
                        height: big?'70px':'50px' , transition: 'all ease-in-out 300ms',
                        width: big?'70px':'50px' ,
                        minHeight: big?'70px':'50px' ,
                        minWidth: big?'70px':'50px' ,
                    }}
                >
                    <Image priority={true} src={'/images/logo.png'} alt="Logo" 
                    sizes="(max-width: 768px) 50px, 70px"
                    fill={true} style={{ objectFit: 'contain' }} />
                </div>
                <GlobalMenu items={MENU_LIST} />
            </MaxWidthContainer>
        </nav>)
}