import { z } from 'zod';

export const searchResultSchema = z.object({
  id: z.string(),
  titulo: z.string(),
  conteudo: z.string(),
  categoria: z.string(),
  relevancia: z.number(),
});

export type SearchResult = z.infer<typeof searchResultSchema>;

export const buscarDocumentoInputSchema = z.object({
  termo_busca: z.string().min(1),
  categoria_filtro: z.string().optional().nullable(),
  match_count: z.number().int().positive().default(3),
});

export const consultarMetricaInputSchema = z.object({
  nome_metrica: z.string().min(1),
  match_count: z.number().int().positive().default(3),
});

export const consultarFeriadosInputSchema = z.object({
  ano: z.number().int().gte(2000),
});

export const feriadoSchema = z.object({
  date: z.string(),
  name: z.string(),
  type: z.string().optional(),
});

export type Holiday = z.infer<typeof feriadoSchema>;
