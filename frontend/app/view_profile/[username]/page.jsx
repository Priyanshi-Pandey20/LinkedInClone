"use client";

import { useEffect, useState } from "react";
import clientServer from "../../config/clientServer";
import UserLayout from "../../layout/UserLayout";
import DashBoardLayout from "../../layout/DashBoardLayout/page";
import styles from "./index.module.css";
import { useRouter, useParams } from "next/navigation"; 
import { useDispatch, useSelector } from "react-redux";
import { getAllPosts } from "../../config/redux/action/postAction";
import { getConnectionsRequest, getMyConnectionRequest, sendConnectionRequest } from "../../config/redux/action/authAction";

export default function ViewProfilePage() {

  const router = useRouter();
  const params = useParams();
  const username = params?.username;

  const dispatch = useDispatch();
  const postReducer = useSelector((state) => state.postReducer);
  const authState = useSelector((state) => state.auth);
  const [isCurrentUserInConnection, setIsCurrentUserInConnection]= useState(false);

  const [isConnectionNull, setIsConnectionNull] = useState(true);

  const [userProfile, setUserProfile] = useState(null);
  const [userPosts, setUserPosts] = useState([]);

  const baseURL = "http://localhost:9090";

  const getUserPost = async() =>{
    await dispatch(getAllPosts());
    await dispatch(getConnectionsRequest({token: localStorage.getItem("token")}));
    await dispatch(getMyConnectionRequest({token: localStorage.getItem("token")}));
  }
 useEffect(() => {
  if (!userProfile?.userId || !Array.isArray(postReducer.posts)) return;

  const userId = userProfile.userId._id;

  console.log("Profile User ID:", userId);
  console.log("All Posts:", postReducer.posts);

  const filteredPosts = postReducer.posts.filter((post) => {
    return post.userId?._id === userId;
  });

  console.log("Filtered Posts:", filteredPosts);

  setUserPosts(filteredPosts);
}, [postReducer.posts, userProfile]);

  useEffect(() => {
    if (!userProfile?.userId || !Array.isArray(authState.connections)) return;

    console.log(authState.connections, userProfile.userId._id)

    if(authState.connections.some(user => user.connectionId._id === userProfile.userId._id)){
      setIsCurrentUserInConnection(true);

      if(authState.connections.find(user => user.connectionId._id === userProfile.userId._id).status_accepted === true){
        setIsConnectionNull(false)
      }
    }
   
    if(authState.connectionRequest.some(user => user.userId._id === userProfile.userId._id)){
      setIsCurrentUserInConnection(true);

      if(authState.connectionRequest.find(user => user.userId._id === userProfile.userId._id).status_accepted === true){
        setIsConnectionNull(false)
      }
    }

  }, [authState.connections, authState.connectionRequest]);


  useEffect(() => {
    getUserPost();
  }, []);
   

  useEffect(() => {
    if (!username) return;

    const fetchProfile = async () => {
      try {
     const res = await clientServer.get(
  "/user/get_profile_based_on_username",
  {
    params: {
      username: decodeURIComponent(username), // ✅ FIX
    },
  }
);
        setUserProfile(res.data?.profile);
      } catch (err) {
        console.error("Error loading profile", err);
      }
    };

    fetchProfile();
    dispatch(getAllPosts());

  }, [username]);



  if (!username) {
    return <h1>Invalid username</h1>;
  }

  if (!userProfile) {
    return <h1>Loading...</h1>;
  }


  

  return (
    <UserLayout>
      <DashBoardLayout>
        <div className={styles.container}>

          <div className={styles.backDropContainer}>
            <img
              className={styles.backdrop}
              src={`${baseURL}/${userProfile.userId.profilePicture}`}
              alt=""
            />
          </div>

          <div className={styles.profileContainer__details}>
            <div className={styles.profileContainer__flex}>
              
              <div style={{ flex: "0.8" }}>
                <div style={{ display: "flex", gap: "1.2rem" }}>
                  <h2>{userProfile.userId.name}</h2>
                  <p style={{ color: "grey" }}>@{userProfile.userId.username}</p>
                </div>
     
               <div style={{display:"flex", alignItems: "center", gap: "1.2rem"}}>
               {isCurrentUserInConnection ? 
                 <button className={styles.connectedButton}>{isConnectionNull ? "Pending": "Connected"}</button> 
                 :
                 <button onClick={() => {
                  dispatch(sendConnectionRequest({token: localStorage.getItem("token"), user_id: userProfile.userId._id}))
                 }} className={styles.connectBtn}>Connect</button>
              }
          
              <div onClick={async () => {
                try {
                  const response = await clientServer.get("/user/download_resume", {
                    params: { id: userProfile.userId._id }
                  });
                  console.log("download_resume res", response.data);

                  if (!response.data?.message) {
                    return alert("Unable to generate PDF. Please try again.");
                  }

                  window.open(`${baseURL}/${response.data.message}`, "_blank");
                } catch (error) {
                  console.error("download_resume error", error);
                  alert("Download failed. Check server logs.");
                }
              }} style={{cursor: "pointer"}}>
                <svg  style ={{width: "1.4rem"}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 7.5h-.75A2.25 2.25 0 0 0 4.5 9.75v7.5a2.25 2.25 0 0 0 2.25 2.25h7.5a2.25 2.25 0 0 0 2.25-2.25v-7.5a2.25 2.25 0 0 0-2.25-2.25h-.75m-6 3.75 3 3m0 0 3-3m-3 3V1.5m6 9h.75a2.25 2.25 0 0 1 2.25 2.25v7.5a2.25 2.25 0 0 1-2.25 2.25h-7.5a2.25 2.25 0 0 1-2.25-2.25v-.75" />
                </svg>

              </div>
                  </div>
               


             
            <div>
              <p>{userProfile.bio}</p>
            </div>
          </div>

          <div style={{flex: "0.2"}}>
            <h3>Recent Activity</h3>
            {userPosts.map((post) => {
              return(
                <div key={post._id} className={styles.postCard}>
                  <div className={styles.card}>
                    <div className={styles.card__profileContainer}>
                      {post.media !== "" ? <img src = {`${baseURL}/${post.media}`} alt=""/> : <div style={{width: "3.4rem", height: "3.4rem"}}></div>}
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
                  userProfile.pastWork.map((work, index) => {
                    return(
                      <div key={index} className={styles.workHistoryCard}>
                        <p style={{fontWeight: "bold", display:"flex", alignItems:"center", gap: "0.8rem"}}>{work.company} - {work.position}</p>
                        <p>{work.years}</p>

                      </div>
                    )
                  })
                }

              </div>
            </div>
        </div>
      </DashBoardLayout>
    </UserLayout>
  );
}