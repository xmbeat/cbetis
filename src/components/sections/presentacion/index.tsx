import MaxWidthContainer from "@/components/maxWidthContainer";


export default function Presentacion() {

    return <section className="flex justify-center mt-8 flex-col items-center">
        <MaxWidthContainer className="w-full">
            <h2 className="text-left w-full">Nuestro Propósito y Valores</h2>
        </MaxWidthContainer>
        <div className="w-full h-[40vh] min-h-[400px] max-h-[800px] bg-slate-500 flex flex-col items-center">
            <MaxWidthContainer className="w-full flex">
                <div className="bg-orange-300 w-[400px] h-[320px]"></div>
                <div>
                    <h3>Nuestra Vision</h3><p>
                    Formar personas con conocimientos tecnologicos en las areas industrial ,comercial y de servicios a través de la preparación de profesionales técnicos y bachilleres , con el fin de contribuir al desarrollo sustentable del pais.    
                    </p>
                </div>
            </MaxWidthContainer>
        </div>
    </section>
}