let handler = async (m, { conn }) => {
    let who = m.quoted 
        ? m.quoted.sender 
        : m.mentionedJid && m.mentionedJid[0] 
            ? m.mentionedJid[0] 
            : m.fromMe 
                ? conn.user.jid 
                : m.sender

    if (!(who in global.db.data.users)) throw `✳️ User not found in database`

    let user = global.db.data.users[who]

    let gold = user.gold || 0
    let exp = user.exp || 0
    let diamond = user.diamond || 0
    let bank = user.bank || 0

    let text = `
≡ *Wallet of:* @${who.split('@')[0]}

💰 *WALLET*
┌───⊷
▢ *💎 Diamonds:* ${diamond.toLocaleString()}
▢ *🪙 Gold:* ${gold.toLocaleString()}
▢ *⭐ XP:* ${exp.toLocaleString()}
▢ *🏦 Bank:* ${bank.toLocaleString()}
└──────────────
`.trim()

    await conn.reply(m.chat, text, m, { mentions: [who] })
}

handler.help = ['balance', 'bal', 'wallet']
handler.tags = ['econ']
handler.command = ['balance', 'bal', 'wallet']

export default handler