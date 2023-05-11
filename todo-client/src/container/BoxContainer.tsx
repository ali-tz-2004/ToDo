import { Button, Checkbox, Grid, IconButton, TextField, styled } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { FormEvent, useEffect, useState } from "react";
import { v4 } from "uuid";
import axios from "axios";
import { toast } from "react-toastify";
import Popup from "../components/Popup";

interface ITodo {
    id: string,
    name: string,
    isComplete: boolean
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
    height: "100%",
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

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

export const BoxContainer = () => {
    const [todos, setTodos] = useState<ITodo[]>([]);
    const [editTodoIndex, setEditTodoIndex] = useState<number>();
    const [newTodo, setNewTodo] = useState("");
    const [selectedTodo, setSelectedTodo] = useState<ITodo>();
    const showDeletePopup = selectedTodo !== undefined;
    const isEdit = editTodoIndex !== undefined;

    const API_URL = 'http://localhost:5147/todoItems';

    const getTodoList = async (): Promise<ITodo[]> => {
        reset();
        const response = await axios.get(API_URL);
        setTodos(response.data);
        return response.data;
    };

    const reset = () => {
        setNewTodo("")
        setEditTodoIndex(undefined);
    }

    const addHandler = async (e: FormEvent) => {
        e.preventDefault();

        if (!newTodo) {
            toast.warning("Please enter a value");
            return;
        }

        const newTodoItem: ITodo = { id: v4(), name: newTodo, isComplete: false };
        const response = await axios.post(API_URL, newTodoItem);

        await getTodoList();
        return response.data;
    }

    const removeHandler = async (todo: ITodo) => {
        setSelectedTodo(todo);
    }

    const editHandler = async (e: FormEvent) => {
        e.preventDefault();
        let temp = [...todos];
        if (editTodoIndex != undefined) {
            temp[editTodoIndex].name = newTodo;

            const response = await axios.put(`${API_URL}/${temp[editTodoIndex].id}`, temp[editTodoIndex])
            await getTodoList();
            return response.data;
        }
    }

    const clickEdit = (todo: ITodo, i: number) => {
        setEditTodoIndex(i);
        setNewTodo(todo.name);
    }

    const completeHandler = async (index: number) => {
        const temp = [...todos];

        temp[index].isComplete = !temp[index].isComplete
        const response = await axios.put(`${API_URL}/${temp[index].id}/complete`, temp[index])
        await getTodoList();
        return response.data;
    }

    const deletePopupOnSubmit = async () => {
        await axios.delete(`${API_URL}/${selectedTodo?.id}`);
        setSelectedTodo(undefined);
        await getTodoList();
    }

    const deletePopupOnCancel = () => {
        setSelectedTodo(undefined);
    };

    useEffect(() => {
        getTodoList();
    }, []);

    return (
        <>
            <From onSubmit={isEdit ? editHandler : addHandler}>
                <Grid container spacing={2}>
                    <Grid xs={10}>
                        <Item>
                            <TextField label={isEdit ? "edit todo" : "new todo"} value={newTodo} onChange={x => setNewTodo(x.target.value)} fullWidth size="small" />
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
                                <Item><Checkbox {...label} defaultChecked onChange={() => completeHandler(i)} checked={x.isComplete} />{x.name}</Item>
                                <Item>
                                    <IconButton color="secondary" onClick={() => clickEdit(x, i)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton color="warning" onClick={() => removeHandler(x)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Item>
                            </Div>
                        ))}
                        <Popup
                            title="delete"
                            buttonColor="warning"
                            content="are you sure?"
                            visible={showDeletePopup}
                            onCancel={deletePopupOnCancel}
                            onSubmit={deletePopupOnSubmit}
                        />
                    </Grid>
                </Grid >
            </From >
        </>
    );
}
