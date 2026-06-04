'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const STORAGE_KEY = 'tgang-api-key';

export default function SettingsPage() {
  const router = useRouter();
  const [apiKey, setApiKey] = useState('');
  const [saved, setSaved] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'ok' | 'fail'>('idle');

  useEffect(() => {
    setApiKey(localStorage.getItem(STORAGE_KEY) || '');
  }, []);

  const handleSave = () => {
    const trimmed = apiKey.trim();
    if (trimmed) {
      localStorage.setItem(STORAGE_KEY, trimmed);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleTest = async () => {
    const key = apiKey.trim();
    if (!key) return;
    setTestStatus('testing');
    try {
      const res = await fetch('/api/posture-correction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          issues: ['slouching'],
          landmarkSummary: 'test',
          apiKey: key,
        }),
      });
      setTestStatus(res.ok ? 'ok' : 'fail');
    } catch {
      setTestStatus('fail');
    }
    setTimeout(() => setTestStatus('idle'), 3000);
  };

  return (
    <div className="animate-fade-in-up space-y-6 pt-2">
      {/* Header */}
      <div className="flex items-center gap-4 mb-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-500 to-gray-700 flex items-center justify-center text-white text-lg shadow-lg">
          ⚙️
        </div>
        <div>
          <h1 className="text-xl font-bold text-[var(--color-text)]">设置</h1>
          <p className="text-sm text-gray-400">配置 AI 服务</p>
        </div>
      </div>

      {/* API Key */}
      <div className="card space-y-4">
        <div>
          <label className="block text-sm font-semibold text-[var(--color-text)] mb-1">
            DeepSeek API Key
          </label>
          <p className="text-xs text-gray-400 mb-3">
            在 <a href="https://platform.deepseek.com/api_keys" target="_blank" rel="noreferrer" className="text-[var(--color-primary)] underline">platform.deepseek.com</a> 获取
          </p>
          <div className="relative">
            <input
              type="password"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm
                         focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)]
                         transition-all placeholder:text-gray-300"
            />
            <button
              onClick={() => setApiKey(prev => prev ? '' : '')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
            >
              {apiKey ? '清空' : ''}
            </button>
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={handleSave} className="btn-primary flex-1 text-sm">
            {saved ? '✓ 已保存' : '保存'}
          </button>
          <button
            onClick={handleTest}
            disabled={!apiKey.trim() || testStatus === 'testing'}
            className={`px-5 py-3 rounded-full text-sm font-semibold transition-all ${
              testStatus === 'testing'
                ? 'bg-gray-200 text-gray-400'
                : testStatus === 'ok'
                ? 'bg-green-100 text-green-700'
                : testStatus === 'fail'
                ? 'bg-red-100 text-red-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {testStatus === 'testing' ? '测试中...' : testStatus === 'ok' ? '✓ 可用' : testStatus === 'fail' ? '✗ 失败' : '测试'}
          </button>
        </div>
      </div>

      {/* About */}
      <div className="card space-y-2">
        <h3 className="font-semibold text-sm text-[var(--color-text)]">关于 tgang-helper</h3>
        <p className="text-xs text-gray-400 leading-relaxed">
          提肛助手 v1.0 — 科学盆底肌训练（凯格尔运动）助手。
          <br />
          所有姿态检测在本地浏览器运行，不上传服务器。
          <br />
          AI 纠正建议通过 DeepSeek V4 API 获取，需要自行配置 API Key。
        </p>
      </div>
    </div>
  );
}
