import { Avatar, Button, TextField, Typography, styled } from '@mui/material';
import { FormEvent, useState } from 'react';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { urls } from '../utils/urls';

interface IUser {
    username: string;
    email: string;
    password: string;
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

export const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const newUser: IUser = { username: username, email: email, password: password };
            const response = await axios.post(urls.user, newUser);

            if (response.data) {
                toast.success("Register is success");
                navigate("/login")
            }
            return response.data;
        } catch (error) {
            toast.warning("this username or email invalid");
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            <AvatarStyled>
                <LockOpenIcon />
            </AvatarStyled>
            <Typography component="h1" variant="h5">
                Register
            </Typography>
            <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="username"
                label="username"
                type='text'
                name="username"
                autoComplete="username"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                type='email'
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
        </Form>
    )
}