// components/profile/ProfilePageClient.tsx

"use client";

import { useState } from "react";

import { AccountInfo } from "@/components/profile/AccountInfo";
import { ChangePasswordForm } from "@/components/profile/ChangePasswordForm";
import { EditProfileForm } from "@/components/profile/EditProfileForm";
import { ProfileActions } from "@/components/profile/ProfileActions";
import { ProfileCard } from "@/components/profile/ProfileCard";

import type { UserProfile } from "@/types/user";

interface ProfilePageClientProps {
  user: UserProfile;
}

type ProfileView =
  | "overview"
  | "edit"
  | "password";

export function ProfilePageClient({
  user: initialUser,
}: ProfilePageClientProps) {
  const [user, setUser] =
    useState<UserProfile>(initialUser);

  const [view, setView] =
    useState<ProfileView>("overview");

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  function clearMessages() {
    setMessage("");
    setError("");
  }

  function handleEditProfile() {
    clearMessages();
    setView("edit");
  }

  function handleChangePassword() {
    clearMessages();
    setView("password");
  }

  function handleCancel() {
    clearMessages();
    setView("overview");
  }

  function handleProfileUpdated(
    updatedUser: UserProfile
  ) {
    setUser(updatedUser);
    setMessage(
      "Your profile has been updated successfully."
    );
    setError("");
    setView("overview");
  }

  function handlePasswordChanged() {
    setMessage(
      "Your password has been changed successfully."
    );
    setError("");
    setView("overview");
  }

  function handleError(
    errorMessage: string
  ) {
    setError(errorMessage);
    setMessage("");
  }

  return (
    <div className="space-y-6">
      {message && (
        <div
          role="status"
          className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
        >
          {message}
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {view === "overview" && (
        <>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <ProfileCard user={user} />

            <div className="lg:col-span-2">
              <AccountInfo user={user} />
            </div>
          </div>

          <ProfileActions
            onEditProfile={handleEditProfile}
            onChangePassword={handleChangePassword}
          />
        </>
      )}

      {view === "edit" && (
        <EditProfileForm
          user={user}
          onSuccess={handleProfileUpdated}
          onError={handleError}
          onCancel={handleCancel}
        />
      )}

      {view === "password" && (
        <ChangePasswordForm
          onSuccess={handlePasswordChanged}
          onError={handleError}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}