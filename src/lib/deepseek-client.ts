const DEEPSEEK_BASE_URL = 'https://api.deepseek.com/v1';

export interface CorrectionResult {
  suggestion: string;
  shortSuggestion: string;
}

/**
 * Call DeepSeek V4 directly from browser (no API route needed).
 */
export async function getPostureCorrection(
  postureData: string,
  apiKey: string
): Promise<CorrectionResult | null> {
  if (!apiKey) return null;

  try {
    const res = await fetch(`${DEEPSEEK_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-v4-pro',
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
          { role: 'user', content: postureData },
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' },
      }),
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) return null;

    const json = await res.json();
    const content = json.choices?.[0]?.message?.content;
    if (!content) return null;

    return JSON.parse(content) as CorrectionResult;
  } catch {
    return null;
  }
}
