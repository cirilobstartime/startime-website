"use client";

import { useField } from "@payloadcms/ui";
import type { TextFieldClientProps } from "payload";
import React, { useId, useState } from "react";

const palette = [
  { name: "Deep purple", hex: "#2e2449" },
  { name: "Eyebrow purple", hex: "#614787" },
  { name: "Purple", hex: "#5b4280" },
  { name: "Soft purple", hex: "#8c719e" },
  { name: "Brand beige", hex: "#d4bda3" },
  { name: "White", hex: "#ffffff" },
  { name: "Ink", hex: "#211933" },
] as const;

const isHex = (value: string) => /^#[0-9a-f]{6}$/i.test(value);

export function BrandColorField({ field, path }: TextFieldClientProps) {
  const { value, setValue, showError, errorMessage, disabled } = useField<string>({ path });
  const [customOpen, setCustomOpen] = useState(false);
  const inputId = useId();
  const selected = typeof value === "string" ? value : "";
  const pickerColor = isHex(selected) ? selected : "#2e2449";

  return (
    <div className="startime-color-field">
      <div className="startime-color-field__heading">
        <label htmlFor={inputId}>{typeof field.label === "string" ? field.label : field.name}</label>
        <span>{selected ? selected.toUpperCase() : "Use design default"}</span>
      </div>
      <div className="startime-color-field__swatches" role="group" aria-label={`${typeof field.label === "string" ? field.label : field.name} brand colors`}>
        <button aria-label="Use design default" aria-pressed={!selected} className={`startime-color-field__swatch startime-color-field__swatch--default ${!selected ? "is-selected" : ""}`} disabled={disabled} onClick={() => setValue("")} title="Use design default" type="button">—</button>
        {palette.map(({ name, hex }) => <button aria-label={`${name} ${hex}`} aria-pressed={selected.toLowerCase() === hex} className={`startime-color-field__swatch ${selected.toLowerCase() === hex ? "is-selected" : ""}`} disabled={disabled} key={hex} onClick={() => setValue(hex)} style={{ backgroundColor: hex }} title={`${name} · ${hex}`} type="button" />)}
        <button aria-expanded={customOpen} className="startime-color-field__custom-trigger" disabled={disabled} onClick={() => setCustomOpen((open) => !open)} type="button">Custom color</button>
      </div>
      {customOpen && <div className="startime-color-field__custom">
        <input aria-label="Choose a custom color" disabled={disabled} onChange={(event) => setValue(event.target.value)} type="color" value={pickerColor} />
        <input aria-label="Custom hex color" disabled={disabled} id={inputId} maxLength={7} onChange={(event) => setValue(event.target.value)} pattern="#[0-9A-Fa-f]{6}" placeholder="#2e2449" type="text" value={selected} />
      </div>}
      <p className="startime-color-field__help">Choose a brand color, enter a custom six-digit hex, or use the approved design default.</p>
      {showError && <p className="startime-color-field__error" role="alert">{errorMessage}</p>}
    </div>
  );
}
