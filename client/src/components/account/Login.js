import { useState, useContext } from "react";
import { Box, TextField, Button, styled, Typography } from "@mui/material";
import { API } from "../../service/api";
import { DataContext } from "../../context/DataProvider";

const Component = styled(Box)`
  width: 400px;
  margin: auto;
  box-shadow: 4px 3px 3px 2px rgb(0 0 0/0.6);
`;

const Image = styled("img")({
  width: 100,
  margin: "auto",
  display: "flex",
  padding: "60px 0 0",
});

// give margin to textfield and button using parent to child relation ( & > )
const Wrapper = styled(Box)`
  padding: 25px 35px;
  display: flex;
  flex: 1;
  flex-direction: column;
  & > div,
  & > button,
  & > p {
    margin-top: 20px;
  }
`;

const LoginButton = styled(Button)`
  background: #fb641b;
  color: #000;
  height: 48px;
  border-radius: 2px;
`;
const SignUpButton = styled(Button)`
  text-transform: none;
  background: #fff;
  color: #2874f0;
  height: 48px;
  border-radius: 2px;
  box-shadow: 0 2px 4px 0 rgb(0 0 0/20%);
`;
const Error = styled(Typography)`
  font-size: 10px;
  color: #ff6161;
  line-height: 10px;
  margin-top: 10px;
  font-weight: 600;
`;
const Text = styled(Typography)`
  color: #878787;
  font-size: 15px;
`;

const loginInitialValues = {
  username: "",
  password: "",
};

// store signUp values
const signupInitialValues = {
  name: "",
  username: "",
  password: "",
};

const Login = () => {
  const imageURL =
    "https://www.sesta.it/wp-content/uploads/2021/03/logo-blog-sesta-trasparente.png";

  const [account, toggleAccount] = useState("login");
  const [signup, setSignup] = useState(signupInitialValues);
  const [login, setLogin] = useState(loginInitialValues);
  const [error, setError] = useState("");

  const { setAccount } = useContext(DataContext);

  //   change state
  const toggleSignUp = () => {
    account === "signup" ? toggleAccount("login") : toggleAccount("signup");
  };

  //   name field is used to differentiate between each textfield
  const onInputChange = (e) => {
    // e.target.name will act as key
    // store signup values
    setSignup({ ...signup, [e.target.name]: e.target.value });
  };

  // call api
  const signupUser = async () => {
    if (
      signup.name === "" ||
      signup.username === "" ||
      signup.password === ""
    ) {
      alert("fill the form first");
    } else {
      await API.userSignup(signup);

      setError("");
      setSignup(signupInitialValues);
      toggleAccount("login");
    }
  };

  const onValueChange = (e) => {
    // get login values
    setLogin({ ...login, [e.target.name]: e.target.value });
  };

  const loginUser = async () => {
    if (login.username === "" || login.password === "") {
      alert("fill the form first");
    } else {
      let response = await API.userLogin(login);
      console.log(response);

      setError("");
      sessionStorage.setItem(
        "accessToken",
        `Bearer ${response.data.accessToken}`
      );
      sessionStorage.setItem(
        "refreshToken",
        `Bearer ${response.data.refreshToken}`
      );

      setAccount({
        username: response.data.username,
        name: response.data.name,
      });
    }
  };

  return (
    <Component>
      <Box>
        <Image src={imageURL} alt="login" />
        {account === "login" ? (
          <Wrapper>
            <TextField
              variant="standard"
              value={login.username}
              onChange={(e) => onValueChange(e)}
              name="username"
              label="Enter Username"
            />
            <TextField
              variant="standard"
              value={login.password}
              onChange={(e) => onValueChange(e)}
              name="password"
              label="Enter password"
            />

            {error && <Error> {error} </Error>}

            <LoginButton variant="contained" onClick={() => loginUser()}>
              Login
            </LoginButton>
            <Text style={{ textAlign: "center" }}>OR</Text>
            <SignUpButton onClick={() => toggleSignUp()}>
              Create an account
            </SignUpButton>
          </Wrapper>
        ) : (
          <Wrapper>
            <TextField
              variant="standard"
              onChange={(e) => onInputChange(e)}
              name="name"
              label="Enter Name"
            />
            <TextField
              variant="standard"
              name="username"
              onChange={(e) => onInputChange(e)}
              label="Enter Username"
            />
            <TextField
              variant="standard"
              onChange={(e) => onInputChange(e)}
              name="password"
              label="Enter password"
            />
            {error && <Error> {error} </Error>}
            <SignUpButton onClick={() => signupUser()}>Sign Up</SignUpButton>
            <Text style={{ textAlign: "center" }}>OR</Text>
            <LoginButton variant="contained" onClick={() => toggleSignUp()}>
              Already have an account
            </LoginButton>
          </Wrapper>
        )}
      </Box>
    </Component>
  );
};

export default Login;
