import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

interface CopyButtonProps {
  value: string
  label?: string
}

export default function CopyButton({
  value,
  label = 'Copy',
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setError(false)

      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
      setError(true)
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={() => void handleCopy()}
        className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-zinc-300 transition hover:border-amber-400/40 hover:text-amber-300"
        aria-label={`${label} ID`}
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
        {copied ? 'Copied' : label}
      </button>

      {error && (
        <span role="status" className="text-xs text-red-300">
          Copy failed
        </span>
      )}
    </div>
  )
}
