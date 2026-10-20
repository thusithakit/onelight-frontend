import { useState } from "react";
import { LogOut, UserRound, Mail, Clock, CalendarDays } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import { useMyProfile } from "../api/profile.queries";
import { logout } from "../../auth/api/auth.api";
import { useAuthStore } from "../../../stores/auth.store";
import CopyButton from "../../../components/ui/CopyButton";

function formatDate(value: string) {
  if (!value) return "—";

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: profile, isLoading, isError, refetch } = useMyProfile();

  const clearSession = useAuthStore((state) => state.clearSession);

  const authUser = useAuthStore((state) => state.user);

  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  async function handleLogout() {
    setLoggingOut(true);
    setLogoutError("");

    try {
      await logout();
    } catch {
      // Clear the local session even if the logout request
      // fails. The server-side refresh token may still exist
      // until it expires or is revoked by the backend.
      setLogoutError(
        "Could not confirm server logout. Your local session was cleared.",
      );
    } finally {
      clearSession();
      queryClient.clear();
      navigate("/login", { replace: true });
      setLoggingOut(false);
    }
  }

  if (isLoading) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10 text-zinc-400">
        Loading your profile...
      </main>
    );
  }

  if (isError || !profile) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-semibold text-white">
          Profile unavailable
        </h1>

        <p className="mt-2 text-sm text-zinc-400">
          We couldn't load your account details.
        </p>

        <button
          onClick={() => void refetch()}
          className="mt-5 rounded-xl bg-amber-400 px-4 py-2.5 font-semibold text-zinc-950 hover:bg-amber-300"
        >
          Try again
        </button>
      </main>
    );
  }

  const displayName = profile.name || authUser?.name || "OneLight user";

  return (
    <main className="mx-auto w-full max-w-3xl px-4 pb-28 pt-6 sm:px-6 sm:pt-10">
      <p className="text-sm text-amber-400">YOUR ACCOUNT</p>

      <h1 className="mt-1 text-3xl font-semibold tracking-tight text-white">
        Profile
      </h1>

      <section className="mt-8 rounded-2xl border border-white/10 bg-zinc-900/70 p-6">
        <div className="flex items-center gap-4">
          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={`${displayName}'s avatar`}
              className="h-16 w-16 rounded-2xl object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-400/10 text-amber-400">
              <UserRound size={30} />
            </div>
          )}

          <div className="min-w-0">
            <h2 className="truncate text-xl font-semibold text-white">
              {displayName}
            </h2>

            <p className="mt-1 text-sm text-zinc-400">OneLight account</p>
          </div>
        </div>

        <div className="mt-7 space-y-5">
          <div className="flex items-start gap-3">
            <Mail className="mt-0.5 text-zinc-500" size={18} />

            <div className="min-w-0">
              <p className="text-xs text-zinc-500">Email</p>
              <p className="mt-1 break-all text-sm text-zinc-200">
                {authUser?.email || "Not available"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="mt-0.5 text-zinc-500" size={18} />

            <div>
              <p className="text-xs text-zinc-500">Timezone</p>
              <p className="mt-1 text-sm text-zinc-200">
                {profile.timezone || "Not configured"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CalendarDays className="mt-0.5 text-zinc-500" size={18} />

            <div>
              <p className="text-xs text-zinc-500">Member since</p>
              <p className="mt-1 text-sm text-zinc-200">
                {formatDate(profile.createdAt)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3 mt-4">
          <UserRound className="mt-0.5 text-zinc-500" size={18} />

          <div className="min-w-0 flex-1">
            <p className="text-xs text-zinc-500">Your user ID</p>

            <div className="grid gap-2 grid-cols-2">
              <p className="mt-1 break-all font-mono text-sm text-zinc-200">
                {profile.authUserId}
              </p>
              <CopyButton value={profile.authUserId} label="Copy ID" />
            </div>
            <p className="mt-1 text-xs text-zinc-500">
              Share this ID with someone who wants to invite you to a Circle.
            </p>
          </div>
        </div>
        <Link to={"/profile/edit"} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-300 px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto mt-5">
          Edit Profile
        </Link>
      </section>

      {logoutError && (
        <p role="status" className="mt-4 text-sm text-amber-300">
          {logoutError}
        </p>
      )}

      <button
        type="button"
        onClick={() => void handleLogout()}
        disabled={loggingOut}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3 font-medium text-red-300 transition hover:bg-red-400/10 disabled:opacity-50"
      >
        <LogOut size={18} />
        {loggingOut ? "Signing out..." : "Sign out"}
      </button>
    </main>
  );
}
