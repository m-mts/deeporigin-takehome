"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({ value }: { value: string }) {
  const { pending } = useFormStatus();

  return (
    <input
      type="submit"
      value={pending ? "Loading…" : value}
      disabled={pending}
      className="btn btn-primary"
    />
  );
}