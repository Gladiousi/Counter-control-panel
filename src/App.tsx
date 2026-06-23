import { useEffect, useState } from 'react';
import { metersApi } from './api/metersApi';
import type { MeterDTO } from './types/api';
import { formatDate, getMeterLabel } from './utils/formatters';
import { TableHeaderCell } from './components/TableHeaderCell';
import { HotWater } from '../public/svg/HotWater';
import { ColdWater } from '../public/svg/ColdWater';
import { TableCell } from './components/TableCell';

function App() {
  const [meters, setMeters] = useState<MeterDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await metersApi.getMeters(20, 0);
        setMeters(data.results);
      } catch (err) {
        setError('Не удалось загрузить данные');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-500 font-medium">
        Загрузка счетчиков...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-red-500 font-semibold">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen min-w-full bg-slate-50 p-4">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-black text-left">
          Список счётчиков
        </h1>

        <div className="overflow-y-auto max-h-[calc(100vh-100px)] rounded-xl border border-[#E0E5EB] bg-white shadow-sm">
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
            <tbody className="divide-y divide-[#E0E5EB] text-sm">
              {meters.map((meter, index) => (
                <tr
                  key={meter.id}
                  className="hover:bg-[#f7f8f9] transition-colors duration-300"
                >
                  <TableCell>{index + 1}</TableCell>

                  <TableCell className="flex items-center gap-2">
                    {meter._type.includes('HotWaterAreaMeter') ? (
                      <HotWater />
                    ) : (
                      <ColdWater />
                    )}
                    {getMeterLabel(meter._type)}
                  </TableCell>
                  <TableCell>{formatDate(meter.installation_date)}</TableCell>
                  <TableCell>{meter.is_automatic ? 'Да' : 'Нет'}</TableCell>
                  <TableCell>{meter.initial_values[0] ?? 0}</TableCell>
                  <TableCell className="text-slate-400 font-semibold">
                    -
                  </TableCell>
                  <TableCell>{meter.description || '-'}</TableCell>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
