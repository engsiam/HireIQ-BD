import { cn } from "@/lib/utils";

interface SectionProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: "section" | "div";
  background?: "default" | "subtle" | "accent" | "none";
  padding?: "default" | "none" | "sm" | "lg";
}

export function Section({
  as: Component = "section",
  className,
  background = "default",
  padding = "default",
  children,
  ...props
}: SectionProps) {
  const backgrounds = {
    default: "",
    subtle: "bg-surface-container-low/30",
    accent: "bg-surface-container-lowest/50",
    none: "",
  };

  const paddings = {
    default: "px-6 md:px-12",
    none: "",
    sm: "px-4",
    lg: "px-8 md:px-16",
  };

  return (
    <Component
      className={cn(
        "py-16",
        backgrounds[background],
        className
      )}
      {...props}
    >
      <div className={cn("max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", paddings[padding])}>
        {children}
      </div>
    </Component>
  );
}