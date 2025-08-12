import { Dialog, Dropdown, Progress } from "../../../../../components/ui";
import { useState } from "react";
import { IoIosRocket } from "react-icons/io";
import { TbUserSquareRounded } from "react-icons/tb";
import { MdOutlineConnectWithoutContact, MdWeb } from "react-icons/md";
import { FaWpforms } from "react-icons/fa";
import { GrContactInfo } from "react-icons/gr";
import React from "react";


const RequestsStatistics = ({dataRequests}) => {




    const parseToPercent = () => {
        const totalRequests = Object.values(dataRequests).reduce((acc, val) => acc + val, 0);
        const percentRequests = Object.keys(dataRequests).map(key => {
            return ((dataRequests[key] / totalRequests) * 100).toFixed(2);
        });


        return percentRequests;
    }


    const percentages = parseToPercent();




    return(
        <>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 overflow-hidden my-2 mt-4 sm:mx-5 p-4 sm:p-2">
                <article className="flex flex-col group items-center p-2 py-3 w-full h-44 sm:h-40 rounded-md border border-sky-500 drop-shadow-2xl hover:scale-105 duration-200">
                    <div className="mb-3">
                        <TbUserSquareRounded className="text-4xl text-sky-500 group-hover:drop-shadow-lg group-hover:-translate-y-2 duration-150" />
                    </div>
                    <div className="text-center mt-3">
                        <span className="font-semibold">{dataRequests?.inbox} <small>veces</small></span>
                        <p className="font-normal mb-6 sm:text-xs">Solicitudes recibidas</p>
                        <div  className="text-md sm:text-xs">
                            <Progress color="green-600" percent={percentages[0]} />
                        </div>
                    </div>
                </article>
                <article className="flex flex-col group items-center p-2 py-3 w-full h-44 sm:h-40 rounded-md border border-sky-500 drop-shadow-2xl hover:scale-105 duration-200">
                    <div className="mb-3">
                        <MdOutlineConnectWithoutContact className="text-4xl text-sky-500 group-hover:drop-shadow-lg group-hover:-translate-y-2 duration-150" />
                    </div>
                    <div className="text-center mt-3">
                        <span className="font-semibold">{dataRequests?.approvedRequests} <small>veces</small></span>
                        <p className="font-normal mb-3 sm:text-xs">Solicitudes aprobadas</p>
                        <div  className="text-md sm:text-xs">
                        <Progress color="green-600" percent={percentages[1]} />
                        </div>
                    </div>
                </article>
                <article className="flex flex-col group items-center p-2 py-3 w-full h-44 sm:h-40 rounded-md border border-sky-500 drop-shadow-2xl hover:scale-105 duration-200">
                    <div className="mb-3">
                        <GrContactInfo className="text-4xl text-sky-500 group-hover:drop-shadow-lg group-hover:-translate-y-2 duration-150" />
                    </div>
                    <div className="text-center mt-3">
                        <span className="font-semibold">{dataRequests?.pendingRequests} <small>veces</small></span>
                        <p className="font-normal mb-3 sm:text-xs">Solicitudes pendientes</p>
                        <div  className="text-md sm:text-xs">
                        <Progress color="green-600" percent={percentages[2]} />
                        </div>  
                    </div>
                </article>
                <article className="flex flex-col group items-center p-2 py-3 w-full h-44 sm:h-40 rounded-md border border-sky-500 drop-shadow-2xl hover:scale-105 duration-200">
                    <div className="mb-3">
                        <MdWeb className="text-4xl text-sky-500 group-hover:drop-shadow-lg group-hover:-translate-y-2 duration-150" />
                    </div>
                    <div className="text-center mt-3">
                        <span className="font-semibold">{dataRequests?.rejectedRequests} <small>veces</small></span>
                        <p className="font-normal mb-3 sm:text-xs">Solicitudes rechazadas</p>
                        <div  className="text-md sm:text-xs">
                        <Progress color="green-600" percent={percentages[3]} />
                        </div>
                    </div>
                </article>
            </div>
        </>
    )
}


const MainContentEvent = ({closeDialogs, dataRequests}) => {
    return(
        <>
           
            <div className="text-center mb-4 sm:mb-2 mt-4 sm:mt-2 sm:mx-14">
                <h3 className="text-2xl">Estadisticas completas Solicitudes</h3>
                <p className="text-gray-500">A continuación se muestran las estadísticas de las solicitudes de intercambio</p>
            </div>
            <RequestsStatistics dataRequests={dataRequests} />
        </>
    )
}


const SeeRequestsDialog = ({openDialog, closeDialogs, dataRequests}) => {
    return (
        <Dialog isOpen={openDialog} onClose={closeDialogs}>
            <MainContentEvent closeDialogs={closeDialogs} dataRequests={dataRequests} />
        </Dialog>
    )
}


export default SeeRequestsDialog;
