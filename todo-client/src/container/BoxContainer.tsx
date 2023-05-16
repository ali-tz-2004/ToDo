import { Button, Checkbox, Grid, IconButton, TextField, styled } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { FormEvent, useEffect, useState } from "react";
import { v4 } from "uuid";
import axios from "axios";
import { toast } from "react-toastify";
import Popup from "../components/Popup";
import { CustomizedAccordions } from "../components/CustomizedAccordions";

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
    const [selectedTodo, setSelectedTodo] = useState<ITodo>();
    const [isCompleteTodos, setIsCompleteTodos] = useState<ITodo[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [deleteId, setDeleteId] = useState<string>();

    const showDeletePopup = deleteId !== undefined;
    const isEdit = selectedTodo !== undefined;
    const API_URL = 'http://localhost:5147/api/Todo';

    const getTodoList = async (): Promise<[ITodo[], ITodo[]]> => {
        reset();

        const response = await axios.get(API_URL);
        const responseComplete = await axios.get(`${API_URL}/complete`);

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

        const newTodoItem: ITodo = { id: v4(), name: inputValue, isComplete: false };
        const response = await axios.post(API_URL, newTodoItem);

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

            // const response = await axios.put(`${API_URL}/${selectedTodo.id}`, selectedTodo)
            const response = await axios.put(`${API_URL}`, selectedTodo)
            await getTodoList();
            return response.data;
        }
    }

    const clickEdit = (todo: ITodo, i: number) => {
        setSelectedTodo(todo)
        setInputValue(todo.name);
    }

    const completeHandler = async (todo: ITodo, index: number) => {
        const temp = todo.isComplete ? [...isCompleteTodos] : [...todos];

        temp[index].isComplete = !temp[index].isComplete;

        const response = await axios.put(`${API_URL}/${temp[index].id}/complete`, temp[index])
        await getTodoList();

        return response.data;
    }

    const deletePopupOnSubmit = async () => {
        await axios.delete(`${API_URL}/${deleteId}`);
        setDeleteId(undefined);
        await getTodoList();
    }

    const deletePopupOnCancel = () => {
        setDeleteId(undefined);
    };

    useEffect(() => {
        getTodoList();
    }, []);

    return (
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
                                <IconButton color="secondary" onClick={() => clickEdit(x, i)}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton color="warning" onClick={() => deleteHandler(x.id)}>
                                    <DeleteIcon />
                                </IconButton>
                            </Item>
                        </Div>
                    ))}
                </Grid>
                <Grid xs={12}>
                    <CustomizedAccordions title="tasks complete">
                        {isCompleteTodos.map((x, i) => (
                            <Div key={x.id}>
                                <Item><Checkbox {...label} defaultChecked onChange={() => completeHandler(x, i)} checked={x.isComplete} />{x.name}</Item>
                                <Item>
                                    <IconButton color="secondary" onClick={() => clickEdit(x, i)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton color="warning" onClick={() => deleteHandler(x.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Item>
                            </Div>
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
    );
}
