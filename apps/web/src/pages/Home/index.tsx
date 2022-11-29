import { faker } from '@faker-js/faker';
import { Layout } from 'src/components';
import { Host, Story } from 'src/types';
import NearHostImage1 from 'src/assets/near-host-1.jpeg';
import NearHostImage2 from 'src/assets/near-host-2.jpeg';
import NearHostImage3 from 'src/assets/near-host-3.jpeg';
import NearHostImage4 from 'src/assets/near-host-4.jpeg';
import NearHostImage5 from 'src/assets/near-host-5.jpeg';
import NearHostImage6 from 'src/assets/near-host-6.jpeg';
import { Hero, NearHostList, PeopleStories, TryHosting } from './components';

const hosts: Host[] = [
  NearHostImage1,
  NearHostImage2,
  NearHostImage3,
  NearHostImage4,
  NearHostImage5,
  NearHostImage6,
].map((image) => ({
  name: faker.name.fullName(),
  address: faker.address.streetAddress(),
  apartmentType: faker.helpers.arrayElement(['Apartment', 'House', 'Flat']),
  countReviews: faker.datatype.number({ min: 0, max: 10 }),
  rate: faker.datatype.float({ max: 9 }),
  profileImage: image,
}));

const stories: Story[] = Array(20)
  .fill(0)
  .map((_: number, index: number) => ({
    brief: faker.lorem.paragraph(1),
    id: faker.datatype.uuid(),
    image: `https://picsum.photos/id/${index}/600/400`,
    location: faker.address.city(),
    title: faker.name.jobTitle(),
    user: faker.name.fullName(),
  }));

function Home(): JSX.Element {
  return (
    <Layout>
      <Hero />
      <NearHostList hosts={hosts} />
      <TryHosting />
      <PeopleStories stories={stories} />
    </Layout>
  );
}

export { Home };
