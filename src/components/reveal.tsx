"use client";

import Link from "next/link";
import { type ElementType, useEffect, useState } from "react";

type RevealProps = {
  as?: ElementType;
  href?: string;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
} & Record<string, unknown>;

export function Reveal({
  as,
  href,
  delay = 0,
  className = "",
  style: styleProp,
  children,
  ...rest
}: RevealProps) {
  const [node, setNode] = useState<Element | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShown(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [node]);

  const classes = `reveal ${shown ? "reveal-in" : ""} ${className}`;
  const style = { ...styleProp, transitionDelay: `${delay}ms` };

  if (href !== undefined) {
    return (
      <Link
        href={href}
        ref={setNode}
        className={classes}
        style={style}
        {...rest}
      >
        {children}
      </Link>
    );
  }

  const Comp = (as ?? "div") as ElementType;
  return (
    <Comp ref={setNode} className={classes} style={style} {...rest}>
      {children}
    </Comp>
  );
}
