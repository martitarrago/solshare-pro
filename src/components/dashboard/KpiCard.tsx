import { useEffect, useState } from "react";
import { LucideIcon } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: number;
  suffix?: string;
  prefix?: string;
  icon: LucideIcon;
  trend?: string;
  delay?: number;
}

export function KpiCard({ title, value, suffix = "", prefix = "", icon: Icon, trend, delay = 0 }: KpiCardProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const duration = 600;
      const steps = 25;
      const increment = value / steps;
      let current = 0;
      const interval = setInterval(() => {
        current += increment;
        if (current >= value) {
          setDisplayValue(value);
          clearInterval(interval);
        } else {
          setDisplayValue(Math.floor(current));
        }
      }, duration / steps);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [value, delay]);

  return (
    <div className="glass-card rounded-xl p-4 hover-lift">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg solar-gradient flex items-center justify-center">
          <Icon className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="text-xs text-muted-foreground">{title}</span>
        {trend && (
          <span className="text-[11px] font-medium text-primary ml-auto">
            {trend}
          </span>
        )}
      </div>
      <p className="text-xl font-semibold text-foreground tabular-nums">
        {prefix}{displayValue.toLocaleString("es-ES")}{suffix}
      </p>
    </div>
  );
}
