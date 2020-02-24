import * as React from 'react';
import { useState } from 'react';
import { View, Ad } from 'remax/wechat';
import { useObserver } from 'mobx-react';
import useStores from '../../hooks/useStores';
import styles from './index.module.less';
import Icon from '@vant/weapp/dist/icon';
import Dialog from '@vant/weapp/dist/dialog';
import Field from '@vant/weapp/dist/field';
import Grid from '@vant/weapp/dist/grid';
import GridItem from '@vant/weapp/dist/grid-item';
import Notify from '@vant/weapp/dist/notify';
import notify from '@vant/weapp/dist/notify/notify';
import Divider from '@vant/weapp/dist/divider';
import DropMenu from '@vant/weapp/dist/dropdown-menu';
import DropItem from '@vant/weapp/dist/dropdown-item';

const IndexPage = () => {
  const { listStore } = useStores();
  const { currentList } = listStore;
  if (!currentList) {
    reLaunch({
      url: '/pages/index/index',
    });
    return;
  }
  const { people, name, add } = currentList;
  const [status, setStatus] = useState(-1);
  const [show, setShow] = useState(false);
  const [ad, setAd] = useState(true);
  let newName = '';
  return useObserver(() => (
    <View className={styles.app}>
      <View hidden={ad}>
        <Ad
          unit-id='adunit-e5ef9e8a2e77c1d1'
          ad-type='video'
          ad-theme='white'
          bindload={() => {
            console.log('ad load');
            setAd(false);
          }}
          binderror={() => {
            console.log('ad error');
            setAd(true);
          }}
        ></Ad>
        <Divider />
      </View>
      <Notify id='van-notify' />
      <DropMenu>
        <DropItem value={0} options={[{ text: `名单：${name}`, value: 0 }]} />
        <DropItem
          value={status}
          options={[
            { text: '全部', value: -1 },
            { text: '未选', value: 0 },
            { text: '已选', value: 1 },
          ]}
          bindchange={({ detail }) => {
            setStatus(detail);
          }}
        />
      </DropMenu>
      <Grid column-num={3} gutter={10} clickable square>
        {people
          .filter(person => {
            if (status === -1) return true;
            return person.status === status;
          })
          .map(person => {
            return (
              <GridItem
                key={person.id}
                text={person.name}
                icon={person.status === 1 ? 'success' : null}
                bindclick={() => {
                  person.status = person.status ? 0 : 1;
                }}
              />
            );
          })}
      </Grid>
      <Dialog
        use-slot
        title='新增名称'
        show={show}
        show-cancel-button
        bindclose={event => {
          setShow(false);
          const { detail } = event;
          if (detail !== 'confirm') return;
          if (!newName || newName === '') {
            notify({ type: 'warning', message: '请输入一个名称' });
            return;
          }
          add(newName);
        }}
      >
        <View>
          <Field
            value=''
            type='text'
            placeholder='请输入一个名称'
            border={false}
            bindchange={event => {
              const { detail } = event;
              newName = detail;
            }}
            border
          />
        </View>
      </Dialog>
      <Divider />
      <View className={styles.bottom}>
        <Icon
          name='replay'
          size={32}
          bindclick={() => {
            people.forEach(person => {
              person.status = 0;
            });
          }}
        ></Icon>
        <Icon
          name='plus'
          size={32}
          bindclick={() => {
            setShow(true);
          }}
        ></Icon>
      </View>
    </View>
  ));
};

export default IndexPage;
