import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';


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
    const [queue, setQueue] = useState<QueueItem[]>(items.map<QueueItem>((item, index) => ({ id: String(index), item })));
    const [queueProps, setQueueProps] = useState<QueueProps>({ itemHeight: 0, itemWidth: 0, x: 0, y: 0 })
    const [active, setActive] = useState<QueueItem | null>(null)
    const last: QueueItem | null = queue.length ? queue[queue.length - 1] : null;
    // Function to handle click on an element in the queue
    const handleItemClick = (index: number) => {
        const selectedItem = queue[index];
        const newQueue = [...queue];
        newQueue.splice(index, 1)
        if (active) {
            newQueue.push({
                id: String(Date.now()),
                item: active.item
            })

        }
        setActive(selectedItem)
        setQueue(newQueue);
    };

    useEffect(() => {
        const handleResize = () => {
            const container = containerRef.current;
            if (container) {
                const rect = container.getBoundingClientRect();
                setQueueProps({
                    x: rect.width * 0.5,
                    y: rect.height * 0.5,
                    itemWidth: rect.width * 0.2,
                    itemHeight: rect.height * 0.2
                })
            }
        };

        const resizeObserver = new ResizeObserver(handleResize);
        const container = containerRef.current;

        if (container) {
            resizeObserver.observe(container);
            handleResize(); // Call it initially
        }

        return () => {
            if (container) {
                resizeObserver.unobserve(container);
            }
        };
    }, []);

    const handleMouseDown = (event: any,index:number)=>{

    }

    const handleMouseUp = (event:any, index:number)=>{

    }

    return (
        <div className='w-full h-full relative overflow-hidden' ref={containerRef}>

            <AnimatePresence>
                {active && <motion.div
                    key={active.id}
                    className='absolute z-[0]'
                    variants={variants}
                    animate={'active'}
                    exit={'exit'}
                    transition={{ duration: 0.3 }}
                    custom={active}>
                    {active.item.title}
                </motion.div>}

                {queue.filter((_, index) => index != queue.length - 1).map((queueItem, index) => (
                    <motion.div
                        className='absolute z-[1]'
                        key={queueItem.id}
                        style={{ backgroundColor: queueItem.item.backgroundColor }}
                        animate={'item'}
                        variants={variants}
                        transition={{delay: 0.2 * index}}
                        custom={{ queueProps, item: queueItem, index }}
                        onMouseDown={(ev)=>handleMouseDown(ev,index)}
                        onMouseUp={(ev)=>handleMouseUp(ev, index)}
                        onClick={() => handleItemClick(index)}
                    >
                        <p>{queueItem.item.title}</p>
                    </motion.div>
                ))}

                {last && <motion.div
                    className='absolute z-[1]'
                    key={queue[queue.length - 1].id}
                    style={{
                        ...variants.item({queueProps, index: queue.length-1, item: last.item}),
                    }}
                    variants={variants}
                    initial={'enter'}
                    animate={'item'}
                    custom={{queueProps, index: queue.length-1, item: last.item}}
                    onClick={() => handleItemClick(queue.length-1)}
                >
                    <p>{last.item.title}</p>
                </motion.div>}

            </AnimatePresence>


        </div>
    );
};

export default FancySlider;
