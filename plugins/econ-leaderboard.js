import { areJidsSameUser } from 'baileys-pro'

let handler = async (m, { conn, args, participants }) => {
  let users = Object.entries(global.db.data.users).map(([key, value]) => {
    return { ...value, jid: key }
  })

  // Sort datasets
  let sortedExp = users.map(toNumber('exp')).sort(sort('exp'))
  let sortedGold = users.map(toNumber('gold')).sort(sort('gold'))
  let sortedBank = users.map(toNumber('bank')).sort(sort('bank'))
  let sortedDiamond = users.map(toNumber('diamond')).sort(sort('diamond'))
  let sortedLevel = users.map(toNumber('level')).sort(sort('level'))

  // Map users
  let usersExp = sortedExp.map(enumGetKey)
  let usersGold = sortedGold.map(enumGetKey)
  let usersBank = sortedBank.map(enumGetKey)
  let usersDiamond = sortedDiamond.map(enumGetKey)
  let usersLevel = sortedLevel.map(enumGetKey)

  // Length of leaderboard (default = 5)
  let len = args[0] && args[0].length > 0
    ? Math.min(50, Math.max(parseInt(args[0]), 5))
    : Math.min(5, sortedGold.length)

  // Build text
  let text = `
╭━━━〔 📊 *LEADERBOARD* 〕━━━╮

┣━━━〔 🪙 *TOP ${len} GOLD* 〕
┃ You: *${usersGold.indexOf(m.sender) + 1}* of *${usersGold.length}*
${sortedGold.slice(0, len).map(({ jid, gold }, i) =>
  `┃ *${i + 1}.* ${participants.some(p => areJidsSameUser(jid, p.id))
    ? `*${conn.getName(jid)}*`
    : `@${jid.split`@`[0]}`} ➭ ${gold.toLocaleString()} 🪙`).join`\n`}

┣━━━〔 💎 *TOP ${len} DIAMONDS* 〕
┃ You: *${usersDiamond.indexOf(m.sender) + 1}* of *${usersDiamond.length}*
${sortedDiamond.slice(0, len).map(({ jid, diamond }, i) =>
  `┃ *${i + 1}.* ${participants.some(p => areJidsSameUser(jid, p.id))
    ? `*${conn.getName(jid)}*`
    : `@${jid.split`@`[0]}`} ➭ ${diamond.toLocaleString()} 💎`).join`\n`}

┣━━━〔 ⭐ *TOP ${len} XP* 〕
┃ You: *${usersExp.indexOf(m.sender) + 1}* of *${usersExp.length}*
${sortedExp.slice(0, len).map(({ jid, exp }, i) =>
  `┃ *${i + 1}.* ${participants.some(p => areJidsSameUser(jid, p.id))
    ? `*${conn.getName(jid)}*`
    : `@${jid.split`@`[0]}`} ➭ ${exp.toLocaleString()} ⭐`).join`\n`}

┣━━━〔 🏦 *TOP ${len} BANK* 〕
┃ You: *${usersBank.indexOf(m.sender) + 1}* of *${usersBank.length}*
${sortedBank.slice(0, len).map(({ jid, bank }, i) =>
  `┃ *${i + 1}.* ${participants.some(p => areJidsSameUser(jid, p.id))
    ? `*${conn.getName(jid)}*`
    : `@${jid.split`@`[0]}`} ➭ ${bank.toLocaleString()} 🏦`).join`\n`}

┣━━━〔 ⬆️ *TOP ${len} LEVELS* 〕
┃ You: *${usersLevel.indexOf(m.sender) + 1}* of *${usersLevel.length}*
${sortedLevel.slice(0, len).map(({ jid, level }, i) =>
  `┃ *${i + 1}.* ${participants.some(p => areJidsSameUser(jid, p.id))
    ? `*${conn.getName(jid)}*`
    : `@${jid.split`@`[0]}`} ➭ Level ${level}`).join`\n`}

╰━━━━━━━━━━━━━━━━━━━━━━━╯
`.trim()

  conn.reply(m.chat, text, m, {
    mentions: [
      ...usersGold.slice(0, len),
      ...usersDiamond.slice(0, len),
      ...usersExp.slice(0, len),
      ...usersBank.slice(0, len),
      ...usersLevel.slice(0, len)
    ]
  })
}

handler.help = ['leaderboard', 'lb', 'top']
handler.tags = ['econ']
handler.command = ['leaderboard', 'lb', 'top']

export default handler

// Helpers
function sort(property, ascending = true) {
  if (property) return (...args) => args[ascending & 1][property] - args[!ascending & 1][property]
  else return (...args) => args[ascending & 1] - args[!ascending & 1]
}

function toNumber(property, _default = 0) {
  if (property) return (a, i, b) => {
    return { ...b[i], [property]: a[property] === undefined ? _default : a[property] }
  }
  else return a => a === undefined ? _default : a
}

function enumGetKey(a) {
  return a.jid
}