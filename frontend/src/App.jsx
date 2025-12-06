import { Provider } from 'react-redux'
import { createTheme, ThemeProvider, Box, AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { styled } from 'styled-components'
import store from './store'
import Dashboard from './pages/Dashboard'
import EquipmentBuilder from './pages/EquipmentBuilder'
import PresetManager from './pages/PresetManager'
import SearchPage from './pages/SearchPage'
import Toast from './components/Toast'
import { useSelector, useDispatch } from 'react-redux'
import { setView } from './store/uiSlice'
import { useLocalStorage, saveEquipmentToStorage, savePresetsToStorage } from './hooks/useLocalStorage'
import BuildIcon from '@mui/icons-material/Build'
import SaveIcon from '@mui/icons-material/Save'
import SearchIcon from '@mui/icons-material/Search'
import HomeIcon from '@mui/icons-material/Home'
import { useEffect } from 'react'

// Define our custom theme with SynthMem colors
const theme = createTheme({
  palette: {
    primary: {
      main: '#2E5D4B',
    },
    secondary: {
      main: '#A0522D',
    },
    background: {
      default: '#f5f5f5',
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
})

const MainContent = styled(Box)`
  flex: 1;
  padding: 2rem;
`

const AppLayout = styled(Box)`
  display: flex;
  height: 100vh;
  background-color: #f5f5f5;
`

function AppContent() {
  const dispatch = useDispatch()
  const currentView = useSelector((state) => state.ui.currentView)
  const equipment = useSelector((state) => state.equipment.equipment)
  const presets = useSelector((state) => state.presets.presets)

  // Load data from localStorage on mount
  useLocalStorage()

  // Save equipment to localStorage whenever it changes
  useEffect(() => {
    saveEquipmentToStorage(equipment)
  }, [equipment])

  // Save presets to localStorage whenever they change
  useEffect(() => {
    savePresetsToStorage(presets)
  }, [presets])

  const navigationItems = [
    { label: 'Dashboard', view: 'dashboard', icon: HomeIcon },
    { label: 'Equipment Builder', view: 'equipment-builder', icon: BuildIcon },
    { label: 'Preset Manager', view: 'preset-manager', icon: SaveIcon },
    { label: 'Search', view: 'search', icon: SearchIcon },
  ]

  const renderView = () => {
    switch (currentView) {
      case 'equipment-builder':
        return <EquipmentBuilder />
      case 'preset-manager':
        return <PresetManager />
      case 'search':
        return <SearchPage />
      default:
        return <Dashboard />
    }
  }

  return (
    <AppLayout>
      <AppBar position="fixed" sx={{ zIndex: 1300 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            <span style={{ color: '#2E5D4B' }}>Synth</span>
            <span style={{ color: '#A0522D' }}>Mem</span>
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
            marginTop: '64px',
          },
        }}
      >
        <List>
          {navigationItems.map((item) => {
            const Icon = item.icon
            return (
              <ListItem key={item.view} disablePadding>
                <ListItemButton
                  selected={currentView === item.view}
                  onClick={() => dispatch(setView(item.view))}
                >
                  <ListItemIcon>
                    <Icon />
                  </ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            )
          })}
        </List>
      </Drawer>

      <MainContent sx={{ marginTop: '64px', marginLeft: '240px' }}>
        {renderView()}
      </MainContent>

      <Toast />
    </AppLayout>
  )
}

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <AppContent />
      </ThemeProvider>
    </Provider>
  )
}

export default App
