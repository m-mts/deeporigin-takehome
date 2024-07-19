"use client";
import { useFormStatus } from "react-dom";

export function Input() {
  const { pending } = useFormStatus();

  return (
    <input
      type="text"
      disabled={pending}
      name="username"
      placeholder="no name"
      defaultValue="no name"
      required
      autoComplete="off"
      data-1p-ignore
      className="input input-bordered"
    />
  );
}