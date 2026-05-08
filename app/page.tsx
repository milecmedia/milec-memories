"use client";

import { useRef, useState } from "react";
import { Great_Vibes } from "next/font/google";

const weddingFont = Great_Vibes({
  subsets: ["latin", "latin-ext"],
  weight: "400",
});

export default function Home() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [guestName, setGuestName] = useState("");
  const [message, setMessage] = useState("");
  const [selectedCount, setSelectedCount] = useState(0);
  const [status, setStatus] = useState("");
  const [uploading, setUploading] = useState(false);

  async function uploadFiles() {
    const selectedFiles = fileInputRef.current?.files;

    if (!selectedFiles || selectedFiles.length === 0) {
      setStatus("Prvo odaberite fotografije ili videozapise.");
      return;
    }

    setUploading(true);
    setStatus(`Pronađeno ${selectedFiles.length} datoteka. Pokrećem prijenos...`);

    for (const file of Array.from(selectedFiles)) {
      try {
        setStatus(`Priprema: ${file.name}`);

        const fileType = file.type || "application/octet-stream";

        const res = await fetch("/api/create-upload-url", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            eventSlug: "ines-silvijo",
            fileName: file.name,
            fileType,
            guestName,
            message,
          }),
        });

        if (!res.ok) {
          setStatus("Greška kod pripreme prijenosa.");
          setUploading(false);
          return;
        }

        const { uploadUrl } = await res.json();

        setStatus(`Prijenos: ${file.name}`);

        const uploadRes = await fetch(uploadUrl, {
          method: "PUT",
          headers: {
            "Content-Type": fileType,
          },
          body: file,
        });

        if (!uploadRes.ok) {
          setStatus(`Prijenos nije uspio: ${file.name}`);
          setUploading(false);
          return;
        }
      } catch (error) {
        console.error(error);
        setStatus(`Prijenos nije uspio: ${file.name}`);
        setUploading(false);
        return;
      }
    }

    setStatus("Hvala ❤️ Vaše uspomene su uspješno prenesene.");
    setUploading(false);
    setSelectedCount(0);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  return (
    <main className="min-h-[100svh] bg-[#f8f3ee] flex items-center justify-center px-4 py-4">
      <section className="w-full max-w-lg rounded-[1.75rem] bg-white/95 shadow-2xl px-5 py-6 sm:p-8 text-center border border-[#e8d8bd]">
        <div className="text-[#c79a3b] text-3xl mb-2">♡</div>

        <p className="uppercase tracking-[0.28em] text-[10px] text-[#b68b3c] mb-2">
          Podijelite uspomene s vjenčanja
        </p>

        <h1
          className={`${weddingFont.className} text-6xl sm:text-7xl text-neutral-800 mb-3 leading-none`}
        >
          Ines & Silvijo
        </h1>

        <p className="text-neutral-600 leading-relaxed mb-5 text-sm sm:text-base">
          Prenesite trenutke koje smo možda propustili dok smo plesali.
          <br />
          Sve uspomene dobrodošle — čak i one nakon treće čaše 🍷
        </p>

        <div className="space-y-2.5 mb-4 text-left">
          <input
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            placeholder="Vaše ime (nije obavezno)"
            className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3.5 text-neutral-900 placeholder:text-neutral-500 placeholder:opacity-100 outline-none"
          />

          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Poruka za mladence (nije obavezno)"
            className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3.5 text-neutral-900 placeholder:text-neutral-500 placeholder:opacity-100 outline-none"
          />
        </div>

        <div className="rounded-2xl border-2 border-dashed border-[#ddb96f] p-4 mb-4 bg-[#fffaf1]">
          <div className="text-3xl mb-2">☁️</div>

          <p className="font-serif text-xl text-neutral-800 mb-3">
            Odaberite fotografije i videozapise
          </p>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*,.dng,.heic,.heif,.mov,.mp4,.jpg,.jpeg,.png"
            onChange={(e) => {
              const count = e.target.files?.length || 0;
              setSelectedCount(count);

              if (count > 0) {
                setStatus(
                  `${count} datoteka odabrano. Sada pritisnite "Prenesi uspomene".`
                );
              }
            }}
            className="block w-full rounded-xl border border-[#ddb96f] bg-white px-3 py-3 text-sm text-neutral-800"
          />

          <p className="text-xs text-neutral-500 mt-2">
            {selectedCount > 0
              ? `${selectedCount} datoteka odabrano`
              : "Nakon odabira pritisnite gumb za prijenos."}
          </p>
        </div>

        <button
          type="button"
          onClick={uploadFiles}
          disabled={uploading}
          className="w-full rounded-full bg-[#c99321] text-white py-3.5 text-base font-medium disabled:opacity-50"
        >
          {uploading ? "Prijenos u tijeku..." : "Prenesi uspomene"}
        </button>

        {status && <p className="mt-4 text-sm text-neutral-600">{status}</p>}

        <p className="mt-5 text-[11px] text-neutral-400">
          Molimo vas da ne zatvarate ovu stranicu dok prijenos ne završi.
        </p>

        <a
          href="https://www.instagram.com/mirkomilec"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 block text-xs text-[#b68b3c] underline underline-offset-4"
        >
          Powered by MILEC MEDIA
        </a>
      </section>
    </main>
  );
}