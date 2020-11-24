import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import request from 'superagent';
import { DataGrid } from '@material-ui/data-grid';
import InfoRoundedIcon from '@material-ui/icons/InfoRounded';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import Grid from '@material-ui/core/Grid';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import DeleteRoundedIcon from '@material-ui/icons/DeleteRounded';
import PublishRoundedIcon from '@material-ui/icons/PublishRounded';
import FilterRoundedIcon from '@material-ui/icons/FilterRounded';
import CompareRoundedIcon from '@material-ui/icons/CompareRounded';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { getIdToken, filterDuplicates } from './utils';

const PAGE_SIZE = 100;

const useStyles = makeStyles((theme) => ({
  input: {
    display: 'none',
  },
}));

const ConfirmDialog = ({ product, open, handleClose }) => {
  if (!product) {
    return null;
  }
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{product.label}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <img alt={product.label} src={product.image} />
          {Object.keys(product).map((key) => (
            <Typography>{`${key}: ${product[key]}`}</Typography>
          ))}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const UploadProducts = () => {
  const classes = useStyles();
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [store, setStore] = useState('jumbo');
  const [comparison, setComparison] = useState(null);
  const [products, setProducts] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const handleFileSelection = (event) => {
    const fileReader = new FileReader();
    fileReader.readAsText(event.target.files[0], 'UTF-8');
    fileReader.onload = (e) => {
      const uploadedProducts = JSON.parse(e.target.result).products;
      setProducts(uploadedProducts);
    };
  };
  const uploadProducts = async () => {
    try {
      const idToken = await getIdToken();
      await request
        .delete('api/v1/products/delete/store')
        .query({ store })
        .set('authorization', `Bearer ${idToken}`);
      await request
        .post('api/v1/products/bulk')
        .send({ products })
        .set('authorization', `Bearer ${idToken}`);
      setProducts([]);
      setMessage(
        `${comparison.new_products_count} Products Added. ${comparison.removed_products_count} Products Removed. ${comparison.duplicate_products_count} Products Updated`
      );
      setTimeout(() => {
        setMessage(null);
      }, 6000);
    } catch (error) {
      console.error(error);
      setError(error.response.body.error || error.message);
      setTimeout(() => {
        setError(null);
      }, 6000);
    }
  };
  const compareProducts = async () => {
    try {
      const idToken = await getIdToken();
      const response = await request
        .post('api/v1/products/compare')
        .send({ products, store })
        .set('authorization', `Bearer ${idToken}`);
      setComparison(response.body.data);
    } catch (error) {
      console.error(error);
      setError(error.response.body.error || error.message);
      setTimeout(() => {
        setError(null);
      }, 6000);
    }
  };
  const handleFilter = () => {
    const [uniques, dupes] = filterDuplicates(products);
    console.info(`Uniques found: ${uniques.length}`);
    console.info(`Duplicates found: ${dupes}`);
    setProducts(uniques);
  };
  const handleDialogClose = () => setDialogOpen(false);
  const columns = [
    { field: 'id', hide: true },
    { field: 'label', headerName: 'label', width: 200 },
    { field: 'store_name', headerName: 'store', width: 100 },
    {
      field: '',
      headerName: 'details',
      width: 80,
      disableClickEventBubbling: true,
      renderCell: (params) => {
        return (
          <IconButton
            onClick={() => {
              setDialogOpen(true);
              setSelectedProduct(params.data);
            }}
          >
            <InfoRoundedIcon color="primary" />
          </IconButton>
        );
      },
    },
    { field: 'amount', headerName: 'amount', width: 150 },
    { field: 'new_price', headerName: 'price', width: 150 },
    { field: 'createdAt', headerName: 'Created at', width: 200 },
  ];

  return (
    <div>
      <Grid container style={{ marginTop: '2rem' }}>
        <Grid item xs={12}>
          <FormControl component="fieldset">
            <FormLabel component="legend">
              Select Store To Upload Products For
            </FormLabel>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={store === 'jumbo'}
                    onChange={() => setStore('jumbo')}
                    name="jumbo"
                  />
                }
                label="Jumbo"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={store === 'albert_heijn'}
                    onChange={() => setStore('albert_heijn')}
                    name="albert_heijn"
                  />
                }
                label="Albert Heijn"
              />
            </FormGroup>
          </FormControl>
        </Grid>
        <Grid item xs={3}>
          <input
            className={classes.input}
            id="contained-button-file"
            type="file"
            onChange={handleFileSelection}
          />
          <label htmlFor="contained-button-file">
            <Button
              variant="contained"
              color="primary"
              component="span"
              style={{ float: 'left', marginTop: '2rem' }}
            >
              Select File
            </Button>
          </label>
        </Grid>
        <Grid item xs={3}>
          <Button
            variant="contained"
            color="secondary"
            className={classes.button}
            startIcon={<DeleteRoundedIcon />}
            onClick={() => {
              setProducts([]);
              setComparison(null);
            }}
            style={{ float: 'right', marginTop: '2rem' }}
          >
            Clear Uploaded File
          </Button>
        </Grid>
        <Grid item xs={3}>
          <Button
            variant="contained"
            color="secondary"
            className={classes.button}
            startIcon={<FilterRoundedIcon />}
            onClick={handleFilter}
            style={{ float: 'right', marginTop: '2rem' }}
          >
            Filter duplicates
          </Button>
        </Grid>
        <Grid item xs={3}>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            startIcon={<CompareRoundedIcon />}
            onClick={compareProducts}
            style={{ float: 'right', marginTop: '2rem' }}
          >
            Compare Products
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            startIcon={<PublishRoundedIcon />}
            onClick={uploadProducts}
            disabled={!comparison}
            style={{ float: 'right', marginTop: '2rem', marginBottom: '2rem' }}
          >
            Confirm Upload
          </Button>
        </Grid>
        {comparison && (
          <Grid item xs={12}>
            <Typography>{`New products: ${comparison.new_products_count}`}</Typography>
            <Typography>{`Removed products: ${comparison.removed_products_count}`}</Typography>
            <Typography>{`Duplicate (Persistent) products: ${comparison.duplicate_products_count}`}</Typography>
          </Grid>
        )}
      </Grid>
      <DataGrid
        rows={products}
        columns={columns}
        pagination
        autoHeight
        pageSize={PAGE_SIZE}
      />
      <ConfirmDialog
        open={dialogOpen}
        handleClose={handleDialogClose}
        handleDelete={handleDialogClose}
        product={selectedProduct}
      />
      <Snackbar open={message} autoHideDuration={6000}>
        <MuiAlert elevation={6} variant="filled" severity="success">
          {message}
        </MuiAlert>
      </Snackbar>
      <Snackbar open={error} autoHideDuration={6000}>
        <MuiAlert elevation={6} variant="filled" severity="error">
          {JSON.stringify(error)}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default UploadProducts;
