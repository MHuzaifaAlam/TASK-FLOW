import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AppShell } from "../components/layout/AppShell";
import { PageLoader } from "../components/ui/Spinner";
import { ErrorState } from "../components/ui/ErrorState";
import { ProfileFormModal } from "../components/profile/ProfileFormModal";
import { fetchProfile, updateProfile } from "../api/users";
import { extractErrorMessage, extractFieldErrors } from "../api/axios";
import type { ApiFieldErrors, Profile as ProfileType, ProfilePayload } from "../types";

export function Profile() {
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<ApiFieldErrors | null>(null);
  const [formGeneralError, setFormGeneralError] = useState<string | null>(null);

  async function load() {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchProfile();
      setProfile(result);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function openForm() {
    setFieldErrors(null);
    setFormGeneralError(null);
    setIsFormOpen(true);
  }

  async function handleSubmit(payload: ProfilePayload) {
    setIsSubmitting(true);
    setFieldErrors(null);
    setFormGeneralError(null);
    try {
      const updated = await updateProfile(payload);
      setProfile(updated);
      setIsFormOpen(false);
      toast.success("Profile saved.");
    } catch (err) {
      const errors = extractFieldErrors(err);
      if (errors) setFieldErrors(errors);
      else setFormGeneralError(extractErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AppShell title="Profile">
      {isLoading && <PageLoader />}
      {!isLoading && error && <ErrorState message={error} onRetry={load} />}
      {!isLoading && !error && profile && (
        <div className="max-w-lg card p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-500 font-display text-xl font-semibold text-white">
              {profile.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold text-ink-900">{profile.username}</h2>
              <p className="text-sm text-ink-400">Account details</p>
            </div>
            </div>
            <button className="btn-primary" onClick={openForm}>
              {profile.bio || profile.phone_number ? "Edit profile" : "Create profile"}
            </button>
          </div>

          <dl className="mt-6 space-y-4 border-t border-line pt-4">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-ink-400">Bio</dt>
              <dd className="mt-1 text-sm text-ink-700">
                {profile.bio || <span className="text-ink-300">No bio added yet.</span>}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-ink-400">Phone number</dt>
              <dd className="mt-1 text-sm text-ink-700">
                {profile.phone_number || <span className="text-ink-300">No phone number added yet.</span>}
              </dd>
            </div>
          </dl>
        </div>
      )}
      {!isLoading && !error && profile && isFormOpen && (
        <ProfileFormModal
          profile={profile}
          isSubmitting={isSubmitting}
          fieldErrors={fieldErrors}
          generalError={formGeneralError}
          onSubmit={handleSubmit}
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </AppShell>
  );
}
