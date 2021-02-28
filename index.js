import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai"

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
    fetch("http://localhost:3000/api/query/full_studies?expr=heart+attack&min_rnk=1&max_rnk=1&fmt=json")
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
        clusionChoice={i}
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
    fetch("http://localhost:3000/api/query/full_studies?expr=paloma+3%0D%0A&min_rnk=1&max_rnk=2&fmt=json")
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
        clusionChoice={i}
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
        <p>{this.state.trial1 ? this.state.trial1.Study.ProtocolSection.BriefTitle : null}</p>
        <div className="TrialCollection">
          {this.state.wrappers}
        </div>
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
      width: (window.innerWidth / props.numDisplays) - 50,
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
    {console.log(this.state.trialData)}
    return (
      <div className="TrialWrapper" style={{width: this.state.width}}>
        <TrialName
          trialChoice={this.state.trialChoice}
          data={this.state.trialData? JSON.stringify(this.state.trialData.Study.ProtocolSection.IdentificationModule.BriefTitle) : null}
        />
        <TrialDate
          dateChoice={this.state.dateChoice}
          startDate= {this.state.trialData ? this.state.trialData.Study.ProtocolSection.StatusModule.StartDateStruct.StartDate : null}
          primaryCompDate = {this.state.trialData ? this.state.trialData.Study.ProtocolSection.StatusModule.PrimaryCompletionDateStruct.PrimaryCompletionDate : null}
          estCompDate = {this.state.trialData ? this.state.trialData.Study.ProtocolSection.StatusModule.CompletionDateStruct.CompletionDate : null}
        />
        <TrialType
          typeChoice={this.state.typeChoice}
          data={this.state.trialData ? this.state.trialData.Study.ProtocolSection.DesignModule.StudyType : null}
        />
        <TrialCondition
          conditionChoice={this.state.conditionChoice}
          data={this.state.trialData ? this.state.trialData.Study.ProtocolSection.ConditionsModule.ConditionList.Condition : null}
        />
        <TrialTreatment treatmentsChoice={this.state.treatmentsChoice}/>
        <TrialInCriteria inclusionChoice={this.state.inclusionChoice} displayInCriteria={this.state.displayInCriteria} toggleInCriteria={() => this.props.toggleInCriteria()}/>
        <TrialExCriteria displayOutCriteria={this.state.displayOutCriteria} toggleOutCriteria={() => this.props.toggleOutCriteria()}/>
        <TrialOutcomeMeasures outcomeChoice={this.state.outcomeChoice} displayOutMeasures={this.state.displayOutMeasures} toggleOutMeasures={() => this.props.toggleOutMeasures()}/>
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
    this.state= {data: {start: this.props.startDate, primary: this.props.primaryCompDate, estComp: this.props.estCompDate}}
  }

  componentDidUpdate(prevProps){
    if(this.props !== prevProps){
      this.setState({data: {start: this.props.startDate, primary: this.props.primaryCompDate, estComp: this.props.estCompDate}});
    }
  }

  render(){
    return(

      <div className="TrialSection" >
        <p>Actual Study Start Date:
          <span className="text">
            {" " + this.state.data.start}
          </span>
        </p>
        <p>Actual Primary Completion Date:
          <span className="text">
            {" " + this.state.data.primary}
          </span>
        </p>
        <p>Estimated Study Completion Date:
          <span className="text">
            {" " + this.state.data.estComp}
          </span>
        </p>
      </div>
    );
  }
}

class TrialType extends React.Component {
  constructor(props){
    super(props);
    this.state = {data: this.props.data}
  }

  componentDidUpdate(prevProps){
    if(this.props.data !== prevProps.data){
      this.setState({data: this.props.data});
    }
  }

  render(){
    return(
      <div className="TrialSection" >
        <p>Type of Trial:
          <span className="text">
            {" " + this.state.data}
          </span>
        </p>
      </div>
    );
  }
}

class TrialCondition extends React.Component {
  constructor(props){
    super(props);
    this.state = {data: this.props.data}

  }

  componentDidUpdate(prevProps){
    if(this.props.data !== prevProps.data){
      this.setState({data: this.props.data});
    }
  }

  render(){
    return(
      <div className="TrialSection" >
        <p>Condition:
          <span className="text">
            {" " + this.state.data}
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
    this.state = {displayInCriteria: this.props.displayInCriteria, clusionChoice: this.props.clusionChoice}
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
    if (this.state.clusionChoice === 0){
      return(
        <div className="TrialSection" onClick={() => this.props.toggleInCriteria()} >
          <p>
            Inclusion Criteria
            {this.state.displayInCriteria ? <AiFillCaretUp /> : <AiFillCaretDown />}
          </p>
          {this.state.displayInCriteria ? <CriteriaBox type="Inclusion" clusionChoice="0"/> : null}
        </div>
      );
    }
    return(
      <div className="TrialSection" onClick={() => this.props.toggleInCriteria()} >
        <p>
          Inclusion Criteria
          {this.state.displayInCriteria ? <AiFillCaretUp /> : <AiFillCaretDown />}
        </p>
        {this.state.displayInCriteria ? <CriteriaBox type="Inclusion" clusionChoice="1"/> : null}
      </div>
    );
  }
}

//Same but for exlusion
class TrialExCriteria extends React.Component {
  constructor(props){
    super(props);
    this.state = {displayOutCriteria: this.props.displayOutCriteria, clusionChoice: this.props.clusionChoice}
  }

  componentDidUpdate(prevProps){
    if(prevProps.displayOutCriteria !== this.props.displayOutCriteria){
      this.setState({displayOutCriteria: this.props.displayOutCriteria});
    }
  }

  render(){
    if (this.state.clusionChoice === 0){
      return(
        <div className="TrialSection" onClick={() => this.props.toggleOutCriteria()} >
          <p>
            Exclusion Criteria
            {this.state.displayOutCriteria ? <AiFillCaretUp /> : <AiFillCaretDown />}
          </p>
          {this.state.displayOutCriteria ? <CriteriaBox type="Exclusion" clusionChoice="0"/> : null}
        </div>
      );
    }
    return(
      <div className="TrialSection" onClick={() => this.props.toggleOutCriteria()} >
        <p>
          Exclusion Criteria
          {this.state.displayOutCriteria ? <AiFillCaretUp /> : <AiFillCaretDown />}
        </p>
        {this.state.displayOutCriteria ? <CriteriaBox type="Exclusion" clusionChoice="1"/> : null}
      </div>
    );
  }
}

class TrialOutcomeMeasures extends React.Component {
  constructor(props){
    super(props);
    this.state = {displayOutMeasures: this.props.displayOutMeasures, outcomeChoice: this.props.outcomeChoice};
  }

  componentDidUpdate(prevProps){
    if(prevProps.displayOutMeasures !== this.props.displayOutMeasures){
      this.setState({displayOutMeasures: this.props.displayOutMeasures});
    }
  }

  render(){
    return(
      <div className="TrialSection" onClick={() => this.props.toggleOutMeasures()}>
        <p>
          Outcome Measures
          {this.state.displayOutMeasures ? <AiFillCaretUp /> : <AiFillCaretDown />}
        </p>
        {this.state.displayOutMeasures ? <MeasuresBox outcomeChoice={this.state.outcomeChoice} /> : null}
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

    this.state = {type: this.props.type, clusionChoice: this.props.clusionChoice};

    if (this.state.type === "Inclusion"){
      if (this.state.clusionChoice == 0) {
        this.state = {criteria: inclusionL[this.props.criteria]}
      }else{
        this.state = {criteria: inclusionR[this.props.criteria]};
      }
    }
    else {
      if (this.state.clusionChoice == 0) {
        this.state = {criteria: exclusionL[this.props.criteria]}
      }else{
        this.state = {criteria: exclusionR[this.props.criteria]};
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
    this.state = { outcomeChoice: props.outcomeChoice }
  }
  render(){
    if(this.state.outcomeChoice === 1){
      return(
        <div className="MeasuresBox" >
          <p className="OutcomeTitle"> Primary Outcome Measures </p>
          <div className="OutcomeBody">
            <ol>
              <li>Progression Free Survival (PFS) Per Investigator Assessment [ Time Frame: Up to approximately 20 months ]</li>
              <ul>
                <li>PFS, defined as the time from the date of randomization to the date of the first documented progression
                  or death due to any cause. PFS was assessed via a local radiology assessment according to RECIST 1.1</li>
              </ul>
            </ol>
          </div>
          <p className="OutcomeTitle"> Secondary Outcome Measures </p>
          <div className="OutcomeBody">
            <ol>
              <li>Overall Response Rate (ORR) as Per Investigator Assessment [ Time Frame: Up to approximately 20 months ]</li>
              <ul>
                <li>Overall response rate (ORR) is defined as the proportion of patients with the best overall response of complete response (CR) or partial response (PR) according to RECIST 1.1. CR = Disappearance of all non-nodal target lesions. In addition, any pathological lymph nodes assigned as target lesions must have a reduction in short axis to &lt; 10 mm; PR = At least a 30% decrease in the sum of diameter of all target lesions, taking as reference the baseline sum of diameters.</li>
              </ul>
              <li>Overall Survival (OS) [ Time Frame: Up to approximately 65 months ]</li>
              <ul>
                <li>Time from date of randomization to the date of death from any cause.</li>
              </ul>
              <li>Clinical Benefit Rate (CBR) [ Time Frame: Up to approximately 20 months ]</li>
              <ul>
                <li>Clinical Benefit Rate (CBR) is defined as the proportion of patients with a best overall response of complete response (CR) or partial response (PR) or stable disease (SD) lasting more than 24 weeks as defined in RECIST 1.1.</li>
              </ul>
              <li>Time to Definitive Deterioration of ECOG Performance Status in One Category of the Score [ Time Frame: Up to approximately 20.5 months ]</li>
              <ul>
                <li>Time to definitive deterioration of ECOG performance status in one category of score is defined as the time from the date of randomization to the date of event, which is defined as at least one score lower than the baseline.</li>
              </ul>
              <li>Safety and Tolerability of LEE011 [ Time Frame: Up to approximately 21 months ]</li>
              <ul>
                <li>Safety will be determined by type, frequency and severity of adverse events per CTCAE version 4.03 and type, frequency and severity of laboratory toxicities per CTCAE version 4.03.</li>
              </ul>
              <li>Time to Definitive 10% Deterioration in the Global Health Status/Quality of Life (QOL) Scale Score of the EORTC QLQ-C30 [ Time Frame: Up to approximately 20 months ]</li>
              <ul>
                <li>The time to definitive 10% deterioration is defined as the time from the date of randomization to the date of event, which is defined as at least 10% relative to baseline worsening of the corresponding scale score (without further improvement above the threshold) or death due to any cause.</li>
              </ul>
              <li>QTc Interval [ Time Frame: Baseline, cycle 1 day 15, cycle 2 day 1, cycle 3 day 1, cycle 4 day 1, cycle 5 day 1, cycle 6 day 1, cycle 7 day 1, cycle 8 day 1, cycle 9 day 1 ]</li>
              <ul>
                <li>Time between the start of the Q wave and the end of the T wave corrected for heart rate</li>
              </ul>
            </ol>
          </div>
        </div>
      );
    }
    else{
      return(
        <div className="MeasuresBox" >
          <p className="OutcomeTitle"> Primary Outcome Measures </p>
          <div className="OutcomeBody">
            <ol>
              <li>Progression-Free Survival (PFS) as Assessed by the Investigator [ Time Frame: From randomization date to date of first documentation of progression or death (assessed up to 12 months) ]</li>
              <ul>
                <li>PFS is the time from the date of randomization to the date of the first documentation of objective progression of disease (PD)or death due to any cause in absence of documented PD. Participants lacking an evaluation of tumor response after randomization had their PFS time censored on the date of randomization with the duration of a day. Participants with documentation of PD or death after a long interval (2 or more incomplete or non-evaluable assessments) since the last tumor assessment were censored at the time of last objective assessment that did not show PD. The length of PFS was calculated as PFS time (months) =[progression/death date(censor date) - randomization date + 1]/30.4. Progression is defined using Response Evaluation Criteria in Solid Tumors(RECIST v1.1) a 20% increase in the sum of diameters of target lesions and the sum must also demonstrate an absolute increase of at least 5mm or unequivocal progression of existing non-target lesions or the appearance of new lesions.</li>
              </ul>
            </ol>
          </div>
          <p className="OutcomeTitle"> Secondary Outcome Measures </p>
          <div className="OutcomeBody">
            <ol>
              <li>Overall Survival (OS) - Number of Participants Who Died [ Time Frame: From randomization until death (up to approximately 36 months) ]</li>
              <ul>
                <li>OS is defined as the time from date of randomization to date of death due to any cause. In the absence of confirmation of death, survival time was censored to last date the participant was known to be alive. For participants lacking survival data beyond the date of their last follow-up, the OS time was censored on the last date they were known to be alive. Participants lacking survival data beyond randomization were to have their OS times be censored at randomization. The length of OS was calculated as OS time (months) = [death date (censor date) - randomization date + 1]/30.4. No inferential statistical analysis were done because of the immaturity of the OS data.</li>
              </ul>
              <li>Objective Response (OR) [ Time Frame: From randomization until end of treatment (assessed up to 12 months) ]</li>
              <ul>
                <li>OR is defined as the overall complete response (CR) or partial response (PR) according to the RECIST version 1.1 Objective Response Rate (ORR) is defined as the proportion of participants with CR or PR relative to all randomized participants and randomized participants with measurable disease at baseline. Participants who do not have on-study radiographic tumor re-evaluation, who received anti-tumor treatment other than the study medication prior to reaching a CR or PR, or who died, progressed, or dropped out for any reason prior to reaching a CR or PR were counted as non-responders in the assessment of ORR. Per response evaluation criteria in solid tumors criteria (RECIST v1.1) for target lesions and assessed by MRI: Complete Response (CR), Disappearance of all target lesions; Partial Response (PR), ≥30% decrease in the sum of the longest diameter of target lesions (longest for non-nodal and short axis for nodal target lesions); Overall Response (OR) = CR + PR.</li>
              </ul>
              <li>Duration of Response (DR) [ Time Frame: From randomization until end of treatment (assessed up to 12 months) ]</li>
              <ul>
                <li>DR is defined as the time from the first documentation of objective tumor response (CR or PR) to the first documentation of disease progression or to death due to any cause, whichever occurs first. If tumor progression data included more than 1 date, the first date was used. DR was calculated as [the date response ended (ie, date of PD or death) - first CR or PR date + 1)]/30.4. Kaplan-Meier estimate of median of the DR is provided below. No inferential statistical analysis were done for DR. The DR was only calculated for the participants with a CR or PR.</li>
              </ul>
              <li>Clinical Benefit Response (CBR) [ Time Frame: From randomization until end of treatment (assessed up to 12 months) ]</li>
              <ul>
                <li>CBR is defined as the overall complete response (CR), partial response (PR) , or stable disease (SD) ≥24 weeks according to the RECIST version 1.1. Clinical Benefit Response Rate (CBRR) is defined as the proportion of participants with CR, PR, or SD ≥24 weeks relative to all randomized participants and randomized participants with measurable disease at baseline. Participants who do not have on-study radiographic tumor re-evaluation, who received antitumor treatment other than the study medication prior to reaching a CR or PR, a best response of SD ≥24 weeks, or who died, progressed, or dropped out for any reason prior to reaching a CR or PR and a best response of SD ≥24 weeks was counted as non-responders in the assessment of CBR. Per RECIST v1.1 for target lesions and assessed by MRI: CR, disappearance of all target lesions; PR, ≥30% decrease in the sum of the longest diameter of target lesions; OR = CR + PR.</li>
              </ul>
              <li>Survival Probabilities at Months 12, 24 and 36 [ Time Frame: From randomization until death (assessed up to 36 months) ]</li>
              <ul>
                <li>One-, Two- or Three-year Survival Probability is defined as the probability of survival 1 year, 2 or 3 years after the date of randomization based on the Kaplan-Meier estimate. Survival time was censored to last date the participant is known to be alive.</li>
              </ul>
              <li>Observed Plasma Trough Concentration (Ctrough) for Palbociclib [ Time Frame: Cycle 1/Day 15 and Cycle 2/Day 15 ]</li>
              <ul>
                <li>Ctrough for palbociclib (if applicable). The method of dispersion applied here is "percent coefficient of variation" (%CV).</li>
              </ul>
              <li>Ctrough for Fulvestrant [ Time Frame: Cycles 2/Day 1 and Cycle 3/Day 1 ]</li>
              <ul>
                <li>Ctrough for Fulvestrant (if applicable). The method of dispersion applied here is "percent coefficient of variation" (%CV).</li>
              </ul>
              <li>Ctrough for Goserelin [ Time Frame: Cycles 2/ Day 1 and Cycle 3/ Day 1 ]</li>
              <ul>
                <li>Cmin for goserelin (if applicable). The method of dispersion applied here is "percent coefficient of variation" (%CV).</li>
              </ul>
              <li>Change From Baseline Between Treatment Comparison in European Organization for Research and Treatment of Cancer Quality of Life Questionnaire (EORTC QLQ-C30) Functional Scale Scores [ Time Frame: From Cycle 1 to 14, as of 05 December 2014. ]</li>
              <ul>
                <li>The EORTC-QLQ-C30 is a 30-item questionnaire composed of five multi-item functional subscales (physical, role, emotional, cognitive , and social functioning), three multi-item symptom scales (fatigue, nausea/vomiting, and pain), a global quality of life (QOL) subscale, and six single item symptom scales assessing other cancer-related symptoms (dyspnea, sleep disturbance, appetite loss, constipation, diarrhea, and the financial impact of cancer). The questionnaire employs 28 4-point Likert scales with responses from "not at all" to "very much" and two 7-point Likert scales for global health and overall QOL. Responses to all items are then converted to a 0 to 100 scale. For functional and global QOL scales, higher scores represent a better level of functioning/QOL. For symptom-oriented scales, a higher score represents more severe symptoms. A 10-point or higher change in scores from baseline is considered clinically significant.</li>
              </ul>
              <li>Change From Baseline Between Treatment Comparison in EORTC QLQ-C30 Symptom Scale Scores [ Time Frame: From Cycle 1 to 14, as of 05 December 2014. ]</li>
              <ul>
                <li>The EORTC-QLQ-C30 is a 30-item questionnaire composed of five multi-item functional subscales (physical, role, emotional, cognitive , and social functioning), three multi-item symptom scales (fatigue, nausea/vomiting, and pain), a global quality of life (QOL) subscale, and six single item symptom scales assessing other cancer-related symptoms (dyspnea, sleep disturbance, appetite loss, constipation, diarrhea, and the financial impact of cancer). The questionnaire employs 28 4-point Likert scales with responses from "not at all" to "very much" and two 7-point Likert scales for global health and overall QOL. Responses to all items are then converted to a 0 to 100 scale. For functional and global QOL scales, higher scores represent a better level of functioning/QOL. For symptom-oriented scales, a higher score represents more severe symptoms. A 10-point or higher change in scores from baseline is considered clinically significant.</li>
              </ul>
              <li>Change From Baseline Between Treatment Comparison in European Organization for Research and Treatment of Cancer Breast Cancer Module (EORTC QLQ BR23) Functional Scale Scores [ Time Frame: From Cycle 1 to 14, as of 05 December 2014. ]</li>
              <ul>
                <li>The EORTC-QLQ-BR23 is a 23-item breast cancer-specific companion module to the EORTC-QLQ-C30 and consists of four functional scales (body image, sexual functioning, sexual enjoyment, future perspective) and four symptom scales (systemic side effects, breast symptoms, arm symptoms, upset by hair loss). QLQ-BR23 questionnaire employs 4-point scales with responses from 'not at all' to 'very much'. All scores are converted to a 0 to 100 scale. For functional scales, higher scores represent a better level of functioning.</li>
              </ul>
              <li>Change From Baseline Between Treatment Comparison in EORTC QLQ BR23 Symptom Scale Scores [ Time Frame: From Cycle 1 to 14, as of 05 December 2014. ]</li>
              <ul>
                <li>The EORTC-QLQ-BR23 is a 23-item breast cancer-specific companion module to the EORTC-QLQ-C30 and consists of four functional scales (body image, sexual functioning, sexual enjoyment, future perspective) and four symptom scales (systemic side effects, breast symptoms, arm symptoms, upset by hair loss). QLQ-BR23 questionnaire employs 4-point scales with responses from 'not at all' to 'very much'. All scores are converted to a 0 to 100 scale. For symptom-oriented scales, a higher score represent more severe symptoms.</li>
              </ul>
              <li>Change From Baseline Between Treatment Comparison in EuroQoL 5D (EQ-5D)- Health Index Scores [ Time Frame: From Cycle 1 to 14, as of 05 December 2014. ]</li>
              <ul>
                <li>The EuroQol-5D (version 3L) is a brief self-administered, validated instrument consisting of 2 parts. The first part consists of 5 descriptors of current health state (mobility, self care, usual activities, pain/discomfort, and anxiety/ depression); a participant is asked to rate each state on a three level scale (1=no problem, 2=some problem, and 3=extreme problem) with higher levels indicating greater severity/ impairment Published weights are available that allow for the creation of a single summary score called the EQ-5D index, which basically ranges from 0 to 1 with low scores representing a higher level of dysfunction and 1 as perfect health. The second part consists of the EQ-5D general health status as measured by a visual analog scale (EQ-5D VAS). EQ-5D VAS measures the participant's self-rated health status on a scale from 0 (worst imaginable health state) to 100 (best imaginable health state).</li>
              </ul>
              <li>Change From Baseline Between Treatment Comparison in EQ-5D Visual Analog Scale (VAS) Scores Scale [ Time Frame: From Cycle 1 to 14, as of 05 December 2014. ]</li>
              <ul>
                <li>The EuroQol-5D (version 3L) is a brief self-administered, validated instrument consisting of 2 parts. The second part consists of the EQ-5D general health status as measured by a visual analog scale (EQ-5D VAS). EQ-5D VAS measures the participant's self-rated health status on a scale from 0 (worst imaginable health state) to 100 (best imaginable health state).</li>
              </ul>
              <li>Time to Deterioration (TTD) [ Time Frame: Baseline, Day 1 of Cycles 2 to 4, Day 1 of every alternate cycle after that until the end of treatment ]</li>
              <ul>
                <li>A time to event analysis was pre-specified for pain. An analysis of TTD in pain defined as time between baseline and first occurrence of increase of ≥10 points in pain. Deterioration will be defined increase in score of 10 points or greater from baseline. The Kaplan-Meier estimates of quartiles (time to deterioration) with 95% CI is mentioned below.</li>
              </ul>
              <li>Percentage of Participants With Treatment-Emergent Adverse Events (TEAEs; All Causalities) [ Time Frame: From the signing of the informed consent until 28 days after the last dose of study medication up to 14 months ]</li>
              <ul>
                <li>An AE is any untoward medical occurrence in a clinical investigation patient administered a product or medical device; the event need not necessarily have a causal relationship with the treatment or usage. An SAE is any untoward medical occurrence at any dose that results in death; is life-threatening; requires hospitalization; results in persistent or significant disability or in congenital anomaly/birth defect. Severity will be graded by the National Cancer Institute Common Terminology Criteria for Adverse Events (NCI CTCAE), Version 4.0.</li>
              </ul>
            </ol>
          </div>
        </div>
      );
    }
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
