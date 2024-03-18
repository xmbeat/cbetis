'use client'
import AspectRatio from "@/components/aspectRatio";
import Image from "next/image";
import Slider from "@/components/slider";
import { IBannerItem } from "@/lib/types/bannerItem";
import styles from './styles.module.scss'
import MaxWidthContainer from "@/components/maxWidthContainer";
export default function Hero() {
  const items:IBannerItem[] = [{
    title: 'Festejando el 50 aniversario del CBTis',
    url: '#',
    backgroundColor: '#000',
    image:'/images/banner/1.jpg'
  }, {
    title: 'Festejando el 50 aniversario del CBTis',
    url: '#',
    backgroundColor: '#000',
    image:'/images/banner/1.jpg'
  }]
  return <section className="w-full bg-slate-500 flex justify-center">
    <AspectRatio aspect={16 / 9} maxHeight="90vh"  width="100%" >
        <Slider>
          {items.map((item, index)=>(
            <div key={index} className="w-full h-full relative" style={{backgroundColor:item.backgroundColor??''}}>
              {item.image && <div className="w-full h-full absolute">
                <Image draggable="false" priority={index==0} alt={item.title} src={item.image} fill={true} style={{objectFit:"cover"}}/>
                <div className={styles.imageOverlay}></div>
              </div>}
              {item.image && <div className="w-full h-full relative">
                <Image draggable="false" priority={index==0} alt={item.title} src={item.image} fill={true} style={{objectFit:"contain"}}/>
              </div>}
              <div className={styles.sliderText}>
                <MaxWidthContainer className="w-full px-4">
                  <h2>{item.title}</h2>
                  <div className={styles.description}><a href={item.url}>Mas informacion &gt;&gt;</a></div>
                </MaxWidthContainer>
              </div>
            </div>
          ))}
            
        </Slider>
    </AspectRatio>
  </section>
}
