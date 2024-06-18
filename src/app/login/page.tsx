import React from "react";
import { Container, Paper, Box } from "@mui/material";
import LoginForm from "@/components/admin/login/LoginForm";
import LogoSection from "@/components/admin/login/LogoSection";

const LoginPage: React.FC = () => {
  return (
    <Container
      sx={{
        mt: 3,
        maxWidth: {
          xs: 450,
          sm: 550,
          md: 750,
          lg: 950,
          xl: 1050,
        },
        height: "95vh",
      }}
    >
      <Paper
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "column", md: "row" },
          borderRadius: 8,
          boxShadow: "0 2px 4px rgba(0, 0, 0)",
          textAlign: "center",
          height: "94%",
        }}
      >
        <LogoSection />
        <LoginForm />
      </Paper>
    </Container>
  );
};

export default LoginPage;
