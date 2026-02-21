import LoginForm from "@/components/auth/LoginForm";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <Image src="/r-logo.png" alt="Logo" width={48} height={48} />
          </div>
          <h1 className="text-2xl font-bold text-white">Resto Planner</h1>
          <p className="mt-1 text-sm text-gray-500">Admin login</p>
        </div>

        <div className="rounded-2xl bg-[#111111] border border-[#2a2a2a] p-8">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
