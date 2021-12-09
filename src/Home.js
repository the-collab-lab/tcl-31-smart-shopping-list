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
        {/* <Container maxWidth="xl"> */}
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
              alt=""
              sx={{
                height: '50px',
                width: '50px',
                mt: '10px',
              }}
            />
            <Typography
              variant="h6"
              fontFamily={'Inter, sans-serif'}
              mt={'20px'}
            >
              Smart Shopping List
            </Typography>
          </Box>
        </header>

        <main>
          <div className="main-header">
            <div className="main-header-container">
              <h1 className="main-header-title">
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
            {/* <div className="main-oranges"> */}
            <img
              className="flex-items"
              id="orange-slice"
              width="50%"
              height="50%"
              src={orangeSliceRemoveBackground}
              alt=""
            />
          </div>
          <div className="main-content">
            <img
              className="flex-items"
              id="orange-whole"
              width="50%"
              height="50%"
              src={orangeWhole}
              alt=""
            />
            {/* </div> */}

            <div className="main-content-text">
              <h2 className="main-content-title">How it works</h2>
              <div id="how-it-works-text">
                <p id="how-it-works-text-top">
                  Let's say you want to buy oranges. Add them to your list, and
                  just select "oranges" whenever you want to buy them again.
                </p>
                <p>
                  Soon, the smart list will predict when you need oranges again,
                  moving them to the right place on your list. One less thing to
                  worry about!
                </p>
              </div>
            </div>
          </div>
          {/* <div className="buttons flex-items">
            <button className="newListButton" onClick={createToken}>
              Create a new shopping list
            </button>


            <TokenForm />
          </div> */}
        </main>
        {/* </Container> */}
      </>
    )
  );
}
