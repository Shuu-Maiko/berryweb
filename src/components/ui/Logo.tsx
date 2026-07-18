interface LogoProps {
  showText?: boolean
}

export function Logo({ showText = true }: LogoProps) {
  return (
    <div className="flex items-center gap-2 cursor-pointer select-none">
      <div className="flex h-5 w-5 flex-col justify-between">
        <div className="flex h-[8px] w-full gap-[3px]">
          <div className="h-full w-1/2 bg-text-primary transition-colors duration-200" />
          <div className="h-full w-1/2 bg-primary transition-colors duration-200" />
        </div>
        <div className="flex h-[8px] w-full gap-[3px]">
          <div className="h-full w-1/2 bg-primary transition-colors duration-200" />
          <div className="h-full w-1/2 bg-text-primary transition-colors duration-200" />
        </div>
      </div>
      {showText && (
        <span className="font-heading text-base font-bold text-text-primary flex items-center uppercase tracking-wider">
          Berry
        </span>
      )}
    </div>
  )
}
