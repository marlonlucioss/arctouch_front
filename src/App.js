import React, {useEffect, useState} from 'react';
import './App.css';

import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';

import axios from 'axios';
import {fade, makeStyles} from "@material-ui/core/styles";

import Grid from '@material-ui/core/Grid';

import Dialog from '@material-ui/core/Dialog';
import FavoriteIcon from '@material-ui/icons/Favorite';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import CardActions from '@material-ui/core/CardActions';
import StarIcon from '@material-ui/icons/Star';

import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';

import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';

import Pagination from '@material-ui/lab/Pagination';

const serverURL = 'http://localhost:3031';

const MAX_LENGTH = 150;

const useStyles = makeStyles(theme => ({
    container: {
        flexGrow: 1,
        marginTop: 20
    },
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
    card: {

    },
    media: {
        height: 240,
    },
    card_media: {
        height: 200,
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    large: {
        width: theme.spacing(10),
        height: theme.spacing(10),
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(1),
            width: 'auto',
        },
    },
    searchIcon: {
        width: theme.spacing(7),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 7),
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: 120,
            '&:focus': {
                width: 200,
            },
        },
    },
    pagination: {
        '& > *': {
            marginTop: theme.spacing(2),
        },
    }
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function App() {

    const classes = useStyles();

    const [movies, setMovies] = useState([]);
    const [movie, setMovie] = useState(null);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const handleClose = () => {
        setMovie(null);
        setOpen(false);
    };

    const handleCloseLoading = () => {
        setLoading(false);
    };

    const fetchMovies = (page = 1) => {
        setLoading(true);
        axios.get(`${serverURL}/movies?page=${page}`).then((response) => {
            setCurrentPage(1);
            setMovies(response.data.results);
            setTotalPages(response.data.totalPages);
            setLoading(false);
        });
    };

    const getMovie = (id) => {
        setLoading(true);
        axios.get(`${serverURL}/movies/movie/${id}`).then((response) => {
            setMovie(response.data);
            setOpen(true);
            setLoading(false);
        });
    };

    const formatGenres = (genresList) => {
        let genres = '';
        for(let i = 0, ilen = genresList.length; i < ilen; i++){
            genres += ` ${genresList[i].name}`;
        }
        return genres;
    };

    let searchTypeTimeout = setTimeout(() => {},0);

    const searchMovie = (text) => {
        clearTimeout(searchTypeTimeout);
        searchTypeTimeout = setTimeout(() => {
            setLoading(true);
            axios.get(`${serverURL}/movies/search?q=${text}`).then((response) => {
                setMovies(response.data.results);
                setTotalPages(response.data.totalPages);
                setLoading(false);
            });
        },500);
    };

    const changePage = (event, value) => {
        setCurrentPage(value);
        fetchMovies(value);
    };

    useEffect(() => {
        fetchMovies();
    }, []);

    return (
      <React.Fragment>
        <CssBaseline />
        <Container maxWidth="lg">
            <Backdrop className={classes.backdrop} open={loading} onClick={handleCloseLoading}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" className={classes.title}>
                        Movies
                    </Typography>
                    <div className={classes.search}>
                        <div className={classes.searchIcon}>
                            <SearchIcon />
                        </div>
                        <InputBase
                            placeholder="Search…"
                            classes={{
                                root: classes.inputRoot,
                                input: classes.inputInput,
                            }}
                            inputProps={{ 'aria-label': 'search' }}
                            onChange={event => searchMovie(event.target.value)}
                        />
                    </div>
                </Toolbar>
            </AppBar>
            <div className={classes.container}>
                <Grid container spacing={3}>
                    {movies.map(item => (
                        <Grid item xs={4} key={item.id}>
                            <Card className={classes.card} onClick={() => getMovie(item.id)}>
                                <CardActionArea>
                                    <CardMedia
                                        className={classes.media}
                                        image={item.backdrop_path}
                                        title={item.original_language}
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="h2">
                                            {item.title}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary" component="p">
                                            {`${item.overview.substring(0, MAX_LENGTH)}...`}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
                <div className={classes.pagination}>
                    <Pagination count={totalPages} page={currentPage} onChange={changePage} />
                </div>
            </div>
            <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                            <CloseIcon />
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                            {movie && (movie.title)}
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Card className={classes.root}>
                    <CardHeader
                        avatar={
                            <Avatar alt={movie && (movie.original_language)} src={movie && (movie.poster_path)} className={classes.large} />
                        }
                        title={movie && (formatGenres(movie.genres))}
                        subheader={movie && ('Release date: ' + movie.release_date)}
                    />
                    <CardMedia
                        className={classes.card_media}
                        image={movie && movie.backdrop_path}
                        title={movie && movie.title}
                    />
                    <CardActions disableSpacing>
                        <IconButton>
                            <StarIcon /> {movie && (movie.vote_count)}
                        </IconButton>
                        <IconButton>
                            <FavoriteIcon /> {movie && (movie.popularity)}
                        </IconButton>
                    </CardActions>
                    <CardContent>
                        <Typography paragraph>Overview:</Typography>
                        <Typography paragraph>
                            {movie && movie.overview}
                        </Typography>
                    </CardContent>
                </Card>
            </Dialog>
        </Container>
      </React.Fragment>
    );
}

export default App;
