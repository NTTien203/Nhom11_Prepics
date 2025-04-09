import React from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import ForgotPassword from '../sign-in/ForgotPassword';
import { GoogleIcon, FacebookIcon, SitemarkIcon } from '../sign-in/CustomIcons';
import { auth, googleProvider, signInWithPopup } from '../../firebaseconfig';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import AdbIcon from '@mui/icons-material/Adb';
const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
  },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  backgroundImage: `url(src/assets/imageLogin.png)`,
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

export default function  SignIn(props) {

  const navigate = useNavigate();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [open, setOpen] = React.useState(false);


  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const idToken = await user.getIdToken();

      console.log("User Info:", user);
      console.log("ID Token:", idToken);

      fetch('http://localhost:8080/public/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
      })
        .then(response => response.json())
        .then(data => {
          localStorage.clear();
          console.log(data.payload);
          localStorage.setItem('userID',JSON.stringify(data.payload.id));
          localStorage.setItem('isAdmin',JSON.stringify((data.payload.isAdmin)));
          console.log("Backend Response:", data)
          navigate("/");
        })
        .catch(error => console.error("Error:", error));
        

    } catch (error) {
      console.error("Login failed", error);
    }
  };


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (event) => {
    if (emailError || passwordError) {
      event.preventDefault();
      return;
    }
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
  };

  const validateInputs = async () => {
    var isValid = true;

    if (email == null || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    if (password == null || password.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 5 characters long.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }
      if (isValid) {
        try {
          const auth = await getAuth();
          var result = signInWithEmailAndPassword(auth, email, password);
          var user = (await result).user;
          var idToken = await user.getIdToken();

          console.log("User Info:", user);
          console.log("ID Token:", idToken);
          fetch('http://localhost:8080/public/api/users/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${idToken}`,
            },
          })
              .then(response => response.json())
              .then(data => {
                localStorage.clear();
                console.log(data.payload);
                localStorage.setItem('userID',JSON.stringify(data.payload.id));
                localStorage.setItem('isAdmin',JSON.stringify((data.payload.isAdmin)));
                console.log("Backend Response:", data)
                navigate("/");
              })
              .catch(error => console.error("Error:", error));
        } catch (e) {
          console.log(e);
        }
      }
  };

  return (
      <SignInContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          {/* <SitemarkIcon /> */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, color: '#379d7d' }} />
            <Typography variant="h4" sx={{ color: '#379d7d' }}>
                PrePics
            </Typography>
        </Box>
          <Typography
            component="h1"
            variant="h1"
            sx={{ width: '5%', fontSize: 'clamp(2rem, 5vw, 2.15rem)' }}
          >
            Đăng nhập
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              gap: 2,
            }}
          >
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                error={emailError}
                helperText={emailErrorMessage}
                id="email"
                type="email"
                name="email"
                placeholder="your@email.com"
                autoComplete="email"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={emailError ? 'error' : 'primary'}
                sx={{ ariaLabel: 'email' }}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <FormLabel htmlFor="password">Mật Khẩu</FormLabel>
                <Link
                  component="button"
                  type="button"
                  onClick={handleClickOpen}
                  variant="body2"
                  sx={{ alignSelf: 'baseline' }}
                >
                 Quên Mật Khẩu?
                </Link>
              </Box>
              <TextField
                error={passwordError}
                helperText={passwordErrorMessage}
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="current-password"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={passwordError ? 'error' : 'primary'}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Luu mat khau"
            />
            <ForgotPassword open={open} handleClose={handleClose} />
            <Button
              // type="submit"
              fullWidth
              variant="contained"
              onClick={validateInputs}
            >
              Đăng nhập
            </Button>
            <Typography sx={{ textAlign: 'center' }}>
              Bạn chưa có tài khoản ?{' '}
              <span>
                <Link
                  href={"/SignUp"}
                  variant="body2"
                  sx={{ alignSelf: 'center' }}
                >
                  Đăng ký
                </Link>
              </span>
            </Typography>
          </Box>
          <Divider>hoặc</Divider>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={handleLogin}
              startIcon={<GoogleIcon />}
            >
              Đăng nhập bằng Google
            </Button>
          </Box>
        </Card>
      </SignInContainer>
  );
}