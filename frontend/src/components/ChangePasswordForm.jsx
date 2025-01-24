import React from 'react'

export const ChangePasswordForm = ({newPassword, handleChangeNewPassword, error}) => {
  return (
        <>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-white mb-2"
              >
                New Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={newPassword?.password}
                onChange={handleChangeNewPassword}
                className="mt-1 w-full px-4 py-2 border rounded-md"
                placeholder="Enter your new password"
              />
               {error?.password && (
          <p className="text-red-500 text-sm mt-1">{error.password}</p>
        )}
            </div>
    
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-white mb-2"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={newPassword?.confirmPassword}
                onChange={handleChangeNewPassword}
                className="mt-1 w-full px-4 py-2 border rounded-md"
                placeholder="Confirm Password"
              />
               {error?.confirmPassword && (
          <p className="text-red-500 text-sm mt-1">{error.confirmPassword}</p>
        )}
            </div>
          </div>
        </>
  );
}
