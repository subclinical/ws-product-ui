import React, { Component } from 'react'
import MyChart from './MyChart'
import Table from './Table'
import Map from './Map'
import './index.scss'

class Landing extends Component {
  constructor(props) {
    super(props)
    this.state = {
      display: "chart",
      loading: false,
      increment: "daily",
      eventsData: null,
      statsData: null
    }
  }

  componentDidMount() {
    if(this.state.increment === "daily") {
      this.fetchData("/data/daily")
    } else if (this.state.increment === "hourly") {
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
        <div className="button-div">
          <button className={increment === "hourly" ? "selected-button" : "select-button"} onClick={() => this.setState({ increment: "hourly" }, () => this.fetchData("/data/hourly"))}>Hourly</button>
          <button className={increment === "daily" ? "selected-button" : "select-button"} onClick={() => this.setState({ increment: "daily" }, () => this.fetchData("/data/daily"))}>Daily</button>
        </div>
        {loading ?
          <div className="loading-container">
            loading...
          </div> : this.display()}
      </div>
    )
  }

  selectDisplay = display => {
    this.setState({ display })
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
        return <MyChart loading={loading} data={data} increment={increment} />
      case "table":
        return <Table loading={loading} data={data} />
      case "map":
        return <Map loading={loading} />
    }
  }
}

export default Landing