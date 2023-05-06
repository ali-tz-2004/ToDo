import { Button, Grid, IconButton, TextField, styled } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect, useState } from "react";
import { v4 } from "uuid";

interface ITodo {
    id: string,
    title: string
}

const Item = styled('div')(({ theme }) => ({
    padding: theme.spacing(1),
    textAlign: 'center',
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
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

export const BoxContainer = () => {
    const storedItems = localStorage.getItem('items');
    const [todos, setTodos] = useState<ITodo[]>(() =>
        storedItems !== null ? JSON.parse(storedItems) : []
    );
    const [editTodoIndex, setEditTodoIndex] = useState<number>();
    const [newTodo, setNewTodo] = useState("");
    const isEdit = editTodoIndex !== undefined;

    const reset = () => {
        setNewTodo("")
        setEditTodoIndex(undefined);
    }

    const addHandler = () => {
        setTodos([...todos, { id: v4(), title: newTodo }]);
        reset();
    }

    const removeHandler = (id: string) => {
        let temp = [...todos];
        const index = temp.findIndex((x) => x.id == id);
        temp.splice(index, 1);
        setTodos(temp);
    }

    const editHandler = () => {
        let temp = [...todos];
        if (editTodoIndex != undefined)
            temp[editTodoIndex].title = newTodo;
        setTodos(temp);
        reset();
    }

    const clickEdit = (todo: ITodo, i: number) => {
        setEditTodoIndex(i);
        setNewTodo(todo.title);
    }

    useEffect(() => {
        localStorage.setItem('items', JSON.stringify(todos));
    }, [todos]);

    return (
        <Grid container spacing={2}>
            <Grid xs={10}>
                <Item>
                    <TextField label="New Todo" value={newTodo} onChange={x => setNewTodo(x.target.value)} fullWidth size="small" />
                </Item>
            </Grid>
            <Grid xs={2}>
                <Item>
                    <Button value="Submit" variant="contained" color="success" onClick={isEdit ? editHandler : addHandler}>
                        {isEdit ? "edit" : "add"}
                    </Button>
                </Item>
            </Grid>
            <Grid xs={12}>
                {todos.map((x, i) => (
                    <Div key={x.id}>
                        <Item>{x.title}</Item>
                        <Item>
                            <IconButton color="secondary" onClick={() => clickEdit(x, i)}>
                                <EditIcon />
                            </IconButton>
                            <IconButton color="warning" onClick={() => removeHandler(x.id)}>
                                <DeleteIcon />
                            </IconButton>
                        </Item>
                    </Div>
                ))}
            </Grid>
        </Grid >
    );
}