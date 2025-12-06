import { Box, Typography, Paper, TextField, Grid, Card, CardContent, CardActions, Button, Chip, Stack } from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import { useState, useMemo } from 'react'
import { setSearchQuery, addFilterTag, removeFilterTag } from '../store/uiSlice'
import SearchIcon from '@mui/icons-material/Search'
import styled from 'styled-components'

const SearchContainer = styled(Box)`
  padding: 2rem;
`

const SearchBar = styled(Paper)`
  padding: 2rem;
  margin-bottom: 2rem;
  background: linear-gradient(135deg, #2E5D4B 0%, #A0522D 100%);
`

const ResultsGrid = styled(Grid)`
  margin-top: 2rem;
`

function SearchPage() {
  const dispatch = useDispatch()
  const searchQuery = useSelector((state) => state.ui.searchQuery)
  const filterTags = useSelector((state) => state.ui.filterTags)
  const equipment = useSelector((state) => state.equipment.equipment)
  const presets = useSelector((state) => state.presets.presets)

  const [searchType, setSearchType] = useState('all') // 'all', 'equipment', 'presets'

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set()
    Object.values(presets).forEach((preset) => {
      preset.tags.forEach((tag) => tags.add(tag))
    })
    return Array.from(tags)
  }, [presets])

  // Filter results
  const filteredResults = useMemo(() => {
    let results = { equipment: [], presets: [] }

    if (searchType === 'all' || searchType === 'equipment') {
      results.equipment = Object.values(equipment).filter((eq) => {
        const matchesQuery = eq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            eq.type.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesQuery
      })
    }

    if (searchType === 'all' || searchType === 'presets') {
      results.presets = Object.values(presets).filter((preset) => {
        const matchesQuery = preset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            preset.description.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesTags = filterTags.length === 0 || 
                           filterTags.some((tag) => preset.tags.includes(tag))
        return matchesQuery && matchesTags
      })
    }

    return results
  }, [searchQuery, filterTags, equipment, presets, searchType])

  return (
    <SearchContainer>
      <SearchBar elevation={3}>
        <Typography variant="h4" sx={{ color: 'white', marginBottom: '1rem' }}>
          Search & Browse
        </Typography>

        <TextField
          fullWidth
          placeholder="Search equipment and presets..."
          value={searchQuery}
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          variant="outlined"
          InputProps={{
            startAdornment: <SearchIcon sx={{ marginRight: '1rem', color: 'white' }} />,
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              color: 'white',
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.5)',
              },
            },
            '& .MuiOutlinedInput-input::placeholder': {
              color: 'rgba(255, 255, 255, 0.7)',
              opacity: 1,
            },
          }}
        />
      </SearchBar>

      <Typography variant="h6" gutterBottom>
        Filter by Tags
      </Typography>

      <Stack direction="row" spacing={1} sx={{ marginBottom: '2rem', flexWrap: 'wrap' }}>
        {allTags.map((tag) => (
          <Chip
            key={tag}
            label={tag}
            onClick={() => {
              if (filterTags.includes(tag)) {
                dispatch(removeFilterTag(tag))
              } else {
                dispatch(addFilterTag(tag))
              }
            }}
            color={filterTags.includes(tag) ? 'primary' : 'default'}
            variant={filterTags.includes(tag) ? 'filled' : 'outlined'}
          />
        ))}
      </Stack>

      <ResultsGrid container spacing={3}>
        {filteredResults.equipment.length > 0 && (
          <>
            <Grid item xs={12}>
              <Typography variant="h6">
                Equipment ({filteredResults.equipment.length})
              </Typography>
            </Grid>
            {filteredResults.equipment.map((eq) => (
              <Grid item xs={12} sm={6} md={4} key={eq.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{eq.name}</Typography>
                    <Typography color="textSecondary">{eq.type}</Typography>
                    <Typography variant="caption">
                      Connections: {eq.connections.length}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </>
        )}

        {filteredResults.presets.length > 0 && (
          <>
            <Grid item xs={12}>
              <Typography variant="h6">
                Presets ({filteredResults.presets.length})
              </Typography>
            </Grid>
            {filteredResults.presets.map((preset) => (
              <Grid item xs={12} sm={6} md={4} key={preset.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{preset.name}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {preset.description}
                    </Typography>
                    <Stack direction="row" spacing={0.5} sx={{ marginTop: '0.5rem', flexWrap: 'wrap' }}>
                      {preset.tags.map((tag) => (
                        <Chip key={tag} label={tag} size="small" variant="outlined" />
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </>
        )}

        {filteredResults.equipment.length === 0 && filteredResults.presets.length === 0 && (
          <Grid item xs={12}>
            <Typography variant="body2" color="textSecondary">
              No results found. Try adjusting your search or filters.
            </Typography>
          </Grid>
        )}
      </ResultsGrid>
    </SearchContainer>
  )
}

export default SearchPage

