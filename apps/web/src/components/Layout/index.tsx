import { FC, PropsWithChildren } from 'react';
import { Box } from '@chakra-ui/react';
import { Footer } from '../Footer';
import { Links } from '../Links';
import { Navbar } from '../Navbar';
import { DonationToastHandler } from '../DonationToastHandler';

const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Box>
      <Navbar />
      <DonationToastHandler />
      <Box>{children}</Box>
      <Links />
      <Footer />
    </Box>
  );
};

export { Layout };
