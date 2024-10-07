import React, { useEffect, useMemo, useState } from 'react'
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'
import axios from 'axios'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import Fade from '@mui/material/Fade'
import Box from '@mui/material/Box'
import Collapse from '@mui/material/Collapse'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Masonry from '@mui/lab/Masonry'
import { grey } from '@mui/material/colors'

//icons
import LogoutIcon from '@mui/icons-material/Logout'
import NewspaperIcon from '@mui/icons-material/Newspaper'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import DeleteIcon from '@mui/icons-material/Delete'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import MenuIcon from '@mui/icons-material/Menu'



type CardData = {
  id: string;
  title: string;
  url: string;
  created_at: string;
  text?: string;
  author?: string;
};

const drawer_width: number = 180
const items_per_page: number = 10

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(false)
  const [data, setData] = useState<CardData[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [expandedCard, setExpandedCard] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState<number>(0)
  const [sortOption, setSortOption] = useState<string | null>(null)
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false)

  const theme = useMemo(() => createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: darkMode ? grey[900] : grey[100],
          },
        },
      },
    },
  }), [darkMode])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const response = await axios.get(
          `https://hn.algolia.com/api/v1/search?tags=front_page&page=${currentPage}&hitsPerPage=${items_per_page}`
        )
        const formattedData: CardData[] = response.data.hits.map((item: any) => {
            console.log(item._highlightResult)
            return {
              id: item.objectID,
              title: item.title,
              url: item.url || 'No subject',
              created_at: item.created_at,
              text: item._highlightResult?.story_text?.value,
              author: item._highlightResult?.author?.value
            }
          }
        )
        setData(formattedData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [currentPage])

  const handleExpandClick = (id: string) => {
    setExpandedCard(expandedCard === id ? null : id)
  }

  const handleRemoveCard = (id: string) => {
    setData((prevData) => prevData.filter((item) => item.id !== id))
  }

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1)
  }

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => (prevPage > 0 ? prevPage - 1 : prevPage))
  }

  const sortByName = (event: React.MouseEvent<HTMLButtonElement>) => {
    setData((prevData) =>
      [...prevData].sort((a, b) => a.title.localeCompare(b.title))
    )
    setSortOption('name')
  }

  const sortByDate = (event: React.MouseEvent<HTMLButtonElement>) => {
    setData((prevData) =>
      [...prevData].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
    )
    setSortOption('date')
  }

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen)
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <Box sx={{ display: 'flex' }}>
        <AppBar
          position='fixed'
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <Toolbar>
            <IconButton
              color='inherit'
              aria-label='open drawer'
              edge='start'
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              {drawerOpen ? <ChevronLeftIcon/> : <MenuIcon/>}
            </IconButton>
            <Typography variant='h6' noWrap component='div'>
              News App
            </Typography>
            <ButtonGroup
              variant='outlined'
              aria-label='Basic button group'
              sx={{
                marginLeft: 'auto',
                color: 'white',
                '& .MuiButton-root': {
                  color: 'white',
                  borderColor: 'white',
                },
                '& .MuiButton-root:hover': {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              <Button
                onClick={sortByName}
                startIcon={sortOption === 'name' && <ArrowDropDownIcon/>}
              >
                Sort by name
              </Button>
              <Button
                onClick={sortByDate}
                startIcon={sortOption === 'date' && <ArrowDropDownIcon/>}
              >
                Sort by date
              </Button>
            </ButtonGroup>
            <IconButton
              color='inherit'
              onClick={() => setDarkMode(!darkMode)}
              sx={{ ml: 2 }}
            >
              {darkMode ? <LightModeIcon/> : <DarkModeIcon/>}
            </IconButton>
          </Toolbar>
        </AppBar>

        <Drawer
          variant='temporary'
          open={drawerOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            [`& .MuiDrawer-paper`]: { width: drawer_width, boxSizing: 'border-box' },
          }}
        >
          <Toolbar/>
          <Box sx={{ overflow: 'auto' }}>
            <List>
              <ListItemButton>
                <NewspaperIcon sx={{ mr: 2 }}/>
                <Typography>News</Typography>
              </ListItemButton>
              <Divider/>
              <ListItemButton>
                <LogoutIcon sx={{ mr: 2 }}/>
                <Typography>Logout</Typography>
              </ListItemButton>
            </List>
          </Box>
        </Drawer>

        <Box component='main' sx={{ flexGrow: 1, p: 3, mt: 8 }}>
          {loading ? <LoadingContainer/> : <><Masonry
            columns={{ xs: 1, sm: 2, md: 3 }}
            spacing={2}
            sx={{ marginLeft: 0 }}
          >
            {data.map((card) => (
              <Card variant='outlined' key={card.id}>
                <CardContent>
                  <Typography variant='h5'>{card.title}</Typography>
                  <Typography variant='body2' color='textSecondary'>
                    {card.author}
                  </Typography>
                  <Typography variant='overline' color='textSecondary'>
                    {new Date(card.created_at).toLocaleString()}
                  </Typography>
                  {card.text && <Box>
                    <Collapse
                      in={expandedCard === card.id}
                      timeout='auto'
                      unmountOnExit
                    >
                      <Typography sx={{ mt: 1 }} variant='body2' dangerouslySetInnerHTML={{ __html: card.text }}/>
                    </Collapse>
                    <Button
                      onClick={() => handleExpandClick(card.id)}
                      startIcon={
                        expandedCard === card.id ? (
                          <ExpandLessIcon/>
                        ) : (
                          <ExpandMoreIcon/>
                        )
                      }
                    >
                      {expandedCard === card.id ? 'Show Less' : 'Show More'}
                    </Button>
                  </Box>}
                  <Box sx={{
                    mt: 2,
                    display: 'flex',
                    justifyContent: 'flex-end'
                  }}>
                    <Button
                      variant='outlined'
                      color='error'
                      endIcon={<DeleteIcon/>}
                      onClick={() => handleRemoveCard(card.id)}
                    >
                      Delete
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Masonry>
            <Box
              sx={{
                mt: 2,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <ButtonGroup variant='outlined'>
                <Button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 0}
                  startIcon={<KeyboardArrowLeftIcon/>}
                >
                  Previous Page
                </Button>
                <Button disabled>
                  Page {currentPage + 1}
                </Button>
                <Button
                  onClick={handleNextPage}
                  disabled={data.length < items_per_page && currentPage > 0}
                  endIcon={<KeyboardArrowRightIcon/>}
                >
                  Next Page
                </Button>
              </ButtonGroup>
            </Box></>}
        </Box>
      </Box>
    </ThemeProvider>
  )
}

const LoadingContainer: React.FC = () => {
  return (
    <Fade in={true} timeout={400}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: 'background.default',
          color: 'text.primary',
        }}
      >
        <CircularProgress
          size={80}
          thickness={4.5}
          sx={{
            mb: 2,
            color: 'primary.main',
          }}
        />
        <Typography variant='h6' component='p'>
          Loading, please wait...
        </Typography>
      </Box>
    </Fade>
  )
}


export default App
