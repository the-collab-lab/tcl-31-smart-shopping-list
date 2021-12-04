import React from 'react';
import { getToken } from '@the-collab-lab/shopping-list-utils';
import { useHistory, Redirect } from 'react-router-dom';
import TokenForm from './TokenForm';
import orangeSliceRemoveBackground from './assets/orangeSliceRemoveBackground.png';
import orangeWhole from './assets/orangeWhole.jpg';
import { Button, Box, Typography, CardMedia } from '@mui/material';
import { orange } from '@mui/material/colors';

const newOrange = orange['A400'];

export function Home() {
  const history = useHistory();
  let token;
  token = localStorage.getItem('token');
  console.log(token);

  function createToken() {
    //-- create a token and store the token in localStorage
    token = localStorage.setItem('token', getToken());
    //-- redirect user to the "list" view
    history.push('/list');
  }

  return (
    // Here validate if token exist
    token ? (
      <Redirect to="/list" />
    ) : (
      <>
        <header>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
            }}
          >
            <CardMedia
              component="img"
              image="/img/wholeorange.jpg"
              sx={{
                height: '50px',
                width: '50px',
              }}
            />
            <Typography
              variant="h6"
              fontFamily={'Inter, sans-serif'}
              mt={'12px'}
            >
              Smart Shopping List
            </Typography>
          </Box>
        </header>

        <main>
          <div className="main-header">
            <div className="main-header-container">
              <h1 className="flex-items main-header-title">
                Remember what to buy,{' '}
                <span className="h1_standout">exactly</span> when you need it
              </h1>
            </div>

            <Button
              variant="contained"
              aria-label="newListButton"
              size="large"
              sx={{
                background: newOrange,
                fontWeight: 775,
                fontSize: 21,
              }}
              onClick={createToken}
            >
              Create new shopping list
            </Button>

            <TokenForm />

            <img
              className="flex-items"
              width="50%"
              height="50%"
              src={orangeSliceRemoveBackground}
              alt="orange slice"
            />
          </div>
          <div className="main-content">
            <img
              className="flex-items"
              width="50%"
              height="50%"
              src={orangeWhole}
              alt="orange whole"
            />
            <div className="flex-items">
              <h2 className="main-content-title">How it works</h2>
              <p>
                Add an item to your list, then select it when you want to buy
                again. After a couple purchases, your smart list will predict
                when you need to buy it again. The item appears right where it
                needs to be on your list so you don't forget!
              </p>
            </div>
          </div>
          {/* <div className="buttons flex-items">
            <button className="newListButton" onClick={createToken}>
              Create a new shopping list
            </button>


            <TokenForm />
          </div> */}
        </main>
      </>
    )
  );
}
