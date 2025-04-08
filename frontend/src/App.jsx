import { useState } from 'react'
import { styled } from 'styled-components'
import { Button, Typography, Box, Container, Paper, createTheme, ThemeProvider } from '@mui/material'

// Define our custom theme with SynthMem colors
const theme = createTheme({
  palette: {
    primary: {
      main: '#2E5D4B', // Mid-green tone
    },
    secondary: {
      main: '#A0522D', // Burnt umber
    },
    background: {
      default: '#f8f8f8',
      paper: '#ffffff',
    },
  },
  typography: {
    h3: {
      color: '#2E5D4B',
      fontWeight: 600,
    },
    h5: {
      color: '#A0522D',
    },
  },
});

const AppContainer = styled(Container)`
  text-align: center;
  padding: 2rem;
`

const StyledPaper = styled(Paper)`
  padding: 2rem;
  margin-top: 2rem;
  border-top: 4px solid #2E5D4B;
`

const Logo = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 1rem;

  span.synth {
    color: #2E5D4B;
  }

  span.mem {
    color: #A0522D;
  }
`

function App() {
  const [count, setCount] = useState(0)

  return (
    <ThemeProvider theme={theme}>
      <AppContainer maxWidth="sm">
        <StyledPaper elevation={3}>
          <Logo>
            <span className="synth">Synth</span>
            <span className="mem">Mem</span>
          </Logo>

          <Typography variant="h5" component="h2" gutterBottom>
            Synthesizer Memory Manager
          </Typography>

          <Box sx={{ my: 4 }}>
            <Typography variant="body1" paragraph>
              This is a Progressive Web App (PWA) for managing synthesizer presets and settings.
            </Typography>

            <Typography variant="body2" paragraph>
              You clicked the button {count} times
            </Typography>

            <Button
              variant="contained"
              color="primary"
              onClick={() => setCount((count) => count + 1)}
            >
              Click me
            </Button>
          </Box>
        </StyledPaper>
      </AppContainer>
    </ThemeProvider>
  )
}

export default App
