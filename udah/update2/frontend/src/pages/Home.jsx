import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import logo from '../assets/toserba.jpg';
import { useLoaderData, useNavigate } from 'react-router-dom';
import Footer from './layout/Footer';
import Navbar from './layout/Navbar';
import BarangCard from './layout/BarangCard';
import darkTheme from './layout/Background';

const Home = () => {
    const data = useLoaderData();
    const navigate = useNavigate();

    const handleNavigate = (id) => {
        navigate(`/${id}`);
    };

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <div style={{ flexGrow: 1 }}>
                <AppBar
                    position="fixed"
                    style={{ backgroundColor: '#1976d2' }}
                >
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="logo"
                            style={{ marginRight: '16px' }}
                        >
                            <img
                                src={logo}
                                alt="Toserba Logo"
                                style={{
                                    width: 50,
                                    height: 50,
                                    borderRadius: '50%',
                                }}
                            />
                        </IconButton>
                        <Typography variant="h6" style={{ flexGrow: 1 }}>
                            Toko Pandan Sari
                        </Typography>
                        <Button color="inherit" onClick={() => navigate("/login")}>Masuk</Button>
                        <Button color="inherit" onClick={() => navigate("/register")}>Daftar</Button>
                    </Toolbar>
                </AppBar>
            </div>

            <div
                style={{
                    minHeight: '80vh',
                    backgroundColor: darkTheme.palette.background.default,
                    color: darkTheme.palette.text.primary,
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '20px',
                    padding: '24px',
                    marginTop: '64px',
                }}
            >
                {data.map((item) => (
                    <BarangCard key={item.id} item={item} onNavigate={handleNavigate} />
                ))}
            </div>
            <Footer />
        </ThemeProvider>
    );
};

export default Home;