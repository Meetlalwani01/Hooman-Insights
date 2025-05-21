// src/app/api/conversations/route.ts
import { NextResponse } from 'next/server'
import conversations from '@/data/conversations.json'

export async function GET() {
  return NextResponse.json(conversations)
}
