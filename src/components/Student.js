import React, { Component } from 'react';
import _ from 'lodash';
import '../App.css';
import {
    TextField,  ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const styles = theme => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    icon: {
        margin: '40px 0 0 0'
    },
    iconHover: {
        margin: theme.spacing.unit * 2,
        '&:hover': {
            color: red[800],
        },
    },
    heading: {
        fontSize: '30px',
        fontWeight: '700',
    },
});

class Student extends Component {
    constructor(props) {
        super(props);


        this.state = {
            students: [],
            searchedName: "",
            filteredStudents: [],
            searchedTag: "",
        };

        this.filterList = this.filterList.bind(this);
        this.handleChange = this.handleChange.bind(this);

    }


    componentDidMount() {
        const url = 'https://www.hatchways.io/api/assessment/students';
        fetch(url)
            .then((res) => res.json())
            .then((data) => {
                this.setState(data);
                this.setState({ filteredStudents: data.students });
            })
    }

    handleChange = search => event => {
        const searchedName = event.target.value.toLowerCase();
        this.setState({
            [search]: searchedName,
        });
        this.setState({ searchedName }, () => this.filterList());
    };

    handleChangeTag = search => event => {
        const searchedTag = event.target.value.toLowerCase();
        this.setState({
            [search]: searchedTag,
        });
        this.setState({ searchedTag }, () => this.filterTagList());
    };

    filterList() {
        let students = this.state.students;
        let searchedName = this.state.searchedName;

        students = students.filter(function (student) {
            const fullName = student.firstName + ' ' + student.lastName;
            return (fullName.toLowerCase().indexOf(searchedName) !== -1)// returns true or false
        });
        this.setState({ filteredStudents: students });
    };

    render() {
        return (
            <div id="studentCard">
                <div id="inner">
                <TextField
                    className="search"
                    id="filled-name"
                    label="Search by name"
                    value={this.state.searchedName}
                    onChange={this.handleChange('searchedName')}
                    margin="normal"
                    variant="standard"
                />

                
                    {
                        this.state.filteredStudents.map((student, index) => {
                            const name = student.firstName + ' ' + student.lastName;
                            const grades = student.grades.map((grade) => Number(grade));
                            return (
                                <div className="info" key={index}>
                                    <ExpansionPanel className="row">
                                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                            <div className="img">
                                                <img src={student.pic} className="img-circle" alt={name}></img>
                                            </div>
                                            <ul className="unstyled">
                                                <li><span className="name">{name.toUpperCase()}</span></li>
                                                <li><span className="facts">Email: {student.email}</span></li>
                                                <li><span className="facts">Company: {student.company}</span></li>
                                                <li><span className="facts">Skill: {student.skill}</span></li>
                                                <li><span className="facts">Average: {
                                                    _.mean(grades)
                                                }%
                                            </span>
                                                </li>
                                            </ul>
                                        </ExpansionPanelSummary>
                                        <ExpansionPanelDetails>
                                            <ul className="unstyled paddLeft138">
                                                {
                                                    grades.map((grade, index) => {
                                                        return (

                                                            <li key={index}>
                                                                Test {index + 1} : {grade}%
                                                            </li>
                                                        );
                                                    })
                                                }
                                            </ul>
                                        </ExpansionPanelDetails>
                                    </ExpansionPanel>
                                </div>
                            );
                        })
                    }
                </div>
            </div>
        )
    }
}

export default withStyles(styles)(Student);