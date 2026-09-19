import { useEffect, useState, type FormEvent } from "react";
import { Modal } from "../ui/Modal";
import type { ApiFieldErrors, Profile, ProfilePayload } from "../../types";

interface ProfileFormModalProps {
  profile: Profile;
  isSubmitting: boolean;
  fieldErrors: ApiFieldErrors | null;
  generalError: string | null;
  onSubmit: (payload: ProfilePayload) => void;
  onClose: () => void;
}

export function ProfileFormModal({
  profile,
  isSubmitting,
  fieldErrors,
  generalError,
  onSubmit,
  onClose,
}: ProfileFormModalProps) {
  const [bio, setBio] = useState(profile.bio);
  const [phoneNumber, setPhoneNumber] = useState(profile.phone_number);

  useEffect(() => {
    setBio(profile.bio);
    setPhoneNumber(profile.phone_number);
  }, [profile]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onSubmit({ bio: bio.trim(), phone_number: phoneNumber.trim() });
  }

  return (
    <Modal title={profile.bio || profile.phone_number ? "Edit profile" : "Create profile"} onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {generalError && (
          <p role="alert" className="rounded-md bg-danger-50 px-3 py-2 text-sm text-danger-600">
            {generalError}
          </p>
        )}

        <div>
          <label className="label" htmlFor="profile-username">
            Username
          </label>
          <input id="profile-username" className="input bg-ink-50" value={profile.username} readOnly />
        </div>

        <div>
          <label className="label" htmlFor="profile-bio">
            Bio
          </label>
          <textarea
            id="profile-bio"
            className="input min-h-[110px] resize-y"
            value={bio}
            onChange={(event) => setBio(event.target.value)}
            placeholder="Tell your team a little about yourself"
          />
          {fieldErrors?.bio && <p className="field-error">{fieldErrors.bio[0]}</p>}
        </div>

        <div>
          <label className="label" htmlFor="profile-phone">
            Phone number
          </label>
          <input
            id="profile-phone"
            className="input"
            value={phoneNumber}
            onChange={(event) => setPhoneNumber(event.target.value)}
            placeholder="e.g. +1 555 123 4567"
          />
          {fieldErrors?.phone_number && <p className="field-error">{fieldErrors.phone_number[0]}</p>}
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" className="btn-secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save profile"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
