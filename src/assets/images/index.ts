// Institution Visual Assets Registry
import logoUrl from './fedpuka_logo.svg';
import gateHeroUrl from './gate_ukana.jfif';
import complexUrl from './Ukana-poly_1.jfif';
import convocationUrl from './Ukana-poly_2.jpg';
import engineeringUrl from './Ukana-poly_3.jpg';

export const INSTITUTION_ASSETS = {
  logo: logoUrl,
  gateHero: gateHeroUrl,
  campusComplex: complexUrl,
  convocation: convocationUrl,
  engineeringLab: engineeringUrl,
  // SVG fallbacks & domain patterns
  fallbackBuilding: complexUrl,
  fallbackLaboratory: engineeringUrl,
  fallbackEvent: convocationUrl,
};

export default INSTITUTION_ASSETS;
