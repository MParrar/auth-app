import { useNavigate, Outlet } from 'react-router';

import { Avatar } from '../components/avatar';
import {
  Dropdown,
  DropdownButton,
  DropdownDivider,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from '../components/dropdown';
import {
  Navbar,
  NavbarItem,
  NavbarSection,
  NavbarSpacer,
} from '../components/navbar';
import {
  Sidebar,
  SidebarBody,
  SidebarFooter,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
  SidebarSpacer,
} from '../components/sidebar';
import { SidebarLayout } from '../components/sidebar-layout';
import {
  ArrowRightStartOnRectangleIcon,
  ChevronUpIcon,
  UserIcon,
  UsersIcon,
  ClipboardDocumentIcon,
  ArrowUpTrayIcon,
} from '@heroicons/react/16/solid';
import { HomeIcon } from '@heroicons/react/20/solid';
import AuthContext from '../contexts/AuthProvider';
import { useContext } from 'react';
import { useIdleTimer } from 'react-idle-timer/legacy';

export const Layout = () => {
  const navigate = useNavigate();
  const { user, logoutUser } = useContext(AuthContext);
  useIdleTimer({
    timeout: 60000 * import.meta.env.VITE_LOGOUT_TIMEOUT_MINUTES,
    onIdle: () => {
      logoutUser();
    },
    debounce: 500,
  });

  return (
    <SidebarLayout
      navbar={
        <Navbar>
          <NavbarSpacer />
          <NavbarSection>
            <Dropdown>
              <DropdownButton as={NavbarItem}>
                <Avatar
                  initials={user?.name?.slice(0, 2)}
                  className='size-10'
                  square
                  alt=''
                />
              </DropdownButton>
              <DropdownMenu className='min-w-64' anchor='bottom end'>
                <DropdownItem onClick={() => navigate('/profile')}>
                  <UserIcon />
                  <DropdownLabel>Profile</DropdownLabel>
                </DropdownItem>
                <DropdownDivider />
                <DropdownDivider />
                <DropdownItem>
                  <ArrowRightStartOnRectangleIcon />
                  <DropdownLabel onClick={() => logoutUser()}>
                    Sign out
                  </DropdownLabel>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarSection>
        </Navbar>
      }
      sidebar={
        <Sidebar>
          <SidebarBody className='mt-8'>
            <SidebarSection>
              <SidebarItem onClick={() => navigate('/dashboard')}>
                <HomeIcon />
                <SidebarLabel>Dashboard</SidebarLabel>
              </SidebarItem>
              <SidebarItem onClick={() => navigate('/profile')}>
                <UserIcon />
                <SidebarLabel>Profile</SidebarLabel>
              </SidebarItem>
              <SidebarItem onClick={() => navigate('/upload-documents')}>
                <ArrowUpTrayIcon />
                <SidebarLabel>Upload Documents</SidebarLabel>
              </SidebarItem>
              {user?.role === 'admin' && (
                <>
                  <SidebarItem onClick={() => navigate('/user-list')}>
                    <UsersIcon />
                    <SidebarLabel>User List</SidebarLabel>
                  </SidebarItem>
                  <SidebarItem onClick={() => navigate('/audit-logs')}>
                    <ClipboardDocumentIcon />
                    <SidebarLabel>Audit Logs</SidebarLabel>
                  </SidebarItem>
                </>
              )}
            </SidebarSection>
            <SidebarSpacer />
          </SidebarBody>
          <SidebarFooter className='max-lg:hidden'>
            <Dropdown>
              <DropdownButton as={SidebarItem}>
                <span className='flex min-w-0 items-center gap-3'>
                  <Avatar
                    initials={user?.name?.slice(0, 2)}
                    className='size-10'
                    square
                    alt=''
                  />
                  <span className='min-w-0'>
                    <span className='block truncate text-sm/5 font-medium text-zinc-950 dark:text-white'>
                      {user?.name}
                    </span>
                    <span className='block truncate text-xs/5 font-normal text-zinc-500 dark:text-zinc-400'>
                      {user?.email}
                    </span>
                  </span>
                </span>
                <ChevronUpIcon />
              </DropdownButton>
              <DropdownMenu className='min-w-64' anchor='top start'>
                <DropdownItem onClick={() => navigate('/profile')}>
                  <UserIcon />
                  <DropdownLabel>Profile</DropdownLabel>
                </DropdownItem>
                <DropdownDivider />
                <DropdownDivider />
                <DropdownItem onClick={() => logoutUser()}>
                  <ArrowRightStartOnRectangleIcon />
                  <DropdownLabel>Sign out</DropdownLabel>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </SidebarFooter>
        </Sidebar>
      }
    >
      <main className='flex-1 overflow-auto'>
        <Outlet />
      </main>
    </SidebarLayout>
  );
};
