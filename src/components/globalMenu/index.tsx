'use client'
import Popup from '@/components/popup';
import styles from './styles.module.scss'
import { useCallback, useEffect, useState } from "react";
import NavigableMenu from '../navigableMenu';

export interface IMenuItem{
    name: string,
    url: string,
    submenu?: null | IMenuItem[]
}


export default function GlobalMenu({ items }: {items:IMenuItem[]}) {
    const [visibleArray, setVisibleArray] = useState<boolean[]>(items.map(()=>false))

    const handleMouseEnter = (index:Number)=>{
        setVisibleArray(items.map((item, i)=>index == i))
    }

    const handleMouseLeave = (index:Number)=>{
        setVisibleArray(visibleArray.map((val, i)=>i == index? false: val))
    }
    
    return <div className={`flex h-full uppercase font-semibold  text-nav-text relative ${styles.menu}`}>
        <ul className='flex items-center'>
            {items.map((item, index) => 
                <li key={item.name} className='relative bg-nav-item hover:bg-nav-item-hover-bg' 
                    onMouseEnter={()=>handleMouseEnter(index)}  
                    onMouseLeave={()=>handleMouseLeave(index)}>
                    <a href={item.url} className='px-6 py-2 block'>{item.name}</a>
                    {item.submenu && <Popup isOpen={visibleArray[index]} onClose={()=>{handleMouseLeave(index)}} desiredWidth='auto' desiredAlign='left'> 
                        <div className='text-sm'>
                            <NavigableMenu items={item.submenu}/>
                        </div>
                    </Popup>}
                </li>
            )}
        </ul>
    </div>
}