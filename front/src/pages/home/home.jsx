import { useState, useEffect } from 'react'
import axios from 'axios'

const home = () => {
    const [posts, setPosts]  = useState([]);
  const [users, setUsers]  = useState([]);
  
    useEffect(() => {
      const fetchUsers = async () => {
          try{
              const { data, status } = await axios.get('http://localhost:8000/api/users/all')
              
              if(status === 200) setUsers(data)
          }catch(error){
              console.log(error.message);
          }
      }
      fetchUsers();
    }, [])

    useEffect(() => {
      const fetchPosts = async () => {
        try{
            const { data, status } = await axios.get('http://localhost:8000/api/posts/all')

            // Transformer le tableau users en un objet clé-valeur pour un accès rapide
            const usersMap = Object.fromEntries(users.map(user => [user._id, user]));

            // Remplacer l'ID user par l'objet user correspondant
            const updatedData = data.map(post => ({
              ...post,
              user: usersMap[post.user]
            })); 
            
            if(status === 200) setPosts(updatedData)
        }catch(error){
            console.log(error.message);
        }
      }
      fetchPosts()
    }, [users])

    
  return (
    <div className='container'>
        <h1>Conversation</h1>
        <div className='row justify-content-center g-5'>
          {posts.map(post => (
              <div key={post._id} className="col-4"> 
                <div className='card p-4'>
                  <h2>{post.title}</h2>
                  <p>{post.content}</p>
                  <div className='metada'>
                    <span>{post.user ? post.user.username : ''}</span>
                    <span>{post.createdAt}</span>
                  </div>
                </div>
              </div>
          ))}
        </div>  
    </div>
  )
}

export default home