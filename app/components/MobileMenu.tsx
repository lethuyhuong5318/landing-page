"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type MobileMenuLink = { href: string; label: string };

export default function MobileMenu({ links, navId }: { links: MobileMenuLink[]; navId: string }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div className={`mobile-menu${open ? " is-open" : ""}`}>
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
      {mounted && createPortal(
        <div className={`mobile-menu-layer${open ? " is-open" : ""}`} aria-hidden={!open}>
          <button className="mobile-menu-backdrop" type="button" aria-label="Đóng menu" tabIndex={open ? 0 : -1} onClick={() => setOpen(false)} />
          <nav className="mobile-menu-panel" id={navId} aria-label="Điều hướng mobile">
            <button className="mobile-menu-close" type="button" aria-label="Đóng menu" onClick={() => setOpen(false)}>×</button>
            <div className="mobile-menu-heading"><small>CHAMCHAMEDEMY</small><strong>Khám phá nội dung</strong></div>
            {links.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
                {link.label}
              </a>
            ))}
          </nav>
        </div>,
        document.body,
      )}
    </div>
  );
}