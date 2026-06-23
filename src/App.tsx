import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { rootStore } from './store/MetersStore';
import { formatAddress, formatDate, getMeterLabel } from './utils/formatters';
import { TableHeaderCell } from './components/TableHeaderCell';
import { TableCell } from './components/TableCell';
import { Pagination } from './components/Pagination';
import { HotWater } from '../public/svg/HotWater';
import { ColdWater } from '../public/svg/ColdWater';

export const App = observer(() => {
  const {
    meters,
    isLoading,
    offset,
    currentPage,
    totalPages,
    setPage,
    loadMeters,
    areasCache,
  } = rootStore;

  useEffect(() => {
    loadMeters();
  }, [loadMeters]);

  if (isLoading && meters.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white text-black">
        Загрузка счетчиков...
      </div>
    );
  }

  if (rootStore.error && meters.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white text-red-600">
        {rootStore.error}
      </div>
    );
  }

  return (
    <div className="h-screen min-w-full bg-[#f8f9fa] p-4">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-black text-left">
          Список счётчиков
        </h1>

        <div className="rounded-xl border border-[#E0E5EB] bg-white flex flex-col overflow-hidden">
          <div className="overflow-y-auto max-h-[calc(100vh-150px)]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <TableHeaderCell>№</TableHeaderCell>
                  <TableHeaderCell>Тип</TableHeaderCell>
                  <TableHeaderCell>Дата установки</TableHeaderCell>
                  <TableHeaderCell>Автоматический</TableHeaderCell>
                  <TableHeaderCell>Значение</TableHeaderCell>
                  <TableHeaderCell>Адрес</TableHeaderCell>
                  <TableHeaderCell>Примечание</TableHeaderCell>
                </tr>
              </thead>
              <tbody
                className={`divide-y divide-[#E0E5EB] text-sm ${isLoading ? 'opacity-60' : ''}`}
              >
                {meters.map((meter, index) => {
                  const cachedArea = areasCache.get(meter.area.id);

                  return (
                    <tr
                      key={meter.id}
                      className="hover:bg-[#f7f8f9] transition-colors duration-300"
                    >
                      <TableCell>{offset + index + 1}</TableCell>

                      <TableCell className="flex items-center gap-2">
                        {meter._type.includes('HotWaterAreaMeter') ? (
                          <HotWater />
                        ) : (
                          <ColdWater />
                        )}
                        {getMeterLabel(meter._type)}
                      </TableCell>

                      <TableCell>
                        {formatDate(meter.installation_date)}
                      </TableCell>
                      <TableCell>{meter.is_automatic ? 'Да' : 'Нет'}</TableCell>
                      <TableCell>{meter.initial_values[0] ?? 0}</TableCell>

                      <TableCell className="text-black font-normal">
                        {cachedArea ? (
                          formatAddress(cachedArea)
                        ) : (
                          <span className="text-slate-400 italic text-xs animate-pulse">
                            Загрузка адреса...
                          </span>
                        )}
                      </TableCell>

                      <TableCell>{meter.description || '-'}</TableCell>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
            disabled={isLoading}
          />
        </div>
      </div>
    </div>
  );
});
