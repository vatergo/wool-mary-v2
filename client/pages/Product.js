import React, { Component } from 'react';
import axios from 'axios';
import Loading from './Loading';
import CloseIcon from '@material-ui/icons/Close';
import { withStyles, Grid, Card, CardMedia, Typography, Button, Snackbar, IconButton } from '@material-ui/core';


class Product extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            loading: true,
            product: [],
            snackbar: false,
        });
    }

    componentDidMount() {
        axios.get(`/api/products/filter?_id=${this.props.id}`)
            .then((result) => this.setState({
                product: result.data[0],
                loading: false,
            }))
            .catch((er) => console.error(er));
    }

    onAddToBasket() {
        const headers = this.props.userData ? { "Authorization": `Bearer ${this.props.userData.token}` } : {};
        axios.post('/api/basket', { productId: this.state.product._id }, { headers })
            .then((result) => this.setState({ snackbar: true }))
            .catch((er) => console.error(er));
    }

    render() {
        const { classes, userData } = this.props;
        const { product, loading, snackbar } = this.state;

        return (
            <>
                {loading
                    ? <Loading />
                    : <Grid container spacing={3} className={classes.container}>
                        <Grid item xs={6}>
                            <Card className={classes.card} variant='outlined'>
                                <CardMedia
                                    className={classes.media}
                                    component='img'
                                    src={product.src}
                                    title={product.name}
                                />
                            </Card>
                        </Grid>
                        <Grid item xs={6} className={classes.info}>
                            <Typography variant="h5" component="h2">{product.name}</Typography>
                            <Typography className={classes.cost}>{product.cost}</Typography>
                            <Typography color="textSecondary" >{product.description || 'Это супур-пупер крутая продукция, обязательно приобрети её себе!'}</Typography>
                            <Button className={classes.button}
                                onClick={this.onAddToBasket.bind(this)}
                                disabled={!userData}
                                variant="contained"
                                color="primary"
                                size="large">
                                Добавить в корзину
                            </Button>
                        </Grid>
                    </Grid>}
                <Snackbar
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    open={snackbar}
                    autoHideDuration={15000}
                    onClose={() => this.setState({ snackbar: false })}
                    message={'Продукт добавлен в корзину'}
                    action={
                        <React.Fragment>
                            <IconButton size="small" aria-label="close" color="inherit" onClick={() => this.setState({ snackbar: false })}>
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </React.Fragment>
                    } />
            </>
        );
    }
}

const styles = {
    container: {
        marginTop: 8,
    },
    card: {
        width: 500,
        height: 500,
        border: '1px solid #7c6d72',
    },
    media: {
        width: '104%',
        marginTop: -10,
        marginLeft: -10,
        height: '104%',
    },
    cost: {
        color: '#d18193',
    },
    button: {
        marginTop: 8,
    },
};

export default withStyles(styles)(Product);