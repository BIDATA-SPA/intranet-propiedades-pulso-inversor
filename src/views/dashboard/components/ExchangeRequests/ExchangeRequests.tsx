import { COLORS } from '../../../../constants/chart.constant'
import { useGetInboxMetadataQuery } from '../../../../services/RtkQueryService'
import { useEffect, useState } from 'react'
import Chart from 'react-apexcharts'
import UseDialog from './hooks/useDialogs'
import SeeRequestsDialog from './components/SeeRequestsDialog'
import { Spinner } from '@/components/ui'
import twColor from 'tailwindcss/colors'




type Metadata = {
    inbox?: number
    pendingRequests?: number
    approvedRequests?: number
    rejectedRequests?: number
}


const ExchangeRequests = () => {
    const [metaData, setMetaData] = useState<Metadata | null> (null);


    const {data} = useGetInboxMetadataQuery({}, {});


    const {openDialog, openSeeDialog, closeDialogs}= UseDialog() || {};


    const handleDialogOpen = () =>{
        openSeeDialog()
    }


    useEffect(() => {
        if (data){
            const response = data;
            setMetaData(response);
        }
    },[data]);




    const Requests = 
    metaData &&
    ((metaData.inbox || 0) +
    (metaData.approvedRequests || 0) +
    (metaData.pendingRequests || 0) +
    (metaData.rejectedRequests || 0)) > 0;


    return (
        <>
        <article className="shadow-md group group-hover:blur-lg h-96 w-full sm:h-full border border-1 rounded-md overflow-hidden overflow-y-auto">
            <div className='mx-3 m-2'>
                <h5 className='text-gray-600'>Cantidad de solicitudes de Canjes</h5>
            </div>
            {Requests? (
                <>
                    <Chart
                        options={{
                            colors: [
                                twColor.blue['500'],
                                twColor.green['400'],
                                twColor.amber['400'],
                                twColor.red['500']
                            ],
                            labels: ['Recibidas', 'Aprobadas', 'Pendientes', 'Rechazadas'],
                            responsive: [
                                {
                                    breakpoint: 480,
                                    options: {
                                        chart: {
                                            width: 200,
                                        },
                                        legend: {
                                            position: 'bottom',
                                        },
                                    },
                                },
                            ],
                            dataLabels: {
                                enabled: true,
                                offsetX: 0,
                                offsetY: -20,
                                formatter: function (val, opts) {  
                                    return opts.w.globals.labels[opts.seriesIndex]
                                }
                            },
                            plotOptions: {
                                pie:{
                                    dataLabels:{
                                        offset: -15,
                                    },
                                    expandOnClick: false,
                                }
                            }
                        }}
                        series={[
                            metaData.inbox || 0,
                            metaData.approvedRequests || 0,
                            metaData.pendingRequests || 0,
                            metaData.rejectedRequests || 0,
                        ]}
                        height={320}
                        type="pie"
                    />
                    <div className='flex justify-end mx-4 m-1 mb-2 cursor-pointer'>
                        <p
                            onClick={() => handleDialogOpen()}
                            className='italic hover:scale-x-105 duration-150 text-sky-400'>Ver más detalles</p>
                    </div>
                </>
                    ) : (
                        <div className="flex items-center justify-center h-80">
                            <p className="text-gray-500 italic">No hay datos para mostrar.</p>
                        </div>
                    )}
        </article>


        {
            openDialog.see && (
                <SeeRequestsDialog
                    openDialog={openDialog.see}
                    closeDialogs={closeDialogs}
                    dataRequests={metaData}/>
            )
        }
       
        </>
    )
}


export default ExchangeRequests;