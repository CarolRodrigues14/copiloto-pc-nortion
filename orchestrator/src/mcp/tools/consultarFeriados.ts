import { z } from 'zod';
import { consultarFeriadosInputSchema, feriadoSchema } from '../types.js';

export const consultarFeriados = async (args: z.infer<typeof consultarFeriadosInputSchema>) => {
  const parsed = consultarFeriadosInputSchema.parse(args);

  const response = await fetch(`https://brasilapi.com.br/api/feriados/v1/${parsed.ano}`);

  if (!response.ok) {
    throw new Error(
      `BrasilAPI request failed with status ${response.status}: ${response.statusText}`,
    );
  }

  const data = await response.json();

  if (!Array.isArray(data)) {
    throw new Error('BrasilAPI returned unexpected response format.');
  }

  const holidays = data.map((item: any) => feriadoSchema.parse({
    date: item.date,
    name: item.name,
    type: item.type ?? 'NACIONAL',
  }));

  return { holidays };
};
