import { Heading } from '../components/heading';
import { Divider } from '../components/divider';
import { useContext, useEffect, useState } from 'react';
import {
  PencilIcon,
  TrashIcon,
  UserPlusIcon,
  LockClosedIcon,
} from '@heroicons/react/16/solid';
import AuthContext from '../contexts/AuthProvider';
import { CustomDialog } from '../components/CustomDialog';
import { Button } from '../components/button';
import { NewUserForm } from '../components/NewUserForm';
import { RemoveUserConfirmation } from '../components/RemoveUserConfirmation';
import { ChangePasswordConfirmation } from '../components/ChangePasswordConfirmation';
import { EditProfileForm } from '../components/EditProfileForm';
import {
  validateEditProfileForm,
  validateNewUserForm,
} from '../utils/validations';
import PaginatedTable from '../components/PaginatedTable';
import {
  createUser,
  getUserList,
  removeUser,
  sendEmailToChangePassword,
  updateUser,
} from '../services/userServices';
import { useNotification } from '../contexts/NotificationProvider';
import useAxios from '../hook/axiosInstance';
import { Loading } from '../components/Loading';

const initialNewUserForm = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
};

export const UserList = () => {
  const { user, users, setUsers } = useContext(AuthContext);

  const [isLoadingComponent, setIsLoadingComponent] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showRemoveDialog, setShowRemoveDialogDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [userSelected, setUserSelected] = useState({});
  const [form, setForm] = useState(initialNewUserForm);
  const [error, setError] = useState('');
  const [editProfileError, setEditProfileError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showChangePasswordDialog, setShowChangePasswordDialog] =
    useState(false);

  const isFormInvalid =
    Object.values(error).some((err) => err !== '') ||
    Object.values(form).some((value) => value.trim() === '');

  const isEditFormValid = Object.values(editProfileError).some(
    (err) => err !== ''
  );
  const showNotification = useNotification();


  const axiosInstance = useAxios();

  const fetchUser = async () => {
    setIsLoadingComponent(true);
    const response = await getUserList(
      axiosInstance,
      setIsLoadingComponent,
      setUsers,
      showNotification
    );

    setUsers(response);
    setIsLoadingComponent(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const openEditDialog = (user) => {
    setUserSelected(user);
    setShowEditDialog(true);
  };

  const closeChangePasswordDialog = () => {
    setUserSelected({});
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

  const handleChangeEditProfile = (e) => {
    const { name, value } = e.target;
    setUserSelected({ ...userSelected, [name]: value });

    validateEditProfileForm(name, value, setEditProfileError, editProfileError);
  };

  const updatePassword = () => {
    try {
      sendEmailToChangePassword(userSelected?.email);
      showNotification('success', `Email set to user ${userSelected?.email}`);
    } catch (error) {
      showNotification(
        'error',
        error?.message || 'An error occurred. Please try again later'
      );
    }
    closeChangePasswordDialog();
  };

  const addUser = async () => {
    await createUser(
      {
        name: form.name,
        email: form.email,
        password: form.password,
        role: 'user',
      },
      users,
      axiosInstance,
      setIsLoadingComponent,
      setUsers,
      showNotification
    );
    closeAddUserDialog();
  };

  const closeEditDialog = () => {
    setShowEditDialog(false);
    setUserSelected({});
    setEditProfileError('');
  };

  const editUserInformation = async () => {
    const response = await updateUser(
      axiosInstance,
      userSelected?.id,
      userSelected,
      showNotification,
      setIsLoadingComponent
    );
    if (response?.status === 'success') {
      setUsers((prevUsers) =>
        prevUsers?.map((user) =>
          user.id === userSelected?.id ? { ...user, ...userSelected } : user
        )
      );
    }
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

  const removeAccount = async () => {
    const response = await removeUser(
      axiosInstance,
      userSelected,
      showNotification,
      setIsLoadingComponent
    );
    if(response?.status === 'success'){
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.id !== userSelected?.id)
      );
    }
    closeRemoveDialog();
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredUsers = users?.filter(
    (user) =>
      user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user?.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const actions = (user) => {
    const canUserUpdateInfo = user?.sub?.startsWith('auth0|');

    return (
      <div className='flex gap-2'>
        <Button
          disabled={!canUserUpdateInfo}
          onClick={() => openEditDialog(user)}
        >
          <PencilIcon className='h-5 w-5' />
        </Button>
        <Button onClick={() => openRemoveDialog(user)}>
          <TrashIcon className='h-5 w-5' />
        </Button>
        <Button
          disabled={!canUserUpdateInfo}
          onClick={() => openChangePasswordDialog(user)}
        >
          <LockClosedIcon className='h-5 w-5' />
        </Button>
      </div>
    );
  };

  return isLoadingComponent ? (
    <div
      style={{ height: '80vh', overflow: 'hidden' }}
      className='overflow-y-hidden'
    >
      <Loading />
    </div>
  ) : (
    <>
      <div className='flex w-full flex-wrap items-end justify-between border-zinc-950/10 pb-6 dark:border-white/10'>
        <Heading>User List - {user?.company_name} </Heading>
        <div className='flex gap-4'>
          <input
            type='text'
            placeholder='Search...'
            value={searchTerm}
            onChange={handleSearchChange}
            className='px-2 py-1 border rounded-md'
          />
          <Button
            onClick={() => openAddUserDialog()}
            className='ml-5 cursor-pointer'
          >
            <UserPlusIcon />
          </Button>
        </div>
      </div>
      <Divider />
      <PaginatedTable
        data={filteredUsers}
        headers={['Email', 'Name', 'Role']}
        actions={actions}
        rowsPerPage={5}
      />
      <CustomDialog
        title={'Edit Account'}
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
        titleButtonClose={'Close'}
        titleButtonSuccess={'Save Changes'}
        disabled={isEditFormValid}
      />

      <CustomDialog
        title={'Change Password'}
        body={<ChangePasswordConfirmation />}
        showDialog={showChangePasswordDialog}
        closeDialog={closeChangePasswordDialog}
        successAction={() => updatePassword()}
        titleButtonClose={'Close'}
        titleButtonSuccess={'Save Changes'}
      />
      <CustomDialog
        title={'Create User'}
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
        titleButtonClose={'Close'}
        titleButtonSuccess={'Save Changes'}
        disabled={isFormInvalid}
      />
      <CustomDialog
        title={'Delete Account'}
        body={<RemoveUserConfirmation />}
        showDialog={showRemoveDialog}
        closeDialog={closeRemoveDialog}
        successAction={() => removeAccount()}
        titleButtonClose={'Close'}
        titleButtonSuccess={'Delete Account'}
      />
    </>
  );
};
