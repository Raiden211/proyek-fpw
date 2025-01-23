import React, { useState } from 'react';
import { useNavigate, useLoaderData, useFetcher, useParams, redirect } from 'react-router-dom';
import {
    Box,
    Button,
    CssBaseline,
    Typography,
    IconButton,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Add, Remove } from '@mui/icons-material';
import darkTheme from './layout/Background';

const Details = () => {
    const { id } = useParams();
    const data = useLoaderData();
    const navigate = useNavigate();
    const [quantity, setQuantity] = useState(1);

    console.log(id);
    console.log(data);
    // Calculate subtotal based on quantity and price
    const subtotal = quantity * data.harga;

    const handleIncrease = () => {
        if (quantity < data.stok) {
            setQuantity(quantity + 1);
        }
    };

    const handleDecrease = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const handleAddToCart = () => {
        const formData = new FormData();
        formData.append('id_barang', data.id);
        formData.append('jumlah', quantity);
    
        alert("Silahkan login dulu :v");
        navigate("/login");
    };

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh',
                    gap: 2,
                    px: 3,
                }}
            >
                {/* Image and details in the center */}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        border: '1px solid black',
                        borderRadius: 2,
                        padding: 3,
                        textAlign: 'center',
                    }}
                >
                    {/* Image */}
                    <Box
                        component="img"
                        src={data.image}
                        alt={data.nama}
                        sx={{
                            height: 'auto',
                            aspectRatio: '4/3',
                            width: '100%',
                            maxWidth: 400,
                            borderRadius: 2,
                            objectFit: 'contain',
                        }}
                    />

                    {/* Details below the image */}
                    <Box
                        sx={{
                            textAlign: 'center',
                            mt: 2,
                            border: '1px solid gray',
                            borderRadius: 2,
                            padding: 2,
                        }}
                    >
                        <Typography variant="h5" fontWeight="bold">
                            {data.nama}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" mt={1}>
                            {data.deskripsi}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" mt={1}>
                            Jenis: {data.jenis}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" mt={1}>
                            Rp. {data.harga}
                        </Typography>
                    </Box>
                </Box>

                {/* Controls on the right */}
                <Box
                    sx={{
                        width: 400,
                        height: 300,
                        border: '1px solid black',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        p: 3,
                    }}
                >
                    <Typography variant="h6" component="div" fontWeight="bold">
                        Atur jumlah dan catatan
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mt={2}>
                        Stok Total: {data.stok < 5 ? (
                            <span style={{ color: 'red' }}>Sisa {data.stok}</span>
                        ) : (
                            <span style={{ color: '#26b617' }}>{data.stok}</span>
                        )}
                    </Typography>
                    <Box
                        sx={{
                            mt: 2,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                        }}
                    >
                        <IconButton
                            color="primary"
                            onClick={handleDecrease}
                            disabled={quantity <= 1}
                        >
                            <Remove />
                        </IconButton>
                        <Typography variant="h6">{quantity}</Typography>
                        <IconButton
                            color="primary"
                            onClick={handleIncrease}
                            disabled={quantity >= data.stok}
                        >
                            <Add />
                        </IconButton>
                    </Box>
                    <Typography variant="h6" mt={2}>
                        Subtotal
                    </Typography>
                    <Typography variant="h5" fontWeight="bold">
                        Rp. {subtotal.toLocaleString('id-ID')}
                    </Typography>
                    <Box sx={{ mt: 3, display: 'flex', gap: 3, justifyContent: 'center' }}>
                        <Button
                            variant="contained"
                            color="success"
                            onClick={handleAddToCart}
                        >
                            + Keranjang
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => navigate('/')}
                        >
                            Back to Home
                        </Button>
                    </Box>
                </Box>
            </Box>
        </ThemeProvider>
    );
}

export default Details