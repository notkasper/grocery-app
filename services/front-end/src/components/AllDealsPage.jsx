/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState } from 'react';
import { observer, inject } from 'mobx-react';
import _ from 'lodash';
import ProductCard from './ProductCard';
import Pagination from './Pagination';

const CategoryPage = inject('applicationStore')(
  observer((props) => {
    const { applicationStore } = props;
    const [products, setProducts] = useState([]);
    const [totalProducts, setTotalProducts] = useState(0);
    const loadProducts = async (newPage) => {
      const { newProducts, count } = await applicationStore.getProducts(
        newPage
      );
      setProducts(newProducts);
      setTotalProducts(count);
    };
    useEffect(() => {
      applicationStore.navbarLabel = 'Nieuwe deals';
    }, []);
    return (
      <Pagination
        items={products}
        onRenderItem={(item) => (
          <ProductCard
            id={item.id}
            image={item.image}
            storeName={item.store_name}
            title={item.label}
            amountText={item.amount}
            cost={item.new_price}
            likes={item.likes}
            key={item.id}
          />
        )}
        onLoadPage={async (page) => {
          await loadProducts(page);
        }}
        totalItems={totalProducts}
        pageSize={20}
      />
    );
  })
);

CategoryPage.propTypes = {};

export default CategoryPage;
