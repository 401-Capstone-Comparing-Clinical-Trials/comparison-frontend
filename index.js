import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai"
import {test_func} from './clinicalAPI.mjs';


class Search extends React.Component{
  constructor(props){
    super(props);
    this.state = {keyword:'', numResult:'', result:'', test:''};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event){
    if(event.target.id === "keyword"){
      this.setState({keyword:event.target.value});
      this.props.keyword = event.target.value;
    }
    else if(event.target.id === "numResult"){
      this.setState({numResult:event.target.value})
      this.props.numResult = event.target.value;
    }
  }

  handleSubmit(event){
    fetch("http://clinicaltrials.gov/api/query/full_studies?expr=heart+attack&min_rnk=1&max_rnk=1&fmt=json")
      .then(response => response.json())
      .then((result) => {alert(result)},
        (error) => {alert(error)})
  }

  render(){
    const BarStyling = {width:"20rem",background:"#F2F1F9", border:"none", padding:"0.5rem", margin:"5px"};
    return(
      <form onSubmit={() => this.props.executeSearch(this.state.keyword, this.state.numResult)}>
        <input 
          id="keyword"
          style={BarStyling}
          value={this.state.keyword}
          onChange={this.handleChange}
          placeholder={"search clinical trials"}
        />
        <input 
          id="numResult"
          type="text"
          style={BarStyling}
          value={this.state.numResult}
          onChange={this.handleChange}
          placeholder= {"number of results"}
        />
        <input 
          type="submit"
        />
      </form>
      );
  }

}

//This is the main (parent) class. This is the first component to be created.
class Display extends React.Component{
  //Runs only on refresh
  constructor(props){
    super(props);
    const numDisplays = 2; //Determines how many trials to display on screen. 
    const wrappers = []; //array of trial display wrappers
    let i;
      
    for (i = 0; i < numDisplays; i++) { 
      wrappers.push(<TrialWrapper key={"key"+ i} numDisplays={numDisplays}
        displayInCriteria={false} //Initial values for criteria dropdown
        displayOutCriteria={false}
        displayOutMeasures={false}
        displayResults={false}
        toggleInCriteria={()=>this.toggleInCriteria()} //Sending dropdown toggle functions down to child components
        toggleOutCriteria={() => this.toggleOutCriteria()} 
        toggleOutMeasures={() => this.toggleOutMeasures()}
        toggleResults={() => this.toggleResults()}
        trialChoice={i}
        dateChoice={i}
        typeChoice={i}
        conditionChoice={i}
        treatmentsChoice={i}
        inclusionChoice={i}
        linkChoice={i}
        outcomeChoice={i}
        resultChoice={i} 
        trialData={null}
        />);
    }
    //Since we want to use these values elsewhere, add them to the state since state is persistent (each componenet instance has own state).
    this.state = {numDisplays: numDisplays, displayInCriteria: false, displayOutCriteria: false, displayOutMeasures: false, displayResults: false, wrappers: wrappers, trial1: null, trial2: null}; 
  }

  componentDidMount(){

    fetch("/api/query/full_studies?expr=paloma+3%0D%0A&min_rnk=1&max_rnk=2&fmt=json")
      .then(response => response.json())
      .then((result) => {this.setState({trial1: result.FullStudiesResponse.FullStudies[0], trial2: result.FullStudiesResponse.FullStudies[1]}); this.updateCriteria()},
        (error) => {alert(error)});

  }


  //When we change the dropdown state in toggleInCriteria or toggleOutCriteria, we need to re-create the display wrappers
  //to reflect the change
  updateCriteria(){
    let i;
    const wrappers = [];
    for (i = 0; i < this.state.numDisplays; i++) { 
      wrappers.push(<TrialWrapper key={"key"+ i} numDisplays={this.state.numDisplays} 
        displayInCriteria={this.state.displayInCriteria}
        displayOutCriteria={this.state.displayOutCriteria}
        displayOutMeasures={this.state.displayOutMeasures}
        displayResults={this.state.displayResults}
        toggleInCriteria={()=>this.toggleInCriteria()}
        toggleOutCriteria={() => this.toggleOutCriteria()}
        toggleOutMeasures={() => this.toggleOutMeasures()}
        toggleResults={() => this.toggleResults()}
        trialChoice={i}
        dateChoice={i}
        typeChoice={i}
        conditionChoice={i}
        treatmentsChoice={i}
        inclusionChoice={i}
        outcomeChoice={i}
        resultChoice={i}
        linkChoice={i}
        trialData={i===0 ? JSON.stringify(this.state.trial1) : JSON.stringify(this.state.trial2)}
        />);
    }
    //Calling setState triggers the render function to run and essentially updates the component
    this.setState({wrappers: wrappers}) 
  }

  //Toggles the criteria dropdowns and the calls updateCriteria
  toggleInCriteria(){
    this.setState({displayInCriteria: !this.state.displayInCriteria}, () => this.updateCriteria());
  }

  toggleOutCriteria(){
    this.setState({displayOutCriteria: !this.state.displayOutCriteria}, () => this.updateCriteria());
  }

  toggleOutMeasures(){
    this.setState({displayOutMeasures: !this.state.displayOutMeasures}, () => this.updateCriteria());
  }

  toggleResults(){
    this.setState({displayResults: !this.state.displayResults}, () => this.updateCriteria());
  }

  //Displays to the screen
  render(){
    return(
      <div className="Background">
        <Search />
        <div className = 'PatientAndTrials'>
          <PatientDisplay/>
          <div className="TrialCollection">
            {this.state.wrappers}
          </div>
        </div>
        
      </div>
    );
  }
}


class PatientDisplay extends React.Component {
  constructor(props){
    super(props);
  }

  render(){
    return(
      <div className='PatientDisplay' style={{width:'200px'}}>
        <p className="Header1">Sorting Criteria</p>
        <form>
          <p className="Header2">Patient Information</p>
          <input
          className="TextInput"
          placeholder="Age"
          />
          <input
          className="TextInput"
          placeholder="Condition"
          />
          <input
          className="TextInput"
          placeholder="Inclusion Criteria"
          />
          <input
          className="TextInput"
          placeholder="Exlusion Criteria"
          />
          <p className="Header2">Trial Status</p>
          <input
          className="TextInput"
          type="checkbox"
          id="option1"
          value="Primary Ongoing"
          />
          <label htmlFor="option1">Primary Ongoing</label>
          <br/>
          <input
          className="TextInput"
          type="checkbox"
          id="option2"
          value="Primary Completed"
          />
          <label htmlFor="option2">Primary Completed</label>
          <br/>
          <input
          className="TextInput"
          type="checkbox"
          id="option3"
          value="Study Completed"
          />
          <label htmlFor="option3">Study Completed</label>
          <p className="Header2">Drug Information</p>
          <input
          className="TextInput"
          placeholder="Include Drug"
          />
          <input
          className="TextInput"
          placeholder="Exclude Drug"
          />
          <p className="Header2">Outcome Measures</p>
          <input
          className="TextInput"
          placeholder="Desired Outcome Measure"
          />
          <br/>
          <br/>
          <input type='submit' value="Apply Criteria"/>
        </form>
      </div>
    );
  }
}

//This class represents an individual clinical trial
class TrialWrapper extends React.Component {
  //Runs on refresh
  constructor(props){
    super(props);
    this.state = {
      width: ((window.innerWidth - 200) / props.numDisplays) - 50,
      displayInCriteria: this.props.displayInCriteria,
      displayOutCriteria: this.props.displayOutCriteria,
      displayOutMeasures: this.props.displayOutMeasures,
      displayResults: this.props.displayResults,
      trialChoice: this.props.trialChoice,
      dateChoice: this.props.dateChoice,
      typeChoice: this.props.typeChoice,
      conditionChoice: this.props.conditionChoice,
      treatmentsChoice: this.props.treatmentsChoice,
      inclusionChoice: this.props.inclusionChoice,
      outcomeChoice: this.props.outcomeChoice, 
      resultChoice: this.props.resultChoice, 
      linkChoice: this.props.linkChoice,
      trialData: JSON.parse(this.props.trialData)
    };
  }

  //Runs when a prop passed down from the parent changes. Used to trigger re-rendering on dropdown toggle
  componentDidUpdate(prevProps) {
    if(this.props.displayInCriteria !==prevProps.displayInCriteria){
      this.setState({displayInCriteria: this.props.displayInCriteria});  
    }
    if(this.props.displayOutCriteria !== prevProps.displayOutCriteria){
      this.setState({displayOutCriteria: this.props.displayOutCriteria});
    }
    if(this.props.displayOutMeasures !== prevProps.displayOutMeasures){
      this.setState({displayOutMeasures: this.props.displayOutMeasures});
    }
    if(this.props.displayResults !== prevProps.displayResults){
      this.setState({displayResults: this.props.displayResults});
    }
    if(this.props.trialData !== prevProps.trialData){
      this.setState({trialData: JSON.parse(this.props.trialData)});
    }
  }

  //For criteria, we pass down the current state of dropdowns and the toggle function that we got from the parent
  render() {
    return (
      <div className="TrialWrapper" style={{width: this.state.width}}>
        <TrialName 
          trialChoice={this.state.trialChoice} 
          data={this.state.trialData? JSON.stringify(this.state.trialData.Study.ProtocolSection.IdentificationModule.BriefTitle) : null} />
        <TrialDate dateChoice={this.state.dateChoice}/>
        <TrialType typeChoice={this.state.typeChoice}/>
        <TrialCondition conditionChoice={this.state.conditionChoice}/>
        <TrialTreatment treatmentsChoice={this.state.treatmentsChoice}/>
        <TrialInCriteria inclusionChoice={this.state.inclusionChoice} displayInCriteria={this.state.displayInCriteria} toggleInCriteria={() => this.props.toggleInCriteria()}/>
        <TrialExCriteria displayOutCriteria={this.state.displayOutCriteria} toggleOutCriteria={() => this.props.toggleOutCriteria()}/>
        <TrialOutcomeMeasures 
        outcomeChoice={this.state.outcomeChoice} 
        displayOutMeasures={this.state.displayOutMeasures} 
        toggleOutMeasures={() => this.props.toggleOutMeasures()}
        data={this.state.trialData? JSON.stringify(this.state.trialData.Study.ProtocolSection.OutcomesModule) : null}
        /> 
        <TrialResult resultChoice={this.state.resultChoice} displayResults={this.state.displayResults} toggleResults={() => this.props.toggleResults()}/>
        <TrialLink linkChoice={this.state.linkChoice}/>
      </div>
    );
  }
}

class TrialName extends React.Component {
  constructor(props){
    super(props);
    this.state= {data: this.props.data}
  }

  componentDidUpdate(prevProps){
    if(this.props.data !== prevProps.data){
      this.setState({data: this.props.data});
    }
  }

  render(){
    return(
      <div className="TrialSection" >
        <p>Clinical Trials:</p>
        <div className="text">
            {this.state.data}
        </div>
      </div>
    );
  }
}

class TrialDate extends React.Component {
  constructor(props){
    super(props);
    this.state = {date1: "September 26, 2013", date2: "December 5, 2014", date3: "May 3, 2021"}
    if (this.props.dateChoice === 1) {
      this.state = {date1: "December 17, 2013", date2: "January 29, 2016", date3: "August 31, 2022"}
    }
  }
  render(){
    return(
      <div className="TrialSection" >
        <p>Actual Study Start Date:
          <span className="text">
            {this.state.date1}
          </span>
        </p>
        <p>Actual Primary Completion Date:
          <span className="text">
            {this.state.date2}
          </span>
        </p>
        <p>Estimated Study Completion Date:
          <span className="text">
            {this.state.date3}
          </span>
        </p>
      </div>
    );
  }
}

class TrialType extends React.Component {
  constructor(props){
    super(props);
    this.state = {type: "Interventional  (Clinical Trial)"}
    if (this.props.typeChoice === 1) {
      this.state = {type: "Interventional  (Clinical Trial)"}
    }
  }
  render(){
    return(
      <div className="TrialSection" >
        <p>Type of Trial: 
          <span className="text">
            {this.state.type}
          </span>
        </p>
      </div>
    );
  }
}

class TrialCondition extends React.Component {
  constructor(props){
    super(props);
    this.state = {condition: "Metastatic Breast Cancer"}
    if (this.props.conditionChoice === 1) {
      this.state = {condition: "Advanced, Metastatic Breast Cancer"}
    }
  }
  render(){
    return(
      <div className="TrialSection" >
        <p>Condition: 
          <span className="text">
            {this.state.condition}
          </span>
        </p>
      </div>
    );
  }
}

class TrialTreatment extends React.Component {
  constructor(props){
    super(props);
    this.state = {treatment1: "Drug: Palbociclib", treatment2: "Drug: Fulvestrant", treatment3: "Drug: Placebo"}
    if (this.props.treatmentsChoice === 1) {
      this.state = {treatment1: "Drug: LEE011", treatment2: "Drug: Letrozole", treatment3: "Drug: LEE011 Placebo"}
    }
  }
  render(){
    return(
      <div className="TrialSection" >
        <p>Treatments:
          <span className="text">
            <li>{this.state.treatment1}</li>
            <li>{this.state.treatment2}</li>
            <li>{this.state.treatment3}</li>
          </span>
        </p>
      </div>
    );
  }
}

//Wrapper for inclusion criteria component
class TrialInCriteria extends React.Component {
  constructor(props){
    super(props);
    this.state = {displayInCriteria: this.props.displayInCriteria, inclusionChoice: this.props.inclusionChoice}
  }

  //Triggers when prop from parent changes (dropdown toggle)
  componentDidUpdate(prevProps){
    if(prevProps.displayInCriteria !== this.props.displayInCriteria){
      this.setState({displayInCriteria: this.props.displayInCriteria});
    }
  }

  //On click, this component calls toggleInCriteria(), the function defined in the Display component
  //This triggers the inclusion dropdown of all trial displays to either appear or disappear
  render(){
    return(
      <div className="TrialSection" onClick={() => this.props.toggleInCriteria()} >
        <p>
          Inclusion Criteria 
          {this.state.displayInCriteria ? <AiFillCaretUp /> : <AiFillCaretDown />}
        </p>
        {this.state.displayInCriteria ? <CriteriaBox type="Inclusion" inclusionChoice="0"/> : null}
      </div>
    );
  }
}

//Same but for exlusion 
class TrialExCriteria extends React.Component {
  constructor(props){
    super(props);
    this.state = {displayOutCriteria: this.props.displayOutCriteria}
  }

  componentDidUpdate(prevProps){
    if(prevProps.displayOutCriteria !== this.props.displayOutCriteria){
      this.setState({displayOutCriteria: this.props.displayOutCriteria});
    }
  }

  render(){
    return(
      <div className="TrialSection" onClick={() => this.props.toggleOutCriteria()} >
        <p>
          Exclusion Criteria 
          {this.state.displayOutCriteria ? <AiFillCaretUp /> : <AiFillCaretDown />}
        </p>
        {this.state.displayOutCriteria ? <CriteriaBox type="Exclusion"/> : null}
      </div>
    );
  }
}

class TrialOutcomeMeasures extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      displayOutMeasures: this.props.displayOutMeasures, 
      outcomeChoice: this.props.outcomeChoice,
      data: JSON.parse(this.props.data)
    };
  }

  componentDidUpdate(prevProps){
    if(prevProps.displayOutMeasures !== this.props.displayOutMeasures){
      this.setState({displayOutMeasures: this.props.displayOutMeasures});
    }
    if(prevProps.data !== this.props.data){
      this.setState({data: JSON.parse(this.props.data)});
    }
  }

  render(){
    return(
      <div className="TrialSection" onClick={() => this.props.toggleOutMeasures()}>
        <p>
          Outcome Measures
          {this.state.displayOutMeasures ? <AiFillCaretUp /> : <AiFillCaretDown />}
        </p>
        {this.state.displayOutMeasures ? <MeasuresBox data={JSON.stringify(this.state.data)} outcomeChoice={this.state.outcomeChoice} /> : null}
      </div>
    );
  }
}

class TrialResult extends React.Component {
  constructor(props){
    super(props);
    this.state = {displayResults: this.props.displayResults, resultChoice: this.props.resultChoice};
  }

  componentDidUpdate(prevProps){
    if(prevProps.displayResults !== this.props.displayResults){
      this.setState({displayResults: this.props.displayResults});
    }
  }

  render(){
    return(
      <div className="TrialSection" onClick={() => this.props.toggleResults()}>
        <p>
          Result
          {this.state.displayResults ? <AiFillCaretUp /> : <AiFillCaretDown />}
        </p>
        {this.state.displayResults ? <ResultTable resultChoice={this.state.resultChoice} /> : null}
      </div>
    );
  }
}

class TrialLink extends React.Component {
  constructor(props){
    super(props);
    this.state = {link: "https:\/\/clinicaltrials.gov\/ct2\/show\/study\/NCT01942135"}
    if (this.props.linkChoice === 1) {
      this.state = {link: "https:\/\/clinicaltrials.gov\/ct2\/show\/study\/NCT01958021"}
    }
  }
  render(){
    return(
      <div className="TrialSection" >
        <p>Link: 
          <span className="text">
            <a href={this.state.link}>{this.state.link}</a>
          </span>
        </p>
      </div>
    );
  }
}

//This component represents a single exclusion or inclusion criteria
class SingleCriteria extends React.Component {
  constructor(props){
    super(props);
    const inclusionL = ["Women 18 years or older with metastatic or locally advanced disease, not amenable to curative therapy",
                     "Confirmed diagnosis of HR+/HER2- breast cancer", 
                     "Any menopausal status", 
                     "Progressed within 12 months from prior adjuvant or progressed within 1 month from prior advanced/metastatic \
                      endocrine breast cancer therapy", 
                     "On an LHRH agonist for at least 28 days, if pre-/peri-menopausal, and willing to switch to goserelin \
                      (Zoladex ®) at time of randomization.", 
                     "Measurable disease defined by RECIST version 1.1, or bone-only disease", 
                     "Eastern Cooperative Oncology Group (ECOG) PS 0-1", 
                     "Adequate organ and marrow function, resolution of all toxic effects of prior therapy or surgical procedures", 
                     "Patient must agree to provide tumor tissue from metastatic tissue at baseline", 
                     "N/A", 
                     "N/A", 
                     "N/A"];
    const inclusionR = ["Women with advanced (locoregionally recurrent or metastatic) breast cancer not amenable to curative therapy.",
                     "Patient is postmenopausal. Postmenopausal status is defined either by:", 
                     "No prior systemic anti-cancer therapy for advanced disease.", 
                     "Patient has a histologically and/or cytologically confirmed diagnosis of estrogen-receptor positive and/or \
                      progesterone receptor positive breast cancer by local laboratory.", 
                     "Patient has HER2-negative breast cancer defined as a negative in situ hybridization test or an IHC status of \
                      0, 1+ or 2+. If IHC is 2+, a negative in situ hybridization (FISH, CISH, or SISH) test is required by local \
                      laboratory testing.", 
                     "Patient must have either:", 
                     "Patient has an Eastern Cooperative Oncology Group (ECOG) performance status 0 or 1", 
                     "N/A", 
                     "N/A", 
                     "N/A", 
                     "N/A", 
                     "N/A"];

    const exclusionL = ["Prior treatment with any CDK inhibitor, fulvestrant, everolimus, or agent that inhibits the PI3K-mTOR pathway",
                     "Patients with extensive advanced/metastatic, symptomatic visceral disease, or known uncontrolled or symptomatic CNS metastases", 
                     "Major surgery or any anti-cancer therapy within 2 weeks of randomization", 
                     "Prior stem cell or bone marrow transplantation", 
                     "Use of potent CYP3A4 inhibitors or inducers", 
                     "N/A", 
                     "N/A", 
                     "N/A", 
                     "N/A", 
                     "N/A", 
                     "N/A", 
                     "N/A"];
    const exclusionR = ["Patient who received any CDK4/6 inhibitor.",
                     "Patient who received any prior systemic anti-cancer therapy (including hormonal therapy and chemotherapy) for advanced breast cancer", 
                     "Patient is concurrently using other anti-cancer therapy.", 
                     "Patient has a concurrent malignancy or malignancy within 3 years of randomization, with the exception of \
                      adequately treated, basal or squamous cell carcinoma, non-melanomatous skin cancer or curatively resected cervical cancer.", 
                     "Patient has active cardiac disease or a history of cardiac dysfunction including any of the following", 
                     "Patient is currently receiving any of the following medications and cannot be discontinued 7 days prior start if the treatment:", 
                     "PN/A", 
                     "N/A", 
                     "N/A", 
                     "N/A", 
                     "N/A", 
                     "N/A"];

    this.state = {type: this.props.type};


    if (this.props.type === "Inclusion"){
      this.state = {criteria: inclusionL[this.props.criteria]};
      if (this.props.inclusionChoice === 1) {
        this.state = {criteria: inclusionR[this.props.criteria]}
      }
    }
    else {
      this.state = {criteria: exclusionL[this.props.criteria]};
      if (this.props.exclusionChoice === 1) {
        this.state = {criteria: exclusionR[this.props.criteria]}
      }
    }
  }
  render(){
    return(
      <div className="Criteria" >
        <p> {this.state.criteria}</p>
      </div>
    );
  }
}

class ResultTable extends React.Component {
  constructor(props){
    super(props);
    this.state = { resultChoice: props.resultChoice }
  }
  render(){
    if(this.state.resultChoice === 0){
      return(
        <table>
          <tbody>
            <tr>
              <th>ArmGroup Title</th>
              <th>Palbociclib + Fulvestrant</th>
              <th>Placebo + Fulvestrant</th>
            </tr>
            <tr>
              <td>Started</td>
              <td>347</td>
              <td>174</td>
            </tr>
            <tr>
              <td>Completed</td>
              <td>0</td>
              <td>0</td>
            </tr>
            <tr>
              <td>Not Completed</td>
              <td>347</td>
              <td>174</td>
            </tr>
            <tr>
              <td>Global Deterioration of Health Status</td>
              <td>8</td>
              <td>3</td>
            </tr>
            <tr>
              <td>Death</td>
              <td>0</td>
              <td>1</td>
            </tr>
            <tr>
              <td>Objective Progression+Progressive Disease </td>
              <td>85</td>
              <td>87</td>
            </tr>
            <tr>
              <td>Participant Refused toContinue Treatment</td>
              <td>1</td>
              <td>1</td>
            </tr>
            <tr>
              <td>Withdrawal by Subject</td>
              <td>4</td>
              <td>2</td>
            </tr>
            <tr>
              <td>Ongoing at date of cut-off (05 Dec 2014)</td>
              <td>238</td>
              <td>75</td>
            </tr>
          </tbody>
        </table>
      );
    }
    else{
      return(
        <table>
          <tbody>
            <tr>
              <th>Arm/Group Title</th>
              <th>LEE011 + Letrozole</th>
              <th>Placebo + Letrozole</th>
            </tr>
            <tr>
              <td>Started</td>
              <td>334</td>
              <td>334</td>
            </tr>
            <tr>
              <td>Patients Untreated</td>
              <td>0</td>
              <td>0</td>
            </tr>
            <tr>
              <td>Completed</td>
              <td>334</td>
              <td>330</td>
            </tr>
            <tr>
              <td>Not Completed</td>
              <td>334</td>
              <td>330</td>
            </tr>
            <tr>
              <td>Progressive disease</td>
              <td>334</td>
              <td>330</td>
            </tr>
            <tr>
              <td>Adverse Event</td>
              <td>25</td>
              <td>7</td>
            </tr>
            <tr>
              <td>Subject/guardian decision</td>
              <td>12</td>
              <td>13</td>
            </tr>
            <tr>
              <td>Physician Decision</td>
              <td>10</td>
              <td>13</td>
            </tr>
            <tr>
              <td>Protocol Violation</td>
              <td>3</td>
              <td>1</td>
            </tr>
            <tr>
              <td>Death</td>
              <td>2</td>
              <td>0</td>
            </tr>
          </tbody>
        </table>
      );
    }
  }
}

class MeasuresBox extends React.Component {
  constructor(props){
    super(props);
    let numPrimary = JSON.parse(this.props.data).PrimaryOutcomeList.PrimaryOutcome.length;
    let numSecondary = JSON.parse(this.props.data).SecondaryOutcomeList.SecondaryOutcome.length
    let primaryOutcomes = [];
    let secondaryOutcomes = [];
    console.log('test');
    for(let i = 0; i < numPrimary; i++){
      primaryOutcomes.push(
        <IndividualMeasure 
        data={JSON.stringify(JSON.parse(this.props.data).PrimaryOutcomeList.PrimaryOutcome[i])}
        type="primary"
        />
      );

    }
    for(let i = 0; i < numSecondary; i++){
      secondaryOutcomes.push(
        <IndividualMeasure 
        data={JSON.stringify(JSON.parse(this.props.data).SecondaryOutcomeList.SecondaryOutcome[i])}
        type="secondary"
        />
  
      );
    }
    this.state = { 
      outcomeChoice: props.outcomeChoice, 
      data: JSON.parse(this.props.data),
      numPrimary: numPrimary,
      numSecondary: numSecondary,
      primaryOutcomes: primaryOutcomes,
      secondaryOutcomes: secondaryOutcomes
    }

  }

  render(){
    return(
      <div className="MeasureBox">
        <p className="OutcomeTitle">Primary Outcome Measures</p>
        {this.state.primaryOutcomes}
        <p className="OutcomeTitle">Secondary Outcome Measures</p>
        {this.state.secondaryOutcomes}
      </div>
    );
  }
    
}

class IndividualMeasure extends React.Component {
  constructor(props){
    super(props);
    if(this.props.type === "primary"){
      this.state = {
        Measure: JSON.parse(this.props.data).PrimaryOutcomeMeasure,
        Description: JSON.parse(this.props.data).PrimaryOutcomeDescription,
        TimeFrame: JSON.parse(this.props.data).PrimaryOutcomeTimeFrame
      };
    }
    else if(this.props.type === "secondary"){
      this.state = {
        Measure: JSON.parse(this.props.data).SecondaryOutcomeMeasure,
        Description: JSON.parse(this.props.data).SecondaryOutcomeDescription,
        TimeFrame: JSON.parse(this.props.data).SecondaryOutcomeTimeFrame
      }
    }
    
  }

  render(){
    return(
      <div className="IndividualMeasure">
        <p>Outcome Measure: {this.state.Measure}</p>
        <p>Description: {this.state.Description}</p>
        <p>Time Frame: {this.state.TimeFrame}</p>
      </div>
    );
  }
}

//Contains one type (inclusion or exclusion) of criteria for one trial display
class CriteriaBox extends React.Component {
  constructor(props){
    super(props);
    this.state = {type: this.props.type,
                  inclusionChoice: this.props.inclusionChoice,
                  exclusionChoice: this.props.exclusionChoice};
    
  }
  render(){
    let i;
    const allCriteria = [];
    //Right now we are just arbitrarily generating 12 criteria for each section
    //Easiest way to put in actual criteria for now would probably be to 
    //hardcode an array of criteria so you can pass the text as a prop using the index (like 'criteria' and 'type').
    for (i = 0; i < 9; i++) { 
      allCriteria.push(<SingleCriteria criteria={i} type={this.state.type} inclusionChoice={this.state.inclusionChoice} key={"criteria" + i}/>)
    }
    return(
      <div className="CriteriaBox" >
        {allCriteria}
      </div>
    );
  }
}


// ========================================

ReactDOM.render(
  <Display />, //Triggers main component to display
  document.getElementById('root')
);

