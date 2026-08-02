import { SdkCenter } from "@/components/proapi/SdkCenter";

export default function SdksPage() {
  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">SDK Center</h1>
        <p className="mt-1 text-sm text-slate-600">
          Official client libraries — install, quick start, methods, and examples.
        </p>
      </header>
      <SdkCenter />
    </div>
  );
}
