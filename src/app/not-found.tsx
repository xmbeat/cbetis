'use client'
import Link from 'next/link'
import { Player, Controls } from '@lottiefiles/react-lottie-player';
export default function NotFound() {
    return (
        <section className='h-screen flex flex-col items-center justify-center'>
            <h2 className='text-3xl font-bold'>Pagina no encontrada</h2>
            <p>Lo sentimos la pagina que solicitaste no existe</p>
            <Link href="/">Regresar al inicio</Link>
            <Player
                autoplay
                loop
                src="/resources/not-found.json"
                style={{ height: '300px', width: '300px' }}
            >
            </Player>
        </section>
    )
}