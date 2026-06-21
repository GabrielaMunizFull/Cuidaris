"use client";

import { useActionState, useRef } from "react";
import { Avatar } from "@cuidaris/ui";
import { Camera } from "lucide-react";
import type { ActionResult } from "../actions";

type ExtendedResult = ActionResult & { success?: boolean };
const initial: ExtendedResult = {};

interface FotoUploadFormProps {
  action: (prevState: ExtendedResult, formData: FormData) => Promise<ExtendedResult>;
  nomeProfissional: string;
  fotoAtual?: string | null;
}

export function FotoUploadForm({ action, nomeProfissional, fotoAtual }: FotoUploadFormProps) {
  const [state, formAction, isPending] = useActionState(action, initial);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <form action={formAction} className="flex items-center gap-5">
      {/* Preview do avatar atual */}
      <div className="relative shrink-0">
        <Avatar name={nomeProfissional} src={fotoAtual ?? undefined} size="lg" />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[var(--accent)] flex items-center justify-center shadow-sm hover:bg-[var(--accent-hover)] transition-colors"
          title="Escolher foto"
        >
          <Camera size={11} className="text-white" />
        </button>
      </div>

      <div className="flex-1 min-w-0">
        {state.success && (
          <p className="text-xs text-emerald-600 mb-2">Foto atualizada com sucesso.</p>
        )}
        {state.error && (
          <p className="text-xs text-red-600 mb-2">{state.error}</p>
        )}
        {state.fieldErrors?.foto && (
          <p className="text-xs text-red-600 mb-2">{state.fieldErrors.foto[0]}</p>
        )}

        <input
          ref={inputRef}
          name="foto"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              e.target.form?.requestSubmit();
            }
          }}
        />

        <p className="text-xs text-[var(--ink-3)]">
          {isPending ? "Enviando…" : "Clique no ícone para trocar a foto · JPG, PNG ou WebP · Máx. 3 MB"}
        </p>
      </div>
    </form>
  );
}
