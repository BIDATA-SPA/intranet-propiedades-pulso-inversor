// import { Card, Calendar } from "@/components/ui";
import CalendarPro from "@/components/ui/Calendario";
import ScheduleCalendar from "./components/ScheduleCalendar";
import { useState } from "react";

const Calendario = () => {
   const [dateToday, setDateToday] = useState<Date>(new Date());


    function formatearFecha(fecha: Date): string {
        const dia: string = String(fecha.getDate()).padStart(2, '0');
        const mes: string = String(fecha.getMonth() + 1).padStart(2, '0');
        const anio: string = String(fecha.getFullYear());
        const hora: string = String(fecha.getHours()).padStart(2, '0');
        const min: string = String(fecha.getMinutes()).padStart(2, '0');
    
        return `${dia}-${mes}-${anio} ${hora}:${min}`;
    }

    const fechaFormateada = formatearFecha(dateToday);
  
    return(
        <>
        <div className="mb-2 ml-3">
            <h3 className="">Calendario</h3>
            <small className="text-gray-500 text-xs">Fecha de hoy: {fechaFormateada}</small>
        </div>
        <div className="h-[85vh] xl:h-[79vh] 2xl:h-[85vh] p-2">
            {/* <CalendarPro/> */}
            <ScheduleCalendar/>
        </div>
        </>
    )


}

export default Calendario;