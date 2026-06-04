export type PostureIssue = 'slouching' | 'shrugging' | 'tilting';

export interface AnalysisResult {
  issues: PostureIssue[];
  details: string[];
}

const NOSE = 0;
const LEFT_SHOULDER = 11;
const RIGHT_SHOULDER = 12;
const LEFT_EAR = 7;
const RIGHT_EAR = 8;
const LEFT_HIP = 23;
const RIGHT_HIP = 24;

export function analyzePosture(landmarks: number[][]): AnalysisResult {
  if (!landmarks || landmarks.length < 25) {
    return { issues: [], details: [] };
  }

  const issues: PostureIssue[] = [];
  const details: string[] = [];

  const lEar = landmarks[LEFT_EAR];
  const rEar = landmarks[RIGHT_EAR];
  const lShoulder = landmarks[LEFT_SHOULDER];
  const rShoulder = landmarks[RIGHT_SHOULDER];
  const lHip = landmarks[LEFT_HIP];
  const rHip = landmarks[RIGHT_HIP];

  const earYAvg = (lEar[1] + rEar[1]) / 2;
  const shoulderYAvg = (lShoulder[1] + rShoulder[1]) / 2;
  const shoulderXAvg = (lShoulder[0] + rShoulder[0]) / 2;
  const earXAvg = (lEar[0] + rEar[0]) / 2;

  // 1. Slouching detection — head forward relative to shoulders
  if (earXAvg < shoulderXAvg - 0.05) {
    issues.push('slouching');
    details.push('检测到驼背：头部前倾，建议挺直背部，收下巴');
  }

  // 2. Shrugging detection — shoulders too high relative to ears
  const shoulderEarDiff = shoulderYAvg - earYAvg;
  if (shoulderEarDiff < 0.1) {
    issues.push('shrugging');
    details.push('检测到耸肩：肩膀过高，建议放松双肩，自然下沉');
  }

  // 3. Tilting detection — uneven shoulders
  const shoulderDiff = Math.abs(lShoulder[1] - rShoulder[1]);
  if (shoulderDiff > 0.04) {
    issues.push('tilting');
    const tiltDir = lShoulder[1] < rShoulder[1] ? '左肩偏高' : '右肩偏高';
    details.push(`检测到身体歪斜：${tiltDir}，建议双肩放平`);
  }

  // Hip tilt
  const hipDiff = Math.abs(lHip[1] - rHip[1]);
  if (hipDiff > 0.04) {
    if (!issues.includes('tilting')) issues.push('tilting');
    const hipTiltDir = lHip[1] < rHip[1] ? '左髋偏高' : '右髋偏高';
    details.push(`检测到骨盆倾斜：${hipTiltDir}，建议调整重心`);
  }

  return { issues, details };
}

export function formatPostureForAI(landmarks: number[][], issues: PostureIssue[]): string {
  const keyIndices = [0, 7, 8, 11, 12, 23, 24];
  const landmarkSummary = keyIndices
    .map(i => {
      if (i < landmarks.length) {
        const l = landmarks[i];
        return `landmark[${i}]: (${l[0].toFixed(3)}, ${l[1].toFixed(3)}, ${(l[2] || 0).toFixed(3)})`;
      }
      return null;
    })
    .filter(Boolean)
    .join('\n');

  return `姿态问题: [${issues.join(', ')}]\n关键点数据:\n${landmarkSummary}`;
}
