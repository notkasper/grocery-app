import { useState, useEffect } from 'react';
import { DataGrid } from '@material-ui/data-grid';
import request from 'superagent';
import Typography from '@material-ui/core/Typography';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import InfoRoundedIcon from '@material-ui/icons/InfoRounded';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DeleteRoundedIcon from '@material-ui/icons/DeleteRounded';
import { getIdToken } from './utils';

const STORES = ['jumbo', 'albert_heijn'];

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

const DeleteSelectionDialog = ({
  handleConfirm,
  handleClose,
  open,
  selection,
}) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Confirm deletion</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {`Are you sure you want to delete ${selection.length} products? This process is irreversible`}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleConfirm} color="primary">
          Confirm Deletion
        </Button>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const Products = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState({});
  const [productSelection, setProductSelection] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [totalProducts, setTotalProducts] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedStores, setSelectedStores] = useState(STORES);
  const loadProducts = async () => {
    const idToken = await getIdToken();
    const stores = selectedStores.join(',');
    console.info(idToken);
    const response = await request
      .get('api/v1/products')
      .query({ stores })
      .set('authorization', `Bearer ${idToken}`);
    setTotalProducts(response.body.data.count);
    setProducts(response.body.data.rows);
  };
  useEffect(() => {
    (async () => {
      setLoading(true);
      await loadProducts();

      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStores]);
  const handleDialogClose = () => setDialogOpen(false);
  const handleDeleteDialogClose = () => setDeleteDialogOpen(false);
  const handleConfirmDeleteSelection = async () => {
    const idToken = await getIdToken();
    const ids = productSelection.join(',');
    await request
      .delete('api/v1/products/delete/bulk')
      .query({ ids })
      .set('authorization', `Bearer ${idToken}`);
    setProducts({});
    await loadProducts();
    setDeleteDialogOpen(false);
  };

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
      <Typography>{`${totalProducts} total products`}</Typography>
      <FormLabel component="legend">Store</FormLabel>
      <Grid container>
        {STORES.map((store) => (
          <Grid item xs={2}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedStores.includes(store)}
                  color="primary"
                  onChange={(event) => {
                    const checked = event.target.checked;
                    if (checked) {
                      setSelectedStores([...selectedStores, store]);
                      setProducts({});
                    } else {
                      setSelectedStores(
                        selectedStores.filter((store2) => store2 !== store)
                      );
                      setProducts({});
                    }
                  }}
                  name={store}
                />
              }
              label={store}
            />
          </Grid>
        ))}
        <Grid item xs={3}>
          <IconButton
            onClick={() => {
              setDeleteDialogOpen(true);
            }}
            color="secondary"
            disabled={productSelection.length < 1}
          >
            <DeleteRoundedIcon />
            <Typography>Delete Selection</Typography>
          </IconButton>
        </Grid>
      </Grid>
      <div style={{ width: '100%' }}>
        <DataGrid
          checkboxSelection
          rows={Object.values(products).flat()}
          columns={columns}
          pagination
          autoHeight
          rowCount={totalProducts}
          loading={loading}
          onSelectionChange={(newSelection) => {
            setProductSelection(newSelection.rowIds);
          }}
        />
      </div>
      <ConfirmDialog
        open={dialogOpen}
        handleClose={handleDialogClose}
        handleDelete={handleDialogClose}
        product={selectedProduct}
      />
      <DeleteSelectionDialog
        open={deleteDialogOpen}
        handleClose={handleDeleteDialogClose}
        handleConfirm={handleConfirmDeleteSelection}
        selection={productSelection}
      />
    </div>
  );
};

export default Products;
