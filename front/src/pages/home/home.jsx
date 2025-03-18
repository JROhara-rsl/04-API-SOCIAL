import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router';

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

    const likePost = (id) => {
      try {
        //axios.put('http://localhost:8000/api/posts/like/'+id) 
      } catch(error) {

      }
    } 

  return (
    <div className='container'>
        <h1>Conversation</h1>
        <div className='row justify-content-center g-5'>
          {posts.map(post => (
              <div key={post._id} className="col-4"> 
                <div className='card p-4'>
                  <h3 className='card-title'>{post.title}</h3>
                  <span>{post.createdAt}</span>
                  <p>{post.content}</p>
                  <div className='metada'>
                    <span>{post.user ? post.user.username : ''}</span>
                    <button className="btn btn-outline-danger" onClick={likePost(post._id)}>{post.like.length} ❤️</button>
                  </div>
                </div>
              </div>
          ))}
        </div>  
    </div>
  )
}

export default home