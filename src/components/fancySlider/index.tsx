import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import MotionBaseSlider from '../MotionBaseSlider';
import { Oswald, Poppins } from 'next/font/google';
import styles from './styles.module.scss'
import Image from 'next/image';
import Button from '../Button';
const font = Oswald({
    weight: ['400', '500', '600'],
    subsets: ["latin"]
})
const poppins = Poppins({
    weight: ['300', '400', '500', '600', '800'],
    subsets: ["latin"]
});
interface Item {
    title: string;
    backgroundColor: string;
    url: string;
    description: string;
    image: string;
}
interface FancySliderProps {
    items: Item[];
}

const card: Variants = {
    initial: {
        width: 0
    },
    show: {
        width: '100%',
        transition: {
            duration: 0,
            delayChildren: 0.5
        }
    },
    exit: {
        opacity: 0
    }
}

const cardData: Variants = {
    initial: {
        width: '40%',
        opacity: 0
    },
    show: {
        opacity: 1,
        transition: {
            duration: 0,
            staggerChildren: 0.3
        },
    }
}
const fromBottom: Variants = {
    initial: {
        opacity: 0,
        y: 40
    },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.3 }
    }
}

const FancySlider: React.FC<FancySliderProps> = ({ items }) => {
    const containerRef = useRef<HTMLDivElement>(null)

    return (
        <div className={`${font.className} w-full h-full relative overflow-hidden text-slate-100`} ref={containerRef}>
            <MotionBaseSlider
                items={items}
                changeDistance={180}
                changeThreshold={0.3}
                clickThreshold={0.05}
                transitionDuration={0.5}
                entranceStyle={{
                    x: (items.length - 1) * 180,
                    top: '40%',
                    width: 180,
                    height: 200,
                    opacity: 0.2,
                    scale: 0.2,
                    zIndex: 0
                }}
                exitStyle={{
                    x: 0,
                    top: 0,
                    width: '100%',
                    height: '100%',
                    opacity: 0.7,
                    scale: 1.3,
                    zIndex: 0,
                }}
                itemStyles={(index) => {
                    if (index == 0) {
                        return {
                            x: 0,
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            opacity: 1,
                            scale: 1,
                            zIndex: index + 1,
                            borderRadius: '0em'
                        }
                    }
                    else {
                        return {
                            x: (index - 1) * 200,
                            top: '40%',
                            left: '40%',
                            width: 180,
                            height: 200,
                            opacity: 1,
                            scale: 1,
                            boxShadow: '10px 10px 10px #00000066',
                            zIndex: index + 1,
                            borderRadius: '0.4em',
                            overflow: 'hidden'
                        }
                    }
                }}
                itemRenderer={(item, index, sizeCanvas, progress) => (
                    <motion.div className={`${styles.item} ${index == 0 ? styles.active : ''}`}>
                        <div className={styles.image}>
                            <Image src={item.image} alt={item.title} fill style={{ objectFit: 'cover' }} />
                        </div>
                        <div className={styles.overlay}></div>

                        <AnimatePresence>
                            {index == 0 && progress == 0 && <motion.div key={'full'} className={`${styles.card}`}
                                variants={card}
                                initial="initial"
                                animate="show"
                                exit="exit"

                            >
                                <motion.div className={styles.cardData}
                                    variants={cardData}
                                    custom={{ width: sizeCanvas.width }}
                                >
                                    <div className={styles.pre}>
                                    </div>

                                    {item.title.split(' ').map((word: string, index: number) => (
                                        <div className={styles.title} key={index}>
                                            <motion.div variants={fromBottom}>
                                                {word}
                                            </motion.div>
                                        </div>))}
                                    <motion.div className={`${poppins.className} ${styles.description}`}
                                        variants={fromBottom}
                                    >
                                        {item.description}
                                    </motion.div>
                                    <motion.div className={`${poppins.className} pt-3`} variants={fromBottom}>
                                        <Button>Pre inscribirme</Button>
                                    </motion.div>
                                </motion.div>
                            </motion.div>}
                            {index != 0 && <motion.div className={styles.mini}>
                                <div className={styles.title}>
                                    {item.title}
                                </div>
                            </motion.div>}
                        </AnimatePresence>

                    </motion.div>)}
            />
        </div>
    );
};

export default FancySlider;
