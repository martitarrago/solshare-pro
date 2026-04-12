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
      const duration = 800;
      const steps = 30;
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
    <div className="glass-card rounded-2xl p-5 hover-lift group">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        {trend && (
          <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
            {trend}
          </span>
        )}
      </div>
      <div className="animate-count-up">
        <p className="text-2xl font-heading font-bold text-foreground">
          {prefix}{displayValue.toLocaleString("es-ES")}{suffix}
        </p>
        <p className="text-sm text-muted-foreground mt-0.5">{title}</p>
      </div>
    </div>
  );
}
