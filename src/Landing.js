import React, { Component } from 'react'
import MyChart from './MyChart'
import Table from './Table'
import Map from './Map'
import './index.scss'

class Landing extends Component {
  constructor(props) {
    super(props)
    this.state = {
      display: "map",
      loading: false,
      increment: "daily",
      eventsData: null,
      statsData: null
    }
  }

  componentDidMount() {
    const { display, increment } = this.state;
    if(display === "chart" && increment === "daily") {
      this.fetchData("/data/daily")
    } else if (display === "chart" && increment === "hourly") {
      this.fetchData("/data/hourly")
    } 
  }

  render() {
    const { loading, display, increment } = this.state;
    return (
      <div className="landing">
        <div className="button-div">
          <button className={display === "chart" ? "selected-button" : "select-button"} onClick={() => this.selectDisplay("chart")}>Chart</button>
          <button className={display === "table" ? "selected-button" : "select-button"} onClick={() => this.selectDisplay("table")}>Table</button>
          <button className={display === "map" ? "selected-button" : "select-button"} onClick={() => this.selectDisplay("map")}>Map</button>
        </div>
        {loading ?
          <div className="loading-container">
            loading...
          </div> : this.display()}
      </div>
    )
  }

  selectDisplay = display => {
    this.setState({ display }, this.fetchData("/data/daily"))
  }

  fetchData = endpoint => {
    this.setState({ loading: true })
    fetch(`https://cors-anywhere.herokuapp.com/${process.env.REACT_APP_API_URL}${endpoint}`)
    // fetch(`http://localhost:5555${endpoint}`)
			.then(res => res.json())
			.then(res => {
				this.setState({
          data: res,
          loading: false
				})
			});
  }
  
  display = () => {
    const { display, loading, data, increment } = this.state;
    switch(display) {
      case "chart":
        return <MyChart 
                loading={loading} 
                data={data} 
                increment={increment} 
                setHourly={() => this.setState({ increment: "hourly" }, () => this.fetchData("/data/hourly"))}
                setDaily={() => this.setState({ increment: "daily" }, () => this.fetchData("/data/daily"))}
              />
      case "table":
        return <Table loading={loading} data={data} />
      case "map":
        return <Map loading={loading} data={data} />
    }
  }
}

export default Landing