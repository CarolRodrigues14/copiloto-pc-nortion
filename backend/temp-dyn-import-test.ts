import path from "path"

async function main() {
  const filePath = path.resolve("../orchestrator/src/orchestrator.ts")
  console.log("filePath=", filePath)
  const module = await import(filePath)
  console.log("module keys=", Object.keys(module))
}

main().catch(err => { console.error(err); process.exit(1) })
