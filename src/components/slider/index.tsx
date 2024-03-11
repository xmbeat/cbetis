import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { MdNavigateBefore, MdNavigateNext } from 'react-icons/md';

interface SliderProps {
    children: React.ReactNode[];
}

const Slider: React.FC<SliderProps> = ({ children }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [startX, setStartX] = useState<number | null>(null);
    const [endX, setEndX] = useState<number|null>(null)
    const containerRef = useRef<HTMLDivElement>(null);

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? children.length - 1 : prevIndex - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex === children.length - 1 ? 0 : prevIndex + 1));
    };

    const handleSwipeStart = (event: any) => {
        if (containerRef.current) {
            setStartX(event instanceof TouchEvent ? event.touches[0].clientX : event.clientX);
            setEndX(null)
        }
    };

    const handleSwipeMove = (event: any) => {
        if (startX === null) return;
        let currentX;
        if (event instanceof TouchEvent) {
            currentX = event.touches[0].clientX;
        } else {
            currentX = event.clientX;
            if ((event.buttons & 1 )== 0){
                setStartX(null)
                setEndX(null)
                return
            }
        }
        setEndX(currentX)
    
    };
    
    const handleSwipeEnd = (event: any) => {
        if (startX === null) return;
    
        let currentX;
        if (event instanceof TouchEvent) {
            currentX = event.changedTouches[0].clientX;
        } else {
            currentX = event.clientX;
        }
    
        const containerWidth = containerRef.current?.offsetWidth || 0;
        const difference = startX - currentX;
        const movementThreshold = containerWidth * 0.2; // Umbral de movimiento (20% del ancho del contenedor)
    
        if (Math.abs(difference) > movementThreshold) {
            // Movimiento suficiente para cambiar de diapositiva
            if (difference > 0) {
                handleNext(); // Cambiar a la siguiente diapositiva
            } else {
                handlePrev(); // Cambiar a la diapositiva anterior
            }
        }
    
        setStartX(null); // Reiniciar startX
        setEndX(null)
    };
    
    const getStyle:any = (index:number)=>{
        let percentageMoved = 0;
        if (startX != null && endX !=null){
            const difference = endX - startX;
            const containerWidth = containerRef.current?.offsetWidth || 0;
            percentageMoved = (difference / containerWidth) * 100;
        }
        
        if (index == currentIndex){
            return {
                left: percentageMoved+'%',
                top: 0,
                width: '100%',
                height: '100%',
            }
        }
        return {
            left: `${100 * (index- currentIndex) + percentageMoved}%`,
            top: 0,
            width: '100%',
            height: '100%'
        }
    }
    
    return (
        <div
            className="w-full h-full relative select-none"
            ref={containerRef}
            onMouseDown={handleSwipeStart}
            onMouseMove={handleSwipeMove}
            onMouseUp={handleSwipeEnd}
            onTouchStart={handleSwipeStart}
            onTouchMove={handleSwipeMove}
            onTouchEnd={handleSwipeEnd}
        >
            <div className="flex overflow-hidden relative w-full h-full">
                {children.map((child, index)=>{
                    return <motion.div key={index} 
                        style={getStyle(index)}  
                        animate={getStyle(index)} 
                        transition={startX!=null?{duration:0}:{duration:0.3}} 
                        className='absolute'
                    >
                        {child}
                    </motion.div>
                })}
            </div>

            <div className="flex justify-center items-center text-primary-color gap-2 absolute z-10 bottom-2 left-1/2 -translate-x-1/2">
                <div className="text-4xl cursor-pointer" onClick={handlePrev}>
                    <MdNavigateBefore />
                </div>
                {children.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-3 h-3 rounded-full cursor-pointer border-none outline-none transition ease-in-out duration-250`}
                        style={{
                            backgroundColor: currentIndex === index ? 'var(--primary-color)' : 'var(--btn-disabled-bg)',
                        }}
                    />
                ))}
                <div className="text-4xl cursor-pointer" onClick={handleNext}>
                    <MdNavigateNext />
                </div>
            </div>
        </div>
    );
};

export default Slider;
