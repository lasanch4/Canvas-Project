import React,{useEffect, useState} from "react"
import './App.css';
import Graph from "./components/main/graph/graph"


function App() {
  const [courseList, setCourseList] = React.useState([]);
  const [currentCourse, setCurrentCourse] = React.useState(0);
  const [currentToken, setCurrentToken] = React.useState('');

  const [assignmentList, setAssignmentList] = useState();
  const [currentAssignmentName, setCurrentAssignment] = useState();

  const [studentArray, setStudentArray] = useState([]);



  useEffect(() => { // fetches the courses to make the dropdown course list
    if (currentToken !== ""){fetch(`http://localhost:5000/courses/?token=${currentToken}`)
    .then(res => res.json())
    .then(res => {
        console.log(res); // this response returns the array of objects (the classes)
        setCourseList(res);
    })}
  }, [currentToken])

  const onClassSelectChange = (e) => { //e an be anything, should change later (maybe crs for course)
    setCurrentCourse(courseList[e.target.value]);
    // console.log("courseList[e.target.value]", courseList[e.target.value])

    fetch(`http://localhost:5000/assignments/${courseList[e.target.value].id}/?token=${currentToken}`) // later change to link made for inputting data
    .then(res => res.json())
    .then(res => {
        // console.log(res) // returns array of assignments and assignment content (retrieve names)
        setAssignmentList(res)
    })
    console.log(assignmentList)
  }

  const onTokenInputChange = (e) => {
    setCurrentToken(e.target.value);
  }

  const onAssignmentSelectChange = (e) => {
    fetch("http://localhost:5000/submissions", {
      body: JSON.stringify({"course": currentCourse, 
        "assignmentId": assignmentList[e.target.value].id, 
        "token": currentToken}), 
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
    }) 
    .then(res => res.json()) 
    .then(res => {
        // console.log(res) // array of arrays[[grader, grade_dist], [grader, grade_dist], etc..]
        setStudentArray(res) 
    })
    setCurrentAssignment(assignmentList[e.target.value].name)
  }


// Main content that is displayed on the webpage
// Select options are the dropdown lists
// HTML code at the end to display graph and headers
  return (
    <div className="App">
      <div style={{display:"flex", flexDirection:"column"}}> 
      <input type='text' placeholder="Please insert a User Token" onChange={onTokenInputChange} ></input>
      <select onChange={onClassSelectChange}>
        <option value="0">Please choose a course</option>
        {
          courseList && courseList.map((course, idx) => ( 
            <option value={idx} key={idx}>{course.id} - {course.name}</option>
          ))
        }
      </select>

      <select onChange={onAssignmentSelectChange}>
        <option value="0">Please choose an assignment</option>
        {
          assignmentList && assignmentList.map((assignment, idx) => ( 
            <option value={idx} key={idx}>{assignment.name}</option>
          ))
        }
      </select>

      </div>

      {/* {courseList.length !== 0 && <Main token={currentToken} course={courseList[currentCourse]} />} */}

      <h1>{currentCourse.name}</h1>
      {studentArray.length !== 0 && 
        <Graph 
          stud_array = {studentArray}
        />
      }
      <h2>{currentAssignmentName}</h2>

    </div>
    

  );
}

export default App;
