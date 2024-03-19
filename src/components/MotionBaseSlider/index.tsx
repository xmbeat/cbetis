import { ReactNode, Ref, RefObject, createRef, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, AnimationProps, TargetAndTransition, Variants, motion, mix } from "framer-motion";
import { interpolate } from "@/lib/utils/interpolation";
interface Item {
  title: string;
  backgroundColor: string;
  url: string;
  description: string;
  image: string;
}

interface IAnimatedSliderProps {
  items: Item[],
  exitStyle: {},
  entranceStyle: {},
  itemStyles: {}[] | ((index:number)=>{}),
  transitionDuration: number
  changeThreshold: number,
  clickThreshold:number,
  changeDistance: number,
  itemRenderer: (item:any, index:number)=>ReactNode
}

interface IQueueItem {
  item?: Item,
  id: string,
  animate?: any,
  initial?: any,
  exit?: any,
  ref?: RefObject<HTMLDivElement>
}

export default function MotionBaseSlider({ items = [], exitStyle, entranceStyle, itemStyles, 
  transitionDuration, changeThreshold, clickThreshold, changeDistance, itemRenderer }: IAnimatedSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [startX, setStartX] = useState<number | null>(null)
  const [progress, setProgress] = useState<number>(0);
  const [itemMD, setItemMD] = useState<Item | null>(null)

  const getItemStyle = useCallback((index:number)=>{
    if (typeof itemStyles == 'function'){
      return itemStyles(index)
    }
    else{
      return itemStyles[index]
    }
  }, [itemStyles])


  const [queue, setQueue] = useState<IQueueItem[]>(items.map((item, index) => ({
    id: String(Math.random()),
    initial: getItemStyle(index),
    animate: getItemStyle(index),
    item: item,
    ref: createRef<HTMLDivElement>()
  })))


  const queueProps = useMemo(() => {
    const duration = progress < 0 ? transitionDuration * (-progress) : transitionDuration * progress

    const qItems = queue.map((qItem, index) => {
      qItem = {...qItem}
      if (startX != null) {
        if (progress < 0) {
          if (index == 0) {
            console.log(interpolate(getItemStyle(index), exitStyle, Math.abs(progress)))
            qItem.animate = interpolate(getItemStyle(index), exitStyle, Math.abs(progress))

          }
          else {
            qItem.animate = interpolate(getItemStyle(index), getItemStyle(index - 1), Math.abs(progress))

          }
        }
        else {
          if (index == queue.length - 1) {
            qItem.animate = interpolate(getItemStyle(index), entranceStyle, Math.abs(progress))
          }
          else {
            qItem.animate = interpolate(getItemStyle(index), getItemStyle(index + 1), Math.abs(progress))
          }
        }
        qItem.initial = qItem.animate
        qItem.animate.transition = { duration: 0 }

      }
      else {
        qItem.animate = getItemStyle(index)
        qItem.animate.transition = { 
          duration: Math.abs(progress) >= changeThreshold || Math.abs(progress) <=clickThreshold 
            ? transitionDuration - duration 
            : duration}
      }

      if (index == queue.length - 1) {
        qItem.exit = { ...entranceStyle, transition: { duration: transitionDuration - duration } }
        if (containerRef.current){
          qItem.initial = { ...interpolate(entranceStyle, getItemStyle(queue.length - 1), Math.abs(progress)) }
        }
      }
      else if (index == 0) {
        qItem.exit = { ...exitStyle, transition: { duration: transitionDuration - duration } }
        if (containerRef.current){
          qItem.initial = { ...interpolate(exitStyle, getItemStyle(0), Math.abs(progress)) }
        }
      }
      return qItem
    })

    const qItemExit: IQueueItem = {
      id: 'exitItem',
      item: queue[queue.length - 1].item
    }
    const qItemEntrance: IQueueItem = {
      id: 'entranceItem',
      item: queue[0].item
    }


    if (progress > 0) {
      qItemExit.initial = interpolate(getItemStyle(0), exitStyle, 1 - progress)
      qItemExit.animate = qItemExit.initial
      qItemExit.animate.transition = { duration: startX ? 0 : duration }
    }
    else if (progress < 0) {
      qItemEntrance.initial = interpolate(getItemStyle(queue.length - 1), entranceStyle, 1 + progress)
      qItemEntrance.animate = qItemEntrance.initial
      qItemEntrance.animate.transition = { duration: startX ? 0 : duration }
    }
    if (startX) {
      if (progress > 0) {
        if (Math.abs(progress) >= changeThreshold) {
          qItemExit.exit = { ...qItemExit.animate, transition: { duration: 0 } }
        }
        else {
          qItemExit.exit = { ...exitStyle, transition: { duration: duration } }
        }
      }
      else if (progress < 0) {
        if (Math.abs(progress) >= changeThreshold) {
          qItemEntrance.exit = { ...qItemEntrance.animate, transition: { duration: 0 } }
        }
        else {
          qItemEntrance.exit = { ...entranceStyle, transition: { duration: duration } }
        }
      }
    }
    else {
      qItemExit.exit = undefined
      qItemEntrance.exit = undefined
    }
    return {
      items: qItems,
      itemExit: qItemExit,
      itemEntrance: qItemEntrance
    }
  }, [progress, transitionDuration, queue, startX, getItemStyle, exitStyle, entranceStyle, changeThreshold, clickThreshold])


  const handleMouseDown = useCallback((ev: any) => {
    setStartX(ev.clientX);
    setProgress(0);
    setItemMD(null)
    for (let qItem of queue) {
      if (qItem.ref!.current!.contains(ev.target)) {
        setItemMD(qItem.item!)
        break;
      }
    }
  }, [queue])

  const shiftQueue = useCallback((offset: number) => {
    let newQueue = queue.slice(-offset)
    if (offset > 0) {
      newQueue = newQueue
        .map<IQueueItem>((item, index) => ({
          id: String(Math.random()),
          item: item.item,
          ref: createRef<HTMLDivElement>()
        }))
        .concat(queue.slice(0, queue.length - offset))
    }
    else {
      newQueue = newQueue
        .concat(queue.slice(0, -offset)
          .map<IQueueItem>((qitem, index) => ({
            id: String(Math.random()),
            item: qitem.item,
            ref: createRef<HTMLDivElement>()
          })))
    }
    return newQueue
  }, [queue])

  const handleMouseMove = useCallback((ev: any) => {
    if (ev.buttons == 1 && startX !== null) {
      let dif = (ev.clientX - startX)
      const offset = (Math.trunc(dif / changeDistance)) % queue.length
      const newProgress = (dif / changeDistance) % 1
      if (offset != 0) {
        const shiftedQueue = shiftQueue(offset)
        setQueue(shiftedQueue)
        setStartX(ev.clientX)
      }
      setProgress(newProgress)
    }
  }, [changeDistance, queue.length, shiftQueue, startX])

  const handleMouseUp = useCallback((ev: any) => {

    if (Math.abs(progress) >= changeThreshold) {
      const newQueue = shiftQueue(progress > 0 ? 1 : -1)
      setQueue(newQueue)
    }
    else if (itemMD){
      for(let i = 0; i < queue.length; i++){
        let qItem = queue[i]
        if (qItem.item == itemMD){
          if (qItem.ref!.current!.contains(ev.target)){
            if (Math.abs(progress) <= clickThreshold){
                const firstItem = queue[0];
                if (qItem != firstItem) {
                  const newQueue = [...queue]
                  newQueue.splice(i, 1)
                  newQueue.splice(0, 1)
                  newQueue.splice(0, 0, qItem)
                  newQueue.push({
                    id: String(Math.random()),
                    item: firstItem.item,
                    ref: createRef()
                  })
                  setQueue(newQueue)
                }
          
            }
          }
          break;
        }
      }
      setItemMD(null)
    }

    setStartX(null);
  }, [changeThreshold, clickThreshold, itemMD, progress, queue, shiftQueue])


  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [itemMD, handleMouseMove, handleMouseUp])




  return <div ref={containerRef} className="w-full h-full relative text-white"
    onMouseDown={handleMouseDown}
  >
    <div className="text-black">
      {`progress:${progress} `}
    </div>
    <AnimatePresence>
      {queueProps.itemExit.exit &&
        <motion.div
          key={queueProps.itemExit.id}
          className="absolute select-none"
          draggable="false"
          initial={queueProps.itemExit.initial}
          animate={queueProps.itemExit.animate}
          exit={queueProps.itemExit.exit}
        >
          
          {itemRenderer(queueProps.itemExit.item, -1)}
        </motion.div>
      }
    </AnimatePresence>

    <AnimatePresence>
      {queueProps.items.map((qItem, index) => (
        <motion.div
          key={qItem.id}
          ref={qItem.ref!}
          className="absolute select-none"
          draggable="false"
          initial={qItem.initial}
          animate={qItem.animate}
          exit={qItem.exit}
        >
          {itemRenderer(qItem.item, index)}

        </motion.div>

      ))}
    </AnimatePresence>
    <AnimatePresence>
      {queueProps.itemEntrance.exit &&
        <motion.div
          key={queueProps.itemEntrance.id}
          className="absolute select-none"
          draggable="false"
          initial={queueProps.itemEntrance.initial}
          animate={queueProps.itemEntrance.animate}
          exit={queueProps.itemEntrance.exit}
        >
          {itemRenderer(queueProps.itemEntrance.item, queue.length )}
        </motion.div>
      }
    </AnimatePresence>

  </div>
}