"use client";

import { useEffect, useRef, useState } from "react";

type MobileMenuLink = { href: string; label: string };

export default function MobileMenu({ links, navId }: { links: MobileMenuLink[]; navId: string }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: Event) {
      if (wrapRef.current && !wrapRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div className={`mobile-menu${open ? " is-open" : ""}`} ref={wrapRef}>
      <button
        className="mobile-menu-toggle"
        type="button"
        aria-label={open ? "Đóng menu" : "Mở menu"}
        aria-expanded={open}
        aria-controls={navId}
        onClick={() => setOpen((value) => !value)}
      >
        <span /><span /><span />
      </button>
      <button className="mobile-menu-backdrop" type="button" aria-label="Đóng menu" tabIndex={open ? 0 : -1} onClick={() => setOpen(false)} />
      <nav id={navId} aria-label="Điều hướng mobile" aria-hidden={!open}>
        <div className="mobile-menu-heading"><small>CHAMCHAMEDEMY</small><strong>Khám phá nội dung</strong></div>
        {links.map((link) => (
          <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
            {link.label}
          </a>
        ))}
      </nav>
    </div>
  );
}
