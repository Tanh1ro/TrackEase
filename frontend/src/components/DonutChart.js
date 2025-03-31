import React from 'react';
import FusionCharts from 'fusioncharts';
import Doughnut2D from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import ReactFusionCharts from 'react-fusioncharts';

// Add the chart as a dependency
FusionCharts.addDep(Doughnut2D);
FusionCharts.addDep(FusionTheme);

const DonutChart = () => {
  const dataSource = {
    chart: {
      caption: "Expense Distribution",
      enableSmartLabels: false,
      subcaption: "Monthly expense breakdown",
      showpercentvalues: "1",
      defaultcenterlabel: "Total Expenses",
      aligncaptionwithcanvas: "0",
      captionpadding: "0",
      decimals: "0",
      plottooltext: "<b>$percentValue</b> of total expenses are in <b>$label</b>",
      theme: "fusion"
    },
    data: [
      {
        color: "#29577b",
        label: "Food & Dining",
        value: "18900"
      },
      {
        color: "#35c09c",
        label: "Transportation",
        value: "5300"
      },
      {
        color: "#f6ce49",
        label: "Entertainment",
        value: "10500"
      },
      {
        color: "#f7a35c",
        label: "Utilities",
        value: "1900"
      }
    ]
  };

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <ReactFusionCharts
        type="doughnut2d"
        width="100%"
        height="100%"
        dataFormat="JSON"
        dataSource={dataSource}
      />
    </div>
  );
};

export default DonutChart;
  