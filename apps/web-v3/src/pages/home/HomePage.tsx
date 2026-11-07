import { AppPromo } from './AppPromo';
import { FinalCta } from './FinalCta';
import { HeroMap } from './HeroMap';
import { HostCta } from './HostCta';
import { HowSteps } from './HowSteps';
import { NearbyHosts } from './NearbyHosts';
import { StatsBand } from './StatsBand';

export default function HomePage() {
  return (
    <>
      <HeroMap />
      <StatsBand />
      <AppPromo />
      <HowSteps />
      <NearbyHosts />
      <HostCta />
      <FinalCta />
    </>
  );
}
