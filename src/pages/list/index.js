import * as React from 'react';
import { useState } from 'react';
import { View, Text } from 'remax/wechat';
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
import { autorun } from 'mobx';

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
  autorun(() => {
    console.log(people);
  });
  const [show, setShow] = useState(false);
  let newName = '';
  return useObserver(() => (
    <View className={styles.app}>
      <Text className={styles.title}>名单：{name}</Text>
      <Notify id='van-notify' />
      <Grid column-num={3} gutter={10} clickable square>
        {people.map(person => {
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
