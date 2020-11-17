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
        .post('api/v1/products/bulk')
        .send({ products })
        .set('authorization', `Bearer ${idToken}`);
      setProducts([]);
    } catch (error) {
      console.error(error);
    }
  };
  const handleFilter = () => {
    const [uniques, dupes] = filterDuplicates(products);
    setProducts(uniques);
    console.info(`Uniques found: ${uniques.length}`);
    console.info(`Duplicates found: ${dupes}`);
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
      <Grid container>
        <Grid item xs={2}>
          <input
            className={classes.input}
            id="contained-button-file"
            type="file"
            onChange={handleFileSelection}
          />
          <label htmlFor="contained-button-file">
            <Button variant="contained" color="primary" component="span">
              Upload
            </Button>
          </label>
        </Grid>
        <Grid item xs={1}>
          <Button
            variant="contained"
            color="secondary"
            className={classes.button}
            startIcon={<DeleteRoundedIcon />}
            onClick={() => setProducts([])}
          >
            Clear
          </Button>
        </Grid>
        <Grid item xs={2}>
          <Button
            variant="contained"
            color="secondary"
            className={classes.button}
            startIcon={<FilterRoundedIcon />}
            onClick={handleFilter}
          >
            Filter duplicates
          </Button>
        </Grid>
        <Grid item xs={3}>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            startIcon={<PublishRoundedIcon />}
            onClick={uploadProducts}
          >
            Confirm Upload
          </Button>
        </Grid>
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
    </div>
  );
};

export default UploadProducts;
