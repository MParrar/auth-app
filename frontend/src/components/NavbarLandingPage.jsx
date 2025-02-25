import { Button } from '../components/button';

export const NavbarLandingPage = ({ showAuth0Login }) => {
  return (
    <nav className='flex items-center justify-between p-4 bg-white lg:bg-zinc-100 dark:bg-zinc-900 dark:lg:bg-zinc-60'>
      <div className='text-xl font-bold'>Logo</div>

      <div className='hidden lg:flex space-x-6'>
        <a href='#home' className='hover:text-gray-400'>
          Home
        </a>
        <a href='#article' className='hover:text-gray-400'>
          Article
        </a>
        <a href='#contact' className='hover:text-gray-400'>
          Contact Us
        </a>
      </div>

      <div className='flex space-x-2 lg:space-x-4'>
        <Button
          variant='solid'
          className='text-white cursor-pointer'
          onClick={() => showAuth0Login()}
        >
          Sign In
        </Button>
      </div>
    </nav>
  );
};
