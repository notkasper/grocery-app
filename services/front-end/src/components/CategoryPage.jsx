/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable react/no-array-index-key */
import React, { useEffect } from 'react';
import { observer, inject } from 'mobx-react';
import _ from 'lodash';
import ProductCard from './ProductCard';
import Pagination from './Pagination';

const CategoryPage = inject('applicationStore')(
  observer((props) => {
    const { applicationStore } = props;
    const loadProductsInCategory = async (newPage) => {
      await applicationStore.getProductsInCategory(
        props.match.params.id,
        newPage
      );
    };
    useEffect(() => {
      applicationStore.navbarLabel = props.match.params.label;
    }, []);
    return (
      <Pagination
        items={Object.values(
          _.get(
            applicationStore.productsPerCategory,
            `[${props.match.params.id}].products`,
            {}
          )
        )}
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
          await loadProductsInCategory(page);
        }}
        totalItems={_.get(
          applicationStore.productsPerCategory,
          `[${props.match.params.id}].count`
        )}
        pageSize={20}
      />
    );
  })
);

CategoryPage.propTypes = {};

export default CategoryPage;
