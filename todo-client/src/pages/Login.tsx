import { Avatar, Button, Grid, Link, TextField, Typography, styled } from '@mui/material';
import { FormEvent, useEffect, useState } from 'react';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { urls } from '../utils/urls';

interface IToken {
    token: string
}

const AvatarStyled = styled(Avatar)(() => ({
    backgroundColor: "red",
    margin: 2
}));

const Form = styled("form")(() => ({
    width: '100%',
    marginTop: 2,
    background: "#dbdada",
    display: 'flex',
    flexDirection: 'column',
    alignItems: "center",
    padding: 20,
}));

const SubmitButton = styled(Button)(() => ({
    margin: "10px 0",
}));

export default function Login() {
    const [emailOrUsername, setEmailOrUsername] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        try {
            const response = await axios.post<IToken>(urls.identity, {
                username: emailOrUsername,
                password: password
            });

            if (response.data && response.data.token) {
                localStorage.setItem("token", JSON.stringify(response.data.token));
                navigate("/todo");
            } else {
                toast.warning("The email or password is wrong");
            }
        } catch (error) {
            console.error(error);
            toast.warning("The email or password is wrong");
        }
    };

    useEffect(() => {
        const savedUsername = localStorage.getItem('token');
        if (savedUsername) navigate('/');
    }, [navigate]);

    useEffect(() => {
        if (emailOrUsername) localStorage.setItem('username', emailOrUsername);
    }, [emailOrUsername])

    return (
        <Form method='post' onSubmit={handleSubmit}>
            <AvatarStyled>
                <LockOpenIcon />
            </AvatarStyled>
            <Typography component="h1" variant="h5">
                Login
            </Typography>
            <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email or user"
                type='text'
                name="email"
                autoComplete="email"
                autoFocus
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
            />
            <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <SubmitButton
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
            >
                Sign In
            </SubmitButton>
            <Grid container>
                <Grid item xs>
                    <Link href="#" variant="body2">
                        Forgot password?
                    </Link>
                </Grid>
                <Grid item>
                    <Link href="/register" variant="body2">
                        {"Don't have an account? Sign Up"}
                    </Link>
                </Grid>
            </Grid>
        </Form>
    );
}