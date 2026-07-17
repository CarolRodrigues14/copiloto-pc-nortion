async function main() {
  const module = await import('./lib/orchestratorClient.ts')
  console.log(Object.keys(module))
}
main().catch(err => { console.error(err); process.exit(1) })
