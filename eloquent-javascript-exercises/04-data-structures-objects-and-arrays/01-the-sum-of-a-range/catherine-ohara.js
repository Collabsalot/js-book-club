//Write a range function that takes two arguments, start and end,
//and returns an array containing all the numbers from 
//start up to (and including) end

function range(start, end) {
    let array = []
    for(let i = start; i <= end; i++){
        array.push(i)
    }
    return array
}


//Next, write a sum function that takes an array of numbers and
//returns the sum of these numbers. Run the example program and
//see whether it does indeed return 55.

function sum(array) {
    return array.reduce((acc, currVal) => acc + currVal, 0)
}

console.log(sum(range(1, 10))) // => 55

//As a Bonus, modify your range function to take and optional third
//argument that indicates the 'step' value used when building the array.
//If no step is given, the elements go up by increments of one, corresponding
//to the old behavior. The function call range(1, 10, 2) should return
//[1, 3, 5, 7, 9]. Make sure it also works with negative step values so that
//range(5, 2, -1) produces [5, 4, 3, 2].

function rangeBonus(start, end, step) {
    let newArray = []
    if (step > 0) {
        for(let i = start; i <= end; i += step) { newArray.push(i) }
    } else {
        for(let i = start; i >= end; i += step) { newArray.push(i) }
    }
    return newArray
}

console.log(rangeBonus(1, 10, 2)) // => [1, 3, 5, 7, 9]
console.log(rangeBonus(5, 2, -1)) // => [5, 4, 3, 2]
