import { useEffect, useMemo, useState } from "react";
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
  items: Item[]
}

interface IQueueItem {
  item?: Item,
  id: string,
  animate?: any,
  initial?: any,
  exit?: any
}


export default function AnimatedSlider({ items = [] }: IAnimatedSliderProps) {

  const [startX, setStartX] = useState<number | null>(null)
  const [progress, setProgress] = useState<number>(0);

  const transitionDuration = 3
  const changeThreshold = 0.2
  const itemShiftDistance = 60

  const [changedByMD, setChangedByMD] = useState<boolean>(false)
  const [entranceProps, setEntranceProps] = useState<any>({
    x: 200,
    y: 200,
    width: 60,
    height: 60,
    backgroundColor: '#000'
  })

  const [exitProps, setExitProps] = useState<any>({
    x: 0,
    y: 200,
    width: 200,
    height: 200,
    backgroundColor: '#f22'
  })

  const [itemProps, setItemProps] = useState<any[]>(items.map((item, index) => {
    return {
      x: index * 60,
      y: 0,
      width: 60,
      height: 60,
      backgroundColor: item.backgroundColor
    };
  }))

  const [queue, setQueue] = useState<IQueueItem[]>(items.map((item, index) => ({
    id: String(Math.random()),
    initial: itemProps[index],
    animate: itemProps[index],
    item: item
  })))


  const queueProps = useMemo(() => {
    const duration = progress < 0 ? transitionDuration * (-progress) : transitionDuration * progress
    console.log(duration)
    const qItems = queue.map((qItem, index) => {
      if (startX != null) {
        if (progress < 0) {
          if (index == 0) {
            qItem.animate = interpolate(itemProps[index], exitProps, Math.abs(progress))

          }
          else {
            qItem.animate = interpolate(itemProps[index], itemProps[index - 1], Math.abs(progress))

          }
        }
        else {
          if (index == queue.length - 1) {
            qItem.animate = interpolate(itemProps[index], entranceProps, Math.abs(progress))
          }
          else {
            qItem.animate = interpolate(itemProps[index], itemProps[index + 1], Math.abs(progress))
          }
        }
        qItem.initial = qItem.animate
        qItem.animate.transition = { duration: 0}

      }
      else {
        qItem.animate = itemProps[index]
        qItem.animate.transition = { duration:transitionDuration-duration}
      }

      if (index == queue.length - 1) {
        qItem.exit = { ...entranceProps, transition: { duration: transitionDuration-duration } }
        qItem.initial = {...interpolate(entranceProps, itemProps[queue.length-1], Math.abs(progress))}
      }
      else if (index == 0) {
        qItem.exit = { ...exitProps, transition: { duration: transitionDuration-duration } }
        qItem.initial = {...interpolate(exitProps, itemProps[0], Math.abs(progress))}
      }
      return qItem
    })

    const qItemExit: IQueueItem = {
      id: 'exitItem',
      item: queue[(queue.length - 1) % queue.length].item
    }
    const qItemEntrance: IQueueItem = {
      id: 'entranceItem',
      item: queue[(queue.length - 1) % queue.length].item
    }


    if (progress > 0) {
      qItemExit.initial = interpolate(itemProps[0], exitProps, 1 - progress)
      qItemExit.animate = qItemExit.initial
      qItemExit.exit = progress >= changeThreshold ? undefined : { ...exitProps, transition: { duration: startX ? 0 : duration } },
        qItemExit.animate.transition = { duration: startX ? 0 : duration }
      qItemEntrance.animate = undefined
    }
    else if (progress < 0) {
      qItemEntrance.initial = interpolate(itemProps[queue.length - 1], entranceProps, 1 + progress)
      qItemEntrance.animate = qItemEntrance.initial
      qItemEntrance.exit = -progress >= changeThreshold ? undefined : { ...entranceProps, transition: { duration: startX ? 0 : duration } }
      qItemEntrance.animate.transition = { duration: startX ? 0 : duration }
      qItemExit.animate = undefined
    }
    return {
      items: qItems,
      itemExit: qItemExit,
      itemEntrance: qItemEntrance
    }
  }, [queue, progress, startX, exitProps, entranceProps, itemProps])


  const handleMouseDown = (ev: any) => {
    setChangedByMD(false);
    setStartX(ev.clientX);
    setProgress(0);
  }

  const shiftQueue = (offset: number) => {
    let newQueue = queue.slice(-offset)
    if (offset > 0) {
      newQueue = newQueue
        .map<IQueueItem>((item, index) => ({
          id: String(Math.random()),
          item: item.item,
        }))
        .concat(queue.slice(0, queue.length - offset))
    }
    else {
      newQueue = newQueue
        .concat(queue.slice(0, -offset)
          .map<IQueueItem>((qitem, index) => ({
            id: String(Math.random()),
            item: qitem.item,
          })))
    }
    return newQueue
  }

  const handleMouseMove = (ev: any) => {
    if (ev.buttons == 1 && startX !== null) {
      let dif = (ev.clientX - startX)
      const offset = (Math.trunc(dif / itemShiftDistance)) % queue.length
      const newProgress = (dif / itemShiftDistance) % 1
      if (offset != 0) {
        const shiftedQueue = shiftQueue(offset)
        setQueue(shiftedQueue)
        setStartX(ev.clientX)
      }
      setProgress(newProgress)
    }
  }



  const handleMouseUp = (ev: any) => {

    if (Math.abs(progress) >= changeThreshold) {
      const newQueue = shiftQueue(progress > 0 ? 1 : -1)
      setQueue(newQueue)
      setChangedByMD(true)
    }

    setStartX(null);
  }

  const handleClick = (index: number) => {
    if (!changedByMD) {
      const item = queue[index]
      const firstItem = queue[0];
      if (item != firstItem) {
        const newQueue = [...queue]
        newQueue.splice(index, 1)
        newQueue.splice(0, 1)
        newQueue.splice(0, 0, item)
        newQueue.push({
          id: String(Math.random()),
          item: firstItem.item
        })
        setQueue(newQueue)
      }

    }
  }


  return <div className="w-full h-full relative text-white"
    onMouseDown={(ev) => handleMouseDown(ev)}
    onMouseMove={(ev) => handleMouseMove(ev)}
    onMouseUp={(ev) => handleMouseUp(ev)}
  >
    <div className="text-black">

      {`progress:${progress}`}
    </div>
    {/* <AnimatePresence>
      {progress > 0 &&
        <motion.div
          key={queueProps.itemExit.id}
          className="absolute select-none"
          draggable="false"
          initial={queueProps.itemExit.initial}
          animate={queueProps.itemExit.animate}
          exit={queueProps.itemExit.exit}
        >
          {queueProps.itemExit.item?.title}
        </motion.div>
      }
    </AnimatePresence> */}

    <AnimatePresence>
      {queueProps.items.map((qItem, index) => (
        <motion.div
          key={qItem.id}
          className="absolute select-none"
          draggable="false"
          onClick={() => handleClick(index)}
          initial={qItem.initial}
          animate={qItem.animate}
          exit={qItem.exit}

        >
          {qItem.item?.title}
        </motion.div>

      ))}
    </AnimatePresence>
    {/* <AnimatePresence>
      {progress < 0 &&
        <motion.div
          key={queueProps.itemEntrance.id}
          className="absolute select-none"
          draggable="false"
          initial={queueProps.itemEntrance.initial}
          animate={queueProps.itemEntrance.animate}
          exit={queueProps.itemEntrance.exit}
        >

          {queueProps.itemEntrance.item?.title}
        </motion.div>
      }
    </AnimatePresence> */}

  </div>
}