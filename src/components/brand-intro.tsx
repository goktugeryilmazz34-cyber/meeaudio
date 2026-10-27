"use client";

import { useEffect, useState } from "react";

export function BrandIntro() {
  // Her tam sayfa yüklemesinde (yenileme) animasyon yeniden oynar.
  // Sayfa içi geçişlerde (Link) layout korunduğu için tekrar tetiklenmez.
  const [show, setShow] = useState(true);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const timer = setTimeout(() => {
      setShow(false);
      document.body.style.overflow = "";
    }, 3300);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "";
    };
  }, []);

  if (!show) return null;

  return (
    <div className="brand-intro" aria-hidden>
      <div className="brand-intro-inner">
        <div className="bi-box">
          <span className="bi-drop" />
          <span className="bi-ripple" />
          <span className="bi-bars">
            <i />
            <i />
            <i />
          </span>
        </div>
        <span className="bi-word">
          mee<b>audio</b>
        </span>
      </div>
    </div>
  );
}
