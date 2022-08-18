import BasketSimple from "../../components/basket-simple";
import List from "../../components/list";
import Layout from "../../components/layout";
import React, {useCallback, useEffect} from "react";
import Item from "../../components/item";
import useStore from "../../utils/use-store";
import useSelector from "../../utils/use-selector";
import Pagination from "../../components/pagination";
import Menu from "../../components/menu";

function Main(){

  console.log('Main');

  const store = useStore();

  const select = useSelector(state => ({
    items: state.catalog.items,
    amount: state.basket.amount,
    sum: state.basket.sum,
    loading: state.catalog.loading,
    activePage: state.catalog.activePage,
    load: state.catalog.load,
    numOfPages: state.catalog.numOfPages
  }));

  useEffect(() => {
    store.get('catalog').load(select.activePage);
  }, [select.activePage])

  const callbacks = {
    load: useCallback((nPage) => store.get('catalog').load(nPage), []),
    // Открытие корзины
    openModalBasket: useCallback(() => store.get('modals').open('basket'), []),
    // Добавление в корзину
    addToBasket: useCallback(_id => store.get('basket').addToBasket(_id), []),
  };

  const renders = {
    item: useCallback(item => <Item item={item} onAdd={callbacks.addToBasket} path={`/description/${item._id}`}/>, []),
  }

  return (
    <Layout head={select.loading ? <h1>Загрузка...</h1> : <h1>Магазин</h1>}>
      <Menu/>
      <BasketSimple
        onOpen={callbacks.openModalBasket}
        amount={select.amount}
        sum={select.sum}/>
      <List
        items={select.items}
        renderItem={renders.item}/>
      {
        select.numOfPages !== 0 &&
        <Pagination
          load={callbacks.load}
          numOfPages={select.numOfPages}
          activePage={select.activePage}/>
      }
    </Layout>
  )
}

export default React.memo(Main);
