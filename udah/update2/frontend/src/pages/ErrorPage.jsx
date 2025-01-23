import { useNavigate, useRouteError } from "react-router-dom";
import { Box, Typography, Button, Stack } from "@mui/material";

const ErrorPage = ({ errorCode, message }) => {
    const routeError = useRouteError();
    const navigate = useNavigate();

    const status = errorCode || routeError?.status;
    const errorMessage = message || routeError?.message || routeError?.error?.message;
    console.log(errorMessage);

    // Check if the error message matches a session expiration error
    const isSessionExpiredError =
        errorMessage?.includes("Cannot destructure property 'username'");

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                bgcolor: "background.default",
                color: "text.primary",
                p: 4,
            }}
        >
            {/* Error Message */}
            <Typography
                variant="h4"
                component="div"
                align="center"
                sx={{
                    mb: 4,
                    color:
                        status === 401 || isSessionExpiredError
                            ? "primary.main"
                            : status === 403
                            ? "success.main"
                            : status === 404
                            ? "error.main"
                            : "text.primary",
                }}
            >
                {isSessionExpiredError
                    ? "Sesimu telah expired"
                    : status === 401
                    ? errorMessage || "Unauthorized"
                    : status === 403
                    ? errorMessage || "Forbidden"
                    : status === 404
                    ? errorMessage || "Not Found"
                    : errorMessage || "Terjadi kesalahan yang tidak terduga"}
            </Typography>

            {/* Navigation Buttons */}
            <Stack direction="column" spacing={2} alignItems="center">
                {isSessionExpiredError ? (
                    <Button
                        variant="contained"
                        color="warning"
                        onClick={() => navigate("/login")}
                        sx={{
                            px: 4,
                            py: 2,
                            fontSize: "1rem",
                        }}
                    >
                        Login Again
                    </Button>
                ) : (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate(-1)}
                        sx={{
                            px: 4,
                            py: 2,
                            fontSize: "1rem",
                        }}
                    >
                        Go Back
                    </Button>
                )}
            </Stack>
        </Box>
    );
};

export default ErrorPage;