import Link from "next/link";
import { supabase } from "@/lib/supabase";

async function checkForEvents() {
  if (!supabase) return false;

  try {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .gte("event_date", "now()")
      .limit(1);

    if (error) {
      console.error("Error checking for events:", error);
      return false;
    }

    return data && data.length > 0;
  } catch (error) {
    console.error("Error checking for events:", error);
    return false;
  }
}

export default async function Home() {
  const hasEvents = await checkForEvents();

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-200 via-rose-300 to-slate-500 flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-16">
        <h1 className="text-8xl font-bold text-slate-800 tracking-wider">
          IFN
        </h1>

        <div className="space-y-8">
          <Link
            href={hasEvents ? "/order" : "/login"}
            className="inline-block bg-orange-400 hover:bg-orange-500 text-white font-semibold py-4 px-12 rounded-full text-lg transition-colors duration-200 shadow-lg"
          >
            {hasEvents ? "Get started" : "Login to Host"}
          </Link>

          <div>
            <Link
              href="/login"
              className="text-slate-700 hover:text-slate-900 font-medium text-lg transition-colors duration-200"
            >
              Host? Log in
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
