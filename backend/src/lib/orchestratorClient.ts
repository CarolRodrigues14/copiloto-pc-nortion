import http from 'http'
import https from 'https'
import { URL } from 'url'
import { config } from '../config'

type ConversationMessage = {
  role: 'user' | 'assistant' | 'system'
  content: string
}

type OrchestratorResponse = {
  resposta: string
  agente_responsavel: string
}

type SummaryResponse = {
  resumo: string
  recomendacoes: string[]
  agente_responsavel: string
}

export class OrchestratorTimeoutError extends Error {
  constructor(message = 'Orquestrador não respondeu a tempo') {
    super(message)
    this.name = 'OrchestratorTimeoutError'
  }
}

export class OrchestratorRequestError extends Error {
  constructor(message = 'Falha ao chamar o orquestrador') {
    super(message)
    this.name = 'OrchestratorRequestError'
  }
}

const orchestratorUrl = new URL(config.orchestratorUrl)

const sendOrchestratorRequest = async <TResponse>(path: string, payload: unknown): Promise<TResponse> => {
  const body = JSON.stringify(payload)
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 20_000)
  const protocol = orchestratorUrl.protocol === 'https:' ? https : http
  const requestPath = `${orchestratorUrl.pathname.replace(/\/$/, '')}${path}`

  return new Promise<TResponse>((resolve, reject) => {
    const req = protocol.request(
      {
        protocol: orchestratorUrl.protocol,
        hostname: orchestratorUrl.hostname,
        port: orchestratorUrl.port ? Number(orchestratorUrl.port) : undefined,
        path: requestPath,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
        },
        signal: controller.signal,
      },
      (res) => {
        let responseData = ''
        res.setEncoding('utf8')

        res.on('data', (chunk) => {
          responseData += chunk
        })

        res.on('end', () => {
          clearTimeout(timeout)

          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            try {
              resolve(JSON.parse(responseData) as TResponse)
            } catch (error) {
              reject(
                new OrchestratorRequestError(
                  `Falha ao parsear resposta do orquestrador: ${String(error)}\n${responseData}`,
                ),
              )
            }
            return
          }

          reject(
            new OrchestratorRequestError(
              `Orquestrador retornou status ${res.statusCode}: ${responseData}`,
            ),
          )
        })
      },
    )

    req.on('error', (error) => {
      clearTimeout(timeout)
      if ((error as any)?.name === 'AbortError') {
        reject(new OrchestratorTimeoutError())
        return
      }
      reject(new OrchestratorRequestError(String(error)))
    })

    req.write(body)
    req.end()
  })
}

export const orchestrateQuestion = async (
  question: string,
  conversationHistory: ConversationMessage[] = [],
): Promise<OrchestratorResponse> => {
  return sendOrchestratorRequest<OrchestratorResponse>('/orchestrate', {
    pergunta: question,
    historico: conversationHistory,
  })
}

export const summarizeConversation = async (
  conversationHistory: ConversationMessage[] = [],
): Promise<SummaryResponse> => {
  return sendOrchestratorRequest<SummaryResponse>('/summary', {
    historico: conversationHistory,
  })
}
