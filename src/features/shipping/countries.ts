export interface CountryConfig {
  code: string;
  name: string;
  enabledForSales: boolean;
  enabledForShipping: boolean;
  enabledForMembership: boolean;
}

const countryRegistry: Map<string, CountryConfig> = new Map([
  [
    'US',
    {
      code: 'US',
      name: 'United States',
      enabledForSales: true,
      enabledForShipping: true,
      enabledForMembership: true,
    },
  ],
  [
    'CA',
    {
      code: 'CA',
      name: 'Canada',
      enabledForSales: true,
      enabledForShipping: true,
      enabledForMembership: true,
    },
  ],
  [
    'GB',
    {
      code: 'GB',
      name: 'United Kingdom',
      enabledForSales: true,
      enabledForShipping: true,
      enabledForMembership: true,
    },
  ],
  [
    'FR',
    {
      code: 'FR',
      name: 'France',
      enabledForSales: true,
      enabledForShipping: true,
      enabledForMembership: true,
    },
  ],
  [
    'EMBARGOED_XX',
    {
      code: 'XX',
      name: 'Restricted Territory XX',
      enabledForSales: false,
      enabledForShipping: false,
      enabledForMembership: false,
    },
  ],
]);

export function getCountryConfig(code: string): CountryConfig | undefined {
  return countryRegistry.get(code.toUpperCase());
}

export function isCountrySupportedForShipping(code: string): boolean {
  const config = getCountryConfig(code);
  return config ? config.enabledForShipping : false;
}

export function getAllCountries(): CountryConfig[] {
  return Array.from(countryRegistry.values());
}
