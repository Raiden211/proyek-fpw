import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import {
  useLoaderData,
  useFetcher,
  redirect,
  useNavigate,
} from "react-router-dom";
import {
  Box,
  TextField,
  Typography,
  MenuItem,
  Button,
  Select,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Avatar,
  IconButton,
  Tooltip,
  Grid,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import client from "../../connection";
import { getCookie } from "../../controller/cookieSetter";

const AdminBarang = () => {
  const [fileName, setFileName] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const data = useLoaderData();
  const fetcher = useFetcher();
  const navigate = useNavigate();

  const schema = Joi.object({
    nama: Joi.string().required().messages({
      "string.empty": "Nama is required",
    }),
    image: Joi.any().required().messages({
      "any.required": "Image is required",
    }),
    deskripsi: Joi.string().min(15).required().messages({
      "string.empty": "Deskripsi is required",
      "string.min": "Deskripsi harus memiliki minimal 15 karakter",
    }),
    id_jenis: Joi.number().required().messages({
      "number.empty": "Jenis is required",
    }),
    stok: Joi.number().min(5).required().messages({
      "number.empty": "Stok is required",
      "number.min": "Stok harus minimal 5",
    }),
    harga: Joi.number().min(1000).required().messages({
      "number.empty": "Harga is required",
      "number.min": "Harga harus minimal 1000",
    }),
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: joiResolver(schema),
  });

  const addData = (formData) => {
    const dataToSend = new FormData();

    for (const [key, value] of Object.entries(formData)) {
      dataToSend.append(key, value);
    }

    fetcher.submit(dataToSend, {
      method: "post",
      action: "/admin/barang",
      encType: "multipart/form-data",
    });
    reset();
  };

  const handleOpenConfirmPopup = (id) => {
    setSelectedId(id);
    setShowConfirmPopup(true);
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    const authData = getCookie("authData");

    if (!authData) {
      throw new Error("Authentication data not found in cookies.");
    }

    const { token } = JSON.parse(authData);

    try {
      const response = await client.delete(`/admin/barang/${selectedId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data) {
        alert("Barang ini telah dihapus");
        setShowConfirmPopup(false);
        setSelectedId(null);
        window.location.reload();
      }
    } catch (error) {
      alert(error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setValue("image", file, { shouldValidate: true });
    }
  };

  return (
    <Box
      sx={{
        pt: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
        bgcolor: "#e3f2fd",
        px: 4,
      }}
    >
      {/* Form Section */}
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: "800px",
          p: 4,
          bgcolor: "white",
          borderRadius: 2,
          mb: 4,
        }}
      >
        <Typography variant="h5" align="center" mb={4}>
          Add Barang
        </Typography>
        <form onSubmit={handleSubmit(addData)}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Nama Barang"
                fullWidth
                {...register("nama")}
                error={!!errors.nama}
                helperText={errors.nama?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <input
                  type="file"
                  accept="image/*"
                  id="image-upload"
                  {...register("image")}
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
                <label htmlFor="image-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    color="primary"
                    startIcon={<CloudUploadIcon />}
                  >
                    Upload Image
                  </Button>
                </label>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {fileName || "No file selected"}
                </Typography>
                {errors.image && (
                  <Typography color="error" variant="caption">
                    {errors.image.message}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Deskripsi"
                multiline
                rows={4}
                fullWidth
                {...register("deskripsi")}
                error={!!errors.deskripsi}
                helperText={errors.deskripsi?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Jenis</InputLabel>
                <Select {...register("id_jenis")} defaultValue="">
                  {data.jenis.map((jenis) => (
                    <MenuItem key={jenis.id} value={jenis.id}>
                      {jenis.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.id_jenis && (
                  <Typography color="error" variant="caption">
                    {errors.id_jenis.message}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Stok"
                type="number"
                fullWidth
                {...register("stok")}
                error={!!errors.stok}
                helperText={errors.stok?.message}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Harga Satuan"
                type="number"
                fullWidth
                {...register("harga")}
                error={!!errors.harga}
                helperText={errors.harga?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Save
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* Data Grid Section */}
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: "1200px",
          bgcolor: "white",
          borderRadius: 2,
          p: 4,
          overflowX: "auto",
        }}
      >
        <Typography variant="h5" align="center" mb={4}>
          Barang List
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nama</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Deskripsi</TableCell>
                <TableCell>Jenis</TableCell>
                <TableCell>Stok</TableCell>
                <TableCell>Harga</TableCell>
                <TableCell>Aksi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.barang.map((barang, idx) => (
                <TableRow key={barang.id}>
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell>{barang.nama}</TableCell>
                  <TableCell>
                    <Avatar
                      src={barang.image}
                      alt={barang.nama}
                      sx={{ width: 50, height: 50 }}
                    />
                  </TableCell>
                  <TableCell>{barang.deskripsi}</TableCell>
                  <TableCell>{barang.jenis || "Tidak ada jenis"}</TableCell>
                  <TableCell>{barang.stok}</TableCell>
                  <TableCell>{barang.harga}</TableCell>
                  <TableCell>
                    <Tooltip title="Edit">
                      <IconButton
                        color="primary"
                        onClick={() =>
                          navigate(`/admin/barang/${barang.id}/edit`)
                        }
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        color="error"
                        onClick={() => handleOpenConfirmPopup(barang.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Confirmation Popup */}
      <Dialog
        open={showConfirmPopup}
        onClose={() => setShowConfirmPopup(false)}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <DialogTitle id="confirm-dialog-title">Konfirmasi Hapus</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-dialog-description">
            Apakah Anda yakin ingin menghapus barang dengan ID {selectedId}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDelete} color="error" variant="contained">
            Iya
          </Button>
          <Button
            onClick={() => setShowConfirmPopup(false)}
            color="primary"
            variant="contained"
            autoFocus
          >
            Tidak
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminBarang;
