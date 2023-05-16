import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, makeStyles } from '@mui/material';

interface IPopupWarning {
    title: string;
    content: string;
    visible: boolean;
    onSubmit: () => void;
    onCancel: () => void;
}

const Popup = (props: IPopupWarning) => {
    return (
        <Dialog open={props.visible} onClose={props.onCancel}>
            <DialogTitle>{props.title}</DialogTitle>
            <DialogContent>
                <p>{props.content}</p>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onCancel} color="warning">NO</Button>
                <Button onClick={props.onSubmit} color="success">YES</Button>
            </DialogActions>
        </Dialog>
    );
};

export default Popup;