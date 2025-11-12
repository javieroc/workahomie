import { Heading, ListItem, OrderedList, UnorderedList, Text, Box, VStack } from '@chakra-ui/react';
import { FC } from 'react';

const Details: FC = () => {
  return (
    <VStack spacing={8} padding={8} color="gray.700" fontSize={['large', 'x-large']}>
      <Box>
        <Heading>How It Works</Heading>
        <Text>
          Welcome to Workahomie – a community-driven platform connecting professionals who need a
          place to work with those who have a space to share. Our mission is to foster
          collaboration, networking, and productivity by making it easy to find and offer free home
          workspaces. Here’s everything you need to know to get started:
        </Text>
      </Box>

      <Box>
        <Heading>For Guests: Find Your Next Workspace</Heading>
        <OrderedList spacing={3}>
          <ListItem>
            <Text>
              <strong>Sign Up & Create Your Profile:</strong> Joining is quick, easy, and completely
              free. Tell us about your profession and what you&apos;re passionate about. A complete
              profile helps hosts get to know you, making it easier to find the perfect match.
            </Text>
          </ListItem>
          <ListItem>
            <Text>
              <strong>Discover Inspiring Spaces:</strong> Browse a variety of unique home offices
              shared by professionals in your city. Use our filters to find a space that fits your
              needs, whether you&apos;re looking for a quiet corner for deep focus or a
              collaborative environment with specific amenities like high-speed Wi-Fi, a coffee
              machine, or even a garden view.
            </Text>
          </ListItem>
          <ListItem>
            <Text>
              <strong>Connect & Book with Ease:</strong> Found a space you love? Send a booking
              request to the host with a friendly message introducing yourself and your work. Our
              built-in chat makes it simple to coordinate details and ensure a smooth experience for
              everyone.
            </Text>
          </ListItem>
          <ListItem>
            <Text>
              <strong>Work, Collaborate & Grow:</strong> Enjoy a change of scenery and a productive
              day of work. More than just a desk, Workahomie is an opportunity to meet like-minded
              people, exchange ideas, and build your professional network in a comfortable, informal
              setting.
            </Text>
          </ListItem>
        </OrderedList>
      </Box>

      <Box>
        <Heading>For Hosts: Share Your Space & Connect</Heading>
        <OrderedList spacing={3}>
          <ListItem>
            <Text>
              <strong>List Your Workspace for Free:</strong> Have a spare desk or a quiet room?
              Share it with the Workahomie community! Creating a listing is simple. Just upload a
              few photos, describe your space, and list the amenities you offer. Set your
              availability and house rules to let guests know what to expect.
            </Text>
          </ListItem>
          <ListItem>
            <Text>
              <strong>Welcome Like-Minded Professionals:</strong> Receive requests from fellow
              professionals. You can review their profiles and chat with them before accepting a
              booking. You have full control over who you host and when.
            </Text>
          </ListItem>
          <ListItem>
            <Text>
              <strong>Build Your Network:</strong> Hosting is a fantastic way to meet new people,
              share knowledge, and discover collaboration opportunities. Expand your professional
              circle without ever leaving your home.
            </Text>
          </ListItem>
          <ListItem>
            <Text>
              <strong>Contribute to Your Community:</strong> By sharing your space, you&apos;re
              helping build a supportive ecosystem for freelancers, remote workers, and
              entrepreneurs in your city. It’s a simple way to give back and make a positive impact.
            </Text>
          </ListItem>
        </OrderedList>
      </Box>

      <Box>
        <Heading>A Community Built on Trust & Respect</Heading>
        <Text>
          Safety and a positive experience are our top priorities. Workahomie is built on a
          foundation of mutual respect.
        </Text>
        <UnorderedList spacing={2} paddingTop={4}>
          <ListItem>
            <Text>
              <strong>Verified Profiles:</strong> We encourage all users to complete their profiles
              to foster a trusted community.
            </Text>
          </ListItem>
          <ListItem>
            <Text>
              <strong>Ratings & Reviews:</strong> After each session, both hosts and guests can
              leave a review. This feedback system helps maintain a high-quality, reliable network
              of spaces and professionals.
            </Text>
          </ListItem>
          <ListItem>
            <Text>
              <strong>Direct Communication:</strong> Our secure messaging system allows you to chat
              and clarify expectations before confirming any arrangement, ensuring a great fit for
              both parties.
            </Text>
          </ListItem>
        </UnorderedList>
      </Box>
    </VStack>
  );
};

export { Details };
