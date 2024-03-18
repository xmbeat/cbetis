import { AnimatePresence, motion } from 'framer-motion';
import React, { useState, ReactNode, forwardRef, ForwardedRef, useImperativeHandle, useRef, useEffect, useCallback, useMemo } from 'react';

export interface PopupProps {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void
  desiredAlign?: 'right' | 'left',
  desiredPosition?: 'top' | 'bottom',
  desiredWidth?: string,
  desiredHeight?: string,
  margin?: string,
}

const Popup: React.FC<PopupProps> = ({ children, isOpen, onClose, desiredAlign = 'right', desiredPosition = 'bottom', desiredWidth = 'same', desiredHeight = '400px', margin = '0px' }) => {
  const popupRef = useRef<HTMLDivElement>(null)
  const [parentRect, setParentRect] = useState({
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: 0,
    height: 0,
  })
  const [isMobile, setIsMobile] = useState(false)

  const popupStyle = useMemo(() => {
    let style: any = {}
    if (!popupRef.current) return style;
    if (!isMobile) {
      const wrapperRect = popupRef.current.getBoundingClientRect()

      const spaceAbove = parentRect.top
      const spaceBelow = window.innerHeight - parentRect.bottom
      const spaceLeft = parentRect.left
      const spaceRight = window.innerWidth - parentRect.right
      // Obtener el ancho del scrollbar horizontal si está presente
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth

      if (desiredPosition == 'bottom') {
        if (spaceBelow >= wrapperRect.height || spaceBelow >= spaceAbove) {
          style.top = `calc(${parentRect.bottom}px + ${margin})`;
          style.maxHeight = `${spaceBelow}px`;
        } else {
          style.bottom = `calc(${window.innerHeight - parentRect.top}px + ${margin})`;
          style.maxHeight = `${spaceAbove}px`;
        }
      } else {
        if (spaceAbove >= wrapperRect.height || spaceAbove >= spaceBelow) {
          style.bottom = `${window.innerHeight - parentRect.top}px`;
          style.maxHeight = `${spaceAbove}px`;

        } else {
          style.top = `${parentRect.bottom}px`;
          style.maxHeight = `${spaceBelow}px`;
        }
      }
      if (desiredAlign == 'left') {
        style.left = `${parentRect.left}px`
      } else {
        style.right = `${spaceRight - scrollbarWidth}px`
      }

      if (desiredWidth == 'same') {
        style.width = `${parentRect.width}px`
      } else {
        style.width = `${desiredWidth}`
      }
    }
    else {
      style.position = 'relative';
      style.maxHeight = '80%';
      if (desiredWidth == 'fit-content' || desiredWidth == 'same') {
        style.maxWidth = '90%';
      } else {
        style.width = desiredWidth
      }
    }
    return style
  }, [parentRect, desiredAlign, desiredPosition, desiredWidth, margin, isMobile])

  useEffect(() => {
    if (!popupRef.current) return;
    const handleResize = () => {
      if (!popupRef.current) return;
      const parent = popupRef.current.parentNode as HTMLElement;
      const rect = parent.getBoundingClientRect();
      setParentRect(rect);
    };

    handleResize(); // Actualiza parentRect al principio

    window.addEventListener('resize', handleResize);

    const observer = new MutationObserver(handleResize);
    observer.observe(popupRef.current.parentNode as Node, { attributes: true, childList: true, subtree: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
    };

  }, [popupRef])


  useEffect(() => {
    const width = window.innerWidth;
    setIsMobile(width < 600);
  }, [])

  useEffect(() => {
    const clickHandler = (event: MouseEvent) => {
      if (popupRef.current && isOpen) {
        const parent = (popupRef.current.parentNode as HTMLElement)
        const target = event.target as HTMLElement
        if (!popupRef.current.contains(target) && !parent.contains(target)) {
          onClose()
        }
      }
    }
    document.addEventListener('click', clickHandler)

    return () => {
      document.removeEventListener('click', clickHandler)
    }
  }, [isOpen, onClose])

  return <div className={`fixed z-[9999] ${isMobile ? 'inset-0' : ''}`} ref={popupRef}>
    <div className='fixed' style={popupStyle}>
      <AnimatePresence>
        {isOpen && <motion.div transition={{ ease: 'easeInOut', duration: 0.1 }} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}>
          {children}
        </motion.div>}

      </AnimatePresence>
    </div>
  </div>
}
export default Popup
