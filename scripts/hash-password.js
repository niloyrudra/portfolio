#!/usr/bin/env node
// Usage: node scripts/hash-password.js yourSecretPassword
const bcrypt = require('bcryptjs')
const password = process.argv[2]
if (!password) {
  console.error('Usage: node scripts/hash-password.js <password>')
  process.exit(1)
}
const hash = bcrypt.hashSync(password, 10)
console.log('\nYour bcrypt hash (paste into ADMIN_PASSWORD_HASH in .env):\n')
console.log(hash)
console.log()
