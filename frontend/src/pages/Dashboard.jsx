import { Box, Typography, Paper, Button, Grid, Card, CardContent, CardActions } from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import { setView } from '../store/uiSlice'
import AddIcon from '@mui/icons-material/Add'
import styled from 'styled-components'

const DashboardContainer = styled(Box)`
  padding: 2rem;
`

const WelcomeCard = styled(Paper)`
  padding: 2rem;
  background: linear-gradient(135deg, #2E5D4B 0%, #A0522D 100%);
  color: white;
  margin-bottom: 2rem;
`

const StatCard = styled(Card)`
  height: 100%;
`

function Dashboard() {
  const dispatch = useDispatch()
  const equipment = useSelector((state) => state.equipment.equipment)
  const presets = useSelector((state) => state.presets.presets)

  const equipmentCount = Object.keys(equipment).length
  const presetsCount = Object.keys(presets).length

  return (
    <DashboardContainer>
      <WelcomeCard elevation={3}>
        <Typography variant="h4" gutterBottom>
          Welcome to SynthMem
        </Typography>
        <Typography variant="body1" paragraph>
          Manage your synthesizer equipment, create presets, and organize your sound library.
        </Typography>
      </WelcomeCard>

      <Grid container spacing={3} sx={{ marginBottom: '2rem' }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Equipment Defined
              </Typography>
              <Typography variant="h4">
                {equipmentCount}
              </Typography>
            </CardContent>
          </StatCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Presets Saved
              </Typography>
              <Typography variant="h4">
                {presetsCount}
              </Typography>
            </CardContent>
          </StatCard>
        </Grid>
      </Grid>

      <Typography variant="h5" gutterBottom sx={{ marginTop: '2rem' }}>
        Quick Actions
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => dispatch(setView('equipment-builder'))}
          >
            Define Equipment
          </Button>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Button
            fullWidth
            variant="contained"
            color="secondary"
            startIcon={<AddIcon />}
            onClick={() => dispatch(setView('preset-manager'))}
          >
            Create Preset
          </Button>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Button
            fullWidth
            variant="outlined"
            color="primary"
            onClick={() => dispatch(setView('search'))}
          >
            Search & Browse
          </Button>
        </Grid>
      </Grid>
    </DashboardContainer>
  )
}

export default Dashboard

