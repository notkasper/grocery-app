import { useState, useEffect } from 'react';
import { DataGrid } from '@material-ui/data-grid';
import request from 'superagent';
import { getIdToken } from './utils';
import Typography from '@material-ui/core/Typography';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';

const PAGE_SIZE = 13;

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
  const [products, setProducts] = useState({});
  const [page, setPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
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
    </div>
  );
};

export default Products;
