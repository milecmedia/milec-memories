"use client";

import { useRef, useState } from "react";

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
    <main className="min-h-screen bg-[#f8f3ee] flex items-center justify-center px-4 py-10">
      <section className="w-full max-w-xl rounded-[2rem] bg-white/90 shadow-2xl p-6 sm:p-10 text-center border border-[#e8d8bd]">
        <div className="text-[#c79a3b] text-4xl mb-4">♡</div>

        <p className="uppercase tracking-[0.35em] text-xs text-[#b68b3c] mb-3">
          Podijelite uspomene s vjenčanja
        </p>

        <h1 className="text-5xl sm:text-6xl font-serif text-neutral-800 mb-6">
          Ines & Silvijo
        </h1>

        <p className="text-neutral-600 leading-relaxed mb-8">
          Prenesite fotografije i videozapise u originalnoj kvaliteti s našeg
          posebnog dana.
          <br />
          Bez aplikacije. Bez računa. Samo skenirajte i prenesite.
        </p>

        <div className="space-y-3 mb-5 text-left">
          <input
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            placeholder="Vaše ime (nije obavezno)"
            className="w-full rounded-xl border border-neutral-200 px-4 py-4 outline-none"
          />

          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Poruka za mladence (nije obavezno)"
            className="w-full rounded-xl border border-neutral-200 px-4 py-4 outline-none"
          />
        </div>

        <div className="rounded-2xl border-2 border-dashed border-[#ddb96f] p-6 mb-5 bg-[#fffaf1]">
          <div className="text-4xl mb-3">☁️</div>

          <p className="font-serif text-2xl text-neutral-800 mb-4">
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
            className="block w-full rounded-xl border border-[#ddb96f] bg-white px-4 py-4 text-sm text-neutral-700"
          />

          <p className="text-sm text-neutral-500 mt-3">
            {selectedCount > 0
              ? `${selectedCount} datoteka odabrano`
              : "Nakon odabira pritisnite gumb za prijenos."}
          </p>
        </div>

        <button
          type="button"
          onClick={uploadFiles}
          disabled={uploading}
          className="w-full rounded-full bg-[#c99321] text-white py-4 text-lg font-medium disabled:opacity-50"
        >
          {uploading ? "Prijenos u tijeku..." : "Prenesi uspomene"}
        </button>

        {status && <p className="mt-5 text-sm text-neutral-600">{status}</p>}

        <p className="mt-8 text-xs text-neutral-400">
          Molimo vas da ne zatvarate ovu stranicu dok prijenos ne završi.
        </p>

        <p className="mt-10 text-xs text-[#b68b3c]">
          Powered by MILEC Memories
        </p>
      </section>
    </main>
  );
}