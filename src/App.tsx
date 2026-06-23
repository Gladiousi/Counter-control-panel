import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { rootStore } from './store/MetersStore';
import { formatAddress, formatDate, getMeterLabel } from './utils/formatters';
import { TableHeaderCell } from './components/TableHeaderCell';
import { TableCell } from './components/TableCell';
import { Pagination } from './components/Pagination';
import { HotWater } from '../public/svg/HotWater';
import { ColdWater } from '../public/svg/ColdWater';
import { Trash } from '../public/svg/Trash';

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
    deleteMeter,
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
    <div className="h-screen w-full bg-[#f8f9fa] p-4 flex flex-col overflow-hidden">
      <div className="flex flex-col gap-4 flex-1 overflow-hidden">
        <h1 className="text-2xl font-bold text-black text-left shrink-0">
          Список счётчиков
        </h1>

        <div className="rounded-xl border border-[#E0E5EB] bg-white flex flex-col overflow-hidden flex-1">
          <div className="overflow-hidden scrollbar-gutter-stable bg-[#f1f5f9]">
            <table className="w-full text-left border-collapse table-fixed">
              <colgroup>
                <col className="w-[5%]" />
                <col className="w-[10%]" />
                <col className="w-[12%]" />
                <col className="w-[12%]" />
                <col className="w-[12%]" />
                <col className="w-[32%]" />
                <col className="w-[15%]" />
              </colgroup>
              <thead>
                <tr>
                  <TableHeaderCell>№</TableHeaderCell>
                  <TableHeaderCell>Тип</TableHeaderCell>
                  <TableHeaderCell>Дата установки</TableHeaderCell>
                  <TableHeaderCell>Автоматический</TableHeaderCell>
                  <TableHeaderCell>Текущие показания</TableHeaderCell>
                  <TableHeaderCell>Адрес</TableHeaderCell>
                  <TableHeaderCell>Примечание</TableHeaderCell>
                </tr>
              </thead>
            </table>
          </div>

          <div className="flex-1 overflow-y-auto custom-table-scrollbar scrollbar-gutter-stable">
            <table className="w-full text-left border-collapse table-fixed">
              <colgroup>
                <col className="w-[5%]" />
                <col className="w-[10%]" />
                <col className="w-[12%]" />
                <col className="w-[12%]" />
                <col className="w-[12%]" />
                <col className="w-[32%]" />
                <col className="w-[15%]" />
              </colgroup>
              <tbody
                className={`divide-y divide-[#E0E5EB] ${
                  isLoading ? 'opacity-60' : ''
                }`}
              >
                {meters.map((meter, index) => {
                  const cachedArea = areasCache.get(meter.area.id);

                  return (
                    <tr
                      key={meter.id}
                      className="group hover:bg-[#f7f8f9] text-black transition-colors duration-300"
                    >
                      <TableCell className="text-[#5E6674]">
                        {offset + index + 1}
                      </TableCell>

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
                      <TableCell>{meter.is_automatic ? 'да' : 'нет'}</TableCell>
                      <TableCell>{meter.initial_values[0] ?? 0}</TableCell>

                      <TableCell>
                        {cachedArea ? (
                          formatAddress(cachedArea)
                        ) : (
                          <span className="animate-pulse">
                            Загрузка адреса...
                          </span>
                        )}
                      </TableCell>

                      <TableCell className="flex items-center w-full justify-between text-[#5E6674]">
                        {meter.description || '-'}
                        <button
                          type="button"
                          onClick={() => deleteMeter(meter.id)}
                          className="flex size-10 p-3 items-center justify-center rounded-lg bg-[#fee3e3] text-[#c53030] opacity-0 transition-all duration-200 hover:bg-[#fed7d7] hover:text-[#9b2c2c] group-hover:opacity-100"
                          title="Удалить счётчик"
                        >
                          <Trash />
                        </button>
                      </TableCell>
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
