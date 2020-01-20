import React, { Component } from 'react'
import GoogleMapReact from 'google-map-react'
import MarkerClusterer from '@google/markerclusterer'

const AnyReactComponent = ({ text }) => <div>{text}</div>;
class Map extends Component {
  constructor(props) {
    super(props)
    this.state = {
      poiData: [],
      loading: false,
      metric: "events",
      maxMeasurement: 0,
      center: {
        lat: 43.6532,
        lng: -79.3832
      },
      zoom: 11
    }
  }

  componentDidMount() {
    this.fetchMapData()
  }

  render() {
    const { loading, poiData, metric, maxMeasurement } = this.state
    return (
      <div className="map-container">
        <div className="button-div">
          <button className={metric === "events" ? "selected-button" : "select-button"} onClick={() => this.changeMetrics("events")}>
            Events
          </button>
          <button className={metric === "clicks" ? "selected-button" : "select-button"} onClick={() => this.changeMetrics("clicks")}>
            Clicks
          </button>
          <button className={metric === "impressions" ? "selected-button" : "select-button"} onClick={() => this.changeMetrics("impressions")}>
            Impressions
          </button>
          <button className={metric === "revenue" ? "selected-button" : "select-button"} onClick={() => this.changeMetrics("revenue")}>
            Revenue
          </button>
        </div>
        {loading ? <div>loading...</div> : null}
        {poiData ? <div id="map" style={{ height: '400px', width: '400px' }}>
          <GoogleMapReact
            bootstrapURLKeys={{ key: process.env.REACT_APP_MAP_KEY }}
            defaultCenter={this.state.center}
            defaultZoom={this.state.zoom}
            yesIWantToUseGoogleMapApiInternals={true}
            onGoogleApiLoaded={({ map, maps }) => this.apiIsLoaded(map, maps)}
          >
            {poiData.map((poi, i) => {
              return (
                <div key={i} lat={poi.lat} lng={poi.lon} >
                  <div className="poi-data" style={{ 
                    width: `calc(${poi[metric] / maxMeasurement} * 50px)`, 
                    height: `calc(${poi[metric] / maxMeasurement} * 50px)`
                  }}>
                    <span>{poi[metric]} {metric}</span>
                  </div>
                </div>
              )
            })}
          </GoogleMapReact>
        </div> : null}
      </div>
    )
  }

  // Return map bounds based on list of places
  getMapBounds = (map, maps, places) => {
    const bounds = new maps.LatLngBounds();

    places.forEach((place) => {
      bounds.extend(new maps.LatLng(
        place.lat,
        place.lon,
      ));
    });
    return bounds;
  };

  // Fit map to its bounds after the api is loaded
  apiIsLoaded = (map, maps) => {
    let markers = []
    this.state.poiData.map(poi => {
      markers.push(new maps.Marker({ position: { lat: poi.lat, lng: poi.lon }, map: map }))
    })
    let cluster = new MarkerClusterer(map, markers, { imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'})
    // Get bounds by our places
    const bounds = this.getMapBounds(map, maps, this.state.poiData);
    // Fit map to bounds
    map.fitBounds(bounds);
    // Bind the resize listener
  };

  changeMetrics = metric => {
    let metrics = this.state.poiData.map(poi => parseFloat(poi[metric]))
    this.setState({ metric, maxMeasurement: Math.max(...metrics) })
  }

  fetchMapData = () => {
    this.setState({ loading: true })
    fetch(`https://cors-anywhere.herokuapp.com/${process.env.REACT_APP_API_URL}/map_data`)
      // fetch(`http://localhost:5555${endpoint}`)
      .then(res => res.json())
      .then(res => {
        let metrics = res.map(poi => parseFloat(poi[this.state.metric]))
        this.setState({
          maxMeasurement: Math.max(...metrics),
          poiData: res,
          loading: false
        })
      });
  }
}

export default Map