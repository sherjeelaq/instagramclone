import React, { useState, useEffect } from "react";
import "./App.css";
import Post from "./components/Post";
import { db } from "./firebase";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { Button, Input } from "@material-ui/core";
import { auth } from "./firebase";
import Imageupload from "./components/Imageupload";
import InstagramEmbed from "react-instagram-embed";

//Modal Styles
function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);

  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        console.log(authUser);
        setUser(authUser);
      } else {
        setUser(null);
      }
    });

    return () => {
      //perform some cleanups
      unsubscribe();
    };
  }, [user, username]);

  useEffect(() => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      });
  }, []);

  const signUp = (e) => {
    e.preventDefault();

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({ displayName: username });
      })
      .catch((error) => alert(error.message));
  };

  const signIn = (e) => {
    e.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));

    setOpenSignIn(false);
  };

  return (
    <div className="App">
      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt="Instagram Logo"
                className="app__headerImage"
              />
            </center>
            <h3 className="app__formLabel">Sign Up</h3>
            <Input
              placeholder="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button onClick={signUp} variant="contained" color="secondary">
              Sign Up
            </Button>
          </form>
        </div>
      </Modal>

      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt="Instagram Logo"
                className="app__headerImage"
              />
            </center>
            <h3 className="app__formLabel">Sign In</h3>

            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button onClick={signIn} variant="contained" color="secondary">
              Sign In
            </Button>
          </form>
        </div>
      </Modal>

      <div className="app__header">
        <img
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt="Instagram Logo"
          className="app__headerImage"
        />
        {user ? (
          <Button
            variant="contained"
            color="secondary"
            onClick={() => auth.signOut()}
          >
            Logout
          </Button>
        ) : (
          <div className="app__loginContainer">
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setOpenSignIn(true)}
            >
              Sign In
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setOpen(true)}
            >
              Sign Up
            </Button>
          </div>
        )}
      </div>

      {user?.displayName ? (
        <div className="app__posts">
          <div className="app__postsLeft">
            {user?.displayName ? (
              <Imageupload username={user.displayName}></Imageupload>
            ) : (
              <h3 className="app__imageLogin">Login to Upload</h3>
            )}
            {posts.map(({ id, post }) => (
              <Post
                key={id}
                user={user}
                username={post.username}
                caption={post.caption}
                imageUrl={post.imageUrl}
                postId={id}
              />
            ))}
          </div>
          <div className="app_postsRight">
            <InstagramEmbed
              url="https://www.instagram.com/p/CErbxJTjDXo/"
              maxWidth={450}
              hideCaption={false}
              containerTagName="div"
              protocol=""
              injectScript
              onLoading={() => {}}
              onSuccess={() => {}}
              onAfterRender={() => {}}
              onFailure={() => {}}
            />
          </div>
        </div>
      ) : (
        <div className="app__posts">
          <form className="app__signinMain">
            <h2 className="app__formLabel">Sign In</h2>

            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button onClick={signIn} variant="contained" color="secondary">
              Sign In
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
