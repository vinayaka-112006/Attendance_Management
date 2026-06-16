import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-100 px-4 text-center">
      <div className="panel max-w-md p-8">
        <h1 className="text-2xl font-bold">Unauthorized</h1>
        <p className="mt-2 text-slate-600">Your account does not have access to this page.</p>
        <Link className="mt-5 inline-block rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white" to="/">Go home</Link>
      </div>
    </main>
  );
}
