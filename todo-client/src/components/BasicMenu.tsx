import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from 'react-router-dom';

interface IMenu {
    title: string;
    children: string[];
}

export const BasicMenu = (props: IMenu) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const navigate = useNavigate();

    const reset = async () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
    }

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = async (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(null);
        const clickedItem = (event.target as HTMLElement).getAttribute("data-value");

        switch (clickedItem) {
            case "back home":
                navigate("/");
                break;
            case "logout":
                reset();
                navigate("/");
                break;
        }
    };

    return (
        <div>
            <Button
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
            >
                {props.title}
            </Button>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                {props.children.map((x) => (
                    <MenuItem key={x} onClick={handleClose} data-value={x}>
                        {x}
                    </MenuItem>
                ))}
            </Menu>
        </div>
    );
};