import React from "react";
import { Box, Grid2, Typography, Link } from "@mui/material";
import reactLogo from "../assets/React_logo.png";
import supabaseLogo from "../assets/supabase-logo-icon.png";
import muiLogo from "../assets/material-ui-48.png";
import linkedinLogo from "../assets/linkedin-logo.png"; // Agregá tu logo

const Footer = () => {
  const technologies = [
    { name: "React", logo: reactLogo },
    { name: "Supabase", logo: supabaseLogo },
    { name: "MUI", logo: muiLogo },
  ];

  return (
    <Box
      sx={{
        backgroundColor: "#f5f5f5",
        padding: 4,
        mt: 6,
        textAlign: "center",
      }}
    >
      <Typography variant="h6" gutterBottom>
        Desarrollado en
      </Typography>
      <Grid2 container spacing={2} justifyContent="center">
        {technologies.map((tech, index) => (
          <Grid2 item xs={6} sm={3} key={index}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                component="img"
                src={tech.logo}
                alt={tech.name}
                sx={{
                  width: 50,
                  height: 50,
                  mb: 1,
                }}
              />
              <Typography variant="body1">{tech.name}</Typography>
            </Box>
          </Grid2>
        ))}
      </Grid2>

      {/* LinkedIn Section */}
      <Box
        sx={{
          mt: 4,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Link
          href="https://www.linkedin.com/in/mariano-franco-1975-mdq/"
          target="_blank"
          rel="noopener noreferrer"
          underline="none"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <Box
            component="img"
            src={linkedinLogo}
            alt="LinkedIn"
            sx={{ width: 30, height: 30, mr: 1 }}
          />
          <Typography variant="body2" color="textSecondary">
            Mariano Franco en LinkedIn
          </Typography>
        </Link>
      </Box>
    </Box>
  );
};

export default Footer;
