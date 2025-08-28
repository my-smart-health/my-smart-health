'use client'

import GoToButton from "@/components/buttons/go-to/GoToButton";

export default function EditProfileForm() {

  return (
    <div>
      <form action="/api/profile" method="POST">
        {/* TODO: Form */}
      </form>
      <GoToButton src="/dashboard" name="Back to Dashboard" />
    </div>
  );
}
