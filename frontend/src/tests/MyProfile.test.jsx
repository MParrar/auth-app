import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { BrowserRouter } from "react-router";
import { AuthProvider } from "../contexts/AuthProvider";
import axios from "axios";
import { NotificationProvider } from "../contexts/NotificationProvider";
import { MyProfile } from "../pages/MyProfile";

describe("My Profile", () => {

const userData = {
    id: 1,
    email: "test@example.com",
    name: "Test User",
  };
  
  beforeEach(() => {
    render(
      <BrowserRouter>
        <NotificationProvider>
          <AuthProvider initialUser={userData}>
            <MyProfile />
          </AuthProvider>
        </NotificationProvider>
      </BrowserRouter>
    );
  });

  it("Structure component", () => {
    const heading = screen.getByTestId("my-profile-heading");
    const emailLabel = screen.getByTestId("my-profile-email-label");
    const passwordLabel = screen.getByTestId("my-profile-password-label");
    const nameLabel = screen.getByTestId("my-profile-name-label");

    expect(heading).toBeInTheDocument();
    expect(heading.textContent).toBe("My Profile");
    expect(emailLabel.textContent).toBe("Email");
    expect(passwordLabel.textContent).toBe("Password");
    expect(nameLabel.textContent).toBe("Name");

  });

it("Edit My Profile", async () => {
  vi.mock("../utils/validations", () => ({
    isTokenValid: vi.fn().mockReturnValue(true),
    validateEditProfileForm: vi.fn().mockReturnValue(true), 

  }));
    const userCredential = { id: userData.id, email: "email@email.com", name: "Naruto" };
  
    const openEditModal = screen.getByRole("button", { name: "Edit" });
    fireEvent.click(openEditModal);
  
    const emailInput = screen.getByTestId("my-profile-email");
    const nameInput = screen.getByTestId("my-profile-name");
    fireEvent.change(emailInput, { target: { value: userCredential.email } });
    fireEvent.change(nameInput, { target: { value: userCredential.name } });
  
    const saveChanges = screen.getByRole("button", { name: "Save Changes" });
    const signInSpy = vi.spyOn(axios, "put").mockResolvedValue({ data: {} });
    fireEvent.click(saveChanges);
  
    await waitFor(() => {
      expect(signInSpy).toHaveBeenCalledWith(
        `${import.meta.env.VITE_BASE_URL}/users/${userCredential.id}`,
        {
          email: userCredential.email,
          name: userCredential.name,
        }
      );
    });
  });

});
