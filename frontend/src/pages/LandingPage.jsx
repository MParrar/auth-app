import { useContext } from 'react';
import { Button } from '../components/button';
import { NavbarLandingPage } from '../components/NavbarLandingPage';
import AuthContext from '../contexts/AuthProvider';
import { projectName } from '../utils/constants';

export const LandingPage = () => {
  const { showAuth0Login } = useContext(AuthContext);
  return (
    <div className="min-h-screen flex flex-col bg-gray-800 text-gray-200">
      <NavbarLandingPage  showAuth0Login={showAuth0Login}/>

      <main className="flex-grow flex flex-col items-center justify-center p-4 bg-white lg:bg-zinc-100 dark:bg-zinc-900 dark:lg:bg-zinc-950">
        <h1 className="text-3xl lg:text-4xl font-bold mb-6">{projectName}</h1>
        <Button
          variant="solid"
          className="text-white px-4 lg:px-6 py-2 lg:py-3 rounded-lg cursor-pointer hover:scale-110 transform-gpu"
          onClick={() => {
            showAuth0Login();
          }}
        >
          Get Started
        </Button>
      </main>
    </div>
  );
};
