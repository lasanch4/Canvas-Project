import { Chart } from "react-google-charts";

// used to render and display the graph using the google charts API
// props is taken from App.js at the bottom of the file with the HTML code
export default function Graph(props) { // props = 'properties'

    return (
      <div className={"my-chart"}>
        <Chart
          width={'100%'}
          height={400}
          chartType="CandlestickChart"
          loader={<div>Loading Chart...</div>} // would pass in "grade_distribution" for data from grade_calc
          data={
            props.stud_array
          }
          options={{
            legend: 'none',
          }}
          rootProps={{ 'data-testid': '1' }}
        />
      </div>
    );
  }




