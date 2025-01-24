import React from "react";

export const EditProfileForm = ({
  userInformation,
  handleChangeEditProfile,
  error
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-white mb-2"
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          data-testid="my-profile-name"
          value={userInformation?.name || ""}
          onChange={handleChangeEditProfile}
          className="mt-1 w-full px-4 py-2 border rounded-md"
          placeholder="Enter your name"
        />
        {error?.name && (
          <p className="text-red-500 text-sm mt-1">{error.name}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-white mb-2"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          data-testid="my-profile-email"
          name="email"
          value={userInformation?.email || ""}
          onChange={handleChangeEditProfile}
          className="mt-1 w-full px-4 py-2 border rounded-md"
          placeholder="Enter your email"
        />
        {error?.email && (
          <p className="text-red-500 text-sm mt-1">{error.email}</p>
        )}
      </div>
    </div>
  );
};
