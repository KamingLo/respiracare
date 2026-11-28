"use client";

import { X } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";

export function Sheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-label={title}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      className="fixed inset-x-0 bottom-0 top-auto m-0 mx-auto w-full max-w-[430px] rounded-t-[28px] border-0 bg-white p-0 text-ink backdrop:bg-ink/40 lg:inset-y-0 lg:my-auto lg:h-fit lg:max-h-[85dvh] lg:max-w-[480px] lg:rounded-[28px] lg:shadow-[0_24px_80px_-20px_rgba(13,46,30,0.45)]"
    >
      <div className="flex flex-col gap-4 px-5 pt-5 pb-[max(20px,env(safe-area-inset-bottom))] lg:p-6">
        <div className="flex items-center justify-between">
          <h2 className="t-section">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="flex size-10 items-center justify-center rounded-xl bg-mint text-brand-deep"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );
}
