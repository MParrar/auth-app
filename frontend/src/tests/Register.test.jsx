import React from 'react';
import { render, screen, fireEvent } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { BrowserRouter } from "react-router";
import { AuthProvider } from "../contexts/AuthProvider";
import axios from "axios";
import { NotificationProvider } from "../contexts/NotificationProvider";
import { Register } from "../pages/Register";

describe("Register", () => {
  
  beforeEach(() => {
    render(
      <BrowserRouter>
        <NotificationProvider>
          <AuthProvider>
            <Register />
          </AuthProvider>
        </NotificationProvider>
      </BrowserRouter>
    );
  });

  it("Structure component", () => {
    const heading = screen.getByTestId("register-heading");
    const nameInput = screen.getByTestId("form-user-name-label");
    const emailInput = screen.getByTestId("form-user-email-label");
    const passwordInput = screen.getByTestId("form-user-password-label");
    const confirmPasswordInput = screen.getByTestId("form-user-confirm-password-label");
    expect(heading).toBeInTheDocument();
    expect(heading.textContent).toBe("Register");
    expect(nameInput.textContent).toBe("Name");
    expect(emailInput.textContent).toBe("Email");
    expect(passwordInput.textContent).toBe("Password");
    expect(confirmPasswordInput.textContent).toBe("Confirm Password");

  });

  it("Register new user", async () => {
    vi.mock("../utils/validations", () => ({
      isTokenValid: vi.fn().mockReturnValue(true),
      validateNewUserForm: vi.fn().mockReturnValue(true), 

    }));
    const userForm = { name: "Sasuke", email: "email@email.com", password: "12345678", confirmPassword: "12345678", role: "user" };
    const nameInput = screen.getByTestId("form-user-name-input");
    const emailInput = screen.getByTestId("form-user-email-input");
    const passwordInput = screen.getByTestId("form-user-password-input");
    const confirmPasswordInput = screen.getByTestId("form-user-confirm-password-input");

    const signUpButton = screen.getByRole("button", { name: "Sign Up" });

    fireEvent.change(nameInput, { target: { value: userForm.name } });
    fireEvent.change(emailInput, {
      target: { value: userForm.email },
    });
    fireEvent.change(passwordInput, { target: { value: userForm.password } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: userForm.confirmPassword },
    });

    const signInSpy = vi.spyOn(axios, "post");

    fireEvent.click(signUpButton);

    expect(signInSpy).toHaveBeenCalledWith(
      `${import.meta.env.VITE_BASE_URL}/users/register`,
      {
        name: userForm.name,
        email: userForm.email,
        password: userForm.password,
        role: userForm.role
      }
    );
  });

});
