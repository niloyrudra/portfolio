import { NextRequest, NextResponse } from 'next/server'
import { getMessages, markMessageRead, deleteMessage } from '@/lib/db'
import { getAuthFromCookies } from '@/lib/auth'

export const runtime = 'nodejs'

async function requireAuth() {
  const auth = await getAuthFromCookies()
  if (!auth) return null
  return auth
}

export async function GET() {
  if (!await requireAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const messages = getMessages(100)
  return NextResponse.json(messages)
}

export async function PATCH(req: NextRequest) {
  if (!await requireAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await req.json()
  markMessageRead(Number(id))
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  if (!await requireAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await req.json()
  deleteMessage(Number(id))
  return NextResponse.json({ ok: true })
}
