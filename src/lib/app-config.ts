export function getAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL ?? process.env.NEXTAUTH_URL ?? 'http://localhost:3000'
}

export function getMailFrom() {
  return process.env.MAIL_FROM ?? 'AgendaFacil <noreply@agendafacil.com.br>'
}
