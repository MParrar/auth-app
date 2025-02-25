import React, { useContext, useEffect, useState } from 'react';
import { Heading } from '../components/heading';
import {
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
} from '../components/description-list';
import { Divider } from '../components/divider';
import { Button } from '../components/button';
import { CustomDialog } from '../components/CustomDialog';
import AuthContext from '../contexts/AuthProvider';

import {
  PencilIcon,
  TrashIcon,
  LockClosedIcon,
} from '@heroicons/react/24/solid';
import { RemoveUserConfirmation } from '../components/RemoveUserConfirmation';
import { Loading } from '../components/Loading';
import { ChangePasswordConfirmation } from '../components/ChangePasswordConfirmation';
import { EditProfileForm } from '../components/EditProfileForm';
import { validateEditProfileForm } from '../utils/validations';
import {
  getUserProfile,
  removeUser,
  sendEmailToChangePassword,
  updateUser,
} from '../services/userServices';
import useAxios from '../hook/axiosInstance';
import { useNotification } from '../contexts/NotificationProvider';

export const MyProfile = () => {
  const { user, logoutUser, setUser } = useContext(AuthContext);

  const showNotification = useNotification();
  const axiosInstance = useAxios();

  const [showRemoveDialog, setShowRemoveDialogDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [isLoadingComponent, setIsLoadingComponent] = useState(false);
  const [showChangePasswordDialog, setShowChangePasswordDialog] =
    useState(false);
  const [userInformation, setUserInformation] = useState({
    email: '',
    name: '',
  });
  const [editProfileError, setEditProfileError] = useState('');

  const isEditFormValid = Object.values(editProfileError).some(
    (err) => err !== ''
  );
  const canUserUpdateInfo = user?.sub?.startsWith('auth0|');

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoadingComponent(true);
      const response = await getUserProfile(axiosInstance, showNotification);
      if (response?.status === 'success') {
        setUser(response.user);
      }
      setIsLoadingComponent(false);
      return response;
    };
    fetchUser();
  }, []);

  const handleChangeEditProfile = (e) => {
    const { name, value } = e.target;
    setUserInformation({ ...userInformation, [name]: value });

    validateEditProfileForm(name, value, setEditProfileError, editProfileError);
  };

  useEffect(() => {
    if (showEditDialog && user) {
      setUserInformation({
        id: user?.id,
        email: user?.email,
        name: user?.name,
        sub: user?.sub,
        role: user?.role,
        company_name: user?.company_name,
      });
    }
  }, [showEditDialog, user]);

  const openRemoveDialog = () => {
    setShowRemoveDialogDialog(true);
  };

  const closeChangePasswordDialog = () => {
    setShowChangePasswordDialog(false);
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
    setEditProfileError('');
  };

  const editUserInformation = async () => {
    const response = await updateUser(
      axiosInstance,
      user?.id,
      userInformation,
      showNotification,
      setIsLoadingComponent
    );
    if (response?.status === 'success') {
      setUser(userInformation);
    }
    closeEditDialog();
  };

  const updatePassword = () => {
    sendEmailToChangePassword(user?.email, showNotification);
    closeChangePasswordDialog();
  };

  const removeAccountAndLogout = async () => {
    const response = await removeUser(
      axiosInstance,
      user,
      showNotification,
      setIsLoadingComponent
    );
    closeRemoveDialog();
    if (response?.status === 'success') {
      logoutUser();
    }
  };

  return (
    <>
      {isLoadingComponent ? (
        <div
          style={{ height: '80vh', overflow: 'hidden' }}
          className='overflow-y-hidden'
        >
          <Loading />
        </div>
      ) : (
        <>
          <Heading data-testid='my-profile-heading'>
            Profile - {user?.company_name}
          </Heading>
          <Divider className='mt-4' />
          <DescriptionList className='mt-10'>
            <DescriptionTerm data-testid='my-profile-email-label'>
              Email
            </DescriptionTerm>
            <DescriptionDetails>{user?.email}</DescriptionDetails>

            <DescriptionTerm data-testid='my-profile-password-label'>
              Password
            </DescriptionTerm>
            <DescriptionDetails>******</DescriptionDetails>

            <DescriptionTerm data-testid='my-profile-name-label'>
              Name
            </DescriptionTerm>
            <DescriptionDetails>{user?.name}</DescriptionDetails>
          </DescriptionList>
          <div className='mt-1y flex gap-4'>
            <Button
              data-testid='edit-profile-button'
              onClick={() => openEditDialog()}
              className={`text-white px-4 py-2 rounded focus:outline-none flex items-center ${
                canUserUpdateInfo ? 'cursor-pointer' : ''
              }`}
              disabled={!canUserUpdateInfo}
            >
              <PencilIcon className='h-5 w-5 mr-2' />
              Edit
            </Button>
            <Button
              onClick={() => openRemoveDialog()}
              className='text-white px-4 py-2 rounded focus:outline-none flex items-center cursor-pointer'
            >
              <TrashIcon className='h-5 w-5 mr-2' />
              Delete
            </Button>
            <Button
              onClick={() => openChangePasswordDialog()}
              className={`text-white px-4 py-2 rounded focus:outline-none flex items-center ${
                canUserUpdateInfo ? 'cursor-pointer' : ''
              }`}
              disabled={!canUserUpdateInfo}
            >
              <LockClosedIcon className='h-5 w-5 mr-2' />
              Change Password
            </Button>
          </div>
          <CustomDialog
            title={'Delete Account'}
            body={<RemoveUserConfirmation />}
            showDialog={showRemoveDialog}
            closeDialog={closeRemoveDialog}
            successAction={() => removeAccountAndLogout()}
            titleButtonClose={'Close'}
            titleButtonSuccess={'Delete Account'}
          />
          <CustomDialog
            title={'Edit Account'}
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
        </>
      )}
    </>
  );
};
