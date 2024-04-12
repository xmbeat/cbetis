'use client'
import MotionBaseSlider from "@/components/MotionBaseSlider"
import AspectRatio from "@/components/aspectRatio"
import FancySlider from "@/components/fancySlider"
import MaxWidthContainer from "@/components/maxWidthContainer"
const especialidades = [{
    title: 'Programacion',
    backgroundColor: '#222',
    url: '#',
    description: 'Aprenda los fundamentos y técnicas esenciales para desarrollar software robusto y eficiente en el campo de la programación. Adquiera habilidades en la resolución de problemas algorítmicos y el diseño de sistemas informáticos.',
    image: '/images/especialidades/programacion.jpg'
},
{
    title: 'Ofimatica',
    backgroundColor: '#333',
    url: '#',
    description: 'Domine el uso de herramientas de oficina como procesadores de texto, hojas de cálculo y software de presentación para mejorar la eficiencia y la organización en entornos empresariales. Aprenda a gestionar documentos y datos de manera efectiva.',
    image: '/images/especialidades/ofimatica.png'
},
{
    title: 'Mecanica',
    backgroundColor: '#444',
    url: '#',
    description: 'Explore los principios fundamentales de la mecánica y adquiera conocimientos en el diseño, análisis y mantenimiento de sistemas mecánicos. Aplique teorías de física y matemáticas para resolver problemas de ingeniería.',
    image: '/images/especialidades/motor.jpg'
},
{
    title: 'Laboratorista Clinico',
    backgroundColor: '#555',
    url: '#',
    description: 'Sumérjase en el estudio de la biología y la química aplicadas para realizar análisis clínicos y diagnósticos precisos. Aprenda las técnicas y procedimientos de laboratorio necesarios para contribuir al cuidado de la salud.',
    image: '/images/especialidades/lab.webp'
},
{
    title: 'Contabilidad',
    backgroundColor: '#666',
    url: '#',
    description: 'Desarrolle habilidades en la gestión financiera y la contabilidad empresarial para analizar y comunicar información financiera de manera precisa y oportuna. Aprenda a aplicar principios contables para la toma de decisiones estratégicas.',
    image: '/images/especialidades/contabilidad.webp'
},
{
    title: 'Mineria',
    backgroundColor: '#666',
    url: '#',
    description: 'Explore los procesos de exploración, extracción y procesamiento de recursos minerales y energéticos. Adquiera conocimientos en geología, ingeniería de minas y gestión ambiental para contribuir al desarrollo sostenible de la industria minera.',
    image: '/images/especialidades/mineria.webp'
},
{
    title: 'Puericultura',
    backgroundColor: '#666',
    url: '#',
    description: 'Aprenda sobre el cuidado y desarrollo integral de niños y niñas en sus primeros años de vida. Adquiera conocimientos en pediatría, nutrición infantil y psicología del desarrollo para promover el bienestar y la salud infantil.',
    image: '/images/especialidades/puericultura.png'
},
{
    title: 'Electronica',
    backgroundColor: '#666',
    url: '#',
    description: 'Explore los principios y aplicaciones de la electrónica para diseñar y construir circuitos y sistemas electrónicos. Aprenda a analizar y solucionar problemas en dispositivos y sistemas electrónicos en diversos campos de aplicación.',
    image: '/images/especialidades/electronica.jpg'
}
];

export default function EspecialidadesSection() {
    return (
        <section className="students flex justify-center">
            <MaxWidthContainer className='w-full'>
                <div className='mt-8 relative'>
                    <h2>Especialidades</h2>
                    <AspectRatio aspect={16 / 9} >
                        <FancySlider items={especialidades}/>
                    </AspectRatio>

                </div>
            </MaxWidthContainer>
        </section>)

}