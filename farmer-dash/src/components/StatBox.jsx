import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";
import ProgressCircle from "./ProgressCircle";

const StatBox = ({ title, subtitle, icon, progress, increase }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box
      bgcolor={colors.primary[400]}
      p={2}
      borderRadius="10px"
      width="100%"
      height="100%"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" flexDirection="column">
          {icon}
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{ color: colors.grey[100], mt: 1 }}
          >
            {title}
          </Typography>
        </Box>
        <ProgressCircle progress={progress} size="40" />
      </Box>

      <Box display="flex" justifyContent="space-between" mt={2}>
        <Typography
          variant="h6"
          sx={{ color: colors.greenAccent[500], fontWeight: 500 }}
        >
          {subtitle}
        </Typography>
        <Typography
          variant="h6"
          fontStyle="italic"
          sx={{ color: colors.greenAccent[600], fontWeight: 500 }}
        >
          {increase}
        </Typography>
      </Box>
    </Box>
  );
};

export default StatBox;
