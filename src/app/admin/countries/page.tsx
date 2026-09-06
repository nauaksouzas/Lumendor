import { getAllCountries } from '@/features/shipping/countries';

export default async function AdminCountriesPage() {
  const countries = getAllCountries();

  return (
    <div>
      <p className="eyebrow">Territory Management</p>
      <h1 className="page-title">Country Availability</h1>
      <table className="data-table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Country Name</th>
            <th>Sales</th>
            <th>Shipping</th>
            <th>Membership</th>
          </tr>
        </thead>
        <tbody>
          {countries.map((c) => (
            <tr key={c.code}>
              <td>{c.code}</td>
              <td>{c.name}</td>
              <td>{c.enabledForSales ? 'Enabled' : 'Disabled'}</td>
              <td>{c.enabledForShipping ? 'Enabled' : 'Disabled'}</td>
              <td>{c.enabledForMembership ? 'Enabled' : 'Disabled'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
