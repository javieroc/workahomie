import { FC } from 'react';
import { faker } from '@faker-js/faker';
import { Layout } from 'src/components';
import { Story } from 'src/types';
import { Hero, NearHostList, PeopleStories, TryHosting } from './components';

const stories: Story[] = Array(20)
  .fill(0)
  .map((_: number, index: number) => ({
    brief: faker.lorem.paragraph(1),
    id: faker.string.uuid(),
    image: `https://picsum.photos/id/${index}/600/400`,
    location: faker.location.city(),
    title: faker.person.jobTitle(),
    user: faker.person.fullName(),
  }));

const Home: FC = () => {
  return (
    <Layout>
      <Hero />
      <NearHostList />
      <TryHosting />
      <PeopleStories stories={stories} />
    </Layout>
  );
};

export { Home };
