import { Link } from "react-router";
import { Button } from '../components/button'

export const NewUserForm = ({
  handleSubmit,
  form,
  handleChange,
  error,
  showLinks = false,
}) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-white mb-2"
          data-testid="form-user-name-label"
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          data-testid="form-user-name-input"
          placeholder="Your Name"
          className={`mt-1 w-full px-4 py-2 border rounded-md ${
            error?.name ? "border-red-500" : ""
          }`}
          value={form?.name}
          onChange={handleChange}
          required
        />
        {error?.name && (
          <p className="text-red-500 text-sm mt-1">{error.name}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="email"
          data-testid="form-user-email-label"
          className="block text-sm font-medium text-white mb-2"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          data-testid="form-user-email-input"
          name="email"
          placeholder="example@correo.com"
          className={`mt-1 w-full px-4 py-2 border rounded-md ${
            error?.email ? "border-red-500" : ""
          }`}
          value={form?.email}
          onChange={handleChange}
          required
        />
        {error?.email && (
          <p className="text-red-500 text-sm mt-1">{error.email}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="password"
          data-testid="form-user-password-label"
          className="block text-sm font-medium text-white mb-2"
        >
          Password
        </label>
        <input
          type="password"
          id="password"
          data-testid="form-user-password-input"
          name="password"
          placeholder="Password"
          className={`mt-1 w-full px-4 py-2 border rounded-md ${
            error?.password ? "border-red-500" : ""
          }`}
          value={form?.password}
          onChange={handleChange}
          required
        />
        {error?.password && (
          <p className="text-red-500 text-sm mt-1">{error.password}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          data-testid="form-user-confirm-password-label"
          className="block text-sm font-medium text-white mb-2"
        >
          Confirm Password
        </label>
        <input
          type="password"
          id="confirmPassword"
          data-testid="form-user-confirm-password-input"
          name="confirmPassword"
          placeholder="Confirm Password"
          className={`mt-1 w-full px-4 py-2 border rounded-md ${
            error?.confirmPassword ? "border-red-500" : ""
          }`}
          value={form?.confirmPassword}
          onChange={handleChange}
          required
        />
        {error?.confirmPassword && (
          <p className="text-red-500 text-sm mt-1">{error.confirmPassword}</p>
        )}
      </div>

      {error?.general && (
        <p className="text-red-500 text-sm">{error.general}</p>
      )}
      {showLinks && (
        <div>
          <Button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 rounded-md"
          >
            Sign Up
          </Button>
          <p className="mt-6 text-center text-sm text-gray-400">
            <Link
              to="/login"
              className="font-semibold text-indigo-400 hover:text-indigo-300"
            >
              Back to Login
            </Link>
          </p>
        </div>
      )}
    </form>
  );
};
