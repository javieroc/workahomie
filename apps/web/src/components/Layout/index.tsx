import { FC, PropsWithChildren } from 'react';
import { Box } from '@chakra-ui/react';
import { Footer } from '../Footer';
import { Links } from '../Links';
import { Navbar } from '../Navbar';

const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Box>
      <Navbar />
      <Box>{children}</Box>
      <Links />
      <Footer />
    </Box>
  );
};

export { Layout };
