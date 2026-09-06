export default function AdminShippingPage() {
  return (
    <div>
      <p className="eyebrow">Logistics</p>
      <h1 className="page-title">Shipping Rates</h1>
      <table className="data-table">
        <thead>
          <tr>
            <th>Service Name</th>
            <th>Code</th>
            <th>Base Rate (USD)</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Lumen D'Or Insured Express Courier</td>
            <td>EXPRESS_INSURED</td>
            <td>$25.00 + $0.01/g</td>
            <td>Hazardous Material Air Express Compliant</td>
          </tr>
          <tr>
            <td>Lumen D'Or Priority White-Glove Direct</td>
            <td>PRIORITY_WHITE_GLOVE</td>
            <td>$45.00 + $0.02/g</td>
            <td>White-Glove Insured Courier</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
