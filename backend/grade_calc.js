// This file consists of all the calculations used in grading such as 
// grading average, Standard Deviation, and calculations needed to display
// the candlestick (AKA Boxplot) chart such as each quartile, median, min and max


// Calculating the average of the given array
function grading_average(grade_array){
    var total = 0;
    for(var i = 0; i < grade_array.length; i++) {
        total += grade_array[i];
    }
    var avg = total / grade_array.length;
}


// creating TA grading distribution arrays of format -> 
// [[grader_id, min, 1st_Q, 2nd_Q(median), 3rd_Q, max],..etc]
function get_TA_grading_data(student_array){ // student_array is retrieved from submissions endpoint
    const graders = {} // "dictionary" object of graders and the grades they gave

    for(student of student_array){
        if(student.grader_id !== null){ // check to make sure assignment is graded by someone
            if(graders[student.grader_id.toString()] === undefined){
                graders[student.grader_id.toString()] = [] 
            }
            graders[student.grader_id.toString()].push(parseFloat(student.grade)) // {"grader_id": [push(grade), push(grade), push(grade)]}
        }
    }

    const grade_distribution = [['TA_ID', "min", '1st_Q', '3rd_Q', 'max']] // final obj to pass in to graph and display. array of arrays

    for(const grader in graders){ 
        grade_distribution.push([grader, // Grader_id to display under the graph, change to TA name later
            Math.min(...graders[grader]), // MIN value from data
            parseFloat(q25(graders[grader])), // first quartile
            parseFloat(q75(graders[grader])), // third quartile 
            Math.max(...graders[grader])]) // MAX value from data
    }
    return grade_distribution // [[graderID, min, 1st_Q, 3rd_Q, max], [graderID, min, 1st_Q, 3rd_Q, max], etc..]
}


// sort array in ascending order
const asc = arr => arr.sort((a, b) => a - b);

const sum = arr => arr.reduce((a, b) => a + b, 0); // retrieve sum of array values

const mean = arr => sum(arr) / arr.length; // calculate average/mean of array values

// sample standard deviation
const std = (arr) => {
    const mu = mean(arr);
    const diffArr = arr.map(a => (a - mu) ** 2);
    return Math.sqrt(sum(diffArr) / (arr.length - 1));
};


// quantile calculations for 1st, 2nd(median), and 3rd quartile
const quantile = (arr, q) => { // q = quartile, used to calculate the chosen quantile
    const sorted = asc(arr); // sort the array first
    const pos = (sorted.length - 1) * q; // pos = position, length-1 to consider indexing values
    const base = Math.floor(pos); // returns largest integer <= given number 
    
    let rest = null;
    if (pos-base === 0){
        rest = 0
    } else{
        rest = .5
    }
    if (sorted[base + 1] !== undefined) { 
        return sorted[base] + parseFloat(rest * (sorted[base + 1] - sorted[base])); 
    } else {
        return sorted[base]; 
    }
    
};


const q25 = arr => quantile(arr, .25); // 1st Quartile function

const q50 = arr => quantile(arr, .50); // 2nd Quartile (median) function

const q75 = arr => quantile(arr, .75); // 3rd Quartile

const median = arr => q50(arr); 


exports.get_TA_grading_data = get_TA_grading_data;