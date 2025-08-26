'use client'

import GoBackDashboard from "@/components/buttons/go-back-dashboard/GoBackDashboard";

export default function EditProfileForm() {

  return (
    <div>
      <form action="/api/profile" method="POST">
        {/* TODO: Form */}
      </form>
      <GoBackDashboard />
    </div>
  );
}
