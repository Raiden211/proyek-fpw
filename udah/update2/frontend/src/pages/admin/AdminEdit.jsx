import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import {
  useNavigate,
  useParams,
  useLoaderData,
  useFetcher,
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
  Paper,
  Grid,
  Avatar,
  IconButton,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const AdminEdit = () => {
  const { id } = useParams();
  const data = useLoaderData();
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const [fileName, setFileName] = useState("");

  const schema = Joi.object({
    nama: Joi.string().required().messages({
      "string.empty": "Nama is required",
    }),
    image: Joi.any().messages({
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
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: data.barang,
    resolver: joiResolver(schema),
  });

  // Set default value for id_jenis when data is loaded
  useEffect(() => {
    if (data.barang.id_jenis) {
      setValue("id_jenis", data.barang.id_jenis);
    }
  }, [data.barang.id_jenis, setValue]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setValue("image", file, { shouldValidate: true });
    }
  };

  const editData = (formData) => {
    const dataToSend = new FormData();

    for (const [key, value] of Object.entries(formData)) {
      dataToSend.append(key, value);
    }

    fetcher.submit(dataToSend, {
      method: "put",
      action: `/admin/barang/${id}/edit`,
      encType: "multipart/form-data",
    });
  };

  if (!data.barang) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box
      sx={{
        pt: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
        bgcolor: "#e3f2fd", // Light blue-gray background
        px: 4,
      }}
    >
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
          Edit Barang
        </Typography>
        <form onSubmit={handleSubmit(editData)}>
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
                <Select
                  {...register("id_jenis")}
                  error={!!errors.id_jenis}
                  value={watch("id_jenis") || ""}
                  onChange={(e) => setValue("id_jenis", e.target.value)}
                >
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
                sx={{ mt: 2 }}
              >
                Save
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="error"
                fullWidth
                onClick={() => navigate("/admin/barang")}
                sx={{ mt: 2 }}
              >
                Back
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default AdminEdit;
