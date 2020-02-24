import * as React from 'react';
import { useState } from 'react';
import { View, useReady, useHide, navigateTo } from 'remax/wechat';
import { useObserver } from 'mobx-react';
import { toJS } from 'mobx';
import useStores from '../../hooks/useStores';
import styles from './index.module.less';
import Icon from '@vant/weapp/dist/icon';
import Dialog from '@vant/weapp/dist/dialog';
import Field from '@vant/weapp/dist/field';
import Grid from '@vant/weapp/dist/grid';
import GridItem from '@vant/weapp/dist/grid-item';
import Notify from '@vant/weapp/dist/notify';
import notify from '@vant/weapp/dist/notify/notify';

const DATA_LIST = 'DATA_LIST';
let inited = false;
const IndexPage = () => {
  const { listStore } = useStores();

  useReady((...args) => {
    const value = wx.getStorageSync(DATA_LIST);
    if (!value || inited) return;
    value.forEach(val => {
      const list = listStore.add(val.name, val.id);
      val.people.forEach(per => {
        const person = list.add(per.name, per.id);
        person.status = per.status;
      });
    });
    inited = true;
  });
  useHide((...args) => {
    const data = toJS(listStore);
    wx.setStorageSync(DATA_LIST, data.list);
  });

  const [show, setShow] = useState(false);
  let newName = '';
  return useObserver(() => (
    <View className={styles.app}>
      <Notify id='van-notify' />
      <Grid column-num={3} gutter={10} clickable square>
        {listStore.list.map(list => {
          return (
            <GridItem
              key={list.id}
              text={list.name}
              bindclick={() => {
                listStore.currentList = list;
                navigateTo({
                  url: '/pages/list/index',
                });
              }}
            />
          );
        })}
      </Grid>
      <Dialog
        use-slot
        title='新增名单'
        show={show}
        show-cancel-button
        bindclose={event => {
          setShow(false);
          const { detail } = event;
          if (detail !== 'confirm') return;
          if (!newName || newName === '') {
            notify({ type: 'warning', message: '请输入一个名单' });
            return;
          }
          listStore.add(newName);
        }}
      >
        <View>
          <Field
            type='text'
            placeholder='请输入一个名单'
            border={false}
            bindchange={event => {
              const { detail } = event;
              newName = detail;
            }}
            border
          />
        </View>
      </Dialog>
      <Icon
        name='plus'
        size={32}
        bindclick={() => {
          setShow(true);
        }}
      ></Icon>
    </View>
  ));
};

export default IndexPage;
