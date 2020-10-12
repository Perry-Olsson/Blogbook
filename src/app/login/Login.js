import React from 'react';
import { useField } from '../../hooks/index';
import { loginUser } from '../../reducers/userReducer';
import { useDispatch } from 'react-redux';

import { StyledInput } from '../../components/styledComponents';
import { Button } from 'react-bootstrap';
import './Login.css';

const Login = () => {
  const dispatch = useDispatch();
  const [username, resetUsername] = useField('text', 'username');
  const [password, resetPassword] = useField('text', 'password');

  const handleLogin = async event => {
    event.preventDefault();
    dispatch(loginUser(username.value, password));
    resetUsername();
    resetPassword();
  };

  return (
    <div className="loginForm-cy">
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label>username</label>
          <StyledInput { ...username } />
        </div>
        <div>
          <label>password</label>
          <StyledInput { ...password } />
        </div>
        <Button id="loginButton" className="login" type="submit" variant="dark">
          login
        </Button>
      </form>
    </div>
  );
};

export default Login;
