'use client';

type Gender = 'male' | 'female' | 'all';
type Difficulty = 'beginner' | 'intermediate' | 'advanced';

interface Props {
  gender: Gender;
  difficulty: Difficulty | 'all';
  onGenderChange: (g: Gender) => void;
  onDifficultyChange: (d: Difficulty | 'all') => void;
}

export default function FilterBar({ gender, difficulty, onGenderChange, onDifficultyChange }: Props) {
  const genders = [
    { value: 'all' as const, label: '全部' },
    { value: 'male' as const, label: '男性' },
    { value: 'female' as const, label: '女性' },
  ];

  const difficulties = [
    { value: 'all' as const, label: '全部' },
    { value: 'beginner' as const, label: '初级' },
    { value: 'intermediate' as const, label: '中级' },
    { value: 'advanced' as const, label: '高级' },
  ];

  const btnClass = (active: boolean) =>
    `px-3 py-1.5 text-sm rounded-full font-medium transition-all ${
      active
        ? 'bg-[var(--color-primary)] text-white shadow-sm'
        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
    }`;

  return (
    <div className="space-y-2 mb-4">
      <div className="flex gap-2 flex-wrap">
        {genders.map(g => (
          <button key={g.value} className={btnClass(gender === g.value)} onClick={() => onGenderChange(g.value)}>
            {g.label}
          </button>
        ))}
      </div>
      <div className="flex gap-2 flex-wrap">
        {difficulties.map(d => (
          <button key={d.value} className={btnClass(difficulty === d.value)} onClick={() => onDifficultyChange(d.value)}>
            {d.label}
          </button>
        ))}
      </div>
    </div>
  );
}
