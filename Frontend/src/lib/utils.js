// src/lib/utils.js
export function cn(...inputs) {
  const classes = []
  for (const input of inputs) {
    if (!input) continue
    if (typeof input === "string") {
      classes.push(input)
      continue
    }
    if (Array.isArray(input)) {
      classes.push(...input.filter(Boolean).map(String))
      continue
    }
    if (typeof input === "object") {
      for (const [k, v] of Object.entries(input)) {
        if (v) classes.push(k)
      }
      continue
    }
  }
  return classes.join(" ").trim()
}
