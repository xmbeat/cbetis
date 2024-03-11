import { useEffect, useMemo, useState } from "react";
import { IMenuItem } from "../globalMenu";
import { MdArrowForwardIos, MdArrowBackIos } from "react-icons/md";
import styles from './styles.module.scss';
import { motion } from 'framer-motion';

interface INavigableMenuNode {
    title?: string;
    items: IMenuItem[];
    parent: INavigableMenuNode | null;
}

export default function NavigableMenu({ items, title }: { items: IMenuItem[]; title?: string }) {
    const [tail, setTail] = useState<INavigableMenuNode>({ title, items, parent: null });
    const [firstRender, setFirstRender] = useState<boolean>(true);
    const [animationDirection, setAnimationDirection] = useState<number>(0);

    const animation = useMemo<{from: any, to: any}>(()=>{
        if (firstRender) return {from:{}, to:{}, exit:{}}
        return {
            from: animationDirection?{x:'-100%'}:{x:'100%'},
            to: {x:0}
        }
    }, [animationDirection, firstRender])

    useEffect(() => {
        setFirstRender(false);
    }, []);

    const handleClick = (event: React.MouseEvent<HTMLAnchorElement>, item: IMenuItem, parentNode: INavigableMenuNode) => {
        if (item.submenu) {
            event.preventDefault();
            const node: INavigableMenuNode = {
                parent: parentNode,
                items: item.submenu,
                title: item.name
            };
            setAnimationDirection(0);
            setTail(node);
        }
    };

    const handleBack = () => {
        if (tail.parent) {
            setAnimationDirection(1);
            setTail(tail.parent);
        }
    };

    return (
        <div className={styles.container}>
            <motion.div
                className={styles.menu}
                key={tail.title}
                initial={animation.from}
                animate={animation.to}
                transition={{ duration: 0.2}}
            >
                {(tail.parent != null || tail.title) && (
                    <>
                    <div className={`${styles.item} ${styles.header}`} onClick={handleBack}>
                        {tail.parent && <MdArrowBackIos />}
                        <span>{tail.title}</span>
                    </div>
                    <div className={styles.header_separator}></div>
                    </>
                )}

                {tail.items.map((item, index) => (
                    <a
                        key={item.name}
                        className={styles.item}
                        onClick={(e) => handleClick(e, item, tail)}
                        href={item.url}
                    >
                        <span className="flex-grow">{item.name}</span>
                        {item.submenu && <MdArrowForwardIos />}
                    </a>
                ))}
            </motion.div>
        </div>
    );
}
