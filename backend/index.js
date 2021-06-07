const express = require('express');
const fetch = require('node-fetch');
var cors = require('cors');
const app = express();
app.use(cors()); 
const grade_calc = require("./grade_calc");
var bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '50mb'}))

const PORT = process.env.PORT || 5000; 
// if want to see data printed in console/terminal, uncomment the lines with "console.log()"

// token for profe in testing environment
// let token = "7~UWXvi9vw7ynDa5g8fgt61g90rSh1aRmBqG1jtEDVDtd2S3J8PtTuxy4891W0gtKD"

// TA 1 token in testing environment 
// let token = "7~Ktk3c0EquDkXZkKxpTzYbl7FSsaNO2nGm6j6y0RISWGbe5NEYD5WFbaiyQneAjGZ" 

// can be changed, this is the base link for the testing environment course
let BASE_URL = "https://canvas.instructure.com/api/v1/" 


// use this endpoint to retrieve the courses from the user's TOKEN
// returns an array of objects(Courses) that the user is in 
app.get('/courses', (req, res) => { // in React, returns list of (course.id - course.name)
  fetch (`${BASE_URL}courses?access_token=${req.query.token}&per_page=100`, {
    method: 'GET',
    headers: {
        'content-type': 'text/html'
    },
    qs: req.query.token
  }).then(res => res.json()) 
  .then(data => {
    // console.log("Courses: ", data);
    res.send(data) 
  })
})


// this endpoint is used after the user has provided their token and picked a course
// returns an array of objects(assignments) and their API data for the chosen class
app.get('/assignments/:assignmentId', (req, res) => {
  const assignmentId = req.params.assignmentId; 
  fetch (`${BASE_URL}courses/${assignmentId}/assignments?access_token=${req.query.token}&per_page=100`, {
    method: 'GET',
    headers: {
        'content-type': 'text/html'
    },
    qs: req.query.token
  }).then(res => res.json()) 
.then(data => {
    // console.log("Assignments: ", data); 
    res.send(data) 
 })
})


// used to be able to retrieve grades for each student to then calculate and send as response data
// data = array of objects(student submissions) to retrieve grade and grader_id
// calculation of data (grade_calc.get_TA_grading_data(data)) is an array of arrays
// format for final calculation = [[graderID, min, 1st_Q, 3rd_Q, max], [graderID, min, 1st_Q, 3rd_Q, max], etc..]
app.use('/submissions', (req, res) => {
  const courseId = req.body.course.id;
  const assignmentId = req.body.assignmentId;
  fetch (`${BASE_URL}courses/${courseId}/assignments/${assignmentId}/submissions?access_token=${req.body.token}&per_page=100`, {
    method: 'GET',
    headers: {
        'content-type': 'text/html'
    },
    qs: req.body.token
  }).then(res => res.json()) 
.then(data => {
  // console.log("data: ", data)
    // console.log(grade_calc.get_TA_grading_data(data)); 
    res.send(grade_calc.get_TA_grading_data(data)) 
 })
})





// NOTE: work in progress for future
// PURPOSE: use this endpoint to change grader_id in graph.js to display their name instead of their grader_ID 
// which is retrieved from the API
// URL from Live API: https://canvas.instructure.com:443/api/v1/courses/2788215/users/30176778
// change course number ID and user ID to become based on input 
app.get('/users', (req, res) => {
  // const userId = req.params.userId;
  // const courseId = req.params.courseId;
  fetch (`${BASE_URL}courses/2788215/users?access_token=${token}&per_page=100`, {
    method: 'GET',
    headers: {
        'content-type': 'text/html'
    },
    qs: token
  }).then(res => res.json())
  .then(data => {
    // console.log(data); 
    res.send(data) 
  })
})



// run backend and lets user know what localhost port it is running on 
app.listen(PORT, () => console.log(`Server Started on port ${PORT}`));
