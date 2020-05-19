import React from 'react';
import './App.js';
import './App.css';
import request from 'request';

// need to run "npm install airtable" in the console

const AirtableVar = require('airtable');
AirtableVar.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: 'keyn1hpKbx5jhKY7i'
});
const base = AirtableVar.base('appfQdjvtsNvuwzHF');

class AirTable extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            sessions: [],
            studentLists: []
        }
        this.getSessions = this.getSessions.bind(this);
        this.getStudents = this.getStudents.bind(this);
        this.buildSession = this.buildSession.bind(this);

    }
    
    getSessions() {
        const self = this;
        base('Session').select({
            view: "Grid view"
        }).eachPage(function page(records, fetchNextPage) {

            records.forEach(function (record) {
                // add session to session state
                self.setState({
                    sessions: self.state.sessions.concat([record.get('Session')])
                });
                // run get students on each session
                self.getStudents(record.get('Session'));
            });
            fetchNextPage();

        }, function done(err) {
            if (err) { console.error(err); return; }
        });
    }

    getStudents(sessionview) {
        let tempEmailList = [];
        const self = this;
        
        base('Students').select({
            view: sessionview // this is the name of the view i.e. "Grid View" for all students "Session X" for a single session
        }).eachPage(function page(records, fetchNextPage) {

            records.forEach(function (record) {
                // add each email address to a temp email list array
                tempEmailList.push(record.get('EmailAddress'));
            });
            fetchNextPage();

        }, function done(err) {
            // add the entire temp email list array to one spot in student list state
            self.setState({
                studentLists:[...self.state.studentLists, tempEmailList]
            });
            if (err) { console.error(err); return; }
        });

    }

    componentDidMount() {
        this.getSessions();
    }

    buildSession(s) {
        return (<option value={s}>{s}</option>);
    }

    render() {
        let displaySessions = [];
        console.log(this.state.sessions);
        console.log(this.state.studentLists)
        displaySessions = this.state.sessions.map(this.buildSession);

        return (
            <React.Fragment>
                {displaySessions}
            </React.Fragment>
        );

    }

}

export default AirTable;

    // // this function needs to be called by a selection on the dropdown list in the main app
