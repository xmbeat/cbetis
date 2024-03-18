
import Students from "@/components/sections/alumnos";
import EspecialidadesSection from "@/components/sections/especialidades";
import Hero from "@/components/sections/hero";
export default function Home() {
  return <div className="mainContainer">
    <Hero/>
    <Students/>
    <EspecialidadesSection/>
  </div>
}
