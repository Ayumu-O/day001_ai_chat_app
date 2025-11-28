import type { ReactNode } from "react";

type GradientBackgroundProps = {
  children: ReactNode;
};

// グラデーション背景を提供するコンポーネント
export const GradientBackground = ({ children }: GradientBackgroundProps) => {
  return (
    <div className="bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.08),transparent_32%),radial-gradient(circle_at_80%_0%,rgba(16,185,129,0.08),transparent_30%)]">
      {children}
    </div>
  );
};
