let mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/freelance-project-api', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

console.log('DB connected successfully');