import OpenAI from 'openai';

export interface CorrectionResult {
  suggestion: string;
  shortSuggestion: string;
}

export async function getPostureCorrection(
  postureData: string,
  apiKey?: string
): Promise<CorrectionResult | null> {
  const key = apiKey || process.env.DEEPSEEK_API_KEY || '';
  if (!key) return null;

  const client = new OpenAI({
    baseURL: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1',
    apiKey: key,
    timeout: 10000,
    maxRetries: 2,
  });

  try {
    const completion = await client.chat.completions.create({
      model: process.env.DEEPSEEK_MODEL || 'deepseek-v4-flash',
      messages: [
        {
          role: 'system',
          content: `你是一个专业姿态矫正教练。根据用户姿态检测数据，给出简洁的纠正建议。
要求：
1. 回答使用中文，口语化，适合语音播报
2. 每句不超过20个字
3. 给出具体可操作的建议
4. 输出JSON格式: { "suggestion": "完整建议", "shortSuggestion": "简短版（15字内）" }`,
        },
        {
          role: 'user',
          content: postureData,
        },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) return null;

    return JSON.parse(content) as CorrectionResult;
  } catch (error) {
    console.error('DeepSeek API error:', error);
    return null;
  }
}
