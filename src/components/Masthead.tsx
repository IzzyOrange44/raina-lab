type Props = {
  title: string
  subtitle?: string
  kicker?: string
}

export default function Masthead({ title, subtitle, kicker }: Props) {
  return (
    <header className="relative pb-10 mb-14 sm:mb-20 border-b border-[color:var(--color-line)]">
      {kicker && (
        <p className="label-strong mb-5 rise rise-1">{kicker}</p>
      )}
      <h1 className="display-xl text-[clamp(2.75rem,8vw,6rem)] text-balance rise rise-2">
        {title}
      </h1>
      {subtitle && (
        <p className="text-lg sm:text-xl text-[color:var(--color-ink-3)] mt-5 leading-[1.45] max-w-[44rem] rise rise-3">
          {subtitle}
        </p>
      )}
    </header>
  )
}
