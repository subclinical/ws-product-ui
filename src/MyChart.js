import React, { Component } from 'react'
import m from 'moment'
import Chart from 'chart.js'

class MyChart extends Component {
  constructor(props) {
    super(props)

    this.state = {
      chartData: this.props.data
    }
  }

  componentDidMount() {
    // this.configChartData(this.props.data)
    // if(!this.state.chartData) this.fetchChartData("/data/daily")
    if(this.state.chartData) this.refreshChart(this.props)
  }

  render() {
    const { increment, setHourly, setDaily } = this.props;
    return (
      <div>
        <div className="button-div">
          <button className={increment === "hourly" ? "selected-button" : "select-button"} onClick={setHourly}>Hourly</button>
          <button className={increment === "daily" ? "selected-button" : "select-button"} onClick={setDaily}>Daily</button>
        </div>
        <canvas className="chart" id="events" width="500" height="500" />
      </div>
    )
  }


  // fetchChartData = endpoint => {
  //   this.setState({ loading: true })
  //   fetch(`https://cors-anywhere.herokuapp.com/${process.env.REACT_APP_API_URL}${endpoint}`)
  //     // fetch(`http://localhost:5555${endpoint}`)
  //     .then(res => res.json())
  //     .then(res => {
  //       this.setState({
  //         chartData: res,
  //         loading: false
  //       })
  //     });
  // }

  configChartData(dataValues) {
    return {
      type: this.props.increment === "hourly" ? "line" : "bar",
      data: {
        labels: dataValues.map(data => this.props.increment === "hourly" ? m(data.date).add(data.hour, "hours").format("YYYY-MM-DD HH a") : m(data.date).format("YYYY-MM-DD")),
        datasets: [
          {
            label: "Events",
            data: dataValues.map(data => data.events),
            backgroundColor: "#3d6391",
            hidden: false
          },
          {
            label: "Clicks",
            data: dataValues.map(data => data.clicks),
            backgroundColor: "#EC7063",
            hidden: true
          },
          {
            label: "Impressions",
            data: dataValues.map(data => data.impressions),
            backgroundColor: "#16A085",
            hidden: true
          },
          {
            label: "Revenue",
            data: dataValues.map(data => data.revenue),
            backgroundColor: "#8E44AD",
            hidden: true
          },
        ]
      },
      options: {
        responsive: true,
        scaleLineColor: "transparent",
        gridLines: {
          drawBorder: false
        },
        hover: { mode: false },
        scales: {
          yAxes: [
            {
              stacked: false,
              gridLines: {
                drawBorder: false
              },
              scaleLineColor: "transparent",
              scaleLabel: { display: true, labelString: "Count" }
            }
          ],
          xAxes: [
            {
              stacked: false,
              gridLines: {
                drawBorder: false
              },
              scaleLineColor: "transparent",
              scaleLabel: {
                display: true,
                labelString: "Time"
              }
            }
          ]
        }
      }
    };
  }

  refreshChart(nextProps) {
    const {
      chartData
    } = this.state;
    const chartCTX = document
      .getElementById("events")
      .getContext("2d");
    console.log(chartCTX)
    const chart = new Chart(
      chartCTX,
      this.configChartData(chartData)
    );

    this.setState({ chart });
  }
}

export default MyChart