import 'dotenv/config';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { buscarDocumento } from './tools/buscarDocumento.js';
import { consultarMetrica } from './tools/consultarMetrica.js';
import { consultarFeriados } from './tools/consultarFeriados.js';
import { buscarDocumentoInputSchema, consultarMetricaInputSchema, consultarFeriadosInputSchema, searchResultSchema, feriadoSchema } from './types.js';
import process from 'node:process';

const SERVER_NAME = 'CopilotoPC-MCP';
const SERVER_VERSION = '1.0.0';

const transport = new StdioServerTransport();
let mcpServer: McpServer | null = null;

const registerTools = (server: McpServer) => {
  server.registerTool('buscar_documento', {
    title: 'Buscar documento',
    description: 'Busca trechos em knowledge_documents usando busca full-text SQL.',
    inputSchema: buscarDocumentoInputSchema,
    outputSchema: z.object({ results: z.array(searchResultSchema) }),
  }, async (args) => {
    const result = await buscarDocumento(args);
    return {
      content: [{ type: 'text', text: 'Resultado de busca de documentos.' }],
      structuredContent: result,
    };
  });

  server.registerTool('consultar_metrica', {
    title: 'Consultar métrica',
    description: 'Busca métricas no dicionário de métricas usando categoria metricas.',
    inputSchema: consultarMetricaInputSchema,
    outputSchema: z.object({ results: z.array(searchResultSchema) }),
  }, async (args) => {
    const result = await consultarMetrica(args);
    return {
      content: [{ type: 'text', text: 'Resultado de consulta de métrica.' }],
      structuredContent: result,
    };
  });

  server.registerTool('consultar_feriados', {
    title: 'Consultar feriados',
    description: 'Consulta feriados nacionais via BrasilAPI. Não filtra por UF.',
    inputSchema: consultarFeriadosInputSchema,
    outputSchema: z.object({ holidays: z.array(feriadoSchema) }),
  }, async (args) => {
    const result = await consultarFeriados(args);
    return {
      content: [{ type: 'text', text: 'Resultado de consulta de feriados.' }],
      structuredContent: result,
    };
  });
};

export const startMcpServer = async () => {
  if (mcpServer) {
    return mcpServer;
  }

  mcpServer = new McpServer({ name: SERVER_NAME, version: SERVER_VERSION }, {
    capabilities: {}
  });

  registerTools(mcpServer);
  await mcpServer.connect(transport);
  console.error('MCP server started on stdio');
  return mcpServer;
};

export const stopMcpServer = async () => {
  if (!mcpServer) {
    return;
  }

  await mcpServer.close();
  mcpServer = null;
};

if (process.argv[1]?.endsWith('server.ts') || process.argv[1]?.endsWith('server.js')) {
  startMcpServer().catch((error) => {
    console.error('Failed to start MCP server:', error);
    process.exit(1);
  });
}
