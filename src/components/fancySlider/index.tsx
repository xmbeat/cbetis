import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import MotionBaseSlider from '../MotionBaseSlider';


interface Item {
    title: string;
    backgroundColor: string;
    url: string;
    description: string;
    image: string;
}

interface QueueItem {
    item: Item,
    id: string,
}

interface FancySliderProps {
    items: Item[];
}

interface QueueProps {
    x: number
    y: number
    itemWidth: number
    itemHeight: number
}

const variants = {
    enter:{
        left: '100%',
        opacity: 0
    },
    exit: {
        scale: 1.1,
        opacity: 0
    },
    active: (props: QueueItem) => {
        return {
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            backgroundColor: props.item.backgroundColor,
            scale: 1,
            opacity: 1
        }
    },
    item: (props: { queueProps: QueueProps, index: number, item: Item }) => {

        return {
            left: props.queueProps.x + (props.index * props.queueProps.itemWidth),
            top: props.queueProps.y,
            width: props.queueProps.itemWidth,
            height: props.queueProps.itemHeight,
            backgroundColor: props.item.backgroundColor,
            scale: 1,
            opacity: 1
        }
    },

}

const FancySlider: React.FC<FancySliderProps> = ({ items }) => {
    const containerRef = useRef<HTMLDivElement>(null)
   

    return (
        <div className='w-full h-full relative overflow-hidden' ref={containerRef}>
            <MotionBaseSlider
                items={items}
                changeDistance={60}
                changeThreshold={0.3}
                clickThreshold={0.05}
                transitionDuration={1}
                entranceStyle={{
                    x: items.length * 60,
                    top: '50%',
                    width: 60,
                    height: 40,
                    opacity: 0,
                }}
                exitStyle={{
                    x:0,
                    top:0,
                    width: '100%',
                    height: '100%',
                    opacity: 0,
                    scale: 1.1,
                }}
                itemStyles={(index)=>({
                    x: index * 60,
                    top: '90%',
                    width: 60,
                    height: 40,
                    opacity: 1,
                })}
                itemRenderer={(item)=>(<div className='w-full h-full' style={{backgroundColor: item.backgroundColor}}>
                    {item.title}
                </div>)}
            />
        </div>
    );
};

export default FancySlider;
