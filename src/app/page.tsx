
import Students from "@/components/sections/alumnos";
import EspecialidadesSection from "@/components/sections/especialidades";
import Hero from "@/components/sections/hero";
import Presentacion from "@/components/sections/presentacion";
export default function Home() {
  return <div className={"flex flex-col"}>
    <Hero/>
    <Students/>
    <EspecialidadesSection/>
    <Presentacion/>
  </div>
}
