const express=require('express');
const mongoose=require('mongoose');

const app=express();
app.use(express.json());
const PORT=process.env.PORT||3000;

mongoose
    .connect('YOUR ENDPOINT')
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.log(err);
    });

const movieSchema = new mongoose.Schema({
    movieCode: { type: String, required: true },
    title: { type: String, required: true },
    Director: { type: String },
    releaseYear: { type: Number },
    genre: { type: String },
});

const Movie = mongoose.model('Movie', movieSchema);
//POST
app.post('/movie', async (req, res) => {
    try {
        const { movieCode, title, Director, releaseYear, genre } = req.body;
        const movie = new Movie({movieCode, title, Director, releaseYear, genre });
        await movie.save();
        res.status(201).json(movie);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// GET
app.get('/movies', async (req, res) => {
    try {
        const movies = await Movie.find();
        res.json(movies);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

//GET by Id
app.get("/movies/:movieCode",async (req,res)=>{
    try{
        const{movieCode}=req.params;
        const movies=await Movie.findOne({movieCode});
        if(!movies)return res.status(404).send("Movie Not Found");
        return res.status(200).json(movies);
    }catch(err){
        res.status(500).send(err.message);
    }

})

//DELETE
app.delete("/delete/:movieCode",async(req,res)=>{
    try{
        const{movieCode}=req.params;
        const movie=await Movie.findOneAndDelete({movieCode});
        if(!movie)return res.status(404).send("Movie do not exist");
        return res.status(200).send("movie deleted");
    }catch(error){
        res.status(500).send(err.message);
    }
})
app.listen(PORT, () => {
    console.log(`Server running @ ${PORT}`);
});