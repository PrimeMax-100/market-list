import type { ReactNode } from "react";

interface CategorySectionProps {
  label: string;
  dotColor?: string;
  icon?: ReactNode;
  labelClassName?: string;
  children: ReactNode;
  className?: string;
}

export function CategorySection({
  label,
  dotColor,
  icon,
  labelClassName = "text-subtle",
  children,
  className = "mb-5",
}: CategorySectionProps) {
  return (
    <section className={className}>
      <div className="mb-2 flex items-center gap-2">
        {dotColor && <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: dotColor }} />}
        {icon}
        <span className={`text-[13px] font-semibold ${labelClassName}`}>{label}</span>
      </div>
      <div className="flex flex-col gap-1.5">{children}</div>
    </section>
  );
}
