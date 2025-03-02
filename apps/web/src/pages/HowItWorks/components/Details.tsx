import { Heading, ListItem, OrderedList, Text, Box, VStack } from '@chakra-ui/react';
import { FC } from 'react';

const Details: FC = () => {
  return (
    <VStack spacing={8} padding={8} color="gray.700" fontSize={['large', 'x-large']}>
      <Box>
        <Heading>How It Works</Heading>
        <Text>
          Welcome to Workahomie – the easiest way to find and share home workspaces with like-minded
          professionals. Whether you have a cozy home office to share or need a quiet place to work,
          Workahomie connects you with a vibrant community of freelancers, entrepreneurs, and remote
          workers. Here’s everything you need to know to get started:
        </Text>
      </Box>

      <Box>
        <Heading>1. Sign Up & Create Your Profile</Heading>
        <Text>
          Joining Workahomie is quick and free. Simply sign up and set up your profile with
          essential details about yourself, including your profession, skills, and work interests.
          The more complete your profile, the better matches you’ll find. Personalizing your profile
          also helps you connect with individuals who share similar goals and work ethics, making
          networking easier and more meaningful.
        </Text>
      </Box>

      <Box>
        <Heading>2. Offer or Find a Workspace</Heading>
        <OrderedList>
          <ListItem>
            Host a Workspace: If you have extra space at home, why not put it to good use? List your
            workspace on Workahomie by providing details about the setup, available amenities like
            high-speed WiFi, a comfortable chair, or even perks like coffee and snacks. Indicate
            your availability and any house rules so potential guests know what to expect.
          </ListItem>
          <ListItem>
            Find a Workspace: Searching for the perfect spot to get things done? Browse through
            available workspaces in your city, filtering by location, amenities, and host
            preferences. Whether you need a quiet desk for deep work or a collaborative space for
            brainstorming, you’ll find something that fits your working style.
          </ListItem>
        </OrderedList>
      </Box>

      <Box>
        <Heading>3. Connect & Book</Heading>
        <Text>
          Once you’ve found a workspace that meets your needs, send a request to the host. Use the
          built-in chat feature to introduce yourself, discuss expectations, and finalize the
          details. Communication is key to ensuring both you and the host have a great experience.
        </Text>
      </Box>

      <Box>
        <Heading>4. Work & Exchange Ideas</Heading>
        <Text>
          Enjoy a productive work session in a comfortable, welcoming space. Workahomie is more than
          just a place to work—it’s a community where you can meet new people, gain fresh
          perspectives, and exchange ideas with fellow professionals. Whether you’re looking for
          quiet focus time or engaging conversations, every work session offers an opportunity for
          growth and collaboration.
        </Text>
      </Box>

      <Box>
        <Heading>5. Rate & Review</Heading>
        <Text>
          After your session, take a moment to leave a review. Your feedback helps other users make
          informed decisions and ensures the community remains trustworthy and high-quality. Share
          your experience, mention any standout moments, and let others know why your host or guest
          was great to work with.
        </Text>
      </Box>
    </VStack>
  );
};

export { Details };
