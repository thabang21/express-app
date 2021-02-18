const express = require('express')
const app = express()
const fileHandler = require('fs');
app.use(express.json())


// get data 
app.get('/api', function(req, res) {
    fileHandler.readFile('webProjects.json', (err, data) => {
        if (err) res.send('File not found. First post to create file.');
        else
            res.send(`web projects: ${data}`);
    })
})


//add data 
app.post('/api/add', (req, res) => {
    const existUsers = getUserData()
    const userData = req.body

    existUsers.push(userData)

     saveUserData(existUsers);
    res.send({success: true, msg: 'data added successfully'})
})



//delete data using id
app.delete('/api/delete/:id', (req, res) => {
    const userId = req.params.id

    //get the existing userdata
    const existUsers = getUserData()

    //filter the userdata to remove it
    const filterUser = existUsers.filter( user => user.id !== userId )

    if ( existUsers.length === filterUser.length ) {
        return res.status(409).send({error: true, msg: 'userId does not exist'})
    }

    //save the filtered data
    saveUserData(filterUser)

    res.send({success: true, msg: 'data removed successfully'})
    
})


//update data using id
app.put('/api/update/:id', (req, res) => {
    //get the userId from url
    const userId = req.params.id

    //get the update data
    const userData = req.body

    //get the existing user data
    const existUsers = getUserData()

   // check if the userId exist or not       
    const findExist = existUsers.find( user => user.id === userId )
    if (!findExist) {
        return res.status(409).send({error: true, msg: 'userId not exist'})
    }

    //filter the userdata
    const updateUser = existUsers.filter( user => user.id !== userId )

    //push the updated data
    updateUser.push(userData)

    //finally save it
    saveUserData(updateUser)

    res.send({success: true, msg: 'data updated successfully'})
})


app.use(function(err, req, res, next) {
    console.log(err.stack)
    res.status(500).send('Something broke!')
})

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});


//read the user data from json file
const saveUserData = (data) => {
    const stringifyData = JSON.stringify(data)
    fileHandler.writeFileSync('webProjects.json', stringifyData)
}

//get the user data from json file
const getUserData = () => {
    const jsonData = fileHandler.readFileSync('webProjects.json')
    return JSON.parse(jsonData)    
}
