import { z } from 'zod';
import { supabase } from '../../lib/supabaseClient.js';
import { consultarMetricaInputSchema, searchResultSchema } from '../types.js';

export const consultarMetrica = async (args: z.infer<typeof consultarMetricaInputSchema>) => {
  const parsed = consultarMetricaInputSchema.parse(args);

  const { data, error } = await supabase.rpc('buscar_documento_texto', {
    termo_busca: parsed.nome_metrica,
    categoria_filtro: 'metricas',
    match_count: parsed.match_count,
  });

  if (error) {
    throw new Error(`Supabase buscar_documento_texto failed: ${error.message}`);
  }

  const results = (data ?? []).map((item: any) => searchResultSchema.parse(item));
  return { results };
};
