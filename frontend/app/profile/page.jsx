"use client";
import React, { useEffect,useState } from 'react'
import UserLayout from '../layout/UserLayout'
import DashboardLayout from '../layout/DashBoardLayout/page'
import { getAboutUser } from '../config/redux/action/authAction'
import styles from "./index.module.css"
import { useDispatch, useSelector } from 'react-redux';
import { getAllPosts } from '../config/redux/action/postAction';
import clientServer from '../config/clientServer';



 export default function ProfilePage() {

    const authState = useSelector((state) => state.auth)
    const postReducer = useSelector((state) => state.postReducer);


    const [userProfile,setUserProfile] = useState({})

    const dispatch = useDispatch();
    const baseUrl ="http://localhost:9090";

    const [isModalOpen,setIsModalOpen] = useState(false);   

    const[inputData, setInputData] = useState({company: '', position:'', years: ''});

    const handleWorkInputChange = (e) => {
      const {name, value} = e.target;
      setInputData({...inputData, [name]:value})
    }
    const [userPosts,setUserPosts] = useState([]);
    
    useEffect(()=>{
        dispatch(getAboutUser({token:localStorage.getItem("token")}))
        dispatch(getAllPosts());
    },[])
    
 useEffect(() => {
    if (authState.user != undefined) {
        setUserProfile(authState.user)
        console.log("Full user object:", authState.user)  // Add this
        console.log("Bio value:", authState.user.bio)     // Check bio specifically
    }
}, [authState.user, postReducer.posts])

useEffect(() => {
  if (!postReducer.posts || !authState.user?.userId) return;

  const myUsername = authState.user.userId.username;

  console.log("All Posts:", postReducer.posts);
  console.log("My Username:", myUsername);

  const filteredPosts = postReducer.posts.filter((post) => {
    return post.userId?.username === myUsername;
  });

  console.log("My Posts:", filteredPosts);

  setUserPosts(filteredPosts);
}, [postReducer.posts, authState.user]);

    const uploadProfilePicture = async(file)=>{
        const formData = new FormData();
        formData.append("profile_picture",file);
        formData.append("token",localStorage.getItem("token"));

        const response = await clientServer.post("/update_profile_picture",formData,{
            headers:{
               'Content-Type':'multipart/form-data',
            }
        });
        dispatch(getAboutUser({token:localStorage.getItem("token")}));
    }

    const updateProfile = async () => {
  await clientServer.post("/user_update", {
    token: localStorage.getItem("token"),
    name: userProfile.userId.name,
  });

  await clientServer.post("/update_profile_data", {
    token: localStorage.getItem("token"),
    bio: userProfile.bio,
    currentPost: userProfile.currentPost,
    pastWork: userProfile.pastWork,
    education: userProfile.education,
  });

  // ✅ Re-fetch user so UI updates with saved data
  dispatch(getAboutUser({ token: localStorage.getItem("token") }));
};
  return (
    <UserLayout>
        <DashboardLayout>
            {authState.user && userProfile?.userId &&
               <div className={styles.container}>

          <div className={styles.backDropContainer}>
           
                <label  htmlFor='profilePictureUpload'className={styles.backDrop_overlay}>
                <p>
                    Edit
                </p>
                </label>
                <input onChange={(e)=>{
                    uploadProfilePicture(e.target.files[0])
                }} hidden type='file' id='profilePictureUpload'/>
               
             <img
              src={`${baseUrl}/${userProfile.userId.profilePicture}`}
              alt=""
            />
           
          </div>

          <div className={styles.profileContainer__details}>
            <div style={{ display: "flex", gap: "0.7rem" }}>
              
              <div style={{ flex: "0.8" }}>
                <div style={{ display: "flex", gap: "1.2rem" }}>
                <input className={styles.nameEdit} type='text' value={userProfile.userId.name} onChange={(e) =>{
                  setUserProfile({...userProfile,userId:{...userProfile.userId, name:e.target.value}})
                  
                }} />
                  <p style={{ color: "grey" }}>@{userProfile.userId.username}</p>
                </div>
      
            <div>
             <textarea value={userProfile.bio}
             onChange={(e)=>{
              setUserProfile({...userProfile, bio:e.target.value});
             }}
             rows={Math.max(3, Math.ceil((userProfile.bio?.length || 0) / 80))}
             style={{width:"100%"}}
             />
            </div>
          </div>



          <div style={{flex: "0.2"}}>
            <h3>Recent Activity</h3>
            {userPosts.map((post) => {
              return(
                <div key={post._id} className={styles.postCard}>
                  <div className={styles.card}>
                    <div className={styles.card__profileContainer}>
                      {post.media !== "" ? <img src = {`${baseUrl}/${post.media}`} alt=""/> : <div style={{width: "3.4rem", height: "3.4rem"}}></div>}
                    </div>
                    <p>{post.body}</p>
                    </div>
                  </div>
              )
            })}

          </div>
        </div>
                
            </div>

            <div className="workHostory">
              <h4>Work History</h4>
              <div className={styles.workHistoryContainer}>
                {
                  userProfile.pastWork?.map((work, index) => {
                    return(
                      <div key={index} className={styles.workHistoryCard}>
                        <p style={{fontWeight: "bold", display:"flex", alignItems:"center", gap: "0.8rem"}}>{work.company} - {work.position}</p>
                        <p>{work.years}</p>

                      </div>
                    )
                  })
                }
               
              </div>
               <button className={styles.addWorkButton} onClick={()=>{
                 setIsModalOpen(true)

                }}>Add Work</button>
            </div>
            {userProfile != authState.user && 
            <div  onClick ={()=>{
              updateProfile();

            }}className={styles.updateProfileBtn}>
              Update Profile
            </div>
            
            }
        </div>
        }
         {
                  isModalOpen  && 
                  <div
                   onClick={() => {
                   setIsModalOpen(false)
                   }}
                  className={styles.commentsContainer}>
                    <div onClick = {(e) => {
                      e.stopPropagation()
                    }}className={styles.allCommentsContainer}>
                 <input  onChange={handleWorkInputChange} name='company' className={styles.inputField} type="text" placeholder="Enter Company"/> 
                <input  onChange={handleWorkInputChange} name='position' className={styles.inputField} type="text" placeholder="Enter Position"/> 
                <input  onChange={handleWorkInputChange}  name='years'className={styles.inputField} type="number" placeholder="Years"/>   

                <div  onClick={() => {
                  setUserProfile({...userProfile, pastWork:[...userProfile.pastWork, inputData]})
                  setIsModalOpen(false)
                }} 
                
                className={styles.updateProfileBtn} >Add Work  </div>

        
                    </div>
                    </div>
                    }

        </DashboardLayout>
    </UserLayout>
  )
}