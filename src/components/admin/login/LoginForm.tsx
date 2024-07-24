"use client";

import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  InputAdornment,
} from "@mui/material";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useProgramsContext } from "@/context/ProgramsContext";
import { setUserInLocalStorage } from "@/utils/localStorageHelpers";
import { loginUser } from "@/server-actions/userActions";

type FormData = {
  username: string;
  password: string;
};

const schema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(20, "Username must be at most 20 characters long"),
  password: z.string().min(4, "Password must be at least 4 characters long"),
});

const LoginForm: React.FC = () => {
  const { state, dispatch } = useProgramsContext();
  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const router = useRouter();

  const onSubmit: SubmitHandler<FormData> = async () => {
    const { username, password } = getValues();
    try {
      const { success, user } = await loginUser({ username, password });
      if (!success || !user) {
        setError("Invalid username or password");
        setTimeout(() => {
          setError(null);
        }, 1000);
      } else {
        setUserInLocalStorage(user, 24);
        dispatch({ type: "SET_USER", payload: user });
        setSuccess("Login successful!");
        setTimeout(() => {
          setSuccess(null);
          router.push("/dashboard");
        }, 2000);
      }
    } catch (error) {
      console.error("Login failed:", error);
      setError("An error occurred during login");
    }
  };

  const onClick = () => {
    router.push("/tvNetworks");
  };

  return (
    <Box
      sx={{
        position: "relative",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        px: "40px",
        minHeight: "44vh",
        marginBlock: { xs: "40px" },
      }}
    >
      <Typography variant="h4" fontWeight={600}>
        LOGIN
      </Typography>
      {error && (
        <Typography variant="body2" color="error" id="error" className="message">
          {error}
        </Typography>
      )}
      {success && (
        <Typography variant="body2" color="success" id="success" className="message">
          {success}
        </Typography>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="username"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Username"
              variant="outlined"
              placeholder="Username"
              fullWidth
              margin="normal"
              error={!!errors.username?.message}
              helperText={errors.username?.message ?? ""}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PermIdentityIcon />
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Password"
              type="password"
              placeholder="password"
              variant="outlined"
              fullWidth
              margin="normal"
              error={!!errors.password?.message}
              helperText={errors.password?.message ?? ""}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOpenIcon />
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{
            marginTop: 2,
            backgroundColor: "#007bff",
            "&:hover": {
              backgroundColor: "#0056b3",
            },
          }}
        >
          LOGIN
        </Button>
      </form>
      <Box
        sx={{
          display: "inline-block",
          color: "white",
          marginTop: "50px",
          bottom: 10,
          right: 45,
          backgroundColor: "#3c3e42",
          borderRadius: "5px",
          "&:hover": {
            backgroundColor: "#252b2b",
          },
        }}
      >
        <Button
          onClick={onClick}
          sx={{
            color: "white",
          }}
        >
          for customer
        </Button>
      </Box>
    </Box>
  );
};

export default LoginForm;

