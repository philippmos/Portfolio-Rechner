import PortfolioDataProvider from '../../Data/PortfolioDataProvider';
import { FormatPriceValue, FormatFloatValue } from '../../Helper/NumberHelper';
import { getMonthDifference } from '../../Helper/DateHelper';


function Rebalancing() {
  let portfolioDataProvider = new PortfolioDataProvider();

  let data = portfolioDataProvider.getAll();

  let totalAssets = 0;
  let monthlySavings = 0;
  let totalPercentage = 0;

  data.portfolioItems.forEach((portfolioItem) => {
    totalAssets += portfolioItem.currentValue;
    totalPercentage += portfolioItem.targetPercentage;

    if (portfolioItem.monthlySavings != null) {
      monthlySavings += portfolioItem.monthlySavings;
    }    
  });

  let targetGoalAmountOfMonths = getMonthDifference(new Date(), new Date(data.goalReachDate));
  let targetGoalMonthlySavings = (data.goalAmount - totalAssets) / targetGoalAmountOfMonths;
  
  
  return (
      <div class="row">
        <div class="col-12">
          <h3>Rebalancing-Übersicht:</h3>
          <div><span class="fw-bold">Assets Gesamt:</span> {FormatPriceValue(totalAssets)}</div>
          <div><span class="fw-bold">Monatliche Sparrate:</span> {FormatPriceValue(monthlySavings)}</div>
          <div><span class="fw-bold">Zielbetrag:</span> {FormatPriceValue(data.goalAmount)}</div>
          <div><span class="fw-bold">Monatliche Zielsparsumme ({targetGoalAmountOfMonths} Monate):</span> {FormatPriceValue(targetGoalMonthlySavings)}</div>
          <div><span class="fw-bold">Prozentangabe:</span> {totalPercentage} %</div>


          <table class="table table-striped table-responsive">
            <colgroup>
                <col width="200" />
                <col width="150" />
                <col width="150" />
                <col width="215" />
                <col width="200" />
                <col width="100" />
                <col width="350" />
            </colgroup>
            <thead>
                <tr>
                    <th class="text-start">Position</th>
                    <th class="text-end">Aktueller</th>
                    <th class="text-end">Ziel</th>
                    <th class="text-end">Rebalancing / <br />Zielbetrag</th>
                    <th class="text-end">Sparbetrag / <br />Zielsparbetrag</th>
                    <th class="text-end">Relevant</th>
                    <th class="text-end">Beschreibung</th>
                </tr>
            </thead>
            <tbody>
              {portfolioDataProvider.getPortfolioItemsOrderedByCurrentValue().map(item => {
                let currentPercentage = (item.currentValue / totalAssets) * 100;
                let targetValue = totalAssets * (item.targetPercentage / 100);
                let difference = targetValue - item.currentValue;

                let differenceClass = 'bg-success';
                let differenceText = 'Buy';

                if (difference <= 0) {
                  differenceClass = 'bg-warning';
                  differenceText = 'Hold';
                }

                return (
                  <tr key={item.title}>
                    <td><span class="fw-bold">{item.title}</span><br />({portfolioDataProvider.getDepotOrAccountById(item.depotOrAccountId)})</td>
                    <td class="text-end">{FormatPriceValue(item.currentValue)}<br />{FormatFloatValue(currentPercentage)} %</td>
                    <td class="text-end">{FormatPriceValue(targetValue)}<br />{FormatFloatValue(item.targetPercentage)} %</td>
                    <td class="text-end">
                      <span className={`badge fw-bold ${differenceClass}`}>
                        {`${differenceText}: ${FormatPriceValue(difference)}`}
                      </span>
                    </td>
                    <td class="text-end">{item.monthlySavings != null ? FormatPriceValue(item.monthlySavings) : '-'}</td>
                    <td className={`text-end ${item.relevantForSavings ? 'text-success' : 'text-danger'}`}>{item.relevantForSavings ? 'Ja' : 'Nein'}</td>
                    <td class="text-end">{item.descriptionItems.join(', ')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
  );
}

export default Rebalancing;
