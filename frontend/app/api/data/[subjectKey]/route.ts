// app/api/subjects/route.ts
import { NextResponse } from 'next/server';
import { appData } from '@/lib/data';
import { Subject } from '@/lib/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userClass = searchParams.get('class');

  if (!userClass) {
    return NextResponse.json(
      { error: 'Class parameter is required' },
      { status: 400 }
    );
  }

  const subjectsForClass: { key: string; data: Subject }[] = Object.entries(
    appData.subjects
  )
    .filter(([_, subject]) => subject.class === userClass)
    .map(([key, subject]) => ({ key, data: subject }));

  return NextResponse.json(subjectsForClass);
}