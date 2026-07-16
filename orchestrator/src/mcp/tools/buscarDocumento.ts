import { z } from 'zod';
import { supabase } from '../../lib/supabaseClient.js';
import { buscarDocumentoInputSchema, searchResultSchema } from '../types.js';

export const buscarDocumento = async (args: z.infer<typeof buscarDocumentoInputSchema>) => {
  const parsed = buscarDocumentoInputSchema.parse(args);

  const { data, error } = await supabase.rpc('buscar_documento_texto', {
    termo_busca: parsed.termo_busca,
    categoria_filtro: parsed.categoria_filtro ?? null,
    match_count: parsed.match_count,
  });

  if (error) {
    throw new Error(`Supabase buscar_documento_texto failed: ${error.message}`);
  }

  const results = (data ?? []).map((item: any) => searchResultSchema.parse(item));
  return { results };
};
