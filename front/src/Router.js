import React, { useState, useReducer } from 'react';
import { Route, Switch, HashRouter } from 'react-router-dom';
import jwt from 'jsonwebtoken';
import Home from 'pages/Home/Home';
import GlobalContext from 'global.context';
import Main from 'pages/Main/Main';
import MyPage from 'pages/MyPage/MyPage';
import SecretGame from 'pages/SecretGame/SecretGame';
import GamePlay from 'components/GamePlay/GamePlay';
import Room from 'logics/room';
import User from 'logics/user';
import RouterStyle from 'Router.style';
import parseCookies from 'util/cookie';

const changeUser = (prev, newUser) => {
  return { ...prev, ...newUser };
};

const Router = () => {
  const { jwt: jwtToken } = parseCookies();

  let userInitial = new User();
  if (jwtToken) {
    const { id, nickname } = jwt.decode(jwtToken);
    userInitial = new User(nickname, null, id);
  }
  const [room, setRoom] = useState(new Room());
  const [user, userDispatch] = useReducer(changeUser, userInitial);
  const [onlineSocket, setOnlineSocket] = useState(null);
  const [gameSocket, setGameSocket] = useState(null);

  return (
    <RouterStyle id="Router">
      <HashRouter>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <GlobalContext.Provider
            value={{
              onlineSocket,
              setOnlineSocket,
              user,
              userDispatch,
              room,
              setRoom,
              gameSocket,
              setGameSocket,
            }}
          >
            <Route path="/mypage">
              <MyPage />
            </Route>
            <Route path="/main">
              <Main />
            </Route>
            <Route path="/gameplay">
              <GamePlay />
            </Route>
            <Route path="/secret:hash">
              <SecretGame />
            </Route>
          </GlobalContext.Provider>
        </Switch>
      </HashRouter>
    </RouterStyle>
  );
};

export default Router;