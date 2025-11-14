import React from "react";

export default function Loading({ text="Loading..." }){
  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-pulse text-sm text-slate-600">{text}</div>
    </div>
  );
}
