const http = require('http')
const fs = require('fs')



const studentsData = JSON.parse(fs.readFileSync('./students.json' , "utf-8"));
const corsesData = JSON.parse(fs.readFileSync('./corses.json' , "utf-8"));
const departmentData = JSON.parse(fs.readFileSync('./department.json' , "utf-8"));

const server = http.createServer(  (req , res) => {

const {url , method} = req
if(url == '/students' && method == 'GET'){
res.statusCode = 200
res.end(JSON.stringify(studentsData))
}
// add student email unique
//get data to handle email unique
else if( url == '/students' && method == 'POST'){

req.on('data' , (chunk)=> {
    console.log(JSON.parse(chunk));
    const body = JSON.parse(chunk)
    const index = studentsData.findIndex( (ele)=> ele.email == body.email )
    
    if(index != -1){
        res.statusCode = 409
           return res.end('email already exist')
    }
    console.log(index);

    const studentId = studentsData.length + 1
body.id = studentId


studentsData.push(body)
console.log(studentsData);
fs.writeFileSync('./students.json' ,JSON.stringify(studentsData) )
res.end('User Has Been Created successfuly')

})

} else if(url.startsWith('/students/' ) && method =="DELETE"){

console.log(url.split('/')[2]);

const id = +url.split('/')[2] 

  const index = studentsData.findIndex( (ele) => ele.id = id )

if(index == -1){
return res.end('id Not Exist')
}

    studentsData.splice(index , 1)
    fs.writeFileSync('./students.json' , JSON.stringify(studentsData))
    res.statusCode = 200
    res.end("Deleted Successfuly")


}



// update

 else if(url.startsWith('/students/' ) && method =="PUT"){


    const id = +url.split("/")[2]

    const isUSer= studentsData.findIndex( (ele) => ele.id == id )

    if(isUSer == -1){

        res.statusCode = 400
        return res.end("id Not Exist")

    }

// get Data

req.on('data' , (chunk)=> {
    const body = JSON.parse(chunk)
    console.log(body);
 

if(body.email ){
    const isEmail= studentsData.findIndex( (ele) => ele.email == body.email && id != ele.id )

    if(isEmail != -1){
        res.statusCode = 400 
        return res.end("email is Already exist")
        }


}

// update user Data
studentsData[isUSer] = {
    ...studentsData[isUSer],
    ...body
}
fs.writeFileSync('./students.json' , JSON.stringify(studentsData))
res.statusCode = 200
res.end("Updated")


})


 }

 //Get BY id 

 else if(url.startsWith('/students/' ) && method =="GET"){
    const id = +url.split("/")[2]
    const isUserExist = studentsData.findIndex( (ele) => ele.id == id )
if(isUserExist == -1){
res.statusCode = 400
return res.end("id Not exist")
}
return res.end(JSON.stringify(studentsData[isUserExist]))
   

 }



 
//  get all students with department , corses info
else if(url == '/studentInfo' && method == "GET"){

    const returnArrStudent = studentsData.map( (student) => {

        // search for dep
        const dep = departmentData.find( (department)=> {
            return department.id == student.DepartmentId
        } )


        // get all courses
        const course = corsesData.filter( (course) => {
            return course.DepartmentId = student.DepartmentId
        } )

        delete student.DepartmentId
        return{
            ...student , 
            departmentInfo: dep,
            coursesInfo : course
        }
    } )

    return res.end(JSON.stringify(returnArrStudent))

}

// add courses 

else if(url == '/courses' && method == "POST"){
    // id - name - content -depId
    req.on('data' , (chunk)=> {

        console.log(JSON.parse(chunk));
        const body = JSON.parse(chunk)
        const courseId = +corsesData.length + 1
        body.id = courseId
        corsesData.push(body)
        fs.writeFileSync('./corses.json' , JSON.stringify(corsesData))
        res.statusCode = 201
        res.end("Course Has been Created")

    })

}

// Delete Course 
else if(url.startsWith('/courses/' )&& method == 'DELETE'){

     const id = +url.split("/")[2]
     const index = corsesData.findIndex( (course) => course.id == id)
     console.log(index);
     if(index == -1){
        res.statusCode = 400
        return res.end("Id Not Exist")


     }
     corsesData.splice(index ,1)
     fs.writeFileSync('./corses.json' , JSON.stringify(corsesData))
     res.statusCode = 200
     res.end("Course Deleted")
}

//Update Course 
else if(url.startsWith('/courses/') && method =='PUT'){
    const id = +url.split('/')[2]
    const index = corsesData.findIndex( (ele)=> ele.id == id )
    console.log(index);
    if(index == -1){
        res.statusCode = 400
        return res.end("id Not exist")
    }
    req.on('data' , (chunk)=> {

        const body = JSON.parse(chunk)

        corsesData[index]= {
            ...corsesData[index],
            ...body
        }
        res.statusCode = 200
        fs.writeFileSync('./corses.json' , JSON.stringify(corsesData))
        res.end("Has Been Updated")
    })



}
// get all courses 
else if(url == '/courses' && method == 'GET'){
res.statusCode = 200
res.end(JSON.stringify(corsesData))
}
// get a specific course 
else if(url.startsWith('/courses/') && method == 'GET'){

    const id = +url.split('/')[2]
    const index = corsesData.findIndex( (ele) => ele.id ==id) 
    console.log(index);
    if(index == -1){
        res.statusCode= 400
    console.log("Not Hereeeeeeeee");

        return res.end("Id Not Exist")

    }
    console.log("mogooooood");
    return res.end(JSON.stringify(corsesData[index]))
}

// departments 
// add dep
else if(url == '/department' && method == 'POST'){
    
    // post always start with send puffer by req.on
    req.on('data' , (chunk) =>{

        const body = JSON.parse(chunk)
        const depID = departmentData.length + 1
        body.id = depID
        res.statusCode = 201 
        departmentData.push(body)
        fs.writeFileSync('./department.json' , JSON.stringify(departmentData))
        res.end('Department Has been Created')

    })


}
// Update dep
else if(url.startsWith('/department/') && method =="PUT"){
    const id = +url.split('/')[2]
    const index = departmentData.findIndex( (ele) => ele.id == id )
    console.log(index);
    if(index == -1){
        res.statusCode == 400
        return res.end("id not exist")
    }
    req.on('data' , (chunk)=> {

        const body = JSON.parse(chunk)
        departmentData[index] ={
            ...departmentData[index],
            ...body
        }
        res.statusCode = 200
        fs.writeFileSync('./department.json' ,JSON.stringify(departmentData))
        res.end('Updated')
    })

}

// delete 
else if(url.startsWith('/department/') && method == 'DELETE'){
    const id = +url.split('/')[2]
    const index = departmentData.findIndex( (ele) => ele.id == id) 
    if(index == -1){
        res.statusCode = 400
       return res.end("id not exist")
    }
    departmentData.splice(index , 1)
    res.statusCode = 200 
    fs.writeFileSync('./department.json' , JSON.stringify(departmentData))
    res.end("deleted" )

}
// get all
else if(url == '/department' && method == 'GET'){
    res.statusCode= 200
    res.end(JSON.stringify(departmentData))

}
//- Get a specific department
else if(url.startsWith('/department/') && method == "GET"){
    const id = +url.split('/')[2]
    const index = departmentData.findIndex( (dep) => dep.id == id )
        if(index == -1){
            res.statusCode = 400
            return res.end("id not exist ")
        }
        return res.end(JSON.stringify(departmentData[index]))

}

});
 

server.listen(3000 , ()=>{
    console.log("port run on 3000")}
)