import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './styles.module.scss';

const variants = {
    tiny:{
        scale:0, 
        opacity: 1
    },
    grow:{
        scale:1,
        opacity: 0.5,
        transition:{
            duration: 0.3
        }
    },
    hide:{
        scale:1,
        opacity: 0,
        transition:{
            duration: 0.2
        }
    }
};


export default function PressEffect() {
    const [circles, setCircles] = useState<{ id: number, style: any }[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const parent = containerRef.current;

        const handleMouseDown = (event: any) => {
            const rect = event.target.getBoundingClientRect();
            const offsetX = event.clientX - rect.left - rect.width;
            const offsetY = event.clientY - rect.top - rect.width;

            const newCircle = {
                id: Date.now(),
                style: { x: offsetX, y: offsetY, width: rect.width * 2, height: rect.width * 2 }
            };

            setCircles(prevCircles => [...prevCircles, newCircle]);
        };

        parent?.addEventListener('mousedown', handleMouseDown);

        return () => {
            parent?.removeEventListener('mousedown', handleMouseDown);
        };
    }, []);

    const handleAnimationComplete = (id: number) => {
        setCircles(prevCircles => prevCircles.filter(circle => circle.id !== id));
    };

    return (
        <div ref={containerRef} className={styles.container}>
            <div className={styles.effectContainer}>
                <AnimatePresence>
                    {circles.map(circle => (
                        <motion.div
                            key={circle.id}
                            className={styles.circle}
                            style={circle.style}
                            initial={variants.tiny}
                            variants={variants}
                            animate="grow"
                            exit="hide"
                            onAnimationComplete={() => handleAnimationComplete(circle.id)}
                        ></motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};
