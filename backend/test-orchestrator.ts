import { orchestrateQuestion } from './src/lib/orchestratorClient.ts'

async function main() {
  const res = await orchestrateQuestion('Quantos dias de férias eu tenho direito?', [])
  console.log(JSON.stringify(res, null, 2))
}

main().catch((err) => {
  console.error('ERROR', err)
  process.exit(1)
})
