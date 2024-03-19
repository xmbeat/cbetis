'use client'
import MotionBaseSlider from "@/components/MotionBaseSlider"
import AspectRatio from "@/components/aspectRatio"
import FancySlider from "@/components/fancySlider"
import MaxWidthContainer from "@/components/maxWidthContainer"

export default function EspecialidadesSection() {
    return (
        <section className="students flex justify-center">
            <MaxWidthContainer className='w-full text-slate-50'>
                <div className='mt-4 relative'>
                    <h2>Especialidades</h2>
                    <AspectRatio aspect={16 / 9} >
                        <FancySlider items={[{
                                title: '0',
                                backgroundColor: '#222',
                                url: '#',
                                description: 'description',
                                image: '/images/banner/1.jpg'
                            }, {
                                title: '1',
                                backgroundColor: '#33v3',
                                url: '#',
                                description: 'description',
                                image: '/images/banner/1.jpg'
                            }, {
                                title: '2',
                                backgroundColor: '#444',
                                url: '#',
                                description: 'description',
                                image: '/images/banner/1.jpg'
                            }, {
                                title: '3',
                                backgroundColor: '#555',
                                url: '#',
                                description: 'description',
                                image: '/images/banner/1.jpg'
                            }, {
                                title: '4',
                                backgroundColor: '#666',
                                url: '#',
                                description: 'description',
                                image: '/images/banner/1.jpg'
                            }]}/>
                    </AspectRatio>

                </div>
            </MaxWidthContainer>
        </section>)

}