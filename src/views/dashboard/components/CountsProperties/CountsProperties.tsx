import { useGetDashboardQuery } from '../../../../services/RtkQueryService';
import { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import UseDialog from './hooks/useDialogs';
// eslint-disable-next-line import/namespace
import CountsDialogs from '../CountsProperties/components/CountsDialogs';
import { Spinner } from '@/components/ui';
import twColor from 'tailwindcss/colors';

type Dashboard = {
  personalInfo?: {
    countsByType?: { typeOfPropertyId: string; total: number }[];
  };
  globalInfo?: {
    countsByType?: { typeOfPropertyId: string; total: number }[];
  };
};

const CountsProperties = () => {
  const [metaData, setMetaData] = useState<Dashboard | null>(null);
  const { data, isLoading } = useGetDashboardQuery(null, {});
  const { openDialog, openSeeDialog, closeDialogs } = UseDialog() || {};

  const handleDialogOpen = () => {
    openSeeDialog();
  };

  useEffect(() => {
    if (data) {
      const response = data as Dashboard;
      setMetaData(response);
    }
  }, [data]);

  // Obtener countsByType desde personalInfo o globalInfo
  const propertyCounts =
    metaData?.globalInfo?.countsByType || [];
  const propertyLabels = propertyCounts.map((property) => property.typeOfPropertyId); 
  const propertyValues = propertyCounts.map((property) => property.total);

  const hasData = propertyCounts.some(
    (count) => (Number(count.typeOfPropertyId) || 0) + (count.total || 0) > 0
  );

  return (
    <>
      <article className="shadow-md group group-hover:blur-lg h-96 w-full sm:h-full border border-1 rounded-md overflow-hidden overflow-y-auto">
        <div className="mx-3 m-2">
          <h5 className="text-gray-600">Cantidad de Propiedades por tipo de inmueble</h5>
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center h-80">
            <Spinner />
          </div>
        ) : hasData ? (
          <>
            <Chart
              options={{
                colors: [
                  twColor.blue['500'],
                  twColor.green['400'],
                  twColor.amber['400'],
                  twColor.red['500'],
                  twColor.indigo['400'],
                  twColor.pink['400'],
                  twColor.cyan['400'],
                ],
                labels: propertyLabels,
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
                  offsetY: 0,
                    style: {
                        fontSize: '12px',
                        colors: ['#fff'],
                    },
                  formatter: (val, opts) =>
                    `${opts.w.globals.labels[opts.seriesIndex]}`, // Cambiado para eliminar el porcentaje
                },
                plotOptions: {
                  pie: {
                    dataLabels: {
                      offset: -10,
                      minAngleToShowLabel: 10,
                    },
                    expandOnClick: true,
                  },
                },
                legend: {
                  position: 'right',
                  horizontalAlign: 'center',
                  offsetY: 10, // Ajustar posición de la leyenda
                },
                tooltip: {
                  enabled: true, // Deshabilitar tooltip
                },
              }}
              series={propertyValues}
              height={350}
              type="pie"
            />
            <div className="flex justify-end mx-4 m-1 mb-2 cursor-pointer">
              <p
                className="italic hover:scale-x-105 duration-150 text-sky-400"
                onClick={() => handleDialogOpen()}
              >
                Ver más detalles
              </p>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-80">
            <p className="text-gray-500 italic">No se encontraron datos.</p>
          </div>
        )}
      </article>

      {openDialog.see && (
        <CountsDialogs
          openDialog={openDialog.see}
          closeDialogs={closeDialogs}
          dataRequests={metaData?.globalInfo?.countsByType || []}
        />
      )}
    </>
  );
};

export default CountsProperties;
