'use client'
import MaxWidthContainer from '@/components/maxWidthContainer'
import { AnimatePresence, Variant, Variants, motion, useAnimation, useInView } from 'framer-motion';
import styles from './styles.module.scss'
import Image from 'next/image';
import Button from '@/components/Button';
import { useEffect, useRef } from 'react';
export default function Students() {
    const items  = [{
        title: 'Nuevo Ingreso',
        description: 'Consulta las fechas y todos los requerimientos para realizar tu preregistro',
        image: '/images/preregistro.jpg',
        content: ''
    }, {
        title: 'Alumnos',
        description: 'Regreso a clases 6 de febrero 2024, consulta las fechas de la inscripcion y la documentacion requerida',
        image: '/images/alumnos.jpeg',
        content: ''
    }, {
        title: 'Horarios',
        description: 'Consulta los horarios de clases febrero - julio 2024',
        image: '/images/horario.webp',
        content: ''
    }];
    return <section className="students flex justify-center">
        <MaxWidthContainer className='w-full'>
            <div className='mt-8'>
                <h2>Inscripciones</h2>
                <motion.div className={styles.gridContainer}>
                    {items.map((item, index)=>(
                        <motion.div key={index} 
                            className={styles.card}
                            initial={{y:'100%', opacity: 0}}
                            whileInView={{y: '0%', opacity: 1, transition:{duration: 0.5, delay: index * 0.3}}}
                            viewport={{margin: '100px', once: true}}
                        >
                            <div className={styles.bgItem}>
                                <Image sizes="(max-width: 768px) 200px, 30vw"src={item.image} fill={true} style={{objectFit: 'cover'}} alt={item.title} priority={true} />
                            </div>
                            <div className={styles.dataItem}>
                                <h3>{item.title}</h3>
                                <div className={styles.description}>{item.description}</div>
                                <Button className='self-end relative' >Mostrar</Button>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </MaxWidthContainer>
    </section>
}