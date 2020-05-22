/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState } from 'react';
import { observer, inject } from 'mobx-react';
import styled from 'styled-components';

const Container = styled.div`
  background-color: #f1f6fa;
  padding: 10px;
  grid-gap: 10px;
  padding-bottom: 10000px;
  height: 100vh;
`;

const ListItemContainer = styled.div`
  background: #ffffff;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.15);
  border-radius: 8px;

  img {
    min-height: 100px;
  }
`;

const ListItem = (props) => {
  return (
    <ListItemContainer>
      <img alt="product preview" />
    </ListItemContainer>
  );
};

const ListPage = inject('applicationStore')(
  observer((props) => {
    const { applicationStore } = props;
    const [listItems, setListItems] = useState([]);
    const loadListItems = async () => {
      const newListItems = await applicationStore.getListItems();
      setListItems(newListItems);
    };
    useEffect(() => {
      applicationStore.navbarLabel = 'Lijstje';
      loadListItems();
    }, []);
    return (
      <Container>
        <p>Lijst</p>
        {listItems.map((item) => (
          <ListItem key={item.id} />
        ))}
      </Container>
    );
  })
);

ListPage.propTypes = {};

export default ListPage;
