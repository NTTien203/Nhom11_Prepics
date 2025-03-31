import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import AdbIcon from '@mui/icons-material/Adb';
import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth";
import { GoogleIcon, FacebookIcon, SitemarkIcon } from '../sign-up/CustomIcons';
import {useNavigate} from "react-router-dom";


const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: {
    width: '450px',
  },
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
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

export default function SignUp(props) {
  const navigate = useNavigate();
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [nameError, setNameError] = React.useState(false);
  const [nameErrorMessage, setNameErrorMessage] = React.useState('');

  const validateInputs = async () => {

    let isValid = true;

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
      setPasswordErrorMessage('Password must be at least 6 characters long.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    if (name == null || name.length < 1) {
      setNameError(true);
      setNameErrorMessage('Name is required.');
      isValid = false;
    } else {
      setNameError(false);
      setNameErrorMessage('');
    }

   if (isValid) {
     try {
       const auth = await getAuth();
       var result = await createUserWithEmailAndPassword(auth, email, password);
       var user = result.user;
       var idToken = await user.getIdToken();

       console.log("User Info:", user);
       console.log("ID Token:", idToken);
       fetch(`http://localhost:8080/public/api/users/register?fullName=${name}`, {
         method: 'POST',
         headers: {
           // 'Content-Type': 'application/json',
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

  const handleSubmit = (event) => {
    if (nameError || emailError || passwordError) {
      event.preventDefault();
      return;
    }
    const data = new FormData(event.currentTarget);
    console.log({
      name: data.get('name'),
      lastName: data.get('lastName'),
      email: data.get('email'),
      password: data.get('password'),
    });
  };

  return (
      <SignUpContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, color: '#379d7d' }} />
            <Typography variant="h4" sx={{ color: '#379d7d' }}>
                PrePics
            </Typography>
        </Box>
          <Typography
           component="h1"
           variant="h1"
           sx={{ width: '50%', fontSize: 'clamp(2rem, 5vw, 2.15rem)' }}
          >
            Đăng ký
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <FormControl>
              <FormLabel htmlFor="name">Họ và tên</FormLabel>
              <TextField
                autoComplete="name"
                name="name"
                required
                fullWidth
                id="name"
                placeholder="Pham Khac"
                error={nameError}
                helperText={nameErrorMessage}
                color={nameError ? 'error' : 'primary'}
                onChange={(e) => setName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                required
                fullWidth
                id="email"
                placeholder="your@email.com"
                name="email"
                autoComplete="email"
                variant="outlined"
                error={emailError}
                helperText={emailErrorMessage}
                color={passwordError ? 'error' : 'primary'}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Mật Khẩu</FormLabel>
              <TextField
                required
                fullWidth
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="new-password"
                variant="outlined"
                error={passwordError}
                helperText={passwordErrorMessage}
                color={passwordError ? 'error' : 'primary'}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
            <Button
              // type="submit"
              fullWidth
              variant="contained"
              onClick={validateInputs}
            >
             Đăng Ký
            </Button>
            <Typography sx={{ textAlign: 'center' }}>
                Bạn đã có tài khoản?{' '}
              <span>
                <Link
                  href={"/Login"}
                  variant="body2"
                  sx={{ alignSelf: 'center' }}
                >
                  Đăng nhập
                </Link>
              </span>
            </Typography>
          </Box>
          <Divider>
            <Typography sx={{ color: 'text.secondary' }}>or</Typography>
          </Divider>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => alert('Sign up with Google')}
              startIcon={<GoogleIcon />}
            >
              Đăng Ký Bằng Google
            </Button>
          </Box>
        </Card>
      </SignUpContainer>
  );
}