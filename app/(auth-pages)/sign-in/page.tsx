import LinkedInSignin from "./linkedInSignin";

export default async function Login() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <div className="max-w-sm w-full space-y-8">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Sign in with LinkedIn
        </h2>
        <p className="text-center text-sm text-gray-600">
          Use your LinkedIn account to get started.
        </p>
        <div className="mt-6">
          <LinkedInSignin />
        </div>
      </div>
    </div>
  );
}
