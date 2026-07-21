import process from 'node:process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

const isProduction = process.env.NODE_ENV === 'production';
const SERVER_COMMAND = isProduction ? process.execPath : 'npx';
const SERVER_ARGS = isProduction
  ? [path.join(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..'), 'dist', 'mcp', 'server.js')]
  : ['tsx', 'src/mcp/server.ts'];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..', '..');

let client: Client | null = null;
let transport: StdioClientTransport | null = null;
let initPromise: Promise<void> | null = null;
let initialized = false;

const buildClient = () => new Client({ name: 'CopilotoPC-MCP-Client', version: '1.0.0' }, { capabilities: {} });

export const initializeMcpClient = async (): Promise<void> => {
  if (initialized && client) {
    return;
  }

  if (initPromise) {
    return initPromise;
  }

  initPromise = (async () => {
    transport = new StdioClientTransport({
      command: SERVER_COMMAND,
      args: SERVER_ARGS,
      cwd: ROOT_DIR,
      env: process.env as Record<string, string>,
      stderr: 'pipe',
    });

    transport.stderr?.on('data', (chunk) => {
      console.error('[MCP server stderr]', chunk.toString());
    });

    transport.onerror = (error) => {
      console.error('[MCP transport error]', error);
    };

    client = buildClient();
    await client.connect(transport);
    initialized = true;
  })();

  try {
    await initPromise;
  } catch (error) {
    initPromise = null;
    throw error;
  }
};

export const callTool = async (toolName: string, params: Record<string, unknown>) => {
  await initializeMcpClient();

  if (!client) {
    throw new Error('MCP client is not initialized.');
  }

  const result = await client.callTool({
    name: toolName,
    arguments: params,
  });

  return result?.structuredContent ?? result;
};
