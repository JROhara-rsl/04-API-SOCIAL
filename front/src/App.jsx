import { useState, useEffect } from 'react'
import axios from 'axios'

import './App.css'

function App() {
  const [posts, setPosts]  = useState([]);
  const [users, setUsers]  = useState([]);
  
    useEffect(() => {
      const fetchUsers = async () => {
          try{
              const { data, status } = await axios.get('http://localhost:8000/api/users/all')
              console.log(data);
              
              if(status === 200) setUsers(data)
          }catch(error){
              console.log(error.message);
          }
      }
      fetchUsers();
      
      const fetchPosts = async () => {
          try{
              const { data, status } = await axios.get('http://localhost:8000/api/posts/all')
            
              const updatedData = data.map(post => ({
                ...post,
                user: users[post.user] // Remplace l'ID par l'objet user correspondant
              })); 
              console.log(updatedData);
              
              if(status === 200) setPosts(data)
          }catch(error){
              console.log(error.message);
          }
      }
      fetchPosts()
    }, [])
  
  return (
    <>
      <h1>Conversation</h1>
      {posts.map(post => (
        <div key={post._id} className="post"> 
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          <span>{post.user}</span>
        </div>
      ))}
    </>
  )
}

export default App
