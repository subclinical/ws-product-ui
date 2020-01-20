import React, { Component } from 'react'
import Fuse from 'fuse.js'
class Table extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tableData: [],
      loading: false,
      keyword: "",
      searchResults: []
    }
  }

  componentDidMount() {
    this.fetchTableData()
  }

  render() {
    const {
      loading,
      tableData,
      keyword,
      searchResults
    } = this.state
    return (
      <div>
        {loading ? <div>Loading...</div> : null}
        {tableData.length > 0 ?
        <div className="table-container">
          <label>Search: </label>
          <input value={keyword} onChange={this.handleKeywordChange} />
          <table className="table">
            <thead>{Object.keys(tableData[0]).map(key => <th>{key}</th>)}</thead>
            <tbody>
              {tableData.map(row => {
                return (
                  <tr className={searchResults.includes(row) ? "highlighted" : ""}>
                    {Object.values(row).map(column => <td>{column}</td>)}
                  </tr>
                )
              })}
            </tbody>
          </table> 
        </div> : null}
      </div>
    )
  }

  handleKeywordChange = e => {
    let options = {
      shouldSort: true,
      threshold: 0.6,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: [
        "name"
      ]
    };
    let fuse = new Fuse(this.state.tableData, options); // "list" is the item array
    let result = fuse.search(e.target.value);
    
    this.setState({ keyword: e.target.value, searchResults: result })
  }

  fetchTableData = () => {
    this.setState({ loading: true })
    fetch(`https://cors-anywhere.herokuapp.com/${process.env.REACT_APP_API_URL}/poi_data`)
      // fetch(`http://localhost:5555${endpoint}`)
      .then(res => res.json())
      .then(res => {
        this.setState({
          tableData: res,
          loading: false
        })
      });
  }
}

export default Table