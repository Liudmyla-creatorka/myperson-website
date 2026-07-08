import type { ReactNode, Ref } from "react";

type ContainerProps = {
  children: ReactNode;
  className?: string;
  ref?: Ref<HTMLDivElement>;
};

export function Container({ children, className, ref }: ContainerProps) {
  const classes = className ? `container ${className}` : "container";
  return (
    <div ref={ref} className={classes}>
      {children}
    </div>
  );
}
