/* eslint-disable object-curly-newline */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import BackSvg from '../assets/back.svg';
import Loader from './Loader';

const Container = styled.div`
  background-color: #f1f6fa;
  min-height: calc(100vh - 100px);
  padding-bottom: 50px;

  .nav-container {
    display: flex;
    justify-content: space-between;
    padding: 10px 10vw 20px 10vw;
  }

  .items-container {
    display: grid;
    margin: auto;
    justify-content: center;
    grid-template-columns: repeat(auto-fit, 136px);
    grid-gap: 5px;
  }

  .next {
    transform: rotate(180deg);
    margin-left: 15px;
  }

  .current {
    border: 2px solid #44c062;
    border-radius: 8px;
  }
`;

const LoaderContainer = styled.div`
  height: 50px;
  margin-top: calc(50vh - 50px);
`;

const NavButton = styled(BackSvg)`
  width: 24px;
  height: 24px;
  margin-top: 13px;
  fill: ${(props) => (props.disabled ? '#ADB5C2' : '#44c062')};
`;

const NavNumItem = styled.p`
  width: 24px;
  font-family: Work Sans;
  font-size: 24px;
  line-height: 24px;
  text-align: center;
  color: #000000;
  margin-top: 13px;
`;

const Pagination = (props) => {
  const { onLoadPage, onRenderItem, items, pageSize, totalItems } = props;
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const loadPage = async (pageToLoad) => {
    setPage(pageToLoad);
    setLoading(true);
    await onLoadPage(pageToLoad);
    setLoading(false);
  };
  useEffect(() => {
    loadPage(page);
  }, []);
  if (loading) {
    return (
      <LoaderContainer>
        <Loader />
      </LoaderContainer>
    );
  }
  const lastPage = Math.floor(totalItems / pageSize);
  const renderNav = () => (
    <div className="nav-container">
      <NavButton
        className="previous"
        onClick={() => {
          if (page <= 0) return;
          loadPage(page - 1);
        }}
        disabled={page <= 0}
      />
      {page > 1 ? (
        <NavNumItem onClick={() => loadPage(0)}>1..</NavNumItem>
      ) : null}
      {page > 0 ? (
        <NavNumItem onClick={() => loadPage(page - 1)}>{page}</NavNumItem>
      ) : null}
      <NavNumItem className="current">{page + 1}</NavNumItem>
      {page < lastPage ? (
        <NavNumItem onClick={() => loadPage(page + 1)}>{page + 2}</NavNumItem>
      ) : null}
      {page < lastPage - 1 ? (
        <NavNumItem onClick={() => loadPage(lastPage)}>
          {`..${lastPage + 1}`}
        </NavNumItem>
      ) : null}
      <NavButton
        className="next"
        onClick={() => {
          if (page >= lastPage) return;
          loadPage(page + 1);
        }}
        disabled={page >= lastPage}
      />
    </div>
  );
  return (
    <Container>
      {renderNav()}
      <div className="items-container">{items.map(onRenderItem)}</div>
      {renderNav()}
    </Container>
  );
};

Pagination.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  onLoadPage: PropTypes.func.isRequired,
  onRenderItem: PropTypes.func.isRequired,
  pageSize: PropTypes.number.isRequired,
  totalItems: PropTypes.number.isRequired,
};

export default Pagination;
