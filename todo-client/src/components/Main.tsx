import { Button, Link, Typography, styled } from "@mui/material"
import { useEffect, useState } from "react";

const Div = styled('div')(() => ({
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    a: {
        marginTop: 10,
        width: "100%",
        button: {
            width: "100%",
        }
    }
}))

export const Main = () => {
    const [visibleLogin, setVisibleLogin] = useState<boolean>();
    const user = localStorage.getItem('username');

    useEffect(() => {
        const savedUsername = localStorage.getItem('token');
        if (savedUsername) {
            setVisibleLogin(true);
        }
        else setVisibleLogin(false);
    }, []);

    return (
        <>
            {visibleLogin ? (
                <Div>
                    <Typography variant="h3">Welcome {user ?? ""}</Typography>
                    <Link href="/todo">
                        <Button color="primary" variant="contained">
                            Go to my todo
                        </Button>
                    </Link>
                </Div>
            ) : (
                <>
                    <Typography variant="h3">Welcome To My To Do</Typography>
                    <Div>
                        <Link href="/login">
                            <Button color="primary" variant="contained">
                                Login
                            </Button>
                        </Link>
                        <Link href="/register">
                            <Button color="secondary">Register</Button>
                        </Link>
                    </Div>
                </>
            )}
        </>
    );
}