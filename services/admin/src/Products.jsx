import { useState, useEffect } from 'react';
import { DataGrid } from '@material-ui/data-grid';
import request from 'superagent';
import { getIdToken } from './utils';
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

const PAGE_SIZE = 13;

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

const Products = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [page, setPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedStores, setSelectedStores] = useState([
    'jumbo',
    'albert_heijn',
  ]);
  const handlePageChange = (params) => {
    setPage(params.page);
  };
  useEffect(() => {
    let active = true;

    (async () => {
      setLoading(true);
      const offset = (page - 1) * PAGE_SIZE;
      const idToken = await getIdToken();
      const stores = selectedStores.join(',');
      console.log(idToken);
      const response = await request
        .get('api/v1/products')
        .query({ stores, limit: PAGE_SIZE, offset })
        .set('authorization', `Bearer ${idToken}`);
      setTotalProducts(response.body.data.count);
      setProducts({ ...products, [page]: response.body.data.rows });

      if (!active) {
        return;
      }

      setLoading(false);
    })();

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, selectedStores]);
  const handleDialogClose = () => setDialogOpen(false);

  const columns = [
    { field: 'id', hide: true },
    { field: 'label', headerName: 'label', width: 200 },
    { field: 'store_name', headerName: 'store', width: 150 },
    { field: 'amount', headerName: 'amount', width: 150 },
    { field: 'new_price', headerName: 'price', width: 150 },
    { field: 'createdAt', headerName: 'Created at', width: 200 },
    {
      field: '',
      headerName: 'details',
      width: 80,
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
  ];

  return (
    <div style={{ width: '100%' }}>
      <Typography>{`${totalProducts} total products`}</Typography>
      <FormLabel component="legend">Store</FormLabel>
      <Grid container>
        <Grid item xs={4}>
          <FormControlLabel
            control={
              <Checkbox
                checked={selectedStores.includes('jumbo')}
                color="primary"
                onChange={(event) => {
                  const checked = event.target.checked;
                  if (checked) {
                    setSelectedStores([...selectedStores, 'jumbo']);
                    setProducts({});
                  } else {
                    setSelectedStores(
                      selectedStores.filter((store) => store !== 'jumbo')
                    );
                    setProducts({});
                  }
                }}
                name={'jumbo'}
              />
            }
            label={'Jumbo'}
          />
        </Grid>
        <Grid item xs={4}>
          <FormControlLabel
            control={
              <Checkbox
                checked={selectedStores.includes('albert_heijn')}
                color="primary"
                onChange={(event) => {
                  const checked = event.target.checked;
                  if (checked) {
                    setSelectedStores([...selectedStores, 'albert_heijn']);
                    setProducts({});
                  } else {
                    setSelectedStores(
                      selectedStores.filter((store) => store !== 'albert_heijn')
                    );
                    setProducts({});
                  }
                }}
                name={'albert_heijn'}
              />
            }
            label={'Albert Heijn'}
          />
        </Grid>
      </Grid>
      <DataGrid
        checkboxSelection
        rows={Object.values(products).flat()}
        columns={columns}
        pagination
        autoHeight
        pageSize={PAGE_SIZE}
        rowCount={totalProducts}
        paginationMode="server"
        onPageChange={handlePageChange}
        loading={loading}
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

export default Products;
