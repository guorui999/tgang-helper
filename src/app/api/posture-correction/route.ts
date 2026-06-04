import { NextRequest, NextResponse } from 'next/server';
import { getPostureCorrection } from '@/lib/deepseek';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { issues, landmarkSummary, apiKey } = body;

    if (!issues || !landmarkSummary) {
      return NextResponse.json(
        { error: 'Missing required fields: issues, landmarkSummary' },
        { status: 400 }
      );
    }

    const postureText = `姿态问题: [${issues.join(', ')}]\n关键点数据:\n${landmarkSummary}`;
    const result = await getPostureCorrection(postureText, apiKey);

    if (!result) {
      return NextResponse.json(
        { error: 'Failed to get correction from AI. Check your API key.' },
        { status: 502 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Posture correction error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
