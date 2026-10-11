import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <main className="min-h-screen bg-emerald-50 px-6 py-10 flex items-center justify-center">
      <SignIn withSignUp={false} />
    </main>
  );
}
