import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const MAX_LENGTH = 150;

const useStyles = makeStyles({
    card: {
        maxWidth: '33%',
        display: 'inline-block',
        marginLeft: 3,
        marginBottom: 20
    },
    media: {
        height: 240,
    },
});

export default function MediaCard(props) {
    const classes = useStyles();
    return (
        <Card className={classes.card}>
            <CardActionArea>
                <CardMedia
                    className={classes.media}
                    image={props.movie.backdrop_path}
                    title={props.movie.original_language}
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                        {props.movie.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        {`${props.movie.overview.substring(0, MAX_LENGTH)}...`}
                    </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions>
                <Button size="small" color="primary">
                    More
                </Button>
            </CardActions>
        </Card>
    );
}