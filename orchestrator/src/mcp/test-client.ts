import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import process from 'node:process';

const serverCommand = 'npx';
const serverArgs = ['tsx', 'src/mcp/server.ts'];

const client = new Client({ name: 'MCP Test Client', version: '1.0.0' }, {
  capabilities: {}
});

const transport = new StdioClientTransport({
  command: serverCommand,
  args: serverArgs,
  cwd: process.cwd(),
  env: process.env as Record<string, string>,
  stderr: 'pipe'
});

const run = async () => {
  transport.stderr?.on('data', (chunk) => {
    console.error('[server stderr]', chunk.toString());
  });
  transport.onerror = (error) => {
    console.error('[transport error]', error);
  };

  let connected = false;

  try {
    await client.connect(transport);
    connected = true;
    console.log('Connected to MCP server');

    const buscarDocumentoResult = await client.callTool({
      name: 'buscar_documento',
      arguments: {
        termo_busca: 'férias',
        match_count: 3
      }
    });
    console.log('buscar_documento result:', JSON.stringify(buscarDocumentoResult, null, 2));

    const consultarMetricaResult = await client.callTool({
      name: 'consultar_metrica',
      arguments: {
        nome_metrica: 'turnover',
        match_count: 3
      }
    });
    console.log('consultar_metrica result:', JSON.stringify(consultarMetricaResult, null, 2));

    const consultarFeriadosResult = await client.callTool({
      name: 'consultar_feriados',
      arguments: {
        ano: 2026
      }
    });
    console.log('consultar_feriados result:', JSON.stringify(consultarFeriadosResult, null, 2));
  }
  finally {
    if (connected) {
      try {
        await client.close();
      }
      catch (error) {
        console.error('[client close error]', error);
      }
    }

    try {
      await transport.close();
    }
    catch (error) {
      console.error('[transport close error]', error);
    }
  }
};

run().then(() => {
  console.log('Test client finished');
  process.exit(0);
}).catch((error) => {
  console.error('Test client failed:', error);
  process.exit(1);
});
