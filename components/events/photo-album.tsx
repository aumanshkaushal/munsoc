"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight, Maximize2, X } from "lucide-react";
import { useRef, useState, type KeyboardEvent } from "react";
import type { EventPhoto } from "@/lib/events";

export default function PhotoAlbum({ photos }: { photos: EventPhoto[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [current, setCurrent] = useState<number | null>(null);
  const photo = current === null ? null : photos[current];

  function move(offset: number) {
    setCurrent((index) => index === null ? null : (index + offset + photos.length) % photos.length);
  }

  function handleKeys(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      move(event.key === "ArrowLeft" ? -1 : 1);
    }
  }

  if (photos.length === 0) return null;

  return (
    <section aria-labelledby="album-heading" className="border-t border-border pt-6">
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3">
        <h2 id="album-heading" className="editorial-label">Photo album</h2>
        <p className="text-sm text-muted-foreground">{photos.length} photographs</p>
      </div>
      <ol className="album-photos">
        {photos.map((item, index) => (
          <li key={item.src}>
            <figure>
              <button
                type="button"
                aria-label={`Enlarge photo: ${item.caption}`}
                className="album-thumb group"
                onClick={(event) => {
                  trigger.current = event.currentTarget;
                  setCurrent(index);
                  dialog.current?.showModal();
                }}
              >
                <Image src={item.src} alt={item.alt} width={item.portrait ? 900 : 1200} height={item.portrait ? 1200 : 900} sizes="(max-width: 459px) 92vw, (max-width: 759px) 45vw, (max-width: 1279px) 30vw, 380px" className="h-auto w-full" />
                <span className="photo-expand" aria-hidden="true"><Maximize2 size={16} /></span>
              </button>
              <figcaption className="photo-caption"><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span> {item.caption}</figcaption>
            </figure>
          </li>
        ))}
      </ol>
      <dialog ref={dialog} className="photo-dialog" aria-labelledby="photo-dialog-title" onKeyDown={handleKeys} onClose={() => {
        trigger.current?.focus({ preventScroll: true });
        setCurrent(null);
      }}>
        <div className="dialog-inner">
          <div className="flex items-center justify-between gap-4">
            <h2 id="photo-dialog-title" className="text-sm">Youth Parliament 2026 / Photo album</h2>
            <button type="button" className="photo-control" aria-label="Close photo" onClick={() => dialog.current?.close()}><X size={21} aria-hidden="true" /></button>
          </div>
          <div className="dialog-photo">
            {photo && <Image key={photo.src} src={photo.src} alt={photo.alt} fill sizes="(max-width: 640px) 92vw, 90vw" className="object-contain" />}
          </div>
          <div className="flex items-center justify-between gap-4">
            <p aria-live="polite" className="text-sm">
              {photo && current !== null && <><span className="mr-2 text-white/70">{current + 1} / {photos.length}</span> {photo.caption}</>}
            </p>
            <div className="flex shrink-0 gap-2">
              <button type="button" className="photo-control" aria-label="Previous photo" onClick={() => move(-1)}><ArrowLeft size={19} aria-hidden="true" /></button>
              <button type="button" className="photo-control" aria-label="Next photo" onClick={() => move(1)}><ArrowRight size={19} aria-hidden="true" /></button>
            </div>
          </div>
        </div>
      </dialog>
    </section>
  );
}
