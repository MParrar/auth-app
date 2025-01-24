
import { Heading } from "../components/heading";
import { Divider } from "../components/divider";
import { useContext, useEffect, useState } from "react";
import {
  PencilIcon,
  TrashIcon,
  UserPlusIcon,
  LockClosedIcon,
} from "@heroicons/react/16/solid";
import AuthContext from "../contexts/AuthProvider";
import { CustomDialog } from "../components/CustomDialog";
import { Button } from "../components/button";
import { NewUserForm } from "../components/NewUserForm";
import { RemoveUserConfirmation } from "../components/RemoveUserConfirmation";
import { ChangePasswordForm } from "../components/ChangePasswordForm";
import { EditProfileForm } from "../components/EditProfileForm";
import { validateEditProfileForm, validateNewPasswordForm, validateNewUserForm } from "../utils/validations";
import PaginatedTable from "../components/PaginatedTable";

const initialPassword = {
  password: "",
  confirmPassword: "",
};

const initialNewUserForm = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export const UserList = () => {
  const {
    users,
    updateUser,
    changePassword,
    removeUser,
    createUser,
    getUserList,
  } = useContext(AuthContext);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showRemoveDialog, setShowRemoveDialogDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [userSelected, setUserSelected] = useState({});
  const [newPassword, setNewPassword] = useState(initialPassword);
  const [form, setForm] = useState(initialNewUserForm);
  const [error, setError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [editProfileError, setEditProfileError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showChangePasswordDialog, setShowChangePasswordDialog] =
    useState(false);

  const isFormInvalid =
    Object.values(error).some((err) => err !== "") ||
    Object.values(form).some((value) => value.trim() === "");

  const isNewPasswordFormValid =
    Object.values(newPasswordError).some((err) => err !== "") ||
    Object.values(newPassword).some((value) => value.trim() === "");

  const isEditFormValid = Object.values(editProfileError).some(
    (err) => err !== ""
  );

  useEffect(() => {
    getUserList();
  }, []);

  const openEditDialog = (user) => {
    setUserSelected(user);
    setShowEditDialog(true);
  };

  const closeChangePasswordDialog = () => {
    setUserSelected({});
    setNewPassword(initialPassword);
    setNewPasswordError("");
    setShowChangePasswordDialog(false);
  };

  const openRemoveDialog = (user) => {
    setUserSelected(user);
    setShowRemoveDialogDialog(true);
  };

  const closeRemoveDialog = () => {
    setShowRemoveDialogDialog(false);
    setUserSelected({});
  };

  const openChangePasswordDialog = (user) => {
    setUserSelected(user);
    setShowChangePasswordDialog(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    validateNewUserForm({ ...form, [name]: value }, setError, error);
  };

  const handleChangeNewPassword = (e) => {
    const { name, value } = e.target;
    setNewPassword({ ...newPassword, [name]: value });

    validateNewPasswordForm({ ...newPassword, [name]: value }, setNewPasswordError, newPasswordError);
  };

  const handleChangeEditProfile = (e) => {
    const { name, value } = e.target;
    setUserSelected({ ...userSelected, [name]: value });

    validateEditProfileForm(name, value, setEditProfileError, editProfileError);
  };

  const updatePassword = () => {
    if (newPassword?.password !== newPassword?.confirmPassword) {
      return;
    }
    changePassword(userSelected?.id, { password: newPassword?.password });
    closeChangePasswordDialog();
  };

  const addUser = () => {
    createUser({
      name: form.name,
      email: form.email,
      password: form.password,
      role: "user",
    });
    closeAddUserDialog();
  };

  const closeEditDialog = () => {
    setShowEditDialog(false);
    setUserSelected({});
    setEditProfileError("");
  };

  const editUserInformation = () => {
    updateUser(userSelected?.id, userSelected);
    closeEditDialog();
  };

  const openAddUserDialog = () => {
    setShowCreateDialog(true);
  };

  const closeAddUserDialog = () => {
    setShowCreateDialog(false);
    setForm(initialNewUserForm);
    setError({});
  };

  const removeAccount = () => {
    removeUser(userSelected.id);
    closeRemoveDialog();
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const actions = (user) => {
    return (
      <div className="flex gap-2">
        <Button onClick={() => openEditDialog(user)}>
          <PencilIcon className="h-5 w-5" />
        </Button>
        <Button onClick={() => openRemoveDialog(user)}>
          <TrashIcon className="h-5 w-5" />
        </Button>
        <Button onClick={() => openChangePasswordDialog(user)}>
          <LockClosedIcon className="h-5 w-5" />
        </Button>
      </div>
    );
  };

  return (
    <>
      <div className="flex w-full flex-wrap items-end justify-between border-zinc-950/10 pb-6 dark:border-white/10">
        <Heading>User List</Heading>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="px-2 py-1 border rounded-md"
          />
          <Button
            onClick={() => openAddUserDialog()}
            className="ml-5 cursor-pointer"
          >
            <UserPlusIcon />
          </Button>
        </div>
      </div>
      <Divider />
      <PaginatedTable
        data={filteredUsers}
        headers={["Email", "Name", "Role"]}
        actions={actions}
        rowsPerPage={5}
      />
      <CustomDialog
        title={"Edit Account"}
        body={
          <EditProfileForm
            userInformation={userSelected}
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
            setNewPassword={setNewPassword}
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
      <CustomDialog
        title={"Create User"}
        body={
          <NewUserForm
            form={form}
            setForm={setForm}
            error={error}
            handleChange={handleChange}
          />
        }
        showDialog={showCreateDialog}
        closeDialog={closeAddUserDialog}
        successAction={() => addUser()}
        titleButtonClose={"Close"}
        titleButtonSuccess={"Save Changes"}
        disabled={isFormInvalid}
      />
      <CustomDialog
        title={"Delete Account"}
        body={<RemoveUserConfirmation />}
        showDialog={showRemoveDialog}
        closeDialog={closeRemoveDialog}
        successAction={() => removeAccount()}
        titleButtonClose={"Close"}
        titleButtonSuccess={"Delete Account"}
      />
    </>
  );
};
