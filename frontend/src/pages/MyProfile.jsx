import React, { useContext, useEffect, useState } from "react";
import { Heading } from "../components/heading";
import {
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
} from "../components/description-list";
import { Divider } from "../components/divider";
import { Button } from "../components/button";
import { CustomDialog } from "../components/CustomDialog";
import AuthContext from "../contexts/AuthProvider";

import {
  PencilIcon,
  TrashIcon,
  LockClosedIcon,
} from "@heroicons/react/24/solid";
import { RemoveUserConfirmation } from "../components/RemoveUserConfirmation";
import { Loading } from "../components/Loading";
import { ChangePasswordForm } from "../components/ChangePasswordForm";
import { EditProfileForm } from "../components/EditProfileForm";
import { validateEditProfileForm, validateNewPasswordForm } from "../utils/validations";

const initialPassword = {
  password: "",
  confirmPassword: "",
};

export const MyProfile = () => {
  const { user, updateUser, changePassword, removeUser, logout, isLoading } =
    useContext(AuthContext);
  const [showRemoveDialog, setShowRemoveDialogDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showChangePasswordDialog, setShowChangePasswordDialog] =
    useState(false);
  const [userInformation, setUserInformation] = useState({
    email: "",
    name: "",
  });
  const [newPassword, setNewPassword] = useState(initialPassword);
  const [newPasswordError, setNewPasswordError] = useState("");
  const [editProfileError, setEditProfileError] = useState("");

  const isNewPasswordFormValid =
    Object.values(newPasswordError).some((err) => err !== "") ||
    Object.values(newPassword).some((value) => value.trim() === "");

  const isEditFormValid = Object.values(editProfileError).some(
    (err) => err !== ""
  );

  const handleChangeNewPassword = (e) => {
    const { name, value } = e.target;
    setNewPassword({ ...newPassword, [name]: value });

    validateNewPasswordForm({ ...newPassword, [name]: value }, setNewPasswordError, newPasswordError);
  };

  const handleChangeEditProfile = (e) => {
    const { name, value } = e.target;
    setUserInformation({ ...userInformation, [name]: value });

    validateEditProfileForm(name, value, setEditProfileError, editProfileError);
  };

  useEffect(() => {
    if (showEditDialog && user) {
      setUserInformation({
        email: user?.email,
        name: user?.name,
      });
    }
  }, [showEditDialog, user]);

  const openRemoveDialog = () => {
    setShowRemoveDialogDialog(true);
  };

  const closeChangePasswordDialog = () => {
    setShowChangePasswordDialog(false);
    setNewPassword(initialPassword);
    setNewPasswordError("");
  };

  const openChangePasswordDialog = () => {
    setShowChangePasswordDialog(true);
  };

  const closeRemoveDialog = () => {
    setShowRemoveDialogDialog(false);
  };

  const openEditDialog = () => {
    setShowEditDialog(true);
  };

  const closeEditDialog = () => {
    setShowEditDialog(false);
    setEditProfileError("")
  };

  const editUserInformation = () => {
    updateUser(user?.id, userInformation);
    closeEditDialog();
  };

  const updatePassword = () => {
    if (newPassword?.password !== newPassword?.confirmPassword) {
      return;
    }

    changePassword(user?.id, { password: newPassword?.password });
    closeChangePasswordDialog();
  };

  const removeAccountAndLogout = () => {
    removeUser(user?.id);
    logout();
  };

  return (
    <>
      <Heading data-testid="my-profile-heading">My Profile</Heading>
      <Divider className="mt-4" />
      <DescriptionList className="mt-10">
        <DescriptionTerm data-testid="my-profile-email-label">
          Email
        </DescriptionTerm>
        <DescriptionDetails>{user?.email}</DescriptionDetails>

        <DescriptionTerm data-testid="my-profile-password-label">
          Password
        </DescriptionTerm>
        <DescriptionDetails>******</DescriptionDetails>

        <DescriptionTerm data-testid="my-profile-name-label">
          Name
        </DescriptionTerm>
        <DescriptionDetails>{user?.name}</DescriptionDetails>
      </DescriptionList>
      <div className="mt-1y flex gap-4">
        <Button
          onClick={() => openEditDialog()}
          className=" text-white px-4 py-2 rounded focus:outline-none flex items-center cursor-pointer"
        >
          <PencilIcon className="h-5 w-5 mr-2" />
          Edit
        </Button>
        <Button
          onClick={() => openRemoveDialog()}
          className="text-white px-4 py-2 rounded focus:outline-none flex items-center cursor-pointer"
        >
          <TrashIcon className="h-5 w-5 mr-2" />
          Delete
        </Button>
        <Button
          onClick={() => openChangePasswordDialog()}
          className="text-white px-4 py-2 rounded focus:outline-none flex items-center cursor-pointer"
        >
          <LockClosedIcon className="h-5 w-5 mr-2" />
          Change Password
        </Button>
      </div>
      <CustomDialog
        title={"Delete Account"}
        body={<RemoveUserConfirmation />}
        showDialog={showRemoveDialog}
        closeDialog={closeRemoveDialog}
        successAction={() => removeAccountAndLogout()}
        titleButtonClose={"Close"}
        titleButtonSuccess={"Delete Account"}
      />
      <CustomDialog
        title={"Edit Account"}
        body={
          <EditProfileForm
            userInformation={userInformation}
            handleChangeEditProfile={handleChangeEditProfile}
            error={editProfileError}
          />
        }
        showDialog={showEditDialog}
        closeDialog={closeEditDialog}
        successAction={() => editUserInformation()}
        titleButtonClose={"Close"}
        titleButtonSuccess={"Save Changes"}
        disabled={isEditFormValid}
      />
      <CustomDialog
        title={"Change Password"}
        body={
          <ChangePasswordForm
            newPassword={newPassword}
            handleChangeNewPassword={handleChangeNewPassword}
            error={newPasswordError}
          />
        }
        showDialog={showChangePasswordDialog}
        closeDialog={closeChangePasswordDialog}
        successAction={() => updatePassword()}
        titleButtonClose={"Close"}
        titleButtonSuccess={"Save Changes"}
        disabled={isNewPasswordFormValid}
      />
      {isLoading && <Loading />}
    </>
  );
};
