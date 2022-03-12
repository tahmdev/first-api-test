import React from 'react';
import './App.css';
import 'font-awesome/css/font-awesome.min.css';

function App() {
  return (
    <div className="App">
      <Test />

    </div>
  );
}

class Test extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      apiData: [],
      loaded: false,
      url: "https://api.publicapis.org/entries",
      searchFilter: [],
      categoryFilter: "",
      searchInput: "",
      categories: [],
    }
    this.handleSearch = this.handleSearch.bind(this)
    this.callApi = this.callApi.bind(this)
    this.handleSwitch = this.handleSwitch.bind(this)
  }
  componentDidMount(){
    this.callApi()
    fetch("https://api.publicapis.org/categories")
      .then(res2 => res2.json())
      .then(json2 => {
        let arr = json2.categories.map(data => [data, false])
        this.setState({
          categories: arr,
        })
      })

    
  }
  callApi(){
    let search = ""
    let filter = ""
    this.state.searchFilter != ""
    ? search = "?title=" + this.state.searchFilter
    : search = ""
    let output = [];

    if (this.state.categoryFilter != ""){
    this.state.categoryFilter.map(item =>{
      if (search == ""){
        filter = "?category=" + item[0]
      }
      else{
        filter = "&category=" + item[0]
      }

      console.log(this.state.url + search + filter)
    fetch(this.state.url + search + filter)
      .then(res => res.json())
      .then(json => {
        output = [...json.entries, ...output];
      })
      .then(() =>{
        output.sort((a,b) => (a.API > b.API) ? 1 :(b.API > a.API) ? -1 : 0)
        this.setState({
          apiData: output,
          loaded: true,
        })
      })
    }) 
    }else{
    fetch(this.state.url + search)
      .then(res => res.json())
      .then(json => {
        this.setState({
          apiData: json.entries,
          loaded: true,
        })
      })
    }
    
    
    
  }
  handleSearch(){
    this.setState ({
      searchFilter: document.getElementById("search-bar").value
    }, () => {
      this.callApi()
    })
    
  }


  handleSwitch(event){
    let checkBox = document.getElementById(event.target.childNodes[1].id)
    checkBox.checked = !checkBox.checked;

    let newState = [...this.state.categories]
    newState[event.target.id][1] = ! newState[event.target.id][1]
    let catFilterArray = newState.filter(item => item[1])

    
    this.setState({
      categories: newState, 
      categoryFilter: catFilterArray
    }, () => this.callApi())

  }
  
  render(){
    let green = {
      backgroundColor: "green"
    }
    let red = {
      backgroundColor: "red"
    }

    let input = document.getElementById("search-bar")
    console.log(input)
    
    if(!this.state.loaded){
      return (<div>Loading...</div>)
    }
    else
    {return(
      <div>
        <nav id="navbar">
          <div id="search-wrapper">
            <input type="text" id="search-bar" placeholder="Search..." onKeyDown={e => e.key==="Enter" ? this.handleSearch() : console.log(e.key)}/>
            <button type="submit" id="search-btn" onClick={this.handleSearch}><i className="fa fa-search"></i></button>
          </div>
        </nav>
        <div id="filter-container">
          {this.state.categories.map((cat, index) =>{
              return(
                <div id={index} key={index} className="filters" style={cat[1] ? green : red} onClick={this.handleSwitch}>
                  <label htmlFor={cat[0]} >{cat[0]}</label>
                  <input id={cat[0]} type="checkbox" />
                </div>
              )
            })}
        </div>
          
        <div className="result-wrapper">
            {this.state.apiData.map((data, index) => {
              return (
                <Template key={index} title={data.API} desc={data.Description} category={data.Category} link={data.Link} />
              )
            })
            }
         
        </div>
      </div>
    )}
  }
}

const Template  = (props) =>{
  return(
    <div className="template-wrapper">
      <div className='flex-container'>
        <a className="title-link" href={props.link}><h1>{props.title}</h1></a>
        <h2>{props.category}</h2>
      </div>
      
      <p>{props.desc}</p>
    </div>
  )
}

export default App;
