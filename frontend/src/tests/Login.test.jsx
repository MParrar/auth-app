import { render, screen, fireEvent } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Login } from "../pages/Login";
import { BrowserRouter } from "react-router";
import { AuthProvider } from "../contexts/AuthProvider";
import axios from "axios";
import { NotificationProvider } from "../contexts/NotificationProvider";

describe("Login", () => {

  beforeEach(() => {
    render(
      <BrowserRouter>
        <NotificationProvider>
          <AuthProvider>
            <Login />
          </AuthProvider>
        </NotificationProvider>
      </BrowserRouter>
    );
  });

  it("Structure component", () => {
    const h2 = screen.getByRole("heading", { level: 2 });
    const emailInput = screen.getByText("Email");
    const passwordInput = screen.getByText("Password");

    expect(h2).toBeInTheDocument();
    expect(h2.textContent).toBe("Sign in to your account");
    expect(emailInput.textContent).toBe("Email");
    expect(passwordInput.textContent).toBe("Password");
  });

  it("Login Action", async () => {
    const userCredential = { email: "email@email.com", password: "12345678" };
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");

    const submitButton = screen.getByRole("button", { name: "Sign In" });

    fireEvent.change(emailInput, { target: { value: userCredential.email } });
    fireEvent.change(passwordInput, {
      target: { value: userCredential.password },
    });

    const signInSpy = vi.spyOn(axios, "post");

    fireEvent.click(submitButton);

    expect(signInSpy).toHaveBeenCalledWith(
      `${import.meta.env.VITE_BASE_URL}/login`,
      {
        email: userCredential.email,
        password: userCredential.password,
      }
    );
  });

  it("should show an error notification on failed login", async () => {
    const userCredential = {
      email: "email@email.com",
      password: "Wrong Password",
    };
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", { name: "Sign In" });

    fireEvent.change(emailInput, { target: { value: userCredential.email } });
    fireEvent.change(passwordInput, {
      target: { value: userCredential.password },
    });

    const signInSpy = vi.spyOn(axios, "post").mockRejectedValueOnce({
      response: {
        data: { message: "Invalid credentials" },
      },
    });

    fireEvent.click(submitButton);

    expect(signInSpy).toHaveBeenCalledWith(
      `${import.meta.env.VITE_BASE_URL}/login`,
      userCredential
    ); 

    const errorNotification = await screen.findByText("Invalid credentials");
    expect(errorNotification).toBeInTheDocument();
  });
});
