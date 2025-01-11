import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Typography, Table, TableBody, TableCell, TableHead, TableRow, TableContainer, Paper } from '@mui/material';
import supabase from '../../conexionDatabase'; // Asegúrate de tener configurado Supabase
import { useUser } from '../UserContext.jsx';

const AdminUsuarios = () => {
    const { escuelaId } = useUser();
    const [carreras, setCarreras] = useState([]);
    const [newCarrera, setNewCarrera] = useState('');

    const fetchCarreras = async () => {
        const { data, error } = await supabase
            .from('carreras')
            .select('*')
            .eq('escuela_id', escuelaId);

        if (error) console.error(error);
        else setCarreras(data);
    };

    const handleAddCarrera = async () => {
        if (!newCarrera) return;

        const { error } = await supabase
            .from('carreras')
            .insert({ nombre_carrera: newCarrera, escuela_id: escuelaId });

        if (error) console.error(error);
        else {
            setNewCarrera('');
            fetchCarreras();
        }
    };

    const handleDeleteCarrera = async (id) => {
        const { error } = await supabase.from('carreras').delete().eq('id', id).eq('escuela_id', escuelaId);

        if (error) console.error(error);
        else fetchCarreras();
    };

    useEffect(() => {
        fetchCarreras();
    }, [escuelaId]);

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Gestión de Carreras
            </Typography>
            <Box display="flex" gap={2} mb={3}>
                <TextField
                    label="Nueva Carrera"
                    value={newCarrera}
                    onChange={(e) => setNewCarrera(e.target.value)}
                />
                <Button variant="contained" color="primary" onClick={handleAddCarrera}>
                    Agregar
                </Button>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {carreras.map((carrera) => (
                            <TableRow key={carrera.id}>
                                <TableCell>{carrera.id}</TableCell>
                                <TableCell>{carrera.nombre_carrera}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => handleDeleteCarrera(carrera.id)}
                                    >
                                        Eliminar
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default AdminUsuarios
