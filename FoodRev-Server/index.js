require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
//System time needs to be correct

const port = process.env.PORT || 5000;
//middlewares
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('FoodRev Server Running');
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
}); 

const { MongoClient, ServerApiVersion, ObjectId  } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.z8xc2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const foodsCollection = client.db("FoodRev").collection("foods");
    app.get('/foods', async (req, res) => {
            const foods = await foodsCollection.find().toArray();
            res.send(foods);
        });
    app.post('/foods', async (req, res) => {
      try {
        const { name, price, ratings, description, image, location, latitude, longitude } = req.body;
    
        // Check for required fields
        if (!name || !price || !ratings || !description || !image || !location || !latitude || !longitude) {
          return res.status(400).send({ message: 'Missing required fields' });
        }
    
        const newFood = {
          name,
          price,
          ratings,
          description,
          image,
          location,
          latitude,
          longitude,
        };
    
        const result = await foodsCollection.insertOne(newFood);
    
        // Check if insertion was successful
        if (result.acknowledged) {
          return res.status(201).send({
            message: 'Food added successfully',
            food: { ...newFood, _id: result.insertedId }, // Include the inserted ID
          });
        } else {
          throw new Error('Food not added to database');
        }
      } catch (error) {
        console.error('Error adding food:', error.message);
        return res.status(500).send({ message: 'Internal Server Error', error: error.message });
      }
    });
        
        
    app.put('/foods/:id', async (req, res) => {
      const { id } = req.params;
      const { name, price, ratings, description, image, location, latitude, longitude } = req.body;
    
      if (!ObjectId.isValid(id)) {
        return res.status(400).send({ message: 'Invalid food ID' });
      }
    
      try {
        const updatedFood = {
          name,
          price,
          ratings,
          description,
          image,
          location,
          latitude,
          longitude,
        };
    
        const result = await foodsCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updatedFood }
        );
    
        if (result.matchedCount === 0) {
          return res.status(404).send({ message: 'Food not found' });
        }
    
        res.status(200).send({ message: 'Food updated successfully', updatedFood });
      } catch (error) {
        res.status(500).send({ message: 'Error updating food', error: error.message });
      }
    });
    app.get('/foods/:id', async (req, res) => {
      const { id } = req.params;

      if (!ObjectId.isValid(id)) {
        return res.status(400).send({ message: 'Invalid food ID' });
      }

      try {
        const food = await foodsCollection.findOne({ _id: new ObjectId(id) });
        if (!food) {
          return res.status(404).send({ message: 'Food not found' });
        }

        res.status(200).send(food);
      } catch (error) {
        console.error('Error fetching food by ID:', error.message);
        res.status(500).send({ message: 'Error fetching food', error: error.message });
      }
    });
    
    app.delete('/foods/:id', async (req, res) => {
      const { id } = req.params;
    
      if (!ObjectId.isValid(id)) {
        return res.status(400).send({ message: 'Invalid food ID' });
      }
    
      try {
        const result = await foodsCollection.deleteOne({ _id: new ObjectId(id) });
    
        if (result.deletedCount === 0) {
          return res.status(404).send({ message: 'Food not found' });
        }
    
        res.status(200).send({ message: 'Food deleted successfully' });
      } catch (error) {
        res.status(500).send({ message: 'Error deleting food', error: error.message });
      }
    });
    
                
    const followsCollection = client.db("FoodRev").collection("follows");
    app.get('/follows', async (req, res) => {
            const follows = await followsCollection.find().toArray();
            res.send(follows);
        });
    const reviewCollection = client.db("FoodRev").collection("reviews");
    app.get('/reviews', async (req, res) => {
            const reviews = await reviewCollection.find().toArray();
            res.send(reviews);
        });
      app.delete('/reviews/:id', async (req, res) => {
        const reviewId = req.params.id;
    
        try {
            const result = await reviewCollection.deleteOne({ _id: new ObjectId(reviewId) });
    
            if (result.deletedCount === 1) {
                res.status(200).send({ message: 'Review deleted successfully' });
            } else {
                res.status(404).send({ message: 'Review not found' });
            }
        } catch (error) {
            console.error('Error deleting review:', error);
            res.status(500).send({ message: 'Error deleting review', error });
        }
    });
      
      
        app.post('/follow', async (req, res) => {
          const { followerId, followingId } = req.body;
      
          try {
              // Check if the follow relationship already exists
              const existingFollow = await followsCollection.findOne({
                  follower_id: followerId,
                  following_id: followingId
              });
      
              if (existingFollow) {
                  // If the relationship exists, remove it (Unfollow)
                  await followsCollection.deleteOne({ _id: existingFollow._id });
                  res.status(200).send({ message: 'Unfollowed successfully' });
              } else {
                  // If it doesn’t exist, add it (Follow)
                  await followsCollection.insertOne({ follower_id: followerId, following_id: followingId });
                  res.status(201).send({ message: 'Followed successfully' });
              }
          } catch (error) {
              res.status(500).send({ message: 'Error handling follow/unfollow', error });
          }
      });
      
    const likedislikeCollection = client.db("FoodRev").collection("likedislikes");
    app.get('/likedislikes', async (req, res) => {
            const likedislikes = await likedislikeCollection.find().toArray();
            res.send(likedislikes);
        });
        app.post('/reviews', async (req, res) => {
          try {
            const newReview = req.body;
            const result = await reviewCollection.insertOne(newReview);
            console.log(newReview)
            res.status(201).send(result);
          } catch (error) {
            res.status(500).send({ message: 'Error adding review', error });
          }
        });

        app.post('/likedislikes', async (req, res) => {
          const { reviewId, userId, type } = req.body;
      
          try {
              const existingReaction = await likedislikeCollection.findOne({ reviewId, userId });
      
              if (existingReaction) {
                  // Update the existing reaction type
                  const result = await likedislikeCollection.updateOne(
                      { _id: existingReaction._id },
                      { $set: { type } }
                  );
                  res.status(200).send(result);
              } else {
                  // Insert a new reaction
                  const newReaction = { reviewId, userId, type };
                  const result = await likedislikeCollection.insertOne(newReaction);
                  res.status(201).send(result);
              }
          } catch (error) {
              res.status(500).send({ message: 'Error updating reaction', error });
          }
      });
      

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
