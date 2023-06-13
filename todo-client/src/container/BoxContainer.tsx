import { Button, Checkbox, Grid, IconButton, TextField, styled } from "@mui/material";
import { FormEvent, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Popup from "../components/Popup";
import { CustomizedAccordions } from "../components/CustomizedAccordions";
import { useNavigate } from "react-router-dom";
import { BasicMenu } from "../components/BasicMenu";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { urls } from "../utils/urls";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import React from "react";

interface ITodo {
    id: string,
    name: string,
    isComplete: boolean,
    userId: string,
    username: string,
}

interface IRequestTodo {
    name: string,
    isComplete: boolean
}

interface IUser {
    id: string,
    username: string,
    email: string,
}

const Item = styled('div')(({ theme }) => ({
    padding: theme.spacing(1),
    textAlign: 'center',
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
}));

const From = styled('form')(() => ({
    width: "100%",
    marginTop: 10
}));

const Div = styled('div')(() => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#dbdada",
    borderRadius: 10,
    paddingLeft: 10,
    marginLeft: 7,
    marginBottom: 10,
}));

const DivAccount = styled('div')(() => ({
    display: "flex",
    alignItems: "center",
    width: "100%",
}));

const IsComplete = styled('div')(() => ({
    "span": { textDecoration: "line-through", opacity: "50%" }
}))

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

export const BoxContainer = () => {
    const [todos, setTodos] = useState<ITodo[]>([]);
    const [isCompleteTodos, setIsCompleteTodos] = useState<ITodo[]>([]);
    const [selectedTodo, setSelectedTodo] = useState<ITodo>();
    const [inputValue, setInputValue] = useState("");
    const [deleteId, setDeleteId] = useState<string>();
    const [user, setUser] = useState<string>("");

    const navigate = useNavigate();

    const showDeletePopup = deleteId !== undefined;
    const isEdit = selectedTodo !== undefined;
    const options = ['Remove', 'Edit'];
    const aboutUser = ["Logout", "Back home"];

    const getUser = () => localStorage.getItem('username');

    const getTodoList = async (): Promise<[ITodo[], ITodo[]]> => {
        reset();

        const response = await axios.get<ITodo[]>(urls.todo);

        const responseComplete = await axios.get<ITodo[]>(`${urls.todo}/complete`);

        const responseUser = await axios.get<IUser[]>(urls.user, {
            headers: {
                username: getUser()
            }
        });

        setUser(responseUser.data[0].username);
        setTodos(response.data);
        setIsCompleteTodos(responseComplete.data);

        return [response.data, responseComplete.data];
    };

    const reset = () => {
        setInputValue("");
        setSelectedTodo(undefined);
    }

    const addHandler = async (e: FormEvent) => {
        e.preventDefault();

        if (!inputValue) {
            toast.warning("Please enter a value");
            return;
        }

        const newTodoItem: IRequestTodo = { name: inputValue, isComplete: false };
        const response = await axios.post(urls.todo, newTodoItem);

        await getTodoList();
        return response.data;
    }

    const deleteHandler = async (id: string) => {
        setDeleteId(id);
    }

    const editHandler = async (e: FormEvent) => {
        e.preventDefault();
        if (selectedTodo != undefined) {
            selectedTodo.name = inputValue;

            const response = await axios.put(`${urls.todo}`, selectedTodo)
            await getTodoList();
            return response.data;
        }
    }

    const clickEdit = (todo: ITodo) => {
        setSelectedTodo(todo)
        setInputValue(todo.name);
    }

    const completeHandler = async (todo: ITodo, index: number) => {
        const temp = todo.isComplete ? [...isCompleteTodos] : [...todos];

        temp[index].isComplete = !temp[index].isComplete;

        const response = await axios.put(`${urls.todo}/${temp[index].id}/complete`, temp[index])
        await getTodoList();

        return response.data;
    }

    const deletePopupOnSubmit = async () => {
        await axios.delete(`${urls.todo}/${deleteId}`);
        setDeleteId(undefined);
        await getTodoList();
    }

    const deletePopupOnCancel = () => {
        setDeleteId(undefined);
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) navigate('/login')
        getTodoList();
    }, []);

    const resetLogout = async () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
    }

    const handleClose = async (event: React.MouseEvent<HTMLElement>, todo?: ITodo, id?: string) => {
        const clickedItem = (event.target as HTMLElement).getAttribute("data-value");

        switch (clickedItem) {
            case "Back home":
                navigate("/");
                break;
            case "Logout":
                resetLogout();
                navigate("/");
                break;
            case "Remove":
                deleteHandler(id ? id : "");
                break;
            case "Edit":
                if (todo) clickEdit(todo);
                break;
        }
    };

    return (
        <>
            <DivAccount>
                <AccountBoxIcon></AccountBoxIcon>
                <BasicMenu title={user} children={aboutUser} onClose={handleClose}></BasicMenu>
            </DivAccount >
            <From onSubmit={isEdit ? editHandler : addHandler}>
                <Grid container spacing={2}>
                    <Grid xs={10}>
                        <Item>
                            <TextField label={isEdit ? "edit todo" : "new todo"} value={inputValue} onChange={x => setInputValue(x.target.value)} fullWidth size="small" />
                        </Item>
                    </Grid>
                    <Grid xs={2}>
                        <Item>
                            <Button type="submit" variant="contained" color={isEdit ? "secondary" : "success"}>
                                {isEdit ? "edit" : "add"}
                            </Button>
                        </Item>
                    </Grid>
                    <Grid xs={12}>
                        {todos.map((x, i) => (
                            <Div key={x.id}>
                                <Item><Checkbox {...label} defaultChecked onChange={() => completeHandler(x, i)} checked={x.isComplete} />{x.name}</Item>
                                <Item>
                                    <BasicMenu title={<MoreVertIcon />} children={options} onClose={(e) => handleClose(e, x, x.id)}></BasicMenu>
                                </Item>
                            </Div>
                        ))}
                    </Grid>
                    <Grid xs={12}>
                        <CustomizedAccordions title="tasks complete">
                            {isCompleteTodos.map((x, i) => (
                                <IsComplete key={x.id}>
                                    <Div>
                                        <Item>
                                            <Checkbox {...label} defaultChecked onChange={() => completeHandler(x, i)} checked={x.isComplete} />
                                            <span>{x.name}</span>
                                        </Item>
                                        <Item>
                                            <BasicMenu title={<MoreVertIcon />} children={options} onClose={(e) => handleClose(e, x, x.id)}></BasicMenu>
                                        </Item>
                                    </Div>
                                </IsComplete>
                            ))}
                        </CustomizedAccordions>
                    </Grid>
                </Grid>
                <Popup
                    title="delete"
                    content="are you sure?"
                    visible={showDeletePopup}
                    onCancel={deletePopupOnCancel}
                    onSubmit={deletePopupOnSubmit}
                />
            </From >
        </>
    );
}