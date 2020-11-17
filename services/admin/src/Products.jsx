import { useEffect, useState } from 'react';
import { DataGrid } from '@material-ui/data-grid';
import request from 'superagent';
import CircularProgress from '@material-ui/core/CircularProgress';
import { getIdToken } from './utils';
import Typography from '@material-ui/core/Typography';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';

const columns = [
  { field: 'id', hide: true },
  { field: 'label', headerName: 'label', width: 200 },
  { field: 'store_name', headerName: 'store', width: 150 },
  { field: 'amount', headerName: 'amount', width: 150 },
  { field: 'new_price', headerName: 'price', width: 150 },
  { field: 'createdAt', headerName: 'Created at', width: 200 },
];

const Products = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState([]);
  const [selectedStores, setSelectedStores] = useState([
    'jumbo',
    'albert_heijn',
  ]);
  const loadProducts = async () => {
    setLoading(true);
    const idToken = await getIdToken();
    const stores = selectedStores.join(',');
    const response = await request
      .get('api/v1/products')
      .query({ stores })
      .set('authorization', `Bearer ${idToken}`);
    setProducts(response.body.data.rows);
    console.log(products[0]);
    setTotalProducts(response.body.data.count);
    setLoading(false);
  };
  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStores]);
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
                onChange={(event) => {
                  const checked = event.target.checked;
                  if (checked) {
                    setSelectedStores([...selectedStores, 'jumbo']);
                  } else {
                    setSelectedStores(
                      selectedStores.filter((store) => store !== 'jumbo')
                    );
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
                onChange={(event) => {
                  const checked = event.target.checked;
                  if (checked) {
                    setSelectedStores([...selectedStores, 'albert_heijn']);
                  } else {
                    setSelectedStores(
                      selectedStores.filter((store) => store !== 'albert_heijn')
                    );
                  }
                }}
                name={'albert_heijn'}
              />
            }
            label={'Albert Heijn'}
          />
        </Grid>
      </Grid>
      {loading ? (
        <CircularProgress />
      ) : (
        <DataGrid
          checkboxSelection
          rows={products}
          columns={columns}
          autoHeight
        />
      )}
    </div>
  );
};

export default Products;
